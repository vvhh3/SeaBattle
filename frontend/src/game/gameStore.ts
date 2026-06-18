import { create } from "zustand";

type CellState = 'empty' | "ship" | "hit" | "miss"

type PhaseGame = 'placement_p1'
    | 'pass'
    | 'placement_p2'
    | 'battle_p1'
    | 'battle_p2'
    | 'game_over';

type board = CellState[][]


const emptyBoard = (): board => {
    return Array.from({ length: 10 }, () =>
        Array.from({ length: 10 }, () => 'empty' as CellState)
    )
}

type Store = {
    phase: PhaseGame
    boards: [board, board]
    placedShipIds: number[]  // добавь
    placeShip: (userId: 0 | 1, row: number, col: number, size: number, shipId: number) => void  // обновь сигнатуру
    shoot: (rows: number, cell: number) => void
    nextPhase: () => void
    reset: () => void
}



export const useGame = create<Store>((set) => ({

    phase: 'placement_p1',
    boards: [emptyBoard(), emptyBoard()],
    placedShipIds: [],

    placeShip: (userId, row, col, size, shipId) => set((state) => {
        const boards = structuredClone(state.boards)

        // считаем все клетки корабля
        const cells = Array.from({ length: size }, (_, i) => ({
            row: row,
            col: col + i  // горизонтально
        }))

        // выход за границы
        if (cells.some(c => c.col > 9)) return state

        // клетка уже занята
        if (cells.some(c => boards[userId][c.row][c.col] === 'ship')) return state

        for (const c of cells) {
            boards[userId][c.row][c.col] = 'ship'
        }

        return { boards, placedShipIds: [...state.placedShipIds, shipId] }
    }),

    shoot: (row, col) => set((state) => {

        //structuredClone - встроенная глобальная функция JavaScript, которая используется для создания полной глубокой копии  объектов, 
        //массивов и других сложных структур данных. Она безопасно копирует данные, не создавая ссылок на оригинальный объект.
        const boards2 = structuredClone(state.boards)
        const idUserTarget = state.phase === 'battle_p1' ? 1 : 0
        const cell = boards2[idUserTarget][row][col]

        if (cell === 'hit' || cell === 'miss') return state

        boards2[idUserTarget][row][col] = cell === 'ship' ? 'hit' : 'miss'

        //flat() —  превращая вложенные массивы в один плоский (одномерный) массив.
        // .every() — проверяет, удовлетворяют ли все элементы массива условию, заданному в функции. 
        // Метод возвращает true или false
        const allShipHit = boards2[idUserTarget].flat().every(e => e !== 'ship')

        return {
            phase: allShipHit ? 'game_over' : state.phase === 'battle_p1' ? 'battle_p2' : 'battle_p1',
            boards: boards2
        }
    }),

    nextPhase: () => set(state => {

        if (state.phase === 'placement_p1') return { phase: 'pass' }
        else if (state.phase === 'pass') return { phase: 'placement_p2' }
        else if (state.phase === 'placement_p2') return { phase: "battle_p1" }
        return state
    }),

    reset: () => {
        set({
            phase: "placement_p1",
            boards: [emptyBoard(), emptyBoard()],
            placedShipIds: []
        })
    }
}))

