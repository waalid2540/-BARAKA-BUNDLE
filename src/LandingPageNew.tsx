import React, { useState } from 'react'

// Professional PaymentButton component
const PaymentButton = ({ price, productName, className = '' }: { price: string, productName: string, className?: string }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    try {
      const paymentData = {
        product: productName,
        price: price,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('pendingPayment', JSON.stringify(paymentData))
      window.location.href = '/payment-success'
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePayment}
      disabled={isLoading}
      className={`bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Processing...</span>
        </div>
      ) : (
        <span>Get Access - {price}</span>
      )}
    </button>
  )
}

const LandingPageNew = () => {
  const showDemo = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="bg-white text-gray-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">ب</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Baraka Bundle
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={showDemo}
                className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
              >
                View Demo
              </button>
              <PaymentButton 
                price="$9.99" 
                productName="Baraka Bundle"
                className="px-6 py-2 text-sm"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Enterprise AI Solutions
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Professional AI Islamic Tools
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                Built for Scale
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Enterprise-grade AI solutions engineered specifically for the Islamic market. 
              Professional tools for name generation, educational content, Quranic analysis, and prayer guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <PaymentButton 
                price="$9.99" 
                productName="Baraka Bundle"
                className="text-lg px-8 py-4"
              />
              <button 
                onClick={showDemo}
                className="border border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-50 transition-colors"
              >
                View Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">1.2B</div>
                <div className="text-gray-600">Muslims Worldwide</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">10</div>
                <div className="text-gray-600">Languages Supported</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">$9.99</div>
                <div className="text-gray-600">One-Time Purchase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Credibility Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Built by Islamic Scholar & Tech Expert
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🕌</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Islamic Scholarship</h3>
                <p className="text-gray-600">
                  Founded by a certified Imam with deep understanding of Islamic principles, 
                  ensuring all AI outputs are authentic and religiously accurate.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💻</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">SaaS Engineering</h3>
                <p className="text-gray-600">
                  Experienced SaaS engineer with enterprise-grade development skills, 
                  building scalable AI solutions trusted by thousands of users.
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <p className="text-lg text-gray-700 font-medium">
                The perfect combination: <span className="bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent font-bold">Religious authenticity meets technical excellence</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              4 Professional AI Islamic Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive Islamic AI solutions with authentic content and multi-language support
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl text-white">👶</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">Islamic Name Generator</h3>
                  <p className="text-gray-600 mb-6">
                    Generate beautiful Islamic names with detailed meanings, origins, and spiritual significance.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">10+ Languages</span>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Arabic Script</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl text-white">📚</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">AI Islamic Stories for Kids</h3>
                  <p className="text-gray-600 mb-6">
                    Create engaging, age-appropriate Islamic stories with voice-over that teach moral values.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Voice-Over</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Moral Lessons</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl text-white">📖</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">AI Tafsir Generator</h3>
                  <p className="text-gray-600 mb-6">
                    Get comprehensive Quranic explanations with historical context and practical applications.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Scholarly</span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Authentic</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-lg hover:transform hover:scale-105 transition-all duration-300">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl text-white">🤲</span>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">AI Du'a Generator</h3>
                  <p className="text-gray-600 mb-6">
                    Find perfect prayers with pronunciation and authentic sources for every situation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Pronunciation</span>
                    <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Authentic Sources</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Masjid Support Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Supporting Islamic Infrastructure</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Every purchase directly contributes to expanding Masjid Madina USA, building a stronger Muslim community.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <div className="text-4xl mb-4">🕌</div>
              <div className="text-2xl font-bold mb-2">50% Revenue</div>
              <div className="text-gray-300">Allocated to Masjid Madina USA expansion</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <div className="text-4xl mb-4">🌍</div>
              <div className="text-2xl font-bold mb-2">1.2B Muslims</div>
              <div className="text-gray-300">Served worldwide in 10 languages</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
              <div className="text-4xl mb-4">🤖</div>
              <div className="text-2xl font-bold mb-2">AI + Scholarship</div>
              <div className="text-gray-300">Built by Imam & SaaS Engineer</div>
            </div>
          </div>

          <PaymentButton 
            price="$9.99" 
            productName="Baraka Bundle"
            className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">ب</span>
            </div>
            <span className="text-2xl font-bold text-white">Baraka Bundle</span>
          </div>
          <p className="text-gray-400 mb-4">
            Professional AI Islamic Tools for the Global Muslim Community
          </p>
          <p className="text-gray-500 text-sm">
            Built with expertise by Islamic Scholar & SaaS Engineer
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageNew