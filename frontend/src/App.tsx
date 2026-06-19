import { Toaster } from "react-hot-toast"
import Game from "./components/Game"

//npm i @dnd-kit/core
import Aurora from './components/Aurora';

function App() {


  return (
    <>
      <Aurora
        colorStops={["#0061fc", "#8507f3", "#5227FF"]}
        blend={0.37}
        amplitude={1.0}
        speed={0.9} />
      <Toaster
        position="top-center"
        reverseOrder={false} />

      <Game />
    </>
  )
}

export default App
