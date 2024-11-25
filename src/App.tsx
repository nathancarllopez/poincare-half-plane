import './App.css'
import Canvas from './Canvas.tsx'

/**
 * Question:
 * For this file and for main.tsx: am I supposed to just keep these as bare bones as possible?
 * That is, should I avoid putting any logic in these files and instead put all logic in other files that I create? I'm thinking that I should keep these files as simple as possible and just use them to render the main component of the app, but maybe App is supposed to be the "master parent" component that holds all the state and logic for the app. I'm not sure what the standard practice is here.
 */

function App() {
  return <Canvas />
}

export default App