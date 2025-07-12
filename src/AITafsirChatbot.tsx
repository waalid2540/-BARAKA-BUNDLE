import React, { useState, useEffect, useRef } from 'react'
import { tafsirSaadiService } from './services/tafsirSaadiProcessor'
import { generateTafsirExplanation } from './services/aiService'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  verse?: string
  isTyping?: boolean
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
    { code: 'indonesian', name: 'Bahasa Indonesia', flag: '🇮🇩' },
    { code: 'urdu', name: 'اردو', flag: '🇵🇰' },
    { code: 'persian', name: 'فارسی', flag: '🇮🇷' },
    { code: 'bengali', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'malay', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'french', name: 'Français', flag: '🇫🇷' },
    { code: 'german', name: 'Deutsch', flag: '🇩🇪' }
  ]

  // Welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'bot',
      content: language === 'arabic' ?
        'السلام عليكم! أنا مساعد تفسير القرآن بالذكاء الاصطناعي. أعتمد على تفسير الشيخ عبد الرحمن السعدي. اسألني عن أي آية من القرآن الكريم.' :
        language === 'turkish' ?
        'Selamün aleyküm! Ben As-Saadi Tefsiri tabanlı AI Tefsir asistanıyım. Kuran ayetleri hakkında bana soru sorabilirsiniz.' :
        language === 'indonesian' ?
        'Assalamu\'alaikum! Saya asisten AI Tafsir berdasarkan Tafsir As-Saadi. Tanyakan kepada saya tentang ayat Al-Quran apapun.' :
        'Assalamu Alaikum! I\'m your AI Tafsir assistant based on Tafsir As-Saadi. Ask me about any verse from the Quran.',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [language])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Parse user message to find verse references
  const parseVerseReference = (message: string): { surah: number, ayah: number } | null => {
    // Look for patterns like "1:1", "Al-Fatiha 1", "Baqarah 2:5", etc.
    const patterns = [
      /(\d+):(\d+)/,                          // "1:1"
      /al-fatiha\s+(\d+)/i,                   // "Al-Fatiha 1"
      /fatiha\s+(\d+)/i,                      // "Fatiha 1"
      /al-baqarah\s+(\d+)/i,                  // "Al-Baqarah 1"
      /baqarah\s+(\d+)/i,                     // "Baqarah 1"
      /الفاتحة\s+(\d+)/,                       // "الفاتحة 1"
      /البقرة\s+(\d+)/,                        // "البقرة 1"
    ]

    for (const pattern of patterns) {
      const match = message.match(pattern)
      if (match) {
        if (pattern.source.includes(':')) {
          return { surah: parseInt(match[1]), ayah: parseInt(match[2]) }
        } else if (pattern.source.includes('fatiha') || pattern.source.includes('الفاتحة')) {
          return { surah: 1, ayah: parseInt(match[1]) }
        } else if (pattern.source.includes('baqarah') || pattern.source.includes('البقرة')) {
          return { surah: 2, ayah: parseInt(match[1]) }
        }
      }
    }
    return null
  }

  // Send message to AI Tafsir
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

    try {
      // Parse for verse references
      const verseRef = parseVerseReference(inputMessage)
      let botResponse = ''
      let verseInfo = ''

      if (verseRef) {
        // User asked about specific verse
        const tafsir = tafsirSaadiService.getTafsirForVerse(verseRef.surah, verseRef.ayah)
        
        if (tafsir) {
          verseInfo = `**${tafsir.surahName} ${verseRef.surah}:${verseRef.ayah}**\n\n**Arabic:** ${tafsir.arabicText}\n\n**Translation:** ${tafsir.translation}\n\n`
          
          // Get AI response based on As-Saadi + user question
          const aiPrompt = `You are an AI Tafsir assistant. A user asked: "${inputMessage}"

This relates to ${tafsir.surahName} ${verseRef.surah}:${verseRef.ayah}.

**Authentic As-Saadi Tafsir:** "${tafsir.tafsirSaadi}"

Respond conversationally in ${language}, including:
1. The As-Saadi explanation (as the foundation)
2. How this relates to the user's question
3. Contemporary applications if relevant

Be natural and helpful, like a knowledgeable Islamic teacher.`

          const aiResponse = await generateTafsirExplanation(aiPrompt, language, 'detailed')
          botResponse = aiResponse.success ? aiResponse.data?.explanation || tafsir.tafsirSaadi : tafsir.tafsirSaadi
        } else {
          botResponse = language === 'arabic' ?
            `عذراً، الآية ${verseRef.surah}:${verseRef.ayah} غير متوفرة حالياً في قاعدة بيانات تفسير السعدي. المتوفر حالياً: الفاتحة 1-7، البقرة 1-3` :
            language === 'turkish' ?
            `Üzgünüm, ${verseRef.surah}:${verseRef.ayah} ayeti As-Saadi veritabanında mevcut değil. Mevcut: Fatiha 1-7, Bakara 1-3` :
            language === 'indonesian' ?
            `Maaf, ayat ${verseRef.surah}:${verseRef.ayah} belum tersedia dalam database As-Saadi. Tersedia: Al-Fatiha 1-7, Al-Baqarah 1-3` :
            `Sorry, verse ${verseRef.surah}:${verseRef.ayah} is not available in our As-Saadi database yet. Available: Al-Fatiha 1-7, Al-Baqarah 1-3`
        }
      } else {
        // General Islamic question - search As-Saadi database
        const searchResults = tafsirSaadiService.searchTafsir(inputMessage)
        
        if (searchResults.length > 0) {
          const relevantTafsir = searchResults[0]
          verseInfo = `**${relevantTafsir.surahName} ${relevantTafsir.surah}:${relevantTafsir.ayah}**\n\n**Arabic:** ${relevantTafsir.arabicText}\n\n**Translation:** ${relevantTafsir.translation}\n\n`
          
          const aiPrompt = `User asked: "${inputMessage}"

Based on this relevant As-Saadi Tafsir: "${relevantTafsir.tafsirSaadi}"

Respond conversationally in ${language}, explaining how this As-Saadi commentary relates to their question.`

          const aiResponse = await generateTafsirExplanation(aiPrompt, language, 'detailed')
          botResponse = aiResponse.success ? aiResponse.data?.explanation || relevantTafsir.tafsirSaadi : relevantTafsir.tafsirSaadi
        } else {
          botResponse = language === 'arabic' ?
            'يمكنك سؤالي عن آيات محددة من الفاتحة (1-7) والبقرة (1-3). مثال: "اشرح لي البسملة" أو "ما معنى الفاتحة 1"' :
            language === 'turkish' ?
            'Fatiha (1-7) ve Bakara (1-3) ayetleri hakkında soru sorabilirsiniz. Örnek: "Bismillah\'ı açıkla" veya "Fatiha 1 ne anlama gelir"' :
            language === 'indonesian' ?
            'Anda bisa bertanya tentang ayat Al-Fatiha (1-7) dan Al-Baqarah (1-3). Contoh: "Jelaskan Bismillah" atau "Apa arti Al-Fatiha 1"' :
            'You can ask me about specific verses from Al-Fatiha (1-7) and Al-Baqarah (1-3). Example: "Explain Bismillah" or "What does Al-Fatiha 1 mean?"'
        }
      }

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: verseInfo + botResponse,
        timestamp: new Date(),
        verse: verseRef ? `${verseRef.surah}:${verseRef.ayah}` : undefined
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: language === 'arabic' ? 'عذراً، حدث خطأ. حاول مرة أخرى.' : 'Sorry, there was an error. Please try again.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const selectedLanguage = languages.find(l => l.code === language)

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
                      {message.verse && (
                        <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full">
                          {message.verse}
                        </span>
                      )}
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
                      {language === 'arabic' ? 'جاري البحث في تفسير السعدي...' :
                       language === 'turkish' ? 'As-Saadi tefsirinde aranıyor...' :
                       language === 'indonesian' ? 'Mencari dalam Tafsir As-Saadi...' :
                       'Searching Tafsir As-Saadi...'}
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
                placeholder={language === 'arabic' ? 'اسأل عن أي آية... مثال: "اشرح البسملة" أو "الفاتحة 1"' :
                           language === 'turkish' ? 'Herhangi bir ayet hakkında sorun... Örnek: "Bismillah\'ı açıkla"' :
                           language === 'indonesian' ? 'Tanya tentang ayat apapun... Contoh: "Jelaskan Bismillah"' :
                           'Ask about any verse... Example: "Explain Bismillah" or "Al-Fatiha 1"'}
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
                onClick={() => setInputMessage('Al-Fatiha 2')}
                className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors"
              >
                {language === 'arabic' ? 'الفاتحة 2' : 'Al-Fatiha 2'}
              </button>
              <button 
                onClick={() => setInputMessage('What does Alhamdulillahi rabbil alameen mean?')}
                className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
              >
                {language === 'arabic' ? 'معنى الحمد لله رب العالمين' : 'Meaning of Alhamdulillah'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AITafsirChatbot