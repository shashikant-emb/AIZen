
import './App.css'
import { BrowserRouter as Router} from "react-router-dom"
import AppRoutes from './routes/routes'
import ToastProvider from './components/Toast/Toast'

function App() {
  return (
    <ToastProvider>
    <Router>
      <div className="app">
        <AppRoutes />
      </div>
    </Router>
    </ToastProvider>
  )
}
export default App
