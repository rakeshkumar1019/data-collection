import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { QuickMessageForm } from './components/QuickMessageForm'
import { DataList } from './components/DataList'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/data" element={<DataList />} />
      </Routes>
    </Router>
  )
}

function HomePage() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Form Data Collection</h1>
        <p>Submit your information and we'll save it securely</p>
      </header>

      <main className="app-main">
        <QuickMessageForm />
      </main>
    </div>
  )
}

export default App
