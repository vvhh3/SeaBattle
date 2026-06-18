import { Toaster } from "react-hot-toast"
import Game from "./components/Game"

//npm i @dnd-kit/core
function App() {


  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false} />
      <Game />
    </>
  )
}

export default App
