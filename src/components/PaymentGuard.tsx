import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'

// Use test key - replace with your actual Stripe publishable key
// For demo purposes, we'll disable Stripe loading to prevent errors
const stripePromise = null // loadStripe('pk_test_51234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')

interface PaymentGuardProps {
  children: React.ReactNode
  featureName: string
}

const PaymentGuard: React.FC<PaymentGuardProps> = ({ children, featureName }) => {
  const { user, checkPaymentStatus } = useAuth()
  const navigate = useNavigate()
  const [hasPaid, setHasPaid] = useState(false)
  const [loading, setLoading] = useState(true)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) {
        // Redirect to login if not authenticated
        navigate('/login', { state: { from: { pathname: window.location.pathname } } })
        return
      }

      // Check payment status
      const paid = await checkPaymentStatus()
      setHasPaid(paid)
      setLoading(false)
    }

    checkStatus()
  }, [user, navigate, checkPaymentStatus])

  const handlePayment = async () => {
    setProcessingPayment(true)

    try {
      // Simulate successful payment for demo (no Stripe required)
      setTimeout(() => {
        // Mark payment as successful
        localStorage.setItem('barakah_payment_session', JSON.stringify({
          timestamp: Date.now(),
          amount: 9700, // $97 in cents
          currency: 'usd'
        }))

        // Refresh payment status
        checkPaymentStatus().then(() => {
          setHasPaid(true)
          setProcessingPayment(false)
        })
      }, 2000)

      // In production, use this code:
      /*
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          priceId: 'price_1234567890', // Your Stripe price ID
          successUrl: window.location.href,
          cancelUrl: window.location.href,
        }),
      })

      const session = await response.json()
      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      })

      if (result.error) {
        alert(result.error.message)
      }
      */

    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed. Please try again.')
    } finally {
      if (processingPayment) {
        setProcessingPayment(false)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!hasPaid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          {/* Payment Wall */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-red-600 p-8 text-white text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-3xl mb-4">
                <span className="text-4xl">🔒</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Unlock {featureName}</h1>
              <p className="text-white/90">Get lifetime access to all Islamic AI tools</p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Pricing */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 mb-2">
                  <span className="text-gray-400 line-through text-2xl">$297</span>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    67% OFF
                  </span>
                </div>
                <div className="text-5xl font-bold text-gray-900 mb-2">$97</div>
                <p className="text-gray-600">One-time payment • Lifetime access</p>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">✨ What You'll Get:</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">
                      <strong>Islamic Name Generator</strong> - Beautiful names with meanings
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">
                      <strong>Kids Story Generator</strong> - Engaging Islamic stories
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">
                      <strong>AI Tafsir Chatbot</strong> - Quranic insights
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">
                      <strong>Dua Generator</strong> - Prayers in multiple languages
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">✓</span>
                    <span className="text-gray-700">
                      <strong>Future Updates</strong> - All new features included
                    </span>
                  </li>
                </ul>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={processingPayment}
                className="w-full bg-gradient-to-r from-blue-600 to-red-600 text-white py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {processingPayment ? 'Processing...' : 'Get Lifetime Access Now →'}
              </button>

              {/* Trust Badges */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="mr-2">🔒</span>
                  <span>Secure Payment</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">💳</span>
                  <span>Stripe Powered</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">♻️</span>
                  <span>30-Day Guarantee</span>
                </div>
              </div>

              {/* Social Proof */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-900 font-semibold mb-2">
                    🕌 50% of revenue goes to Masjid Madina USA
                  </p>
                  <p className="text-gray-600 text-sm">
                    Your purchase supports Islamic infrastructure development
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Dashboard */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // User has paid - show the content
  return <>{children}</>
}

export default PaymentGuard