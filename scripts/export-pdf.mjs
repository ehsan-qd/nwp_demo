import { access, mkdir, writeFile } from 'node:fs/promises'
import { constants } from 'node:fs'
import { createServer } from 'node:net'
import { spawn } from 'node:child_process'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { PDFDocument } from 'pdf-lib'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const PROJECT_DIR = path.resolve(SCRIPT_DIR, '..')
const OUTPUT_DIR = path.join(PROJECT_DIR, 'exports')
// A 1280×720 CSS viewport at 1.5 device scale reproduces a 1920×1080
// browser window viewed at 150% zoom.
const WIDTH = 1280
const HEIGHT = 720
const BROWSER_ZOOM = 1.5
const PDF_WIDTH = 960
const PDF_HEIGHT = 540

const DECKS = {
  full: {
    route: '/',
    filename: 'nwp-full-deck.pdf',
    title: 'Full presentation',
  },
  showcase: {
    route: '/showcase',
    filename: 'nwp-showcase-deck.pdf',
    title: 'Showcase presentation',
  },
}

function selectedDecks() {
  const deckFlag = process.argv.find((arg) => arg.startsWith('--deck='))
  const requested = deckFlag?.split('=')[1] ?? 'all'

  if (requested === 'all') return Object.entries(DECKS)
  if (DECKS[requested]) return [[requested, DECKS[requested]]]

  throw new Error(`Unknown deck "${requested}". Use full, showcase, or all.`)
}

async function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  ].filter(Boolean)

  for (const candidate of candidates) {
    try {
      await access(candidate, constants.X_OK)
      return candidate
    } catch {
      // Try the next common installation path.
    }
  }

  throw new Error('Chrome or Chromium was not found. Set CHROME_PATH to its executable.')
}

async function availablePort() {
  return new Promise((resolve, reject) => {
    const server = createServer()
    server.unref()
    server.on('error', reject)
    server.listen(0, '127.0.0.1', () => {
      const address = server.address()
      const port = typeof address === 'object' && address ? address.port : null
      server.close(() => (port ? resolve(port) : reject(new Error('Could not allocate a port.'))))
    })
  })
}

async function waitForServer(url, child) {
  const deadline = Date.now() + 90_000

  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`The Next.js server exited with code ${child.exitCode}.`)
    }

    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // The development server is still starting.
    }

    await new Promise((resolve) => setTimeout(resolve, 300))
  }

  throw new Error('Timed out waiting for the Next.js server.')
}

async function existingProjectServer() {
  const url = 'http://localhost:3000'

  try {
    const response = await fetch(url)
    const html = await response.text()
    if (response.ok && html.includes('North Wales Police: Optimisation of Forward Deployment')) {
      return url
    }
  } catch {
    // Nothing is running on the default development port.
  }

  return null
}

async function preparePage(page, url) {
  await page.setViewport({
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: BROWSER_ZOOM,
  })
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  await page.waitForSelector('[data-presentation]', { timeout: 90_000 })
  await page.evaluate(async () => {
    await document.fonts.ready
  })

  await page.addStyleTag({
    content: `
      nextjs-portal, [data-pdf-hide] { display: none !important; }
      *, *::before, *::after {
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
      }
      [class*="animate-fade-in-up"] {
        opacity: 1 !important;
        transform: none !important;
      }
    `,
  })
}

async function waitForSlide(page, index) {
  await page.waitForSelector(`[data-presentation][data-current-slide="${index}"]`, {
    timeout: 10_000,
  })

  await page
    .waitForFunction(
      () =>
        Array.from(document.querySelectorAll('iframe')).every((frame) => {
          try {
            return frame.contentDocument?.readyState === 'complete'
          } catch {
            return true
          }
        }),
      { timeout: 8_000 },
    )
    .catch(() => {})

  await new Promise((resolve) => setTimeout(resolve, 250))
}

async function exportDeck(browser, baseUrl, deck) {
  const page = await browser.newPage()
  const pdf = await PDFDocument.create()

  try {
    await preparePage(page, `${baseUrl}${deck.route}`)
    const totalSlides = await page.$eval('[data-presentation]', (element) =>
      Number(element.getAttribute('data-total-slides')),
    )

    for (let index = 0; index < totalSlides; index += 1) {
      if (index > 0) {
        await page.$eval(`[data-slide-number="${index}"]`, (button) => button.click())
      }
      await waitForSlide(page, index)

      const imageBytes = await page.screenshot({
        type: 'png',
        captureBeyondViewport: false,
      })
      const image = await pdf.embedPng(imageBytes)
      const pdfPage = pdf.addPage([PDF_WIDTH, PDF_HEIGHT])
      pdfPage.drawImage(image, {
        x: 0,
        y: 0,
        width: PDF_WIDTH,
        height: PDF_HEIGHT,
      })

      process.stdout.write(`\r${deck.title}: ${index + 1}/${totalSlides}`)
    }

    pdf.setTitle(deck.title)
    pdf.setCreator('NWP FDO presentation exporter')
    const outputPath = path.join(OUTPUT_DIR, deck.filename)
    await writeFile(outputPath, await pdf.save())
    process.stdout.write(`\nCreated ${outputPath}\n`)
    return outputPath
  } finally {
    await page.close()
  }
}

async function main() {
  const decks = selectedDecks()
  const chromePath = await findChrome()
  await mkdir(OUTPUT_DIR, { recursive: true })

  let baseUrl = await existingProjectServer()
  let server
  let browser

  try {
    if (!baseUrl) {
      const port = await availablePort()
      baseUrl = `http://127.0.0.1:${port}`
      server = spawn(
        process.platform === 'win32' ? 'npm.cmd' : 'npm',
        ['run', 'dev', '--', '--hostname', '127.0.0.1', '--port', String(port)],
        {
          cwd: PROJECT_DIR,
          stdio: ['ignore', 'pipe', 'pipe'],
          env: { ...process.env, NEXT_TELEMETRY_DISABLED: '1' },
        },
      )
      await waitForServer(baseUrl, server)
    }

    browser = await puppeteer.launch({
      executablePath: chromePath,
      headless: true,
      args: ['--hide-scrollbars', '--font-render-hinting=none'],
    })

    for (const [, deck] of decks) {
      await exportDeck(browser, baseUrl, deck)
    }
  } finally {
    if (browser) await browser.close()
    if (server?.exitCode === null) server.kill('SIGTERM')
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
