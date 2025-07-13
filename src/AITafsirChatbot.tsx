import React, { useState, useEffect, useRef } from 'react'
import { tafsirSaadiService } from './services/tafsirSaadiProcessor'
import { generateSimpleResponse } from './services/aiService'

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
        'السلام عليكم ورحمة الله وبركاته\n\nأنا الدكتور أحمد، متخصص في التفسير القرآني وتفسير السعدي. أقدم شروحات علمية دقيقة للآيات القرآنية.\n\n**المتاح حالياً:**\n• سورة الفاتحة (1-7)\n• سورة البقرة (1-3)\n\nاسأل عن أي آية أو موضوع إسلامي.' :
        language === 'turkish' ?
        'Selamün aleyküm ve rahmetullahi ve berakatüh\n\nBen Dr. Ahmad, Kuran tefsiri ve As-Saadi tefsiri uzmanıyım. Kuran ayetleri hakkında akademik açıklamalar sunuyorum.\n\n**Mevcut:**\n• Fatiha Suresi (1-7)\n• Bakara Suresi (1-3)\n\nHerhangi bir ayet veya İslami konu hakkında soru sorabilirsiniz.' :
        language === 'indonesian' ?
        'Assalamu\'alaikum warahmatullahi wabarakatuh\n\nSaya Dr. Ahmad, spesialis tafsir Al-Quran dan Tafsir As-Saadi. Saya memberikan penjelasan akademis tentang ayat-ayat Al-Quran.\n\n**Tersedia:**\n• Surah Al-Fatiha (1-7)\n• Surah Al-Baqarah (1-3)\n\nTanyakan tentang ayat atau topik Islam apa pun.' :
        'Assalamu Alaikum wa Rahmatullahi wa Barakatuh\n\nI am Dr. Ahmad, a specialist in Quranic commentary and Tafsir As-Saadi. I provide scholarly explanations of Quranic verses based on authentic Islamic scholarship.\n\n**Currently Available:**\n• Surah Al-Fatiha (verses 1-7)\n• Surah Al-Baqarah (verses 1-3)\n\nPlease ask about any verse or Islamic topic.',
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
    const lowerMessage = message.toLowerCase()
    
    // Direct number patterns
    const numberPatterns = [
      /(\d+):(\d+)/,                          // "1:1", "2:1"
      /al-fatiha\s+(\d+)/i,                   // "Al-Fatiha 1"
      /fatiha\s+(\d+)/i,                      // "Fatiha 1"
      /al-baqarah\s+(\d+)/i,                  // "Al-Baqarah 1"
      /baqarah\s+(\d+)/i,                     // "Baqarah 1"
      /الفاتحة\s+(\d+)/,                       // "الفاتحة 1"
      /البقرة\s+(\d+)/,                        // "البقرة 1"
    ]

    for (const pattern of numberPatterns) {
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

    // Smart conversational patterns
    if (lowerMessage.includes('bismillah') || lowerMessage.includes('basmalah') || message.includes('بسم الله')) {
      return { surah: 1, ayah: 1 }
    }
    
    // Extract numbers from natural language for Fatiha
    if (lowerMessage.includes('fatiha')) {
      const ayahNumbers = message.match(/\b(\d+)\b/g)
      if (ayahNumbers) {
        const ayahNum = parseInt(ayahNumbers[0])
        if (ayahNum >= 1 && ayahNum <= 7) {
          return { surah: 1, ayah: ayahNum }
        }
      }
      
      // Handle word-based numbers for Fatiha
      if (lowerMessage.includes('first') || lowerMessage.includes('1st') || lowerMessage.includes('one')) {
        return { surah: 1, ayah: 1 }
      }
      if (lowerMessage.includes('second') || lowerMessage.includes('2nd') || lowerMessage.includes('two')) {
        return { surah: 1, ayah: 2 }
      }
      if (lowerMessage.includes('third') || lowerMessage.includes('3rd') || lowerMessage.includes('three')) {
        return { surah: 1, ayah: 3 }
      }
      if (lowerMessage.includes('fourth') || lowerMessage.includes('4th') || lowerMessage.includes('four')) {
        return { surah: 1, ayah: 4 }
      }
      if (lowerMessage.includes('fifth') || lowerMessage.includes('5th') || lowerMessage.includes('five')) {
        return { surah: 1, ayah: 5 }
      }
      if (lowerMessage.includes('sixth') || lowerMessage.includes('6th') || lowerMessage.includes('six')) {
        return { surah: 1, ayah: 6 }
      }
      if (lowerMessage.includes('seventh') || lowerMessage.includes('7th') || lowerMessage.includes('seven')) {
        return { surah: 1, ayah: 7 }
      }
      
      // Topic-based matching for Fatiha
      if (lowerMessage.includes('praise') || lowerMessage.includes('hamd')) {
        return { surah: 1, ayah: 2 }
      }
      if (lowerMessage.includes('mercy') || lowerMessage.includes('rahman')) {
        return { surah: 1, ayah: 3 }
      }
      if (lowerMessage.includes('judgment') || lowerMessage.includes('day') || lowerMessage.includes('malik')) {
        return { surah: 1, ayah: 4 }
      }
      if (lowerMessage.includes('worship') || lowerMessage.includes('help')) {
        return { surah: 1, ayah: 5 }
      }
      if (lowerMessage.includes('guidance') || lowerMessage.includes('path')) {
        return { surah: 1, ayah: 6 }
      }
      if (lowerMessage.includes('straight') || lowerMessage.includes('righteous')) {
        return { surah: 1, ayah: 7 }
      }
    }
    
    // Extract numbers from natural language for Baqarah  
    if (lowerMessage.includes('baqarah')) {
      const ayahNumbers = message.match(/\b(\d+)\b/g)
      if (ayahNumbers) {
        const ayahNum = parseInt(ayahNumbers[0])
        if (ayahNum >= 1 && ayahNum <= 3) {
          return { surah: 2, ayah: ayahNum }
        }
      }
      
      // Handle word-based numbers for Baqarah
      if (lowerMessage.includes('first') || lowerMessage.includes('1st') || lowerMessage.includes('one')) {
        return { surah: 2, ayah: 1 }
      }
      if (lowerMessage.includes('second') || lowerMessage.includes('2nd') || lowerMessage.includes('two')) {
        return { surah: 2, ayah: 2 }
      }
      if (lowerMessage.includes('third') || lowerMessage.includes('3rd') || lowerMessage.includes('three')) {
        return { surah: 2, ayah: 3 }
      }
      
      // Topic-based matching for Baqarah
      if (lowerMessage.includes('alif') || lowerMessage.includes('lam') || lowerMessage.includes('meem')) {
        return { surah: 2, ayah: 1 }
      }
      if (lowerMessage.includes('book') || lowerMessage.includes('doubt') || lowerMessage.includes('guidance')) {
        return { surah: 2, ayah: 2 }
      }
      if (lowerMessage.includes('unseen') || lowerMessage.includes('prayer') || lowerMessage.includes('charity')) {
        return { surah: 2, ayah: 3 }
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
      console.log('Processing message:', inputMessage)
      const verseRef = parseVerseReference(inputMessage)
      console.log('Parsed verse reference:', verseRef)
      let botResponse = ''
      let verseInfo = ''
      let source = 'AI Assistant'

      if (verseRef) {
        // User asked about specific verse - check As-Saadi database
        const tafsir = tafsirSaadiService.getTafsirForVerse(verseRef.surah, verseRef.ayah)
        
        if (tafsir) {
          // We have authentic As-Saadi explanation!
          source = 'Dr. Ahmad - Islamic Scholar'
          verseInfo = `**${tafsir.surahName} ${verseRef.surah}:${verseRef.ayah}**\n\n**Arabic Text:**\n${tafsir.arabicText}\n\n**Translation:**\n${tafsir.translation}\n\n**Tafsir As-Saadi:**\n${tafsir.tafsirSaadi}\n\n`
          
          // Get professional AI enhancement based on As-Saadi + user question
          const aiPrompt = `A student asks: "${inputMessage}"

This question relates to ${tafsir.surahName} ${verseRef.surah}:${verseRef.ayah}.

Sheikh As-Saadi explains: "${tafsir.tafsirSaadi}"

As Dr. Ahmad, an Islamic scholar, provide a professional response that:
1. Addresses their question with scholarly authority
2. Explains the verse based on As-Saadi's commentary
3. Offers practical guidance for contemporary Muslim life
4. Maintains academic tone while being accessible

Response in ${language}. Be concise and authoritative.`

          console.log('About to call AI with prompt:', aiPrompt.substring(0, 100) + '...')
          const aiResponse = await generateSimpleResponse(aiPrompt, language)
          console.log('AI Response received:', aiResponse)
          
          if (aiResponse.success && aiResponse.data) {
            console.log('AI data exists:', aiResponse.data.substring(0, 50))
            botResponse = `**Dr. Ahmad's Response:**\n${aiResponse.data}`
          } else {
            console.error('AI failed with error:', aiResponse.error)
            // Better fallback with some actual guidance
            if (verseRef.surah === 1 && verseRef.ayah === 1) {
              botResponse = `**Dr. Ahmad's Response:**\nAs Sheikh As-Saadi explains, Bismillah contains the most beautiful names of Allah. We should begin every action with this blessed phrase, seeking Allah's blessing and guidance. It reminds us that all success comes from Allah alone.`
            } else {
              botResponse = `**Dr. Ahmad's Response:**\nBased on Sheikh As-Saadi's authentic commentary above, this verse provides essential guidance for our spiritual development. The explanation highlights timeless principles that remain highly relevant for contemporary Muslim practice.`
            }
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
        // Handle conversational messages and general questions
        const lowerInput = inputMessage.toLowerCase()
        
        // Check for greetings first
        if (lowerInput.includes('salam') || lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('peace')) {
          source = 'Dr. Ahmad - Islamic Scholar'
          const greetingPrompt = `A student greets you with: "${inputMessage}"

As Dr. Ahmad, respond warmly in ${language} with:
1. Proper Islamic greeting response
2. Brief introduction of your expertise in Tafsir As-Saadi
3. Invitation to ask about Quranic verses or Islamic topics
4. Mention available content (Al-Fatiha 1-7, Al-Baqarah 1-3)

Keep it warm, scholarly, and conversational.`

          const aiResponse = await generateSimpleResponse(greetingPrompt, language)
          if (aiResponse.success && aiResponse.data) {
            botResponse = `**Dr. Ahmad's Response:**\n${aiResponse.data}`
          } else {
            botResponse = `**Dr. Ahmad's Response:**\nWa alaykum assalam wa rahmatullahi wa barakatuh! Welcome! I'm Dr. Ahmad, your Islamic scholar specializing in Tafsir As-Saadi. I'm here to help you understand Quranic verses through authentic scholarship. Please feel free to ask about any verse or Islamic topic.`
          }
        } else {
          // General Islamic question - search As-Saadi database
          const searchResults = tafsirSaadiService.searchTafsir(inputMessage)
        
        if (searchResults.length > 0) {
          const relevantTafsir = searchResults[0]
          source = 'Dr. Ahmad - Islamic Scholar'
          verseInfo = `**Related Verse: ${relevantTafsir.surahName} ${relevantTafsir.surah}:${relevantTafsir.ayah}**\n\n**Arabic Text:**\n${relevantTafsir.arabicText}\n\n**Translation:**\n${relevantTafsir.translation}\n\n**Sheikh As-Saadi's Commentary:**\n${relevantTafsir.tafsirSaadi}\n\n`
          
          const aiPrompt = `A student asks about: "${inputMessage}"

I found this relevant verse with Sheikh As-Saadi's commentary: "${relevantTafsir.tafsirSaadi}"

As Dr. Ahmad, provide a scholarly response in ${language} that:
1. Explains how this verse relates to their question
2. Draws insights from As-Saadi's commentary
3. Offers practical guidance for Muslim life
4. Maintains professional academic tone`

          const aiResponse = await generateSimpleResponse(aiPrompt, language)
          botResponse = aiResponse.success && aiResponse.data ? 
            `**Dr. Ahmad's Analysis:**\n${aiResponse.data}` :
            `**Dr. Ahmad's Analysis:**\nThis verse provides relevant guidance from the Quran. Sheikh As-Saadi's commentary offers valuable insights that address your question within the framework of authentic Islamic scholarship.`
        } else {
          // No As-Saadi content found - use AI for general Islamic guidance
          source = 'Dr. Ahmad - Islamic Scholar'
          const generalPrompt = `A student asks: "${inputMessage}"

As Dr. Ahmad, an Islamic scholar specializing in Tafsir As-Saadi, provide a helpful response in ${language} that:
1. Addresses their question from an Islamic perspective
2. References relevant Quranic principles when appropriate
3. Offers practical Islamic guidance
4. Maintains scholarly authority while being conversational
5. If relevant, guide them toward specific verses in our available As-Saadi database (Al-Fatiha 1-7, Al-Baqarah 1-3)

Keep it concise, scholarly, and helpful.`

          const aiResponse = await generateSimpleResponse(generalPrompt, language)
          if (aiResponse.success && aiResponse.data) {
            botResponse = `**Dr. Ahmad's Analysis:**\n${aiResponse.data}`
          } else {
            botResponse = language === 'arabic' ?
              'يمكنك سؤالي عن آيات محددة من:\n\n**الفاتحة (1-7):** "اشرح البسملة"، "الفاتحة 2"\n**البقرة (1-3):** "البقرة 1"، "البقرة 2"\n\nأو اسأل عن مواضيع مثل: "الرحمة"، "الهداية"، "الحمد"' :
              language === 'turkish' ?
              'Şu ayetler hakkında soru sorabilirsiniz:\n\n**Fatiha (1-7):** "Bismillah\'ı açıkla", "Fatiha 2"\n**Bakara (1-3):** "Bakara 1", "Bakara 2"\n\nVeya şu konular: "Rahmet", "Hidayet", "Hamd"' :
              language === 'indonesian' ?
              'Anda bisa bertanya tentang ayat-ayat:\n\n**Al-Fatiha (1-7):** "Jelaskan Bismillah", "Al-Fatiha 2"\n**Al-Baqarah (1-3):** "Al-Baqarah 1", "Al-Baqarah 2"\n\nAtau topik: "Rahmat", "Hidayah", "Puji"' :
              'You can ask me about specific verses:\n\n**Al-Fatiha (1-7):** "Explain Bismillah", "Al-Fatiha 2"\n**Al-Baqarah (1-3):** "Al-Baqarah 1", "Al-Baqarah 2"\n\nOr topics like: "Mercy", "Guidance", "Praise"'
          }
        }
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
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-3xl">👨‍🏫</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dr. Ahmad - Islamic Scholar</h1>
                  <p className="text-sm text-gray-600">
                    {language === 'arabic' ? 'متخصص في تفسير السعدي والتفسير القرآني' :
                     language === 'turkish' ? 'As-Saadi Tefsiri ve Kuran Tefsiri Uzmanı' :
                     language === 'indonesian' ? 'Spesialis Tafsir As-Saadi dan Tafsir Al-Quran' :
                     'Specialist in Tafsir As-Saadi & Quranic Commentary'}
                  </p>
                </div>
              </div>
            </div>
            
            <select
              id="language-selector"
              name="language"
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
                      <span className="text-emerald-600">👨‍🏫</span>
                      <span className="text-sm font-medium text-emerald-700">Dr. Ahmad</span>
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
                    <span className="text-emerald-600">👨‍🏫</span>
                    <span className="text-sm font-medium text-emerald-700">Dr. Ahmad</span>
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
                id="chat-input"
                name="message"
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
                autoComplete="off"
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