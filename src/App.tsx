import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPageNew from './LandingPageNew'
import Dashboard from './Dashboard'
import IslamicNameGenerator from './IslamicNameGenerator'
import IslamicKidsStories from './IslamicKidsStories'
import TafsirGenerator from './TafsirGenerator'
import QuranReflectionGenerator from './AITafsirChatbot'
import DuaGenerator from './DuaGenerator'
import PaymentSuccess from './PaymentSuccess'
import Login from './Login'
import PaymentGuard from './components/PaymentGuard'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPageNew />} />
          <Route path="/login" element={<Login />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Direct feature routes matching the marketing flow - Protected with PaymentGuard */}
          <Route path="/name-poster" element={
            <PaymentGuard featureName="Islamic Name Generator">
              <IslamicNameGenerator />
            </PaymentGuard>
          } />
          <Route path="/kids-stories" element={
            <PaymentGuard featureName="Islamic Kids Stories">
              <IslamicKidsStories />
            </PaymentGuard>
          } />
          <Route path="/ebook-generator" element={
            <PaymentGuard featureName="Tafsir eBook Generator">
              <TafsirGenerator />
            </PaymentGuard>
          } />
          <Route path="/dua-generator" element={
            <PaymentGuard featureName="AI Dua Generator">
              <DuaGenerator />
            </PaymentGuard>
          } />

          {/* Legacy routes for backwards compatibility - Also protected */}
          <Route path="/islamic-name-generator" element={
            <PaymentGuard featureName="Islamic Name Generator">
              <IslamicNameGenerator />
            </PaymentGuard>
          } />
          <Route path="/islamic-kids-stories" element={
            <PaymentGuard featureName="Islamic Kids Stories">
              <IslamicKidsStories />
            </PaymentGuard>
          } />
          <Route path="/tafsir-generator" element={
            <PaymentGuard featureName="Tafsir eBook Generator">
              <TafsirGenerator />
            </PaymentGuard>
          } />
          <Route path="/ai-tafsir-chatbot" element={
            <PaymentGuard featureName="AI Tafsir Chatbot">
              <QuranReflectionGenerator />
            </PaymentGuard>
          } />

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
      </AuthProvider>
    </Router>
  )
}

export default App