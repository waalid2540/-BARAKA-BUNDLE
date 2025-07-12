import React, { useState, useEffect, useRef } from 'react'
import { tafsirSaadiService } from './services/tafsirSaadiProcessor'
import { generateTafsirExplanation } from './services/aiService'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  verse?: string
  source?: string
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

  // Parse user message to find verse references
  const parseVerseReference = (message: string): { surah: number, ayah: number } | null => {
    // Look for patterns like "1:1", "Al-Fatiha 1", "Baqarah 2:5", "Bismillah", etc.
    const patterns = [
      /(\d+):(\d+)/,                          // "1:1"
      /al-fatiha\s+(\d+)/i,                   // "Al-Fatiha 1"
      /fatiha\s+(\d+)/i,                      // "Fatiha 1"
      /al-baqarah\s+(\d+)/i,                  // "Al-Baqarah 1"
      /baqarah\s+(\d+)/i,                     // "Baqarah 1"
      /bismillah/i,                           // "Bismillah" -> Al-Fatiha 1
      /basmalah/i,                            // "Basmalah" -> Al-Fatiha 1
      /الفاتحة\s+(\d+)/,                       // "الفاتحة 1"
      /البقرة\s+(\d+)/,                        // "البقرة 1"
      /بسم\s*الله/,                            // "بسم الله" -> Al-Fatiha 1
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
        } else if (pattern.source.includes('bismillah') || pattern.source.includes('basmalah') || pattern.source.includes('بسم')) {
          return { surah: 1, ayah: 1 } // Bismillah = Al-Fatiha 1:1
        }
      }
    }
    return null
  }

  // Send message with As-Saadi + AI integration
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
      let source = 'AI Assistant'

      if (verseRef) {
        // User asked about specific verse - check As-Saadi database
        const tafsir = tafsirSaadiService.getTafsirForVerse(verseRef.surah, verseRef.ayah)
        
        if (tafsir) {
          // We have authentic As-Saadi explanation!
          source = 'Tafsir As-Saadi + AI'
          verseInfo = `**${tafsir.surahName} ${verseRef.surah}:${verseRef.ayah}**\n\n**Arabic:** ${tafsir.arabicText}\n\n**Translation:** ${tafsir.translation}\n\n**Tafsir As-Saadi:**\n${tafsir.tafsirSaadi}\n\n`
          
          // Get AI enhancement based on As-Saadi + user question
          const aiPrompt = `You are an AI Islamic scholar. A user asked: "${inputMessage}"

This relates to ${tafsir.surahName} ${verseRef.surah}:${verseRef.ayah}.

**Authentic As-Saadi Tafsir:** "${tafsir.tafsirSaadi}"

Based ONLY on the As-Saadi explanation above, provide a conversational response in ${language} that:
1. Acknowledges their question
2. Explains how As-Saadi's commentary answers their question  
3. Adds contemporary applications based on As-Saadi's insights
4. Keeps it conversational and helpful

Do not add interpretations beyond what As-Saadi provides. Use his explanation as the foundation.`

          const aiResponse = await generateTafsirExplanation(aiPrompt, language, 'detailed')
          
          if (aiResponse.success && aiResponse.data?.explanation) {
            botResponse = `**AI Contemporary Application:**\n${aiResponse.data.explanation}`
          } else {
            botResponse = `**Contemporary Application:**\nBased on As-Saadi's explanation, this verse teaches us important principles that we can apply in our daily lives as Muslims.`
          }
        } else {
          // Verse not in As-Saadi database
          botResponse = language === 'arabic' ?
            `عذراً، الآية ${verseRef.surah}:${verseRef.ayah} غير متوفرة حالياً في قاعدة بيانات تفسير السعدي.\n\n**المتوفر حالياً:**\n• الفاتحة 1-7 (جميع الآيات)\n• البقرة 1-3 (أول 3 آيات)\n\nجرب: "اشرح البسملة" أو "الفاتحة 2"` :
            language === 'turkish' ?
            `Üzgünüm, ${verseRef.surah}:${verseRef.ayah} ayeti As-Saadi veritabanında mevcut değil.\n\n**Mevcut:**\n• Fatiha 1-7 (tüm ayetler)\n• Bakara 1-3 (ilk 3 ayet)\n\nDeneyin: "Bismillah'ı açıkla" veya "Fatiha 2"` :
            language === 'indonesian' ?
            `Maaf, ayat ${verseRef.surah}:${verseRef.ayah} belum tersedia dalam database As-Saadi.\n\n**Tersedia:**\n• Al-Fatiha 1-7 (semua ayat)\n• Al-Baqarah 1-3 (3 ayat pertama)\n\nCoba: "Jelaskan Bismillah" atau "Al-Fatiha 2"` :
            `Sorry, verse ${verseRef.surah}:${verseRef.ayah} is not available in our As-Saadi database yet.\n\n**Available:**\n• Al-Fatiha 1-7 (all verses)\n• Al-Baqarah 1-3 (first 3 verses)\n\nTry: "Explain Bismillah" or "Al-Fatiha 2"`
        }
      } else {
        // General Islamic question - search As-Saadi database
        const searchResults = tafsirSaadiService.searchTafsir(inputMessage)
        
        if (searchResults.length > 0) {
          const relevantTafsir = searchResults[0]
          source = 'Tafsir As-Saadi + AI'
          verseInfo = `**Related: ${relevantTafsir.surahName} ${relevantTafsir.surah}:${relevantTafsir.ayah}**\n\n**Arabic:** ${relevantTafsir.arabicText}\n\n**Translation:** ${relevantTafsir.translation}\n\n**As-Saadi Explanation:**\n${relevantTafsir.tafsirSaadi}\n\n`
          
          const aiPrompt = `User asked: "${inputMessage}"

I found this relevant As-Saadi Tafsir: "${relevantTafsir.tafsirSaadi}"

Respond conversationally in ${language}, explaining how this As-Saadi commentary relates to their question and provide contemporary applications.`

          const aiResponse = await generateTafsirExplanation(aiPrompt, language, 'detailed')
          botResponse = aiResponse.success && aiResponse.data?.explanation ? 
            `**How this relates to your question:**\n${aiResponse.data.explanation}` :
            `This verse from As-Saadi's commentary is relevant to your question and provides valuable Islamic guidance.`
        } else {
          // No relevant As-Saadi content found
          botResponse = language === 'arabic' ?
            'يمكنك سؤالي عن آيات محددة من:\n\n**الفاتحة (1-7):** "اشرح البسملة"، "الفاتحة 2"\n**البقرة (1-3):** "البقرة 1"، "البقرة 2"\n\nأو اسأل عن مواضيع مثل: "الرحمة"، "الهداية"، "الحمد"' :
            language === 'turkish' ?
            'Şu ayetler hakkında soru sorabilirsiniz:\n\n**Fatiha (1-7):** "Bismillah\'ı açıkla", "Fatiha 2"\n**Bakara (1-3):** "Bakara 1", "Bakara 2"\n\nVeya şu konular: "Rahmet", "Hidayet", "Hamd"' :
            language === 'indonesian' ?
            'Anda bisa bertanya tentang ayat-ayat:\n\n**Al-Fatiha (1-7):** "Jelaskan Bismillah", "Al-Fatiha 2"\n**Al-Baqarah (1-3):** "Al-Baqarah 1", "Al-Baqarah 2"\n\nAtau topik: "Rahmat", "Hidayah", "Puji"' :
            'You can ask me about specific verses:\n\n**Al-Fatiha (1-7):** "Explain Bismillah", "Al-Fatiha 2"\n**Al-Baqarah (1-3):** "Al-Baqarah 1", "Al-Baqarah 2"\n\nOr topics like: "Mercy", "Guidance", "Praise"'
        }
      }

      const botMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: verseInfo + botResponse,
        timestamp: new Date(),
        verse: verseRef ? `${verseRef.surah}:${verseRef.ayah}` : undefined,
        source: source
      }

      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'bot',
        content: language === 'arabic' ? 
          'عذراً، حدث خطأ في الاتصال مع OpenAI. تأكد من أن مفتاح API متصل بشكل صحيح.' : 
          'Sorry, there was an error connecting to OpenAI. Please ensure your API key is properly configured.',
        timestamp: new Date(),
        source: 'Error'
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