import React, { useState } from 'react'

interface PaymentButtonProps {
  price: string
  productName: string
  className?: string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ price, productName, className = '' }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      // For now, redirect to a simple payment page
      // Later you can integrate with Stripe
      const paymentData = {
        product: productName,
        price: price,
        timestamp: new Date().toISOString()
      }
      
      // Store in localStorage for demo
      localStorage.setItem('pendingPayment', JSON.stringify(paymentData))
      
      // Redirect to payment success (for demo)
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
      className={`bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Processing...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <span>💳</span>
          <span>Get {productName} - {price}</span>
          <span>🕌</span>
        </div>
      )}
    </button>
  )
}

export default PaymentButton