import { useGame } from "../game/gameStore"
import { useDroppable } from '@dnd-kit/core'

type Props = {
    userId: 0 | 1
    interactive: boolean
}

function Cell({ row, col, state, phase, onClick }: {
    row: number, col: number, state: string,
    phase: string, onClick: () => void
}) {
    const { setNodeRef, isOver } = useDroppable({ id: `${row}-${col}` })
    const isPlacement = phase === 'placement_p1' || phase === 'placement_p2'

    function color() {
        if (isOver && isPlacement) return 'bg-blue-400'
        if (state === 'ship' && isPlacement) return 'bg-blue-500'
        if (state === 'hit') return 'bg-red-500'
        if (state === 'miss') return 'bg-gray-400'
        return 'bg-gray-700 hover:bg-gray-600'
    }

    return (
        <div
            ref={setNodeRef}
            onClick={onClick}
            className={`w-10 h-10 border border-gray-600 cursor-pointer ${color()}`} />
    )
    
}

const Board = ({ userId, interactive }: Props) => {
    const phase = useGame(s => s.phase)
    const board = useGame(s => s.boards[userId])
    const shoot = useGame(s => s.shoot)

    return (
        <div>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((cell, colIndex) => (
                        <Cell
                            key={colIndex}
                            row={rowIndex}
                            col={colIndex}
                            state={cell}
                            phase={phase}
                            onClick={() => {
                                if (interactive && (phase === 'battle_p1' || phase === 'battle_p2')) {
                                    shoot(rowIndex, colIndex)
                                }
                            }}/>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Board