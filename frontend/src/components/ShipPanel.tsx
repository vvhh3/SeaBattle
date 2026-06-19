import { useDraggable } from '@dnd-kit/core'
import { useGame } from '../game/gameStore'

const SHIPS = [
  { id: 1, size: 4, name: 'Линкор' },
  { id: 2, size: 3, name: 'Крейсер' },
  { id: 3, size: 3, name: 'Крейсер' },
  { id: 4, size: 2, name: 'Эсминец' },
  { id: 5, size: 2, name: 'Эсминец' },
  { id: 6, size: 2, name: 'Эсминец' },
  { id: 7, size: 1, name: 'Катер' },
  { id: 8, size: 1, name: 'Катер' },
  { id: 9, size: 1, name: 'Катер' },
  { id: 10, size: 1, name: 'Катер' },
]

function Ship({ ship }: { ship: typeof SHIPS[0] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: ship.id,
    // data — это то что получим в onDragEnd
    data: { size: ship.size, shipId: ship.id }
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex gap-0.5 cursor-grab ${isDragging ? 'opacity-30' : ''}`}
    >
      {Array.from({ length: ship.size }, (_, i) => (
        <div key={i} className="w-8 h-8 bg-blue-500 border border-blue-400" />
      ))}
    </div>
  )
}

export default function ShipPanel() {
  const phase = useGame(s => s.phase)
  const playerIndex = phase === 'placement_p2' ? 1 : 0
  const placedShipIds = useGame(s => s.placedShipIds[playerIndex])

  const remaining = SHIPS.filter(s => !placedShipIds.includes(s.id))  // без [], просто s.id

  return (
    <div className="flex flex-col gap-3 p-4 bg-gray-800 rounded-xl">
      <p className="text-sm text-gray-400">Перетащи корабли на поле</p>
      {remaining.map(ship => (
        <div key={ship.id}>
          <p className="text-xs text-gray-500 mb-1">{ship.name}</p>
          <Ship ship={ship} />
        </div>
      ))}
      {remaining.length === 0 && <p className="text-green-400 text-sm">Все расставлены!</p>}
    </div>
  )
}