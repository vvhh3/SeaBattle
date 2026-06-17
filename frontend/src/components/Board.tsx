import { useGame } from "../game/gameStore"

type Props = {
    userId: 0 | 1
    interactive: boolean
}

function cellColor(state: string, interactive: boolean) {
    if (state === 'ship' && !interactive) return 'bg-blue-500'
    if (state === 'ship' && interactive) return 'bg-gray-700'
    if (state === 'hit') return 'bg-red-500'
    if (state === 'miss') return 'bg-gray-400'
    return 'bg-gray-700 hover:bg-gray-600'
}

const Board = ({ userId, interactive }: Props) => {

    const phase = useGame(state => state.phase)
    const board = useGame(state => state.boards)
    const shoot = useGame(state => state.shoot)
    const placeShip = useGame(state => state.placeShip)

    const isPlacement = phase === 'placement_p1' || phase === 'placement_p2'

    const handleClick = (row: number, col: number) => {
        if (!interactive) return

        if (isPlacement) {
            placeShip(userId, row, col)
        } else {
            shoot(row, col)
        }
    }

    return (
        <div>
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="flex">
                    {row.map((col, colIndex) => (
                        <div key={colIndex} 
                        onClick={() => handleClick(rowIndex,colIndex)}>
                        className={` w-8 h-8 border border-gray-600 cursor-pointer ${cellColor(col.toString(), interactive)}`}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default Board