import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import Events from './components/Events'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/events' element={<Events/>}/>
    </Routes>
    </BrowserRouter>
  )
}

export default App
