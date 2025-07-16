import React, { useState, useEffect, useRef } from 'react'
import { generateSimpleResponse } from './services/aiService'
import { quranLifeLessons, getReflectionByDay, getReflectionsByCategory, getRandomReflection } from './services/quranReflectionData'

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  verse?: string
  source?: string
}

const QuranReflectionGenerator = () => {
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
    { code: 'malay', name: 'Bahasa Melayu', flag: '🇲🇾' },
    { code: 'french', name: 'Français', flag: '🇫🇷' },
    { code: 'spanish', name: 'Español', flag: '🇪🇸' },
    { code: 'german', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'italian', name: 'Italiano', flag: '🇮🇹' },
    { code: 'russian', name: 'Русский', flag: '🇷🇺' },
    { code: 'chinese', name: '中文', flag: '🇨🇳' },
    { code: 'japanese', name: '日本語', flag: '🇯🇵' },
    { code: 'korean', name: '한국어', flag: '🇰🇷' },
    { code: 'hindi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bengali', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'swahili', name: 'Kiswahili', flag: '🇰🇪' },
    { code: 'hausa', name: 'Hausa', flag: '🇳🇬' },
    { code: 'albanian', name: 'Shqip', flag: '🇦🇱' }
  ]

  // Welcome message
  useEffect(() => {
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'bot',
      content: language === 'arabic' ?
        'السلام عليكم ورحمة الله وبركاته\n\n**مولد تأملات القرآن بالذكاء الاصطناعي**\nأقدم دروس حياة ملهمة وتأملات شخصية من آيات القرآن للنمو الروحي اليومي.\n\n**الميزات:**\n• دروس الحياة من أي آية قرآنية\n• مطالبات التأمل الشخصي\n• التطبيقات المعاصرة\n• أسئلة التفكير للتطوير الروحي' :
        language === 'turkish' ?
        'Selamün aleyküm ve rahmetullahi ve berakatüh\n\n**AI Kuran Yansıması Üreticisi**\nKuran ayetlerinden günlük ruhani gelişim için ilham verici yaşam dersleri ve kişisel yansımalar sağlarım.\n\n**Özellikler:**\n• Herhangi bir Kuran ayetinden yaşam dersleri\n• Kişisel yansıma istekleri\n• Çağdaş uygulamalar\n• Ruhani gelişim için günlük sorular' :
        language === 'indonesian' ?
        'Assalamu\'alaikum warahmatullahi wabarakatuh\n\n**AI Generator Refleksi Quran**\nSaya menyediakan pelajaran hidup yang menginspirasi dan refleksi pribadi dari ayat-ayat Quran untuk pertumbuhan spiritual harian.\n\n**Fitur:**\n• Pelajaran hidup dari ayat Quran manapun\n• Prompt refleksi pribadi\n• Aplikasi kontemporer\n• Pertanyaan jurnal untuk pengembangan spiritual' :
        'Assalamu Alaikum wa Rahmatullahi wa Barakatuh\n\n**AI Quran Reflection Generator**\nI provide inspiring life lessons and personal reflections from Quranic verses for daily spiritual growth.\n\n**Features:**\n• Life Lessons from any Quranic verse\n• Personal Reflection prompts\n• Contemporary Applications\n• Journaling questions for spiritual development\n\n**Language Support:**\nSay "explain in Arabic" or "en español" to switch languages automatically!\n\nAsk about any verse or share your current situation for personalized Quranic wisdom.',
      timestamp: new Date()
    }
    setMessages([welcomeMessage])
  }, [language])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-detect language requests and update language state
  const detectLanguageRequest = (message: string): string | null => {
    const lowerMessage = message.toLowerCase()
    
    // Language detection patterns
    const languagePatterns = [
      // Direct language requests
      { patterns: ['in arabic', 'باللغة العربية', 'بالعربي', 'arabic'], code: 'arabic' },
      { patterns: ['in turkish', 'türkçe', 'turkish'], code: 'turkish' },
      { patterns: ['in urdu', 'اردو میں', 'urdu'], code: 'urdu' },
      { patterns: ['in persian', 'فارسی', 'farsi', 'persian'], code: 'persian' },
      { patterns: ['in french', 'en français', 'french'], code: 'french' },
      { patterns: ['in spanish', 'en español', 'spanish'], code: 'spanish' },
      { patterns: ['in german', 'auf deutsch', 'german'], code: 'german' },
      { patterns: ['in italian', 'in italiano', 'italian'], code: 'italian' },
      { patterns: ['in russian', 'на русском', 'russian'], code: 'russian' },
      { patterns: ['in chinese', '中文', 'chinese'], code: 'chinese' },
      { patterns: ['in japanese', '日本語', 'japanese'], code: 'japanese' },
      { patterns: ['in korean', '한국어', 'korean'], code: 'korean' },
      { patterns: ['in hindi', 'हिन्दी में', 'hindi'], code: 'hindi' },
      { patterns: ['in bengali', 'বাংলায়', 'bengali'], code: 'bengali' },
      { patterns: ['in indonesian', 'bahasa indonesia', 'indonesian'], code: 'indonesian' },
      { patterns: ['in malay', 'bahasa melayu', 'malay'], code: 'malay' },
      { patterns: ['in swahili', 'kiswahili', 'swahili'], code: 'swahili' },
      { patterns: ['in hausa', 'hausa'], code: 'hausa' },
      { patterns: ['in albanian', 'shqip', 'albanian'], code: 'albanian' },
      { patterns: ['in english', 'english'], code: 'english' }
    ]
    
    for (const lang of languagePatterns) {
      for (const pattern of lang.patterns) {
        if (lowerMessage.includes(pattern)) {
          return lang.code
        }
      }
    }
    
    return null
  }

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
      // Check for language requests first
      const detectedLanguage = detectLanguageRequest(inputMessage)
      if (detectedLanguage && detectedLanguage !== language) {
        console.log('Language change detected:', detectedLanguage)
        setLanguage(detectedLanguage)
        
        // Show language switch confirmation
        const languageName = languages.find(l => l.code === detectedLanguage)?.name || detectedLanguage
        const confirmMessage: ChatMessage = {
          id: Date.now().toString(),
          type: 'bot',
          content: `✅ Language switched to ${languageName}! Now I'll respond in ${languageName}. Please repeat your question.`,
          timestamp: new Date(),
          source: 'AI Tafsir Assistant'
        }
        setMessages(prev => [...prev, confirmMessage])
        setIsLoading(false)
        return
      }

      // Parse for verse references
      console.log('Processing message:', inputMessage)
      const verseRef = parseVerseReference(inputMessage)
      console.log('Parsed verse reference:', verseRef)
      let botResponse = ''
      let verseInfo = ''
      let source = 'AI Assistant'

      if (verseRef) {
        // User asked about specific verse - generate AI Quran reflection
        source = 'AI Quran Reflection'
        
        const reflectionPrompt = `Generate a comprehensive Quran reflection for verse ${verseRef.surah}:${verseRef.ayah} in ${language}.

Create a spiritual reflection in this format:
**Life Lesson:** Core wisdom from this verse
**Personal Reflection:** How this applies to daily life
**Contemporary Application:** Modern situations where this guidance helps
**Journaling Questions:** 2-3 questions for deeper contemplation
**Action Steps:** Practical ways to implement this wisdom

Make it inspiring, practical, and spiritually enriching for personal growth.`

        const aiResponse = await generateSimpleResponse(reflectionPrompt, language)
        
        if (aiResponse.success && aiResponse.data) {
          botResponse = `**Quran Reflection: ${verseRef.surah}:${verseRef.ayah}**

${aiResponse.data}

*Generated for your spiritual growth and daily application*`
        } else {
          botResponse = `**Quran Reflection: ${verseRef.surah}:${verseRef.ayah}**

**Life Lesson:** Every verse in the Quran contains timeless wisdom for spiritual growth and practical guidance.

**Personal Reflection:** Consider how this verse might apply to your current life situation and spiritual journey.

**Contemporary Application:** Look for ways to implement Quranic teachings in your daily interactions and decisions.

**Journaling Questions:** 
- How can I apply this verse's wisdom today?
- What does this teach me about my relationship with Allah?

**Action Steps:** Make du'a for understanding and seek to embody Quranic values in your actions.`
        }
      } else {
        // Handle conversational messages and general questions
        const lowerInput = inputMessage.toLowerCase()
        
        // Check for greetings first
        if (lowerInput.includes('salam') || lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('peace')) {
          source = 'AI Quran Reflection'
          botResponse = `**Quran Reflection:**\nWa alaikum assalam wa rahmatullahi wa barakatuh. Welcome to AI Quran Reflection. How can I help you with spiritual guidance today?`
        } else if (lowerInput.includes('ok') || lowerInput.includes('thanks') || lowerInput.includes('thank you') || lowerInput.includes('good') || lowerInput.includes('yes') || lowerInput.includes('alright')) {
          // Handle casual responses with AI engagement
          source = 'AI Quran Reflection'
          const casualPrompt = `A person says: "${inputMessage}"
          
This is a casual response. As an AI Quran Reflection guide, respond warmly and naturally, then ask an engaging question about spiritual growth to continue the conversation. Maybe ask about their current spiritual journey, what they're reflecting on, or suggest exploring a meaningful verse together.

Be conversational and genuinely interested in their spiritual development. Write in ${language}.`

          const aiResponse = await generateSimpleResponse(casualPrompt, language)
          botResponse = aiResponse.success && aiResponse.data ? 
            `**Quran Reflection:**\n${aiResponse.data}` :
            `**Quran Reflection:**\nAlhamdulillah! I'm glad we're connecting. Every conversation about spiritual growth is a blessing. 

What's been on your heart lately? Is there a particular verse or spiritual concept you've been reflecting on? I'd love to explore some meaningful Quranic wisdom together!`
        } else {
          // General questions - provide AI Quran reflection
          source = 'AI Quran Reflection'
          
          const generalPrompt = `A user asks: "${inputMessage}"

As an AI Quran Reflection guide, provide a thoughtful response in ${language} that:
1. Connects their question to relevant Quranic wisdom
2. Offers practical life guidance and spiritual reflection
3. Includes journaling questions for deeper contemplation
4. Provides actionable steps for spiritual growth
5. Makes it personally applicable and inspiring

Even if they ask about life, relationships, struggles, or any topic - relate it back to relevant Quranic verses and provide meaningful reflections for their spiritual journey.`

          const aiResponse = await generateSimpleResponse(generalPrompt, language)
          botResponse = aiResponse.success && aiResponse.data ? 
            `**Quran Reflection:**\n${aiResponse.data}` :
            `**Quran Reflection:**\nEvery question and situation in life can be illuminated by Quranic wisdom. Consider how the teachings of the Quran apply to your current circumstances and make du'a for guidance and understanding.`
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
                  <span className="text-3xl">📖</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">AI Tafsir Assistant</h1>
                  <p className="text-sm text-gray-600">
                    {language === 'arabic' ? 'مدعوم بتفسير السعدي الأصيل - تفسير قرآني حصرياً' :
                     language === 'turkish' ? 'Otantik As-Saadi Tefsiri - Sadece Kuran Tefsiri' :
                     language === 'indonesian' ? 'Tafsir As-Saadi Otentik - Khusus Tafsir Al-Quran' :
                     'Authentic As-Saadi Tafsir - Quranic Commentary Only'}
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
                      <span className="text-sm font-medium text-emerald-700">AI Tafsir</span>
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
                onClick={() => setInputMessage('Explain in Arabic')}
                className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded-full hover:bg-purple-200 transition-colors"
              >
                Switch to Arabic
              </button>
              <button 
                onClick={() => setInputMessage('En español')}
                className="text-sm bg-orange-100 text-orange-700 px-3 py-1 rounded-full hover:bg-orange-200 transition-colors"
              >
                Español
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuranReflectionGenerator