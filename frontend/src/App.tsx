import { Toaster } from "react-hot-toast"
import Game from "./components/Game"


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
