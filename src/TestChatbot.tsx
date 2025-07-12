import React from 'react'

const TestChatbot = () => {
  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">🤖 AI Tafsir Chatbot Test</h1>
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <p className="text-lg text-center text-gray-700">
            ✅ Chatbot component is loading successfully!
          </p>
          <p className="text-center text-gray-500 mt-4">
            This confirms the route and component are working.
          </p>
          <div className="text-center mt-6">
            <button 
              onClick={() => window.history.back()}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestChatbot