
import './App.css'
import { BrowserRouter as Router} from "react-router-dom"
import AppRoutes from './routes/routes'

function App() {
  return (
    <Router>
      <div className="app">
        <AppRoutes />
      </div>
    </Router>
  )
}
export default App
