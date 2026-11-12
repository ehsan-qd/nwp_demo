import wardData from './wards.json'
import { SCHEDULE, HOURS, TARGET_DEPLOYED } from '@/components/ui/ScheduleHeatmap'

export { HOURS, SCHEDULE, TARGET_DEPLOYED }
export const wards = wardData
export type Scenario = 'routine' | 'surge' | 'reduced'
export type VehicleState = 'available' | 'busy' | 'resting'
export type Vehicle = { id: string; base: string; ward: string; state: VehicleState }
export type Move = { vehicle: string; from: string; to: string; minutes: number }
export type LogEntry = { id: number; time: string; title: string; detail: string; kind: 'plan' | 'approved' | 'info' }

export const stations = ['CRW08', 'CRW11', 'CRW14', 'CRW16', 'CRW26']
const bases = [0, 1, 4, 2, 3, 0, 4, 0, 1, 3, 4, 2, 0, 4, 0]
export const wardById = (id: string) => wards.find(ward => ward.id === id)!
export const unitId = (index: number) => `V${String(index + 1).padStart(2, '0')}`

export function fleetAt(slot: number, scenario: Scenario, positions: Record<string, string> = {}): Vehicle[] {
  const active = SCHEDULE.map((row, index) => row[slot] ? index : -1).filter(index => index >= 0)
  const busy = active.slice(-(scenario === 'reduced' ? 4 : 2))
  return bases.map((base, index) => ({
    id: unitId(index), base: stations[base], ward: positions[unitId(index)] ?? stations[base],
    state: !SCHEDULE[index][slot] ? 'resting' : busy.includes(index) ? 'busy' : 'available',
  }))
}

// Illustrative travel estimates for this UI only, not the demonstrator's travel matrix.
export function travelMinutes(from: string, to: string) {
  if (from === to) return 0
  const a = wardById(from), b = wardById(to)
  const km = Math.hypot((a.lon - b.lon) * 67, (a.lat - b.lat) * 111)
  return Math.round((km * 1.3 / 0.75 + 2.5) * 10) / 10
}

export function demandAt(id: string, scenario: Scenario, slot: number) {
  const ward = wardById(id)
  return ward.demand * (scenario === 'surge' && ['CRW04', 'CRW08', 'CRW11'].includes(id) ? 2.8 : 1)
    * (1 + Math.sin(slot * 0.8 + Number(id.slice(-2)) * 0.4) * 0.12)
}

export function metrics(fleet: Vehicle[], scenario: Scenario, slot: number) {
  const available = fleet.filter(unit => unit.state === 'available')
  const total = wards.reduce((sum, ward) => sum + demandAt(ward.id, scenario, slot), 0)
  let covered = 0, travel = 0
  for (const ward of wards) {
    const nearest = available.length ? Math.min(...available.map(unit => travelMinutes(unit.ward, ward.id))) : 60
    const weight = demandAt(ward.id, scenario, slot)
    if (nearest <= 15) covered += weight
    travel += nearest * weight
  }
  return { coverage: covered / total * 100, mean: travel / total }
}

export function applyMoves(fleet: Vehicle[], moves: Move[]): Vehicle[] {
  return fleet.map(unit => ({ ...unit, ward: moves.find(move => move.vehicle === unit.id)?.to ?? unit.ward }))
}

// A small deterministic heuristic makes controls and comparisons coherent.
// It is a prototype scenario model, not an Orbit or p-dit solver integration.
export function proposeMoves(fleet: Vehicle[], held: string[], scenario: Scenario, slot: number): Move[] {
  const moves: Move[] = []
  let current = fleet
  for (let step = 0; step < 3; step++) {
    const before = metrics(current, scenario, slot)
    let best: Move | undefined, bestGain = 0.05
    for (const unit of current.filter(unit => unit.state === 'available' && !held.includes(unit.id) && !moves.some(move => move.vehicle === unit.id))) {
      for (const ward of wards) {
        if (ward.id === unit.ward) continue
        const minutes = travelMinutes(unit.ward, ward.id)
        if (minutes > 30) continue
        const move = { vehicle: unit.id, from: unit.ward, to: ward.id, minutes }
        const after = metrics(applyMoves(current, [move]), scenario, slot)
        const gain = (after.coverage - before.coverage) * 0.15 + before.mean - after.mean - minutes * 0.006
        if (gain > bestGain) { bestGain = gain; best = move }
      }
    }
    if (!best) break
    moves.push(best)
    current = applyMoves(current, [best])
  }
  return moves
}
