import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './LandingPage'
import Dashboard from './Dashboard'
import IslamicNameGenerator from './IslamicNameGenerator'
import IslamicKidsStories from './IslamicKidsStories'
import TafsirGenerator from './TafsirGenerator'
import AITafsirChatbot from './AITafsirChatbot'
import DuaGenerator from './DuaGenerator'
import PaymentSuccess from './PaymentSuccess'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/islamic-name-generator" element={<IslamicNameGenerator />} />
        <Route path="/islamic-kids-stories" element={<IslamicKidsStories />} />
        <Route path="/tafsir-generator" element={<TafsirGenerator />} />
        <Route path="/ai-tafsir-chatbot" element={<AITafsirChatbot />} />
        <Route path="/dua-generator" element={<DuaGenerator />} />
        
        {/* 404 */}
        <Route path="*" element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
              <a href="/" className="text-blue-600 hover:underline">Go to Homepage</a>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App