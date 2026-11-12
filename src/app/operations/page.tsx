import type { Metadata } from 'next'
import DeploymentWorkspace from '@/components/operations/DeploymentWorkspace'

export const metadata: Metadata = {
  title: 'Forward Deployment | North Wales Police × Quantum Dice',
  description: 'Interactive forward deployment management prototype with illustrative scenario data.',
}

export default function OperationsPage() {
  return <DeploymentWorkspace />
}
