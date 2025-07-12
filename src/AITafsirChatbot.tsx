import React, { useState, useEffect, useRef } from 'react'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

const AITafsirChatbot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState('english')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const languages = [
    { code: 'english', name: 'English', flag: '🇺🇸' },
    { code: 'arabic', name: 'العربية', flag: '🇸🇦' },
    { code: 'turkish', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'indonesian', name: 'Bahasa Indonesia', flag: '🇮🇩' }
  ]

  // Welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'bot',
      content: language === 'arabic' ?
        'السلام عليكم! أنا مساعد تفسير القرآن بالذكاء الاصطناعي المدعوم بتفسير السعدي. اسألني عن أي آية!' :
        language === 'turkish' ?
        'Selamün aleyküm! Ben As-Saadi Tefsiri destekli AI asistanıyım. Kuran ayetleri hakkında soru sorabilirsiniz!' :
        language === 'indonesian' ?
        'Assalamu\'alaikum! Saya asisten AI Tafsir berdasarkan Tafsir As-Saadi. Tanyakan tentang ayat Al-Quran!' :
        'Assalamu Alaikum! I\'m your AI Tafsir assistant powered by Tafsir As-Saadi. Ask me about any Quranic verse!',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [language])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Send message
  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    // Simple response for now - will integrate with As-Saadi later
    setTimeout(() => {
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: language === 'arabic' ?
          'شكراً لسؤالك! أنا أعمل حالياً على تطوير الاتصال مع قاعدة بيانات تفسير السعدي. سيتم تحديث هذه الميزة قريباً.' :
          language === 'turkish' ?
          'Sorunuz için teşekkürler! As-Saadi veritabanı bağlantısı üzerinde çalışıyorum. Bu özellik yakında güncellenecek.' :
          language === 'indonesian' ?
          'Terima kasih atas pertanyaannya! Saya sedang mengembangkan koneksi dengan database As-Saadi. Fitur ini akan segera diperbarui.' :
          'Thank you for your question! I\'m currently working on connecting with the As-Saadi database. This feature will be updated soon.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => window.history.back()}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                ← Back
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🤖</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Tafsir Chatbot</h1>
                  <p className="text-sm text-gray-600">
                    {language === 'arabic' ? 'مدعوم بتفسير السعدي' :
                     language === 'turkish' ? 'As-Saadi Tefsiri Destekli' :
                     language === 'indonesian' ? 'Didukung Tafsir As-Saadi' :
                     'Powered by Tafsir As-Saadi'}
                  </p>
                </div>
              </div>
            </div>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-green-500"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 h-[600px] flex flex-col">
          
          {/* Status Banner */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b border-yellow-200 p-4 rounded-t-3xl">
            <div className="flex items-center space-x-2">
              <span className="text-yellow-600">⚠️</span>
              <span className="text-sm text-yellow-800 font-medium">
                {language === 'arabic' ? 'قيد التطوير - سيتم الاتصال بقاعدة بيانات تفسير السعدي قريباً' :
                 language === 'turkish' ? 'Geliştirme aşamasında - As-Saadi veritabanı bağlantısı yakında' :
                 language === 'indonesian' ? 'Dalam pengembangan - koneksi database As-Saadi akan segera tersedia' :
                 'Under Development - As-Saadi database connection coming soon'}
              </span>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-6 flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] ${
                  message.type === 'user' 
                    ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-2xl rounded-br-md'
                    : 'bg-gray-100 text-gray-900 rounded-2xl rounded-bl-md'
                } p-4`}>
                  {message.type === 'bot' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-green-600">🤖</span>
                      <span className="text-sm font-medium text-green-700">AI Tafsir Assistant</span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap leading-relaxed" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                    {message.content}
                  </div>
                  <div className={`text-xs mt-2 ${message.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start mb-6">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md p-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-600">🤖</span>
                    <span className="text-sm font-medium text-green-700">AI Tafsir Assistant</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    <span className="text-gray-500 text-sm ml-2">
                      {language === 'arabic' ? 'جاري الإعداد...' :
                       language === 'turkish' ? 'Hazırlanıyor...' :
                       language === 'indonesian' ? 'Sedang menyiapkan...' :
                       'Preparing response...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-6">
            <div className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={language === 'arabic' ? 'اكتب سؤالك هنا...' :
                           language === 'turkish' ? 'Sorunuzu buraya yazın...' :
                           language === 'indonesian' ? 'Tulis pertanyaan Anda di sini...' :
                           'Type your question here...'}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                disabled={isLoading}
                dir={language === 'arabic' ? 'rtl' : 'ltr'}
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? '⏳' : '📤'}
              </button>
            </div>
            
            {/* Quick Examples */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                onClick={() => setInputMessage('Explain Bismillah')}
                className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
              >
                {language === 'arabic' ? 'اشرح البسملة' : 'Explain Bismillah'}
              </button>
              <button 
                onClick={() => setInputMessage('Al-Fatiha 1')}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {language === 'arabic' ? 'الفاتحة 1' : 'Al-Fatiha 1'}
              </button>
              <button 
                onClick={() => setInputMessage('What is Islamic guidance?')}
                className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
              >
                {language === 'arabic' ? 'ما هي الهداية الإسلامية؟' : 'Islamic Guidance?'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AITafsirChatbot