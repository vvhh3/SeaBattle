import { useGame } from '../game/gameStore'
import Board from './Board'
import type { DragEndEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import ShipPanel from './ShipPanel'

export default function Game() {

  const phase = useGame(state => state.phase)
  const nextPhase = useGame(state => state.nextPhase)
  const reset = useGame(state => state.reset)
  const placeShip = useGame(state => state.placeShip)

  // Экран "передай компьютер"
  if (phase === 'pass') {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h2 className="text-2xl font-bold">Передай компьютер игроку 2</h2>
        <p className="text-gray-400">Игрок 1 закончил расстановку</p>
        <button
          onClick={nextPhase}
          className="px-6 py-3 bg-blue-600 rounded-lg">
          Готов
        </button>
      </div>
    )
  }

  // Экран расстановки
  if (phase === 'placement_p1' || phase === 'placement_p2') {
    const player = phase === 'placement_p1' ? 1 : 2
    const playerIndex = phase === 'placement_p1' ? 0 : 1

    const handleDragEnd = (event: DragEndEvent) => {
      const { over, active } = event
      if (!over) return

      const [row, col] = (over.id as string).split('-').map(Number)
      const { size, shipId } = active.data.current as { size: number, shipId: number }

      placeShip(playerIndex, row, col, size, shipId)
    }

    return (
      <DndContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col items-center gap-6 p-8">
          <h2 className="text-2xl font-bold">Игрок {player} — расставь корабли</h2>
          <div className="flex gap-8 items-start">
            <ShipPanel />
            <Board userId={playerIndex} interactive={false} />
          </div>
          <button onClick={nextPhase} className="px-6 py-3 bg-green-600 rounded-lg">
            Готово
          </button>
        </div>
      </DndContext>
    )
  }

  // Экран битвы
  if (phase === 'battle_p1' || phase === 'battle_p2') {
    const player = phase === 'battle_p1' ? 1 : 2
    const enemyIndex = phase === 'battle_p1' ? 1 : 0
    const myIndex = phase === 'battle_p1' ? 0 : 1

    return (
      <div className="flex flex-col items-center gap-6 p-8 w-full">
        <h2 className="text-2xl font-bold">Ход игрока {player}</h2>

        <div className="flex justify-around w-full">
          <div>
            <p className="text-center text-gray-400 mb-2">поле игрока {player}</p>
            {/* interactive=false — своё поле только смотрим */}
            <Board userId={myIndex} interactive={false} />
          </div>
          <div>
            <p className="text-center text-gray-400 mb-2">Поле игрока {player === 1 ? 2 : 1}</p>
            {/* interactive=true — по чужому полю стреляем */}
            <Board userId={enemyIndex} interactive={true} />
          </div>
        </div>
      </div>
    )
  }

  // Конец игры
  if (phase === 'game_over') {

    return (
      <div className="flex flex-col items-center justify-center h-screen gap-6">
        <h2 className="text-3xl font-bold">Игра окончена!</h2>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 rounded-lg cursor-pointer">
          Играть снова
        </button>
      </div>
    )
  }
}