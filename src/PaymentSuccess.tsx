import React, { useEffect } from 'react'

const PaymentSuccess = () => {
  useEffect(() => {
    // Redirect to dashboard after showing success
    const timer = setTimeout(() => {
      window.location.href = '/dashboard'
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Success Animation */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <span className="text-white text-4xl">✅</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Barakallahu Feek!</h1>
          <p className="text-2xl text-gray-600 mb-2">
            Payment Successful 🎉
          </p>
          <p className="text-lg text-blue-600 font-medium">
            Welcome to Baraka Bundle - Your Islamic AI Tools
          </p>
        </div>

        {/* Loading Status */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xl text-gray-700 font-medium">Activating your AI tools...</span>
          </div>
          
          <div className="text-green-600 font-semibold text-lg">
            ✅ Access granted to all 4 Islamic AI tools!
          </div>
        </div>

        {/* What's Unlocked */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Islamic AI Tools:</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl">
              <span class="text-3xl">👶</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">Islamic Name Generator</div>
                <div className="text-sm text-gray-600">Beautiful names with meanings</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl">
              <span class="text-3xl">📚</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">AI Islamic Stories</div>
                <div className="text-sm text-gray-600">Educational stories for kids</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-xl">
              <span class="text-3xl">📖</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">AI Tafsir Generator</div>
                <div className="text-sm text-gray-600">Quranic explanations</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 bg-amber-50 rounded-xl">
              <span class="text-3xl">🤲</span>
              <div className="text-left">
                <div className="font-semibold text-gray-900">AI Du'a Generator</div>
                <div className="text-sm text-gray-600">Perfect prayers & supplications</div>
              </div>
            </div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="bg-gradient-to-r from-blue-600 to-red-600 text-white rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-4">🕌 Jazak Allah Khair!</h3>
          <p className="text-lg mb-4">
            Your purchase supports Masjid Madina USA expansion project.
          </p>
          <p className="text-blue-100">
            50% of your $5.99 payment is being allocated to support Islamic infrastructure.
          </p>
        </div>

        <p className="text-gray-500 mt-8">
          Redirecting you to your dashboard in a few seconds...
        </p>
      </div>
    </div>
  )
}

export default PaymentSuccess