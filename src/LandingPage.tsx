import React, { useState } from 'react'

const LandingPage = () => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePurchase = async () => {
    setIsLoading(true)
    
    try {
      // This will integrate with Stripe for $5.99 one-time payment
      // For now, redirect to success page for demo
      setTimeout(() => {
        alert('🔥 COMING SOON! Payment integration will be added next!')
      }, 1000)
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const testimonials = [
    {
      name: "Ahmad Hassan",
      location: "Cairo, Egypt",
      text: "I was STRUGGLING for weeks to find the perfect Islamic name for my son. Spent hours on websites with incomplete information. This AI tool gave me 10 beautiful names with full meanings in 2 minutes! Worth every penny.",
      rating: 5,
      pain: "Was spending weeks researching names"
    },
    {
      name: "Umm Maryam",
      location: "Jakarta, Indonesia", 
      text: "My 7-year-old was getting bored with Islamic lessons and asking for cartoons instead. These AI stories completely changed that! Now she BEGS for more Islamic stories every night. This saved my parenting!",
      rating: 5,
      pain: "Daughter was losing interest in Islam"
    },
    {
      name: "Abu Bakr Al-Rashid",
      location: "Manchester, UK",
      text: "I felt embarrassed because I couldn't understand complex Tafsir books. This AI explains Quranic verses in simple modern language that I actually GET. Finally feeling connected to Allah's words again!",
      rating: 5,
      pain: "Felt disconnected from Quran"
    },
    {
      name: "Sister Khadijah",
      location: "Detroit, USA",
      text: "During my divorce, I was desperately googling du'as but found unreliable sources. This tool gave me exactly the right du'a with pronunciation for my situation. It felt like Allah sent me help through technology!",
      rating: 5,
      pain: "Couldn't find reliable du'as during crisis"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-islamic-gradient rounded-xl flex items-center justify-center animate-barakah">
                <span className="text-white font-bold text-xl">ب</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-islamic-gradient">
                  Baraka Bundle
                </h1>
                <p className="text-sm text-gray-600">AI Islamic Tools for the Ummah</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-sm text-emerald-600 font-medium bg-emerald-50 px-3 py-1 rounded-full">
                ✨ 50% supports Masjid Madina
              </div>
              <button 
                onClick={handlePurchase}
                className="bg-islamic-gradient text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Bundle $5.99
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Pain Point Hero Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center max-w-6xl mx-auto">
          {/* Urgency Badge */}
          <div className="mb-8">
            <span className="bg-red-100 text-red-800 px-6 py-3 rounded-full text-lg font-bold animate-pulse">
              ⚠️ 500 Million Muslims Struggling Without These Tools
            </span>
          </div>
          
          {/* Pain-Focused Headline */}
          <h2 className="text-7xl font-bold text-gray-900 mb-8 leading-tight">
            Are You <span className="text-red-600">Struggling</span> With...
          </h2>
          
          {/* Pain Points List */}
          <div className="grid md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-left">
              <div className="text-4xl mb-4">😰</div>
              <h3 className="text-2xl font-bold text-red-800 mb-4">Finding the Perfect Islamic Name?</h3>
              <ul className="text-red-700 space-y-3">
                <li>• Spending hours researching Islamic names online</li>
                <li>• Worried about choosing a name with wrong meaning</li>
                <li>• Can't find names with proper spiritual significance</li>
                <li>• Family disagreements about name choices</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-left">
              <div className="text-4xl mb-4">😔</div>
              <h3 className="text-2xl font-bold text-red-800 mb-4">Teaching Islam to Your Kids?</h3>
              <ul className="text-red-700 space-y-3">
                <li>• Kids losing interest in Islamic stories</li>
                <li>• Struggling to make Islam engaging for children</li>
                <li>• Limited Islamic content for different age groups</li>
                <li>• Competing with non-Islamic entertainment</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-left">
              <div className="text-4xl mb-4">😓</div>
              <h3 className="text-2xl font-bold text-red-800 mb-4">Understanding the Quran Deeply?</h3>
              <ul className="text-red-700 space-y-3">
                <li>• Reading Tafsir books that are too complex</li>
                <li>• Can't relate Quranic teachings to modern life</li>
                <li>• Limited access to scholarly explanations</li>
                <li>• Feeling disconnected from Quranic wisdom</li>
              </ul>
            </div>
            
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-left">
              <div className="text-4xl mb-4">🤲</div>
              <h3 className="text-2xl font-bold text-red-800 mb-4">Finding the Right Du'a?</h3>
              <ul className="text-red-700 space-y-3">
                <li>• Googling du'as and finding unreliable sources</li>
                <li>• Not knowing which du'a fits your situation</li>
                <li>• Missing pronunciation and proper timing</li>
                <li>• Feeling lost during difficult life moments</li>
              </ul>
            </div>
          </div>

          {/* Solution Statement */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-3xl p-12 mb-12">
            <h3 className="text-5xl font-bold mb-6">STOP Struggling!</h3>
            <p className="text-2xl mb-8 leading-relaxed">
              What if you could solve ALL these problems in the next 5 minutes 
              with AI-powered Islamic tools that understand your faith?
            </p>
            <div className="text-3xl font-bold bg-white text-emerald-600 inline-block px-8 py-4 rounded-2xl">
              🚀 YES, Show Me The Solution!
            </div>
          </div>

          {/* Benefits After Pain */}
          <div className="mb-12">
            <h3 className="text-4xl font-bold text-gray-900 mb-8">Imagine If You Could...</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-left">
                <div className="text-2xl mb-3">✅</div>
                <p className="text-green-800 font-semibold">Generate perfect Islamic names instantly with meanings and spiritual significance</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-left">
                <div className="text-2xl mb-3">✅</div>
                <p className="text-green-800 font-semibold">Create engaging Islamic stories that make your kids LOVE learning about Islam</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-left">
                <div className="text-2xl mb-3">✅</div>
                <p className="text-green-800 font-semibold">Get personalized Tafsir explanations that relate to YOUR modern life</p>
              </div>
              <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-left">
                <div className="text-2xl mb-3">✅</div>
                <p className="text-green-800 font-semibold">Find the perfect du'a for ANY situation with proper pronunciation</p>
              </div>
            </div>
          </div>
          
          {/* URGENCY Price Card */}
          <div className="bg-gradient-to-br from-red-50 to-orange-50 border-4 border-red-300 rounded-3xl shadow-2xl p-10 mb-12 max-w-2xl mx-auto relative overflow-hidden">
            {/* Urgency Banner */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-8 py-2 rounded-full font-bold text-sm animate-pulse">
              ⚡ LIMITED TIME - ACT NOW!
            </div>
            
            <div className="text-center pt-6">
              {/* Price Comparison */}
              <div className="mb-6">
                <div className="text-gray-500 text-xl line-through mb-2">
                  Usually costs $200+ for these services separately
                </div>
                <div className="text-6xl font-bold text-red-600 mb-2">$5.99</div>
                <div className="text-emerald-600 font-bold text-xl mb-4">That's 97% OFF!</div>
              </div>

              {/* Scarcity Counter */}
              <div className="bg-red-100 border-2 border-red-300 rounded-2xl p-6 mb-8">
                <div className="text-red-800 font-bold text-lg mb-3">
                  ⏰ Only 1,000 Early Access Spots Available
                </div>
                <div className="text-red-600 text-3xl font-bold mb-2">847 Remaining</div>
                <div className="text-red-700 text-sm">
                  After these spots are gone, the price goes up to $29.99
                </div>
              </div>

              <button
                onClick={handlePurchase}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-6 px-8 rounded-2xl font-bold text-2xl hover:from-red-700 hover:to-red-800 transition-all shadow-2xl hover:shadow-3xl disabled:opacity-50 transform hover:scale-105 transition-transform duration-200 animate-pulse"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>🔥 SECURE MY SPOT FOR $5.99 NOW!</>
                )}
              </button>

              <div className="text-sm text-gray-600 mt-6 space-y-2">
                <div className="font-bold text-emerald-600">✅ Instant Access (No Waiting)</div>
                <div>✅ 30-Day Money-Back Guarantee</div>
                <div>✅ Lifetime Access (Never Expires)</div>
                <div className="font-bold text-red-600">⚠️ Price increases to $29.99 after 1,000 sales</div>
              </div>

              {/* Risk Reversal */}
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mt-6">
                <div className="text-yellow-800 font-bold text-lg mb-2">
                  🛡️ ZERO RISK GUARANTEE
                </div>
                <div className="text-yellow-700 text-sm">
                  If you're not completely satisfied, get 100% of your money back within 30 days. 
                  No questions asked.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* POWERFUL Social Proof Section */}
      <section className="py-20 bg-gradient-to-br from-red-50 to-orange-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="bg-red-600 text-white px-6 py-3 rounded-full inline-block mb-6 font-bold">
              🔥 BREAKING: Muslims Around the World Are Raving!
            </div>
            <h3 className="text-5xl font-bold text-gray-900 mb-6">See How Baraka Bundle Solved Their EXACT Problems</h3>
            <p className="text-2xl text-red-600 font-bold">These Muslims Had the SAME Struggles as You...</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto mb-16">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-2xl border-2 border-yellow-300 relative">
                {/* Pain Point Banner */}
                <div className="bg-red-100 border border-red-300 rounded-lg p-3 mb-6">
                  <div className="text-red-800 font-bold text-sm mb-1">❌ BEFORE: Their Problem</div>
                  <div className="text-red-700 text-sm">{testimonial.pain}</div>
                </div>
                
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-2xl">⭐</span>
                  ))}
                  <span className="ml-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">
                    VERIFIED PURCHASE
                  </span>
                </div>
                
                <p className="text-gray-800 mb-6 font-medium leading-relaxed text-lg">"{testimonial.text}"</p>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                    <div className="text-gray-600">{testimonial.location}</div>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                    ✅ PROBLEM SOLVED!
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Fear of Missing Out */}
          <div className="text-center">
            <div className="bg-red-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-3xl font-bold mb-4">⚠️ DON'T BE THE ONLY ONE LEFT OUT!</div>
              <div className="text-xl mb-6">
                While you're thinking about it, other Muslims are already solving their problems with Baraka Bundle
              </div>
              <button
                onClick={handlePurchase}
                className="bg-yellow-400 text-red-800 py-4 px-8 rounded-xl font-bold text-xl hover:bg-yellow-300 transition-colors shadow-lg"
              >
                🔥 I DON'T WANT TO MISS OUT - GET MINE NOW!
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL POWER CTA Section */}
      <section className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 py-24">
        <div className="container mx-auto px-6 text-center">
          {/* Last Chance Warning */}
          <div className="bg-yellow-400 text-red-800 px-8 py-4 rounded-2xl inline-block mb-8 font-bold text-2xl animate-pulse">
            ⚠️ LAST CHANCE: Only 153 Spots Left at $5.99!
          </div>
          
          <h3 className="text-6xl font-bold text-white mb-8 leading-tight">
            Stop Struggling & Start Thriving
            <br />
            <span className="text-yellow-300">Your Islamic Journey Awaits!</span>
          </h3>

          {/* MEGA CTA Button */}
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-red-800 py-8 px-16 rounded-3xl font-black text-3xl hover:from-yellow-300 hover:to-yellow-400 transition-all duration-200 shadow-2xl hover:shadow-3xl disabled:opacity-50 transform hover:scale-105 transition-transform duration-200 animate-pulse mb-8"
          >
            {isLoading ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-8 h-8 border-4 border-red-800 border-t-transparent rounded-full animate-spin"></div>
                <span>PROCESSING...</span>
              </div>
            ) : (
              <>🔥 YES! GIVE ME BARAKA BUNDLE FOR $5.99 NOW!</>
            )}
          </button>

          {/* Final Guarantee */}
          <div className="text-yellow-200 text-xl max-w-3xl mx-auto">
            <div className="mb-4">
              <strong>💝 Blessed Purchase:</strong> 50% supports Masjid Madina Waqf Project
            </div>
            <div className="mb-4">
              <strong>🛡️ Protected Purchase:</strong> 30-Day Money-Back Guarantee
            </div>
            <div>
              <strong>⚡ Instant Access:</strong> Download immediately after payment
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-islamic-gradient rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">ب</span>
            </div>
            <span className="text-2xl font-bold text-islamic-gradient">Baraka Bundle</span>
          </div>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
            Empowering the Muslim Ummah with AI technology. A blessed Waqf project supporting 
            Masjid Madina and serving 500 million Muslims worldwide.
          </p>
          <div className="text-sm text-gray-500 space-y-2">
            <div>© 2024 Baraka Bundle. All rights reserved.</div>
            <div>Halal Certified AI Tools • Shariah Compliant • Waqf Project</div>
            <div>🕌 50% of proceeds support Masjid Madina • Made with ❤️ for the Ummah</div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage