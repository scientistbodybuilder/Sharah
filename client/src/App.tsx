import Header from './components/Header'
import Footer from './components/Footer'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css'

import Analyze from './components/Analyze';
import Landing from './components/Landing'
import ProtectedRoute from './ProtectedRoute'
// import Gallery from './components/gallery/Gallery';

function App() {

  return (
    <Router>
      <Header />
      <div>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/analyze" element={<ProtectedRoute>
              <Analyze />
          </ProtectedRoute>
            } />
          <Route path="*" element={<Navigate to="/analyze" replace />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
