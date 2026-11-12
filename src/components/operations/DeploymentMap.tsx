'use client'

import { useState } from 'react'
import { demandAt, stations, travelMinutes, wardById, wards, type Move, type Scenario, type Vehicle } from './model'
import Icon from './Icon'
import styles from './operations.module.css'

const townLabels: Record<string, [number, number]> = {
  CRW04: [-35, -44], CRW08: [28, 55], CRW11: [32, -30],
  CRW14: [-50, 58], CRW16: [-50, 56],
  CRW26: [-115, -30], CRW28: [-100, 44],
}

export default function DeploymentMap({ fleet, moves, selected, onSelect, onManageFleet, scenario, slot, approved }: {
  fleet: Vehicle[]; moves: Move[]; selected: string; onSelect: (id: string) => void;
  onManageFleet: () => void;
  scenario: Scenario; slot: number; approved: boolean;
}) {
  const [layer, setLayer] = useState<'demand' | 'coverage'>('demand')
  const [zoom, setZoom] = useState(1)
  const [selectedWard, setSelectedWard] = useState<string | null>(null)
  const available = fleet.filter(unit => unit.state === 'available')
  const ward = selectedWard ? wardById(selectedWard) : null
  const selectedUnit = fleet.find(unit => unit.id === selected)!
  const stateColour = { available: '#58B9DF', busy: '#E5716F', resting: '#8C8C8C' }

  return <section className={styles.mapPanel} aria-label="Deployment map" data-plan-applied={approved}>
    <div className={styles.mapHeading}>
      <h2>Conwy &amp; Denbighshire</h2>
      <div className={styles.layerSwitch} aria-label="Map layer">
        <button onClick={() => setLayer('demand')} aria-pressed={layer === 'demand'}>Demand</button>
        <button onClick={() => setLayer('coverage')} aria-pressed={layer === 'coverage'}>Coverage</button>
      </div>
    </div>
    <div className={styles.mapCanvas}>
      <div className={styles.mapCompass}><span>N</span><svg width="14" height="25" viewBox="0 0 14 25" aria-hidden="true"><path d="m7 0 6 19-6-4-6 4L7 0Z" fill="#89c2d9" /><path d="M7 0v15l6 4L7 0Z" fill="#36505e" /></svg></div>
      <svg className={styles.regionMap} viewBox="35 10 850 560" aria-label="Ward map with vehicle positions and proposed relocations">
        <defs>
          <pattern id="map-grid" width="44" height="44" patternUnits="userSpaceOnUse"><path d="M44 0H0v44" fill="none" stroke="#89c2d9" strokeOpacity=".035" /></pattern>
          <radialGradient id="map-glow"><stop stopColor="#89c2d9" stopOpacity=".07" /><stop offset="1" stopColor="#89c2d9" stopOpacity="0" /></radialGradient>
          <marker id="move-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 10 5 0 10Z" fill="#BCECEC" /></marker>
        </defs>
        <rect width="920" height="600" fill="url(#map-grid)" />
        <ellipse cx="460" cy="290" rx="430" ry="300" fill="url(#map-glow)" />
        <g style={{ transform: `translate(${460 * (1 - zoom)}px, ${300 * (1 - zoom)}px) scale(${zoom})`, transition: 'transform .3s ease' }}>
          {wards.map(ward => {
            const covered = available.some(unit => travelMinutes(unit.ward, ward.id) <= 15)
            const demand = demandAt(ward.id, scenario, slot)
            return <path key={ward.id} d={ward.path} fill={layer === 'demand' ? '#89C2D9' : covered ? '#58B9DF' : '#E5716F'}
              fillOpacity={layer === 'demand' ? Math.min(0.11 + demand * 0.016, 0.5) : covered ? 0.21 : 0.12}
              stroke={selectedWard === ward.id ? '#BCECEC' : '#89C2D9'} strokeOpacity={selectedWard === ward.id ? 1 : 0.3} strokeWidth={selectedWard === ward.id ? 1.5 : 0.7}
              className={styles.wardShape} role="button" tabIndex={0} aria-label={`${ward.name}, ${ward.id}`}
              onClick={() => setSelectedWard(ward.id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedWard(ward.id) } }}>
              <title>{`${ward.name} · ${ward.id}`}</title>
            </path>
          })}
          {stations.map(id => { const ward = wardById(id); return <g key={id} transform={`translate(${ward.x}, ${ward.y})`}><rect x="-5" y="-5" width="10" height="10" fill="#101b20" stroke="#c2d2db" strokeWidth="1.4" /><title>{`${ward.name} station`}</title></g> })}
          {Object.entries(townLabels).map(([id, offset]) => { const ward = wardById(id); return <text key={id} x={ward.x + offset[0]} y={ward.y + offset[1]} className={styles.townLabel}>{id === 'CRW08' ? 'Denbigh' : id === 'CRW04' ? 'St. Asaph' : id === 'CRW23' ? 'Llanrwst' : ward.name}</text> })}
          {moves.map(move => {
            const from = wardById(move.from), to = wardById(move.to)
            const curveX = (from.x + to.x) / 2 + 25, curveY = (from.y + to.y) / 2 - 35
            return <g key={move.vehicle} className={styles.moveRoute}>
              <path d={`M${from.x} ${from.y}Q${curveX} ${curveY} ${to.x} ${to.y}`} fill="none" stroke="#BCECEC" strokeWidth="1.8" strokeDasharray="5 5" markerEnd="url(#move-arrow)" />
              <circle cx={to.x} cy={to.y} r="13" fill="#BCECEC" fillOpacity=".08" stroke="#BCECEC" strokeOpacity=".4" />
              <path d={`m${to.x} ${to.y - 5} 5 5-5 5-5-5Z`} fill="#BCECEC" />
            </g>
          })}
          {fleet.map(unit => {
            const ward = wardById(unit.ward)
            const peers = fleet.filter(other => other.ward === unit.ward)
            const index = peers.findIndex(other => other.id === unit.id)
            const angle = index * Math.PI * 2 / Math.max(peers.length, 3) - Math.PI / 2
            const x = ward.x + Math.cos(angle) * 32, y = ward.y + Math.sin(angle) * 32
            return <g key={unit.id} transform={`translate(${x},${y})`} role="button" tabIndex={0}
              aria-label={`Select ${unit.id}, ${unit.state}, ${ward.name}`} className={styles.vehicleMarker}
              onClick={() => { onSelect(unit.id); setSelectedWard(null) }}
              onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(unit.id); setSelectedWard(null) } }}>
              {selected === unit.id && <circle r="23" stroke={stateColour[unit.state]} strokeOpacity=".6" fill={stateColour[unit.state]} fillOpacity=".1" className={styles.selectedRing} />}
              <rect x="-13" y="-10" width="26" height="20" rx="4" fill="#101a22" stroke={stateColour[unit.state]} strokeWidth="1.7" />
              <path d="m-5-2 1-2h8l1 2m-10 1h10v4H-5v-4Zm1 1h1m6 0h1" fill="none" stroke={stateColour[unit.state]} strokeWidth="1" />
              <title>{`${unit.id} · ${unit.state} · ${ward.name}`}</title>
            </g>
          })}
        </g>
      </svg>
      {ward && <div className={styles.wardPopup} role="status">
        <button className={styles.iconButton} aria-label="Close ward details" onClick={() => setSelectedWard(null)}><Icon name="close" size={14} /></button>
        <span className={styles.eyebrow}>{ward.id}</span><strong>{ward.name}</strong>
        <span>{ward.demand.toFixed(2)}% baseline P0 demand</span>
        <span>{available.some(unit => travelMinutes(unit.ward, ward.id) <= 15) ? 'Within modelled 15-minute coverage' : 'Outside modelled 15-minute coverage'}</span>
      </div>}
      <div className={styles.zoomControls}>
        <button aria-label="Zoom in" onClick={() => setZoom(value => Math.min(value + .2, 1.8))} disabled={zoom >= 1.8}><Icon name="plus" size={16} /></button>
        <button aria-label="Zoom out" onClick={() => setZoom(value => Math.max(value - .2, 1))} disabled={zoom <= 1}><Icon name="minus" size={16} /></button>
      </div>
    </div>
    <div className={styles.mapFooter}>
      <div className={styles.mapKey}>
        <span><i style={{ background: 'var(--state-available)' }} />Available</span>
        <span><i style={{ background: 'var(--state-busy)' }} />Busy</span>
        <span><i style={{ background: 'var(--state-resting)' }} />Resting</span>
        <span><i className={styles.stationKey} />Station</span>
        {moves.length > 0 && <span><i className={styles.routeKey} />Moves</span>}
      </div>
      <button className={styles.mapSelected} onClick={onManageFleet} aria-label={`Manage selected unit ${selected}`}><Icon name="car" size={18} /><strong>{selected}</strong><span className={styles.stateText} data-state={selectedUnit.state}>{selectedUnit.state}</span><Icon name="chevron" size={16} /></button>
    </div>
  </section>
}
