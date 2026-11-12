'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { NWPWordmark, QuantumDiceWordmark } from '@/components/BrandMark'
import DeploymentMap from './DeploymentMap'
import Icon from './Icon'
import {
  applyMoves, fleetAt, HOURS, metrics, proposeMoves, SCHEDULE, TARGET_DEPLOYED,
  unitId, wardById, type LogEntry, type Move, type Scenario,
} from './model'
import styles from './operations.module.css'

type Phase = 'ready' | 'running' | 'review' | 'approved'
type Tab = 'deployment' | 'fleet' | 'schedule' | 'log'
const initialMoves = () => proposeMoves(fleetAt(2, 'routine'), [], 'routine', 2)
const scenarioNames: Record<Scenario, string> = { routine: 'Routine demand', surge: 'Town-centre demand surge', reduced: 'Reduced availability' }
const initialLog: LogEntry[] = [
  { id: 1, time: '10:00', title: 'Illustrative plan generated', detail: 'Routine demand · available units only · up to 3 relocations.', kind: 'plan' },
  { id: 0, time: '10:00', title: 'Day-shift scenario loaded', detail: '15 vehicles · 28 wards · demonstrator work/rest schedule.', kind: 'info' },
]

export default function DeploymentWorkspace() {
  const [tab, setTab] = useState<Tab>('deployment')
  const [slot, setSlot] = useState(2)
  const [scenario, setScenario] = useState<Scenario>('routine')
  const [phase, setPhase] = useState<Phase>('review')
  const [moves, setMoves] = useState<Move[]>(initialMoves)
  const [excluded, setExcluded] = useState<string[]>([])
  const [held, setHeld] = useState<string[]>([])
  const [positions, setPositions] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState('V01')
  const [filter, setFilter] = useState<'all' | 'available'>('all')
  const [playing, setPlaying] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>(initialLog)
  const [notice, setNotice] = useState('')
  const [fullscreen, setFullscreen] = useState(false)
  const [resetVersion, setResetVersion] = useState(0)
  const nextLogId = useRef(2)
  const fleet = useMemo(() => fleetAt(slot, scenario, positions), [slot, scenario, positions])
  const available = fleet.filter(unit => unit.state === 'available')
  const busy = fleet.filter(unit => unit.state === 'busy')
  const resting = fleet.filter(unit => unit.state === 'resting')
  const includedMoves = moves.filter(move => !excluded.includes(move.vehicle))
  const currentMetrics = metrics(fleet, scenario, slot)
  const projectedMetrics = metrics(applyMoves(fleet, phase === 'review' ? includedMoves : []), scenario, slot)
  const selectedUnit = fleet.find(unit => unit.id === selected)!
  const activeCount = available.length + busy.length
  const eligibleCount = available.filter(unit => !held.includes(unit.id)).length

  function addLog(title: string, detail: string, kind: LogEntry['kind']) {
    setLogs(previous => [{ id: nextLogId.current++, time: HOURS[slot], title, detail, kind }, ...previous])
  }

  function invalidate() {
    setPhase('ready'); setMoves([]); setExcluded([])
  }

  function changeSlot(next: number) {
    if (next === slot) return
    setSlot(next); setPositions({}); invalidate()
    setNotice(`Scenario advanced to ${HOURS[next]}. Generate a plan for this snapshot.`)
  }

  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      if (slot >= HOURS.length - 1) { setPlaying(false); return }
      setSlot(slot + 1)
      setPositions({}); setPhase('ready'); setMoves([]); setExcluded([])
      setNotice('Playback advanced the schedule. Pause to review a deployment plan.')
    }, 5000)
    return () => window.clearInterval(timer)
  }, [playing, slot])

  useEffect(() => {
    if (phase !== 'running') return
    const timer = window.setTimeout(() => {
      const nextMoves = proposeMoves(fleet, held, scenario, slot)
      setMoves(nextMoves); setExcluded([]); setPhase('review')
      setLogs(previous => [{ id: nextLogId.current++, time: HOURS[slot], title: 'Illustrative plan generated', detail: `${scenarioNames[scenario]} · ${nextMoves.length} proposed moves · ${held.length} held units respected.`, kind: 'plan' }, ...previous])
      setNotice(nextMoves.length ? 'Deployment plan ready for supervisor review.' : 'No beneficial eligible moves found for this snapshot.')
    }, 1100)
    return () => window.clearTimeout(timer)
  }, [phase, fleet, held, scenario, slot])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(''), 6000)
    return () => window.clearTimeout(timer)
  }, [notice])

  useEffect(() => {
    const update = () => setFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', update)
    return () => document.removeEventListener('fullscreenchange', update)
  }, [])

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen()
      else await document.documentElement.requestFullscreen()
    } catch { setNotice('Fullscreen is unavailable in this browser.') }
  }

  function generatePlan() {
    setPlaying(false); setPhase('running'); setMoves([]); setExcluded([])
  }

  function approvePlan() {
    if (phase !== 'review' || !includedMoves.length || playing) return
    const nextPositions = { ...positions }
    includedMoves.forEach(move => { nextPositions[move.vehicle] = move.to })
    setPositions(nextPositions); setPhase('approved')
    addLog('Deployment plan approved in prototype', includedMoves.map(move => `${move.vehicle} → ${wardById(move.to).name}`).join(' · '), 'approved')
    setNotice(`${includedMoves.length} moves applied to the scenario. Decision recorded in the log.`)
  }

  function toggleHold() {
    if (selectedUnit.state !== 'available') return
    const isHeld = held.includes(selected)
    setHeld(previous => isHeld ? previous.filter(id => id !== selected) : [...previous, selected])
    invalidate(); setPlaying(false)
    addLog(isHeld ? `${selected} released for repositioning` : `${selected} held at current location`, wardById(selectedUnit.ward).name, 'info')
    setNotice('Unit constraint updated. Generate a fresh plan.')
  }

  function resetDemo() {
    setPlaying(false); setSlot(2); setScenario('routine'); setPhase('review'); setMoves(initialMoves())
    setExcluded([]); setHeld([]); setPositions({}); setSelected('V01'); setLogs(initialLog)
    nextLogId.current = 2; setTab('deployment'); setFilter('all'); setNotice('Demo reset to the 10:00 review scene.')
    setResetVersion(previous => previous + 1)
  }

  function exportSnapshot() {
    const snapshot = {
      prototype: true, date: '2026-10-21', time: HOURS[slot], scenario: scenarioNames[scenario],
      phase, fleet, held, proposedMoves: includedMoves, currentMetrics, projectedMetrics, decisions: logs,
      note: 'Illustrative scenario only. Ward geometry and work/rest patterns come from the demonstrator. Vehicle states, travel estimates and recommendations are simulated.',
    }
    const url = URL.createObjectURL(new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `nwp-demo-${HOURS[slot].replace(':', '')}.json`; anchor.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    setNotice('Scenario snapshot exported as JSON.')
  }

  const fleetPanel = <aside className={`${styles.panel} ${styles.fleetPanel}`}>
    <div className={styles.panelHeading}><h2>Response fleet</h2><span className={styles.count}>{fleet.length}</span></div>
    <div className={styles.fleetFilters}>
      <button aria-pressed={filter === 'all'} onClick={() => setFilter('all')}>All units</button>
      <button aria-pressed={filter === 'available'} onClick={() => setFilter('available')}>Available <span>{available.length}</span></button>
    </div>
    <div className={styles.fleetList}>
      {fleet.filter(unit => filter === 'all' || unit.state === 'available').map(unit => <button key={unit.id}
        className={`${styles.unitRow} ${selected === unit.id ? styles.unitSelected : ''}`} onClick={() => setSelected(unit.id)} aria-pressed={selected === unit.id}>
        <span className={styles.unitIcon} data-state={unit.state}><Icon name="car" size={16} /></span>
        <span><strong>{unit.id}</strong><small>{wardById(unit.ward).name.replace(' Central', '')}</small></span>
        {held.includes(unit.id) ? <Icon name="lock" size={12} /> : <i className={styles.statusDot} data-state={unit.state} title={unit.state} />}
      </button>)}
    </div>
    <div className={styles.unitDetail}>
      <div className={styles.unitDetailTitle}><strong>{selectedUnit.id}</strong><span className={styles.stateText} data-state={selectedUnit.state}>{selectedUnit.state}</span></div>
      <span>Base <b>{wardById(selectedUnit.base).name.replace(' Central', '')}</b></span>
      <button className={`${styles.holdButton} ${held.includes(selected) ? styles.heldButton : ''}`} onClick={toggleHold} disabled={selectedUnit.state !== 'available'} aria-pressed={held.includes(selected)}>
        <Icon name="lock" size={13} />{held.includes(selected) ? 'Release position hold' : 'Hold current position'}
      </button>
    </div>
  </aside>

  const recommendationPanel = <aside className={`${styles.panel} ${styles.recommendationPanel}`} aria-label="Deployment recommendations">
    <div className={styles.panelHeading}><h2>Deployment plan</h2><button className={styles.refreshButton} onClick={generatePlan} disabled={phase === 'running' || !eligibleCount} aria-label="Regenerate plan"><Icon name="reset" size={17} />Refresh</button></div>
    <div className={styles.planIntro}>
      <h3>{phase === 'approved' ? 'Deployment updated.' : phase === 'review' ? `${includedMoves.length} ${includedMoves.length === 1 ? 'move' : 'moves'} to review` : phase === 'running' ? 'Preparing your plan…' : 'Ready to plan.'}</h3>
      <p>{phase === 'approved' ? 'Saved to your decision log.' : phase === 'review' ? 'Select the moves to approve.' : phase === 'running' ? 'Checking available units.' : 'Use this snapshot’s demand and availability.'}</p>
    </div>
    <div className={styles.moveList}>
      {(phase === 'review' || phase === 'approved') && moves.map(move => <label key={move.vehicle} className={`${styles.moveCard} ${excluded.includes(move.vehicle) ? styles.excludedMove : ''}`}>
        <div className={styles.moveCardTop}>
          {phase === 'review' ? <input type="checkbox" aria-label={`Include move ${move.vehicle}`} checked={!excluded.includes(move.vehicle)} onChange={() => setExcluded(previous => previous.includes(move.vehicle) ? previous.filter(id => id !== move.vehicle) : [...previous, move.vehicle])} /> : <Icon name="check" size={15} />}
          <strong>{move.vehicle}</strong><span>{Math.ceil(move.minutes)} min</span>
        </div>
        <div className={styles.moveLocation}><span>{wardById(move.from).name.replace(' Central', '')}</span><Icon name="arrow" size={13} /><strong>{wardById(move.to).name}</strong></div>
        {phase === 'approved' && <p>{excluded.includes(move.vehicle) ? 'Excluded from the approved plan' : 'Applied to scenario'}</p>}
      </label>)}
      {phase === 'review' && !moves.length && <div className={styles.emptyPlan}><Icon name="shield" size={28} /><strong>Keep current positions</strong><p>No beneficial eligible relocations were found. Try another time or scenario.</p></div>}
      {phase === 'ready' && <div className={styles.emptyPlan}><div className={styles.planningOrbit}><Icon name="pin" size={30} /></div><strong>{eligibleCount} units ready to reposition</strong><p>Busy and resting units remain outside the proposed moves.</p></div>}
      {phase === 'running' && <div className={styles.loadingPlan}><span className={styles.spinner} /><span>Evaluating illustrative options</span></div>}
    </div>
    <div className={styles.planBottom}>
      <details className={styles.constraintDetails}><summary><Icon name="shield" size={16} />Deployment checks</summary><div className={styles.constraintList}>
        <span><Icon name="check" size={14} />Work/rest schedule respected</span>
        <span><Icon name="check" size={14} />Busy units excluded</span>
        <span><Icon name="check" size={14} />{held.length ? `${held.length} position ${held.length === 1 ? 'hold' : 'holds'} respected` : phase === 'approved' ? 'Supervisor approval recorded' : 'Supervisor approval required'}</span>
      </div></details>
      {phase === 'review' ? <button className={styles.primaryButton} onClick={approvePlan} disabled={!includedMoves.length || playing}><Icon name="check" size={17} />Approve {includedMoves.length} {includedMoves.length === 1 ? 'move' : 'moves'}<Icon name="arrow" size={17} /></button>
        : phase === 'approved' ? <button className={styles.primaryButton} onClick={() => setTab('log')}><Icon name="list" size={17} />View decision log<Icon name="arrow" size={17} /></button>
          : <button className={styles.primaryButton} onClick={generatePlan} disabled={phase === 'running' || !eligibleCount}><Icon name="bolt" size={17} />{phase === 'running' ? 'Generating…' : 'Generate deployment plan'}<Icon name="arrow" size={17} /></button>}
    </div>
  </aside>

  return <div className={styles.workspace}>
    <header className={styles.topbar}>
      <div className={styles.brandLockup}><QuantumDiceWordmark markClassName="h-9" /><span /><NWPWordmark crestClassName="h-9" /></div>
      <div className={styles.topbarActions}><span className={styles.prototypeBadge}>Prototype</span><button className={styles.resetButton} onClick={resetDemo} aria-label="Reset demo"><Icon name="reset" size={18} />Reset demo</button><button className={styles.iconButton} onClick={toggleFullscreen} aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}><Icon name="expand" /></button></div>
    </header>
    <div className={styles.appBody}>
      <main className={styles.main}>
        <div className={styles.pageHeading}>
          <div><h1>Forward deployment<span>.</span></h1><p>21 October 2026 <span>·</span> Day shift, 08:00–16:00</p></div>
          <div className={styles.headingActions}>
            <label className={styles.scenarioSelect}><span>Scenario</span><select aria-label="Scenario" value={scenario} onChange={event => { const value = event.target.value as Scenario; setScenario(value); setPositions({}); setPlaying(false); invalidate(); addLog('Scenario changed', scenarioNames[value], 'info'); setNotice(`${scenarioNames[value]} loaded. Generate a fresh plan.`) }}><option value="routine">Routine demand</option><option value="surge">Town-centre demand surge</option><option value="reduced">Reduced availability</option></select></label>
          </div>
        </div>

        <div className={styles.metrics}>
          <div className={styles.metric}><span>15-minute coverage</span><div><strong>{currentMetrics.coverage.toFixed(1)}<small>%</small></strong>{phase === 'review' && <b title="Coverage with proposed moves">→ {projectedMetrics.coverage.toFixed(1)}%</b>}</div></div>
          <div className={styles.metric}><span>Mean modelled travel</span><div><strong>{currentMetrics.mean.toFixed(1)}<small> min</small></strong>{phase === 'review' && <b title="Mean travel with proposed moves">→ {projectedMetrics.mean.toFixed(1)} min</b>}</div></div>
          <div className={styles.metric}><span>Available to reposition</span><div><strong>{eligibleCount.toString().padStart(2, '0')}</strong><span className={styles.metricAside}>{busy.length} busy · {resting.length} resting{held.length > 0 ? ` · ${held.length} held` : ''}</span></div></div>
        </div>

        <div className={styles.sectionNav}>
          <div role="tablist" aria-label="Operations views">{([['deployment', 'Deployment overview'], ['fleet', 'Fleet'], ['schedule', 'Shift schedule'], ['log', 'Decision log']] as const).map(([id, label]) => <button key={id} role="tab" id={`tab-${id}`} aria-selected={tab === id} aria-controls="operations-content" onClick={() => setTab(id)}>{label}</button>)}</div>
          <span className={styles.snapshotTime}><i /><strong>{HOURS[slot]}</strong></span>
        </div>

        <div id="operations-content" role="tabpanel" aria-labelledby={`tab-${tab}`} className={tab === 'deployment' ? styles.deploymentGrid : styles.alternateGrid}>
          {tab === 'deployment' && <><DeploymentMap key={resetVersion} fleet={fleet} moves={phase === 'review' ? includedMoves : []} selected={selected} onSelect={setSelected} onManageFleet={() => setTab('fleet')} scenario={scenario} slot={slot} approved={phase === 'approved'} />{recommendationPanel}</>}
          {tab === 'fleet' && <>{fleetPanel}{recommendationPanel}</>}
          {tab === 'schedule' && <>
            <section className={`${styles.panel} ${styles.schedulePanel}`}>
              <div className={styles.panelHeading}><div><h2>Work / rest schedule</h2><p>15 vehicles · 8 hourly slots</p></div></div>
              <div className={styles.scheduleTableWrap}><table className={styles.scheduleTable}><thead><tr><th>UNIT</th>{HOURS.map((hour, index) => <th key={hour} className={slot === index ? styles.currentHour : ''}><button onClick={() => { setPlaying(false); changeSlot(index) }}>{hour}</button></th>)}</tr></thead><tbody>{SCHEDULE.map((row, index) => <tr key={index}><th>{unitId(index)}</th>{row.map((active, hour) => <td key={hour} className={slot === hour ? styles.currentHour : ''}><span className={active ? styles.deployedCell : styles.restCell}>{active ? 'Deployed' : 'Rest'}</span></td>)}</tr>)}</tbody><tfoot><tr><th>DEPLOYED</th>{HOURS.map((hour, index) => <td key={hour}>{SCHEDULE.reduce((sum, row) => sum + row[index], 0)}<span> / {TARGET_DEPLOYED[index]}</span></td>)}</tr></tfoot></table></div>
              <div className={styles.scheduleLegend}><span><i />Deployed</span><span><i />Scheduled rest</span></div>
            </section>{recommendationPanel}
          </>}
          {tab === 'log' && <>
            <section className={`${styles.panel} ${styles.logPanel}`}>
              <div className={styles.panelHeading}><h2>Decision log</h2><button className={styles.secondaryButton} onClick={exportSnapshot}><Icon name="download" size={17} />Export snapshot</button></div>
              <div className={styles.logList}>{logs.map(log => <article key={log.id} className={styles.logEntry}><div className={`${styles.logIcon} ${log.kind === 'approved' ? styles.approvedLog : ''}`}><Icon name={log.kind === 'approved' ? 'check' : log.kind === 'plan' ? 'bolt' : 'info'} size={19} /></div><div><span className={styles.eyebrow}>{log.time} <span> / {log.kind === 'approved' ? 'SUPERVISOR DECISION' : 'SCENARIO EVENT'}</span></span><h3>{log.title}</h3><p>{log.detail}</p></div>{log.kind === 'approved' && <span className={styles.smallTag}>APPROVED</span>}</article>)}</div>
              <div className={styles.logFootnote}><Icon name="info" size={17} />Export a snapshot to keep this session’s decisions.</div>
            </section>{recommendationPanel}
          </>}
        </div>

        <section className={styles.timeline} aria-label="Scenario timeline">
          <div className={styles.timelineIntro}><h2>Shift timeline</h2><span className={styles.timelineTarget}>{activeCount} on duty / {TARGET_DEPLOYED[slot]} target</span>{activeCount < TARGET_DEPLOYED[slot] && <span className={styles.targetGap}>1 below target</span>}<button onClick={() => { if (!playing && slot === HOURS.length - 1) changeSlot(0); setPlaying(value => !value) }} aria-label={playing ? 'Pause scenario' : 'Play scenario'} className={styles.playButton}><Icon name={playing ? 'pause' : 'play'} size={15} />{playing ? 'Pause' : 'Play scenario'}</button></div>
          <div className={styles.hourStrip}>{HOURS.map((hour, index) => { const deployed = SCHEDULE.reduce((sum, row) => sum + row[index], 0); return <button key={hour} className={`${styles.hourButton} ${slot === index ? styles.activeHour : ''}`} onClick={() => { setPlaying(false); changeSlot(index) }} aria-pressed={slot === index} aria-label={`View ${hour}, ${deployed} deployed vehicles`}><span>{hour}</span><div className={styles.hourTrack} aria-hidden="true"><i style={{ width: `${deployed / fleet.length * 100}%` }} /></div><small>{deployed} on duty</small></button> })}</div>
        </section>
        <footer className={styles.footer}><span><i />Illustrative scenario</span><details className={styles.demoDetails}><summary>About this demo</summary><p>Ward boundaries, five station locations and the SC01 work/rest schedule come from the demonstrator. Vehicle states, demand changes, travel estimates and recommendations are illustrative. Coverage and mean travel use ward-centre estimates weighted by scenario demand. Approval updates this prototype only. Decisions reset when you reload; export a snapshot to keep them.</p></details></footer>
      </main>
    </div>
    <div className={`${styles.toast} ${notice ? styles.toastVisible : ''}`} role="status" aria-live="polite">{notice && <><Icon name="check" size={17} />{notice}<button aria-label="Dismiss notification" onClick={() => setNotice('')}><Icon name="close" size={14} /></button></>}</div>
  </div>
}
