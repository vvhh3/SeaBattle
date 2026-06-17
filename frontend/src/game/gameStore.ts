import { create } from "zustand";

type CellState = 'empty' | "ship" | "hit" | "miss"

type PhaseGame = 'placement_p1'  // игрок 1 ставит корабли
    | 'pass'          // экран "передай компьютер"
    | 'placement_p2'  // игрок 2 ставит корабли
    | 'battle_p1'     // ход игрока 1
    | 'battle_p2'     // ход игрока 2
    | 'game_over';

type board = CellState[][]

function emptyBoard(): board {
    return Array.from({ length: 10 }, () => Array(10).fill('empty'))
}

type Store = {
    phase: PhaseGame
    boards: [board, board]
    placeShip: (userId: 0 | 1, rows: number, cell: number) => void
    shoot: (rows: number, cell: number) => void
    nextPhase: () => void
    reset: () => void
}

export const useGame = create<Store>((set) => ({
    phase: 'placement_p1',
    boards: [emptyBoard(), emptyBoard()],

    placeShip: (userId, row, coll) => set((state) => {
        const boards = structuredClone(state.boards)
        boards[userId][row][coll] = "ship"
        return { boards }
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

        if (state.phase === 'placement_p1') return {phase: 'pass'}
        else if (state.phase  === 'pass') return {phase: 'placement_p2'}
        else if (state.phase  === 'placement_p2') return {phase: "battle_p1"}
        return state
    }),

    reset: () => {
        set({
            phase: "placement_p1",
            boards: [emptyBoard(), emptyBoard()]
        })
    }
}))

