import React, { useState, useRef } from 'react'
import { aiService } from './services/aiService'
import { voiceService } from './services/voiceService'

interface GeneratedStory {
  title: string
  content: string
  ageGroup: string
  moralLesson: string
  characters: string[]
  arabicTitle?: string
  audioUrl?: string
  isPlaying?: boolean
  islamicConcepts?: string[]
  practicalApplication?: string
  parentGuide?: string
}

const IslamicKidsStories = () => {
  const [ageGroup, setAgeGroup] = useState<'3-5' | '6-8' | '9-12'>('3-5')
  const [theme, setTheme] = useState<'prophets' | 'companions' | 'morals' | 'quran'>('prophets')
  const [language, setLanguage] = useState('english')
  const [isGenerating, setIsGenerating] = useState(false)
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false)
  const [isTranslating, setIsTranslating] = useState(false)
  const [generatedStory, setGeneratedStory] = useState<GeneratedStory | null>(null)
  const [enableVoiceOver, setEnableVoiceOver] = useState(true)
  const [voiceType, setVoiceType] = useState<'male' | 'female' | 'child'>('female')
  const [autoTranslate, setAutoTranslate] = useState(true)
  const audioRef = useRef<HTMLAudioElement>(null)

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

  const generateStory = async () => {
    setIsGenerating(true)
    
    try {
      // Generate story using AI
      const response = await aiService.generateIslamicStory(ageGroup, theme, 'english', '')
      
      let baseStory: GeneratedStory
      
      if (response.success && response.data?.choices?.[0]?.message?.content) {
        try {
          const aiContent = response.data.choices[0].message.content
          const parsedData = JSON.parse(aiContent)
          baseStory = parsedData
        } catch (parseError) {
          console.error('Error parsing AI story:', parseError)
          baseStory = getFallbackStory()
        }
      } else {
        console.error('AI story generation failed:', response.error)
        baseStory = getFallbackStory()
      }

      // Translate story if needed
      let finalStory = baseStory
      if (language !== 'english' && autoTranslate) {
        setIsTranslating(true)
        finalStory = await translateStory(baseStory, language)
        setIsTranslating(false)
      }

      // Generate voice-over if enabled
      if (enableVoiceOver) {
        setIsGeneratingVoice(true)
        const voiceResult = await voiceService.generateVoiceOver({
          text: finalStory.content,
          language: language,
          voice: voiceType,
          speed: ageGroup === '3-5' ? 0.8 : ageGroup === '6-8' ? 0.9 : 1.0
        })

        if (voiceResult.success && voiceResult.audioUrl) {
          finalStory.audioUrl = voiceResult.audioUrl
        }
        setIsGeneratingVoice(false)
      }

      setGeneratedStory(finalStory)
    } catch (error) {
      console.error('Error generating story:', error)
      setGeneratedStory(getFallbackStory())
    }
    
    setIsGenerating(false)
  }

  const getFallbackStory = (): GeneratedStory => {
    return {
      title: 'The Story of Prophet Yusuf and Patience',
      arabicTitle: 'قصة النبي يوسف والصبر',
      content: 'There was a little boy named Yusuf. His father, Prophet Yakub (AS), loved him very much. Yusuf had a beautiful dream: eleven stars, the sun, and the moon were prostrating to him. He told his father about the dream. His father said: "Don\'t tell your brothers about this dream." But Yusuf\'s brothers were very jealous of him. One day, they took Yusuf with them and threw him into a deep well. But Allah (SWT) was protecting Yusuf. A caravan found him and took him to Egypt. There, Yusuf became a righteous and wise man. In the end, he became a minister in Egypt and forgave his brothers. From Yusuf\'s story, we learn that patience and faith in Allah lead to good.',
      ageGroup: ageGroup,
      moralLesson: 'Patience and faith in Allah lead to success',
      characters: ['Prophet Yusuf (AS)', 'Prophet Yakub (AS)', 'Yusuf\'s Brothers']
    }
  }

  const translateStory = async (story: GeneratedStory, targetLanguage: string): Promise<GeneratedStory> => {
    try {
      const titleTranslation = await voiceService.translateContent({
        text: story.title,
        fromLanguage: 'english',
        toLanguage: targetLanguage,
        contentType: 'story'
      })

      const contentTranslation = await voiceService.translateContent({
        text: story.content,
        fromLanguage: 'english',
        toLanguage: targetLanguage,
        contentType: 'story'
      })

      const lessonTranslation = await voiceService.translateContent({
        text: story.moralLesson,
        fromLanguage: 'english',
        toLanguage: targetLanguage,
        contentType: 'story'
      })

      return {
        ...story,
        title: titleTranslation.success ? titleTranslation.translation! : story.title,
        content: contentTranslation.success ? contentTranslation.translation! : story.content,
        moralLesson: lessonTranslation.success ? lessonTranslation.translation! : story.moralLesson
      }
    } catch (error) {
      console.error('Translation error:', error)
      return story
    }
  }

  const playStoryAudio = () => {
    if (generatedStory?.audioUrl) {
      if (generatedStory.audioUrl === 'browser-tts') {
        // Use browser TTS
        voiceService.generateVoiceOver({
          text: generatedStory.content,
          language: language,
          voice: voiceType,
          speed: ageGroup === '3-5' ? 0.8 : 0.9
        })
        setGeneratedStory({...generatedStory, isPlaying: true})
      } else if (audioRef.current) {
        // Use audio file
        audioRef.current.src = generatedStory.audioUrl
        audioRef.current.play()
        setGeneratedStory({...generatedStory, isPlaying: true})
      }
    }
  }

  const stopStoryAudio = () => {
    voiceService.stopSpeech()
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    setGeneratedStory(generatedStory ? {...generatedStory, isPlaying: false} : null)
  }

  const onLanguageChange = async (newLanguage: string) => {
    const oldLanguage = language
    setLanguage(newLanguage)
    
    if (generatedStory && autoTranslate && newLanguage !== oldLanguage) {
      setIsTranslating(true)
      const translatedStory = await translateStory(generatedStory, newLanguage)
      setGeneratedStory(translatedStory)
      setIsTranslating(false)
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📚</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">AI Islamic Stories for Kids</h1>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {isTranslating && (
                <div className="flex items-center text-blue-600">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-sm">Translating...</span>
                </div>
              )}
              <select
                value={language}
                onChange={(e) => onLanguageChange(e.target.value)}
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
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'arabic' ? 'قصص إسلامية تفاعلية للأطفال' :
             language === 'turkish' ? 'Çocuklar İçin Etkileşimli İslami Hikayeler' :
             language === 'indonesian' ? 'Cerita Islam Interaktif untuk Anak-anak' :
             'Interactive Islamic Stories for Children'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {language === 'arabic' ? 
              'اكتشف قصص الأنبياء والصحابة الملهمة مع دروس أخلاقية جميلة، مكتوبة خصيصاً لعمر طفلك.' :
             language === 'turkish' ?
              'Çocuğunuzun yaşına özel yazılmış, güzel ahlaki derslerle peygamber ve sahabe hikayelerini keşfedin.' :
             language === 'indonesian' ?
              'Jelajahi kisah-kisah inspiratif para nabi dan sahabat dengan pelajaran moral yang indah, ditulis khusus untuk usia anak Anda.' :
              'Discover inspiring stories of prophets and companions with beautiful moral lessons, written specifically for your child\'s age.'}
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full">
            <span className="mr-2">{selectedLanguage?.flag}</span>
            <span className="font-medium">{selectedLanguage?.name}</span>
          </div>
        </div>

        {/* Story Generator Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Age Group Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'الفئة العمرية' :
                 language === 'turkish' ? 'Yaş Grubu' :
                 language === 'indonesian' ? 'Kelompok Usia' :
                 'Age Group'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['3-5', '6-8', '9-12'].map((age) => (
                  <button
                    key={age}
                    onClick={() => setAgeGroup(age as '3-5' | '6-8' | '9-12')}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                      ageGroup === age
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {age} {language === 'arabic' ? 'سنوات' : language === 'turkish' ? 'yaş' : language === 'indonesian' ? 'tahun' : 'years'}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'الموضوع' :
                 language === 'turkish' ? 'Tema' :
                 language === 'indonesian' ? 'Tema' :
                 'Theme'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['prophets', 'companions', 'morals', 'quran'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t as 'prophets' | 'companions' | 'morals' | 'quran')}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors text-sm ${
                      theme === t
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {t === 'prophets' && (language === 'arabic' ? 'الأنبياء' : language === 'turkish' ? 'Peygamberler' : language === 'indonesian' ? 'Para Nabi' : 'Prophets')}
                    {t === 'companions' && (language === 'arabic' ? 'الصحابة' : language === 'turkish' ? 'Sahabeler' : language === 'indonesian' ? 'Para Sahabat' : 'Companions')}
                    {t === 'morals' && (language === 'arabic' ? 'أخلاق' : language === 'turkish' ? 'Ahlak' : language === 'indonesian' ? 'Akhlak' : 'Morals')}
                    {t === 'quran' && (language === 'arabic' ? 'القرآن' : language === 'turkish' ? 'Kuran' : language === 'indonesian' ? 'Al-Quran' : 'Quran')}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice & Translation Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'خيارات الصوت والترجمة' :
                 language === 'turkish' ? 'Ses ve Çeviri Seçenekleri' :
                 language === 'indonesian' ? 'Opsi Suara & Terjemahan' :
                 'Voice & Translation Options'}
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={enableVoiceOver}
                    onChange={(e) => setEnableVoiceOver(e.target.checked)}
                    className="text-green-600 mr-2" 
                  />
                  <span className="text-sm text-gray-700">
                    {language === 'arabic' ? 'تشغيل التعليق الصوتي' :
                     language === 'turkish' ? 'Sesli anlatım etkinleştir' :
                     language === 'indonesian' ? 'Aktifkan narasi suara' :
                     'Enable voice-over'}
                  </span>
                </label>
                
                {enableVoiceOver && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-600">Voice:</span>
                      <select 
                        value={voiceType}
                        onChange={(e) => setVoiceType(e.target.value as 'male' | 'female' | 'child')}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                        <option value="child">Child</option>
                      </select>
                    </div>
                  </div>
                )}

                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={autoTranslate}
                    onChange={(e) => setAutoTranslate(e.target.checked)}
                    className="text-green-600 mr-2" 
                  />
                  <span className="text-sm text-gray-700">
                    {language === 'arabic' ? 'ترجمة تلقائية عند تغيير اللغة' :
                     language === 'turkish' ? 'Dil değiştirildiğinde otomatik çeviri' :
                     language === 'indonesian' ? 'Terjemahan otomatis saat ganti bahasa' :
                     'Auto-translate when changing language'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateStory}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {language === 'arabic' ? 'جاري إنشاء القصة...' :
                   language === 'turkish' ? 'Hikaye oluşturuluyor...' :
                   language === 'indonesian' ? 'Membuat cerita...' :
                   'Creating Story...'}
                </span>
              </div>
            ) : (
              <>
                📚 {language === 'arabic' ? 'إنشاء قصة إسلامية' :
                     language === 'turkish' ? 'İslami Hikaye Oluştur' :
                     language === 'indonesian' ? 'Buat Cerita Islam' :
                     'Create Islamic Story'}
              </>
            )}
          </button>
        </div>

        {/* Generated Story */}
        {generatedStory && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-green-600 mb-2">{generatedStory.title}</h3>
                {generatedStory.arabicTitle && language !== 'arabic' && (
                  <h3 className="text-2xl font-bold text-green-600 mb-2" dir="rtl">{generatedStory.arabicTitle}</h3>
                )}
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>👶 {generatedStory.ageGroup} {language === 'arabic' ? 'سنوات' : 'years'}</span>
                  <span>📖 {theme.charAt(0).toUpperCase() + theme.slice(1)}</span>
                  <span>🌍 {selectedLanguage?.name}</span>
                </div>
              </div>
            </div>

            <div className="prose max-w-none mb-8">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-6" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                <p className="text-lg leading-relaxed text-gray-800" style={{ lineHeight: '1.8' }}>
                  {generatedStory.content}
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                  <span className="mr-2">🎯</span>
                  {language === 'arabic' ? 'الدرس الأخلاقي' :
                   language === 'turkish' ? 'Ahlaki Ders' :
                   language === 'indonesian' ? 'Pelajaran Moral' :
                   'Moral Lesson'}
                </h4>
                <p className="text-blue-700" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                  {generatedStory.moralLesson}
                </p>
              </div>

              <div className="bg-green-50 rounded-2xl p-6">
                <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                  <span className="mr-2">👥</span>
                  {language === 'arabic' ? 'الشخصيات' :
                   language === 'turkish' ? 'Karakterler' :
                   language === 'indonesian' ? 'Tokoh-tokoh' :
                   'Characters'}
                </h4>
                <div className="space-y-1">
                  {generatedStory.characters.map((character, index) => (
                    <p key={index} className="text-green-700" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                      • {character}
                    </p>
                  ))}
                </div>
              </div>
              
              {/* Islamic Concepts - New Professional Section */}
              {generatedStory.islamicConcepts && generatedStory.islamicConcepts.length > 0 && (
                <div className="bg-amber-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-amber-800 mb-3 flex items-center">
                    <span className="mr-2">🕌</span>
                    {language === 'arabic' ? 'المفاهيم الإسلامية' :
                     language === 'turkish' ? 'İslami Kavramlar' :
                     language === 'indonesian' ? 'Konsep Islam' :
                     'Islamic Concepts'}
                  </h4>
                  <div className="space-y-1">
                    {generatedStory.islamicConcepts.map((concept, index) => (
                      <p key={index} className="text-amber-700" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                        • {concept}
                      </p>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Practical Application - New Professional Section */}
              {generatedStory.practicalApplication && (
                <div className="bg-indigo-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                    <span className="mr-2">⚡</span>
                    {language === 'arabic' ? 'التطبيق العملي' :
                     language === 'turkish' ? 'Pratik Uygulama' :
                     language === 'indonesian' ? 'Penerapan Praktis' :
                     'Practical Application'}
                  </h4>
                  <p className="text-indigo-700" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                    {generatedStory.practicalApplication}
                  </p>
                </div>
              )}
              
              {/* Parent Guide - New Professional Section */}
              {generatedStory.parentGuide && (
                <div className="bg-rose-50 rounded-2xl p-6">
                  <h4 className="font-semibold text-rose-800 mb-3 flex items-center">
                    <span className="mr-2">👨‍👩‍👧‍👦</span>
                    {language === 'arabic' ? 'دليل الوالدين' :
                     language === 'turkish' ? 'Ebeveyn Rehberi' :
                     language === 'indonesian' ? 'Panduan Orang Tua' :
                     'Parent Guide'}
                  </h4>
                  <p className="text-rose-700" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                    {generatedStory.parentGuide}
                  </p>
                </div>
              )}
            </div>

            {/* Voice Controls */}
            {enableVoiceOver && generatedStory.audioUrl && (
              <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                  <span className="mr-2">🎧</span>
                  {language === 'arabic' ? 'التعليق الصوتي' :
                   language === 'turkish' ? 'Sesli Anlatım' :
                   language === 'indonesian' ? 'Narasi Suara' :
                   'Voice Narration'}
                </h4>
                <div className="flex items-center justify-center space-x-4">
                  {!generatedStory.isPlaying ? (
                    <button
                      onClick={playStoryAudio}
                      className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors"
                    >
                      <span>▶️</span>
                      <span>
                        {language === 'arabic' ? 'تشغيل القصة' :
                         language === 'turkish' ? 'Hikayeyi Dinle' :
                         language === 'indonesian' ? 'Putar Cerita' :
                         'Play Story'}
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={stopStoryAudio}
                      className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
                    >
                      <span>⏹️</span>
                      <span>
                        {language === 'arabic' ? 'إيقاف' :
                         language === 'turkish' ? 'Durdur' :
                         language === 'indonesian' ? 'Berhenti' :
                         'Stop'}
                      </span>
                    </button>
                  )}
                  
                  {isGeneratingVoice && (
                    <div className="flex items-center text-purple-600">
                      <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span className="text-sm">
                        {language === 'arabic' ? 'جاري إنشاء الصوت...' :
                         language === 'turkish' ? 'Ses oluşturuluyor...' :
                         language === 'indonesian' ? 'Membuat suara...' :
                         'Generating voice...'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 text-center">
                  <p className="text-sm text-purple-700">
                    {language === 'arabic' ? `الصوت: ${voiceType === 'female' ? 'أنثى' : voiceType === 'male' ? 'ذكر' : 'طفل'}` :
                     language === 'turkish' ? `Ses: ${voiceType === 'female' ? 'Kadın' : voiceType === 'male' ? 'Erkek' : 'Çocuk'}` :
                     language === 'indonesian' ? `Suara: ${voiceType === 'female' ? 'Wanita' : voiceType === 'male' ? 'Pria' : 'Anak'}` :
                     `Voice: ${voiceType.charAt(0).toUpperCase() + voiceType.slice(1)}`}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 text-center space-x-4">
              <button
                onClick={generateStory}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-8 rounded-2xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-200"
              >
                {language === 'arabic' ? 'إنشاء قصة أخرى' :
                 language === 'turkish' ? 'Başka Hikaye Oluştur' :
                 language === 'indonesian' ? 'Buat Cerita Lain' :
                 'Create Another Story'}
              </button>
              
              {generatedStory.audioUrl && (
                <button
                  onClick={() => {
                    setIsGeneratingVoice(true)
                    voiceService.generateVoiceOver({
                      text: generatedStory.content,
                      language: language,
                      voice: voiceType,
                      speed: ageGroup === '3-5' ? 0.8 : 0.9
                    }).then(result => {
                      if (result.success && result.audioUrl) {
                        setGeneratedStory({...generatedStory, audioUrl: result.audioUrl})
                      }
                      setIsGeneratingVoice(false)
                    })
                  }}
                  className="bg-purple-100 text-purple-700 py-3 px-6 rounded-2xl font-semibold hover:bg-purple-200 transition-all duration-200"
                >
                  🎤 {language === 'arabic' ? 'إعادة إنشاء الصوت' :
                       language === 'turkish' ? 'Sesi Yeniden Oluştur' :
                       language === 'indonesian' ? 'Buat Ulang Suara' :
                       'Regenerate Voice'}
                </button>
              )}
            </div>

            {/* Hidden audio element for playing generated audio files */}
            <audio
              ref={audioRef}
              onEnded={() => setGeneratedStory(generatedStory ? {...generatedStory, isPlaying: false} : null)}
              onPlay={() => setGeneratedStory(generatedStory ? {...generatedStory, isPlaying: true} : null)}
              onPause={() => setGeneratedStory(generatedStory ? {...generatedStory, isPlaying: false} : null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default IslamicKidsStories