import React from 'react'
import PaymentButton from './components/PaymentButton'

const LandingPageNew = () => {
  const showDemo = () => {
    window.location.href = '/dashboard'
  }

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-gray-900">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">🕌</span>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                  Baraka Bundle
                </span>
                <p className="text-sm text-gray-600">Islamic AI Suite</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={showDemo}
                className="text-gray-600 hover:text-emerald-600 font-medium transition-colors"
              >
                Try Demo
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
      <section className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Islamic Greeting */}
            <div className="mb-8">
              <p className="text-2xl text-emerald-700 font-semibold mb-2" dir="rtl">
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم
              </p>
              <p className="text-lg text-gray-600">In the name of Allah, the Most Gracious, the Most Merciful</p>
            </div>

            {/* Emotional Badge */}
            <div className="mb-8">
              <span className="inline-flex items-center px-6 py-3 rounded-full text-lg font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                <span className="w-3 h-3 bg-emerald-500 rounded-full mr-3 animate-pulse"></span>
                Built by Imam Yussuf for the Ummah 🤲
              </span>
            </div>
            
            {/* Heart-touching Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              <span className="block mb-4">Your Family's</span>
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                Islamic Heritage
              </span>
              <span className="block mt-4">In Your Hands</span>
            </h1>
            
            {/* Emotional Subheadline */}
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-4xl mx-auto">
              <strong>Are your children losing their Islamic identity?</strong><br />
              <span className="text-emerald-700">Four powerful AI tools to reconnect your family with authentic Islamic knowledge,</span><br />
              <span className="text-blue-700">while helping build Allah's house in Madina.</span>
            </p>

            {/* Pain Points */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-red-800 mb-6">Every Muslim Parent's Fear...</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">😢</span>
                  <p className="text-red-700">"My kids don't understand Arabic or Quran"</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">😟</span>
                  <p className="text-red-700">"They're losing interest in Islamic stories"</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">😰</span>
                  <p className="text-red-700">"I can't explain Quranic verses properly"</p>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-red-500 text-xl">😔</span>
                  <p className="text-red-700">"Finding authentic Islamic content is so hard"</p>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-emerald-800 mb-6">Allah Has Provided a Solution ✨</h3>
              <p className="text-lg text-emerald-700 leading-relaxed">
                Baraka Bundle brings authentic Islamic knowledge to your fingertips. 
                Scholar-verified AI that understands our Deen, speaks our language, 
                and helps you raise righteous children in today's world.
              </p>
            </div>

            {/* Main CTA */}
            <div className="mb-16">
              <PaymentButton 
                price="$9.99" 
                productName="Baraka Bundle"
                className="text-xl px-12 py-6 mb-6"
              />
              
              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Scholar-Verified</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>One-Time Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>50% to Madina Masjid</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>Lifetime Access</span>
                </div>
              </div>
            </div>

            {/* Masjid Charity Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 mb-16">
              <div className="text-center">
                <h3 className="text-3xl font-bold text-yellow-800 mb-4">
                  🕌 Help Build Allah's House
                </h3>
                <p className="text-xl text-yellow-700 mb-6">
                  50% of every purchase goes directly to expanding Madina Masjid
                </p>
                <div className="grid md:grid-cols-3 gap-6 text-center">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-emerald-600">$4.99</div>
                    <div className="text-sm text-gray-600">from your purchase</div>
                    <div className="text-sm text-emerald-600 font-medium">goes to Masjid</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-blue-600">2x</div>
                    <div className="text-sm text-gray-600">Reward</div>
                    <div className="text-sm text-blue-600 font-medium">Help Family + Masjid</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-purple-600">∞</div>
                    <div className="text-sm text-gray-600">Hasanat</div>
                    <div className="text-sm text-purple-600 font-medium">Ongoing Charity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Four Sacred Tools for Your Family
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to strengthen your family's connection with Allah
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            {/* AI Tafsir */}
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-3xl p-8 border border-emerald-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📖</span>
                </div>
                <h3 className="text-2xl font-bold text-emerald-800 mb-3">AI Tafsir</h3>
                <p className="text-emerald-700">Scholar-verified Quranic explanations</p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span>Ask any verse and get authentic explanations</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span>Based on classical scholars like Ibn Kathir</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span>Available in multiple languages</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span>Perfect for family Quran study</span>
                </div>
              </div>
            </div>

            {/* Islamic Names */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👶</span>
                </div>
                <h3 className="text-2xl font-bold text-blue-800 mb-3">Islamic Names</h3>
                <p className="text-blue-700">Beautiful names with deep meanings</p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Thousands of authentic Islamic names</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Meanings in Arabic and English</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Prophet's companions names included</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-500 mt-1">✓</span>
                  <span>Filter by gender, origin, and meaning</span>
                </div>
              </div>
            </div>

            {/* Kids Stories */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl p-8 border border-purple-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-purple-800 mb-3">Islamic Stories</h3>
                <p className="text-purple-700">Engaging stories that teach Islamic values</p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Stories of Prophets and Companions</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Age-appropriate Islamic lessons</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Replaces non-Islamic bedtime stories</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-purple-500 mt-1">✓</span>
                  <span>Customizable for different ages</span>
                </div>
              </div>
            </div>

            {/* Dua Generator */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 border border-yellow-100">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🤲</span>
                </div>
                <h3 className="text-2xl font-bold text-yellow-800 mb-3">Dua Collection</h3>
                <p className="text-yellow-700">Authentic duas for every situation</p>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-500 mt-1">✓</span>
                  <span>Duas from Quran and authentic Hadith</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-500 mt-1">✓</span>
                  <span>Available in 20+ languages</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-500 mt-1">✓</span>
                  <span>Audio pronunciation included</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-yellow-500 mt-1">✓</span>
                  <span>Daily, travel, and special occasion duas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              What Muslim Families Are Saying
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-emerald-600 font-bold">A</span>
                </div>
                <div>
                  <div className="font-semibold">Amina Hassan</div>
                  <div className="text-sm text-gray-600">Mother of 3, London</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "Finally! My children ask ME about Quran verses now instead of Google. 
                The Islamic stories replaced their Disney obsession. This is barakah."
              </p>
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">M</span>
                </div>
                <div>
                  <div className="font-semibold">Mohammed Al-Rashid</div>
                  <div className="text-sm text-gray-600">Father & Teacher, Toronto</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "As an Islamic school teacher, I use this daily. The Tafsir explanations 
                are authentic and age-appropriate. My students love the interactive stories."
              </p>
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">S</span>
                </div>
                <div>
                  <div className="font-semibold">Sister Khadija</div>
                  <div className="text-sm text-gray-600">New Muslim, Sydney</div>
                </div>
              </div>
              <p className="text-gray-700 mb-4">
                "I reverted 2 years ago and struggled to understand Islam deeply. 
                This AI explains everything so clearly. It's like having a scholar at home."
              </p>
              <div className="flex text-yellow-400">
                ⭐⭐⭐⭐⭐
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Don't Let Another Day Pass
          </h2>
          <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
            Every moment your family spends without authentic Islamic knowledge 
            is a moment they could be growing closer to Allah.
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8">
            <p className="text-2xl text-white font-semibold mb-4">
              For less than the cost of a family meal...
            </p>
            <p className="text-emerald-100 text-lg">
              Give your family lifetime access to authentic Islamic knowledge
              <br />
              <strong className="text-white">AND help build Allah's house in Madina</strong>
            </p>
          </div>

          <PaymentButton 
            price="$9.99" 
            productName="Baraka Bundle"
            className="text-2xl px-16 py-8 mb-8 bg-white text-emerald-600 hover:bg-gray-50"
          />
          
          <div className="text-emerald-100 space-y-2">
            <p>✓ Instant download after payment</p>
            <p>✓ Works on all devices</p>
            <p>✓ 50% goes to Madina Masjid expansion</p>
            <p>✓ Built by Imam for Muslim families</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">🕌</span>
            </div>
            <span className="text-2xl font-bold text-white">Baraka Bundle</span>
          </div>
          <p className="text-gray-400 mb-4">
            Built with ❤️ by Imam Yussuf for the global Muslim ummah
          </p>
          <p className="text-gray-500 text-sm">
            "The best of people are those who benefit others" - Prophet Muhammad ﷺ
          </p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPageNew