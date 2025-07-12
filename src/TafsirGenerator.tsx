import React, { useState } from 'react'
import { tafsirSaadiService } from './services/tafsirSaadiProcessor'
import { generateTafsirExplanation } from './services/aiService'

interface TafsirResult {
  verse: string
  verseArabic: string
  reference: string
  explanation: string
  keyLessons: string[]
  historicalContext: string
  practicalApplication: string
  authenticSource?: string // As-Saadi source indicator
  aiEnhancement?: string // AI-generated contemporary applications
}

const TafsirGenerator = () => {
  const [selectedSurah, setSelectedSurah] = useState('')
  const [verseRange, setVerseRange] = useState('')
  const [language, setLanguage] = useState('english')
  const [explanationLevel, setExplanationLevel] = useState<'simple' | 'detailed' | 'scholarly'>('simple')
  const [isGenerating, setIsGenerating] = useState(false)
  const [tafsirResult, setTafsirResult] = useState<TafsirResult | null>(null)
  const [specificQuestion, setSpecificQuestion] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

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

  const popularSurahs = [
    { name: 'Al-Fatiha', arabicName: 'الفاتحة', number: 1 },
    { name: 'Al-Baqarah', arabicName: 'البقرة', number: 2 },
    { name: 'Ale-Imran', arabicName: 'آل عمران', number: 3 },
    { name: 'Yasin', arabicName: 'يس', number: 36 },
    { name: 'Ar-Rahman', arabicName: 'الرحمن', number: 55 },
    { name: 'Al-Kahf', arabicName: 'الكهف', number: 18 },
    { name: 'Maryam', arabicName: 'مريم', number: 19 },
    { name: 'Al-Mulk', arabicName: 'الملك', number: 67 },
    { name: 'Al-Ikhlas', arabicName: 'الإخلاص', number: 112 },
    { name: 'Al-Falaq', arabicName: 'الفلق', number: 113 },
    { name: 'An-Nas', arabicName: 'الناس', number: 114 }
  ]

  const generateTafsir = async () => {
    if (!selectedSurah || !verseRange) return
    
    setIsGenerating(true)
    
    try {
      // Parse verse input (supports single verse or range)
      const verses = verseRange.includes('-') 
        ? verseRange.split('-').map(v => parseInt(v.trim()))
        : [parseInt(verseRange)]
      
      const surahNumber = popularSurahs.find(s => s.name === selectedSurah)?.number || 1
      const ayahNumber = verses[0] || 1
      
      // Get authentic As-Saadi explanation if available
      const authenticTafsir = tafsirSaadiService.getTafsirForVerse(surahNumber, ayahNumber)
      
      // Generate AI-enhanced explanation
      const enhancedPrompt = await tafsirSaadiService.generateEnhancedTafsir(
        surahNumber, 
        ayahNumber, 
        specificQuestion || undefined
      )
      
      // Call AI service with enhanced prompt
      const aiResponse = await generateTafsirExplanation(
        enhancedPrompt,
        language,
        explanationLevel
      )
      
      // Create result combining authentic source with AI enhancement
      const result: TafsirResult = {
        verse: authenticTafsir?.translation || aiResponse.translation || 'Translation will be provided',
        verseArabic: authenticTafsir?.arabicText || aiResponse.arabicText || '',
        reference: `${selectedSurah} ${surahNumber}:${ayahNumber}`,
        authenticSource: authenticTafsir ? 'Tafsir As-Saadi' : undefined,
        explanation: aiResponse.explanation || 'Generating explanation...',
        keyLessons: aiResponse.keyLessons || [],
        historicalContext: aiResponse.historicalContext || 'Historical context will be provided',
        practicalApplication: aiResponse.practicalApplication || 'Practical application will be provided',
        aiEnhancement: aiResponse.aiEnhancement
      }
      
      setTafsirResult(result)
      
    } catch (error) {
      console.error('Error generating tafsir:', error)
      // Fallback to basic explanation
      setTafsirResult({
        verse: 'Error loading verse',
        verseArabic: '',
        reference: `${selectedSurah} ${verseRange}`,
        explanation: 'Unable to generate explanation. Please try again.',
        keyLessons: [],
        historicalContext: '',
        practicalApplication: ''
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedLanguage = languages.find(l => l.code === language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100">
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
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">📖</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">AI Tafsir Generator</h1>
              </div>
            </div>
            
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-purple-500"
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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {language === 'arabic' ? 'فهم القرآن الكريم بعمق' :
             language === 'turkish' ? 'Kuran-ı Kerim\'i Derinlemesine Anlayın' :
             language === 'indonesian' ? 'Memahami Al-Quran dengan Mendalam' :
             'Understand the Quran with Depth'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {language === 'arabic' ? 
              'احصل على تفسير شامل لآيات القرآن الكريم مع السياق التاريخي والدروس العملية والتطبيق في الحياة اليومية.' :
             language === 'turkish' ?
              'Kuran ayetlerinin tarihsel bağlamı, pratik dersleri ve günlük yaşamda uygulaması ile kapsamlı tefsir alın.' :
             language === 'indonesian' ?
              'Dapatkan tafsir komprehensif ayat-ayat Al-Quran dengan konteks sejarah, pelajaran praktis, dan penerapan dalam kehidupan sehari-hari.' :
              'Get comprehensive explanations of Quranic verses with historical context, practical lessons, and daily life applications.'}
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full">
            <span className="mr-2">{selectedLanguage?.flag}</span>
            <span className="font-medium">{selectedLanguage?.name}</span>
          </div>
        </div>

        {/* Tafsir Generator Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Surah Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'اختر السورة' :
                 language === 'turkish' ? 'Sure Seçin' :
                 language === 'indonesian' ? 'Pilih Surah' :
                 'Select Surah'}
              </label>
              <select
                value={selectedSurah}
                onChange={(e) => setSelectedSurah(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-purple-500"
              >
                <option value="">
                  {language === 'arabic' ? 'اختر سورة...' :
                   language === 'turkish' ? 'Bir sure seçin...' :
                   language === 'indonesian' ? 'Pilih surah...' :
                   'Select a surah...'}
                </option>
                {popularSurahs.map((surah) => (
                  <option key={surah.number} value={surah.name}>
                    {surah.number}. {surah.name} ({surah.arabicName})
                  </option>
                ))}
              </select>
            </div>

            {/* Verse Range */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'نطاق الآيات' :
                 language === 'turkish' ? 'Ayet Aralığı' :
                 language === 'indonesian' ? 'Rentang Ayat' :
                 'Verse Range'}
              </label>
              <input
                type="text"
                value={verseRange}
                onChange={(e) => setVerseRange(e.target.value)}
                placeholder={language === 'arabic' ? 'مثال: 1-7 أو 1' :
                           language === 'turkish' ? 'Örnek: 1-7 veya 1' :
                           language === 'indonesian' ? 'Contoh: 1-7 atau 1' :
                           'e.g., 1-7 or 1'}
                className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Specific Question Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              {language === 'arabic' ? 'سؤال محدد (اختياري)' :
               language === 'turkish' ? 'Özel Soru (İsteğe Bağlı)' :
               language === 'indonesian' ? 'Pertanyaan Khusus (Opsional)' :
               'Specific Question (Optional)'}
            </label>
            <input
              type="text"
              value={specificQuestion}
              onChange={(e) => setSpecificQuestion(e.target.value)}
              placeholder={language === 'arabic' ? 'مثال: ما هي الدروس المستفادة من هذه الآية؟' :
                         language === 'turkish' ? 'Örnek: Bu ayetten çıkan dersler nelerdir?' :
                         language === 'indonesian' ? 'Contoh: Apa pelajaran dari ayat ini?' :
                         'e.g., What lessons can we learn from this verse?'}
              className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 font-medium focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Explanation Level */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'مستوى التفسير' :
                 language === 'turkish' ? 'Açıklama Seviyesi' :
                 language === 'indonesian' ? 'Tingkat Penjelasan' :
                 'Explanation Level'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['simple', 'detailed', 'scholarly'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setExplanationLevel(level as 'simple' | 'detailed' | 'scholarly')}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors text-sm ${
                      explanationLevel === level
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level === 'simple' && (language === 'arabic' ? 'بسيط' : language === 'turkish' ? 'Basit' : language === 'indonesian' ? 'Sederhana' : 'Simple')}
                    {level === 'detailed' && (language === 'arabic' ? 'مفصل' : language === 'turkish' ? 'Detaylı' : language === 'indonesian' ? 'Rinci' : 'Detailed')}
                    {level === 'scholarly' && (language === 'arabic' ? 'علمي' : language === 'turkish' ? 'Akademik' : language === 'indonesian' ? 'Ilmiah' : 'Scholarly')}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Access */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'وصول سريع' :
                 language === 'turkish' ? 'Hızlı Erişim' :
                 language === 'indonesian' ? 'Akses Cepat' :
                 'Quick Access'}
              </label>
              <div className="space-y-2">
                <button 
                  onClick={() => {setSelectedSurah('Al-Fatiha'); setVerseRange('1')}}
                  className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  📖 {language === 'arabic' ? 'الفاتحة 1' : 'Al-Fatiha 1'}
                </button>
                <button 
                  onClick={() => {setSelectedSurah('Al-Ikhlas'); setVerseRange('1-4')}}
                  className="w-full text-left px-4 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                >
                  🕌 {language === 'arabic' ? 'الإخلاص 1-4' : 'Al-Ikhlas 1-4'}
                </button>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateTafsir}
            disabled={isGenerating || !selectedSurah}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {language === 'arabic' ? 'جاري إنشاء التفسير...' :
                   language === 'turkish' ? 'Tefsir oluşturuluyor...' :
                   language === 'indonesian' ? 'Membuat tafsir...' :
                   'Generating Tafsir...'}
                </span>
              </div>
            ) : (
              <>
                📖 {language === 'arabic' ? 'إنشاء تفسير' :
                     language === 'turkish' ? 'Tefsir Oluştur' :
                     language === 'indonesian' ? 'Buat Tafsir' :
                     'Generate Tafsir'}
              </>
            )}
          </button>
        </div>

        {/* Generated Tafsir */}
        {tafsirResult && (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            {/* Verse Display */}
            <div className="text-center mb-8 pb-8 border-b border-gray-200">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{tafsirResult.reference}</h3>
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <p className="text-3xl font-bold text-purple-600 mb-4 leading-relaxed" dir="rtl" style={{fontFamily: 'Amiri, serif'}}>
                    {tafsirResult.verseArabic}
                  </p>
                  <p className="text-xl text-gray-800 leading-relaxed" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                    {tafsirResult.verse}
                  </p>
                </div>
              </div>
            </div>

            {/* Main Explanation */}
            <div className="mb-8">
              <h4 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <span className="mr-3">💡</span>
                {language === 'arabic' ? 'التفسير' :
                 language === 'turkish' ? 'Açıklama' :
                 language === 'indonesian' ? 'Penjelasan' :
                 'Explanation'}
              </h4>
              <div className="bg-gray-50 rounded-2xl p-6">
                <p className="text-lg leading-relaxed text-gray-800" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                  {tafsirResult.explanation}
                </p>
              </div>
            </div>

            {/* Key Lessons & Context Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Key Lessons */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h5 className="font-bold text-blue-800 mb-4 flex items-center">
                  <span className="mr-2">🎯</span>
                  {language === 'arabic' ? 'الدروس الرئيسية' :
                   language === 'turkish' ? 'Ana Dersler' :
                   language === 'indonesian' ? 'Pelajaran Utama' :
                   'Key Lessons'}
                </h5>
                <ul className="space-y-2">
                  {tafsirResult.keyLessons.map((lesson, index) => (
                    <li key={index} className="text-blue-700 flex items-start" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                      <span className="mr-2 text-blue-500">•</span>
                      {lesson}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Historical Context */}
              <div className="bg-green-50 rounded-2xl p-6">
                <h5 className="font-bold text-green-800 mb-4 flex items-center">
                  <span className="mr-2">📜</span>
                  {language === 'arabic' ? 'السياق التاريخي' :
                   language === 'turkish' ? 'Tarihsel Bağlam' :
                   language === 'indonesian' ? 'Konteks Sejarah' :
                   'Historical Context'}
                </h5>
                <p className="text-green-700 leading-relaxed" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                  {tafsirResult.historicalContext}
                </p>
              </div>
            </div>

            {/* Practical Application */}
            <div className="bg-amber-50 rounded-2xl p-6 mb-8">
              <h5 className="font-bold text-amber-800 mb-4 flex items-center">
                <span className="mr-2">🌟</span>
                {language === 'arabic' ? 'التطبيق العملي' :
                 language === 'turkish' ? 'Pratik Uygulama' :
                 language === 'indonesian' ? 'Penerapan Praktis' :
                 'Practical Application'}
              </h5>
              <p className="text-amber-700 leading-relaxed" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                {tafsirResult.practicalApplication}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="text-center space-x-4">
              <button
                onClick={generateTafsir}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-2xl font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                {language === 'arabic' ? 'تفسير آخر' :
                 language === 'turkish' ? 'Başka Tefsir' :
                 language === 'indonesian' ? 'Tafsir Lain' :
                 'Another Tafsir'}
              </button>
              <button className="bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-semibold hover:bg-gray-200 transition-all duration-200">
                {language === 'arabic' ? 'حفظ التفسير' :
                 language === 'turkish' ? 'Tefsiri Kaydet' :
                 language === 'indonesian' ? 'Simpan Tafsir' :
                 'Save Tafsir'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TafsirGenerator