import React, { useState } from 'react'
import { aiService } from './services/aiService'

interface GeneratedName {
  name: string
  meaning: string
  origin: string
  pronunciation: string
  spiritualSignificance: string
  arabicScript?: string
}

const IslamicNameGenerator = () => {
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [style, setStyle] = useState<'classic' | 'modern' | 'rare'>('classic')
  const [language, setLanguage] = useState('english')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedNames, setGeneratedNames] = useState<GeneratedName[]>([])

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

  const generateNames = async () => {
    setIsGenerating(true)
    
    try {
      // Use real AI to generate Islamic names
      const response = await aiService.generateIslamicNames(gender, style, language, 3)
      
      if (response.success && response.data?.choices?.[0]?.message?.content) {
        try {
          const aiContent = response.data.choices[0].message.content
          const parsedData = JSON.parse(aiContent)
          
          if (parsedData.names && Array.isArray(parsedData.names)) {
            setGeneratedNames(parsedData.names)
          } else {
            throw new Error('Invalid AI response format')
          }
        } catch (parseError) {
          console.error('Error parsing AI response:', parseError)
          // Fallback to sample names if AI parsing fails
          setGeneratedNames(getFallbackNames())
        }
      } else {
        // Fallback to sample names if AI request fails
        console.error('AI request failed:', response.error)
        setGeneratedNames(getFallbackNames())
      }
    } catch (error) {
      console.error('Error generating names:', error)
      // Fallback to sample names
      setGeneratedNames(getFallbackNames())
    }
    
    setIsGenerating(false)
  }

  const getFallbackNames = (): GeneratedName[] => {
    // Fallback sample names when AI is not available
    return [
      {
        name: "Ibrahim",
        arabicScript: "إبراهيم",
        meaning: language === 'arabic' ? "أبو الأمم" : 
                language === 'turkish' ? "Milletlerin babası" :
                language === 'indonesian' ? "Bapa bangsa-bangsa" :
                language === 'urdu' ? "قوموں کا باپ" :
                "Father of nations",
        origin: language === 'arabic' ? "عربي/عبري" : 
               language === 'turkish' ? "Arapça/İbranice" :
               language === 'indonesian' ? "Arab/Ibrani" :
               "Arabic/Hebrew",
        pronunciation: "Ib-ra-heem",
        spiritualSignificance: language === 'arabic' ? 
          "سُمي على اسم النبي إبراهيم عليه السلام، المعروف بإيمانه الثابت وتسليمه لله. اسم يمثل القوة والقيادة والتفاني." :
          language === 'turkish' ? 
          "Hz. İbrahim'in (AS) adından gelir, sarsılmaz imanı ve Allah'a teslimiyeti ile tanınır. Güç, liderlik ve bağlılığı temsil eden bir isimdir." :
          language === 'indonesian' ?
          "Dinamakan dari Nabi Ibrahim AS, yang dikenal karena imannya yang teguh dan ketundukan kepada Allah. Nama yang melambangkan kekuatan, kepemimpinan, dan pengabdian." :
          "Named after Prophet Ibrahim (AS), known for his unwavering faith and submission to Allah. A name that represents strength, leadership, and devotion."
      },
      {
        name: "Aisha",
        arabicScript: "عائشة",
        meaning: language === 'arabic' ? "الحية، النشطة" : 
                language === 'turkish' ? "Yaşayan, canlı" :
                language === 'indonesian' ? "Yang hidup, yang bersemangat" :
                "Living, lively",
        origin: language === 'arabic' ? "عربي" : 
               language === 'turkish' ? "Arapça" :
               "Arabic",
        pronunciation: "Aa-ee-sha",
        spiritualSignificance: language === 'arabic' ?
          "اسم أم المؤمنين عائشة رضي الله عنها، زوجة النبي محمد صلى الله عليه وسلم. يرمز إلى الحكمة والمعرفة والحيوية." :
          language === 'turkish' ?
          "Müminlerin annesi Hz. Aişe'nin (RA) adıdır, Hz. Muhammed'in (SAV) eşidir. Bilgelik, ilim ve canlılığı simgeler." :
          "Name of Aisha (RA), Mother of the Believers and wife of Prophet Muhammad (SAW). Symbolizes wisdom, knowledge, and vitality."
      }
    ]
  }

  const selectedLanguage = languages.find(l => l.code === language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">👶</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Islamic Name Generator</h1>
              </div>
            </div>
            
            {/* Language Selector */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-medium focus:ring-2 focus:ring-blue-500"
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
            {language === 'arabic' ? 'اكتشف أسماء إسلامية جميلة' :
             language === 'turkish' ? 'Güzel İslami İsimler Keşfedin' :
             language === 'indonesian' ? 'Temukan Nama Islam yang Indah' :
             'Discover Beautiful Islamic Names'}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {language === 'arabic' ? 
              'قم بإنشاء أسماء إسلامية ذات معاني جميلة مع شرح مفصل لأصولها العربية وأهميتها الروحية.' :
             language === 'turkish' ?
              'Arapça kökenleri ve ruhani önemi hakkında detaylı açıklamalarla anlamlı İslami isimler üretin.' :
             language === 'indonesian' ?
              'Hasilkan nama-nama Islam yang bermakna dengan penjelasan rinci tentang asal-usul Arab dan makna spiritualnya.' :
              'Generate meaningful Islamic names with detailed explanations of their Arabic origins and spiritual significance.'}
          </p>
          <div className="mt-4 inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
            <span className="mr-2">{selectedLanguage?.flag}</span>
            <span className="font-medium">{selectedLanguage?.name}</span>
          </div>
        </div>

        {/* Generator Form */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Gender Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'الجنس' :
                 language === 'turkish' ? 'Cinsiyet' :
                 language === 'indonesian' ? 'Jenis Kelamin' :
                 'Gender'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {['male', 'female'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGender(g as 'male' | 'female')}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                      gender === g
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {g === 'male' && (language === 'arabic' ? 'ذكر' : language === 'turkish' ? 'Erkek' : language === 'indonesian' ? 'Laki-laki' : 'Male')}
                    {g === 'female' && (language === 'arabic' ? 'أنثى' : language === 'turkish' ? 'Kız' : language === 'indonesian' ? 'Perempuan' : 'Female')}
                  </button>
                ))}
              </div>
            </div>

            {/* Style Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'النمط' :
                 language === 'turkish' ? 'Stil' :
                 language === 'indonesian' ? 'Gaya' :
                 'Style'}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['classic', 'modern', 'rare'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s as 'classic' | 'modern' | 'rare')}
                    className={`py-3 px-4 rounded-xl font-medium transition-colors ${
                      style === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {s === 'classic' && (language === 'arabic' ? 'كلاسيكي' : language === 'turkish' ? 'Klasik' : language === 'indonesian' ? 'Klasik' : 'Classic')}
                    {s === 'modern' && (language === 'arabic' ? 'عصري' : language === 'turkish' ? 'Modern' : language === 'indonesian' ? 'Modern' : 'Modern')}
                    {s === 'rare' && (language === 'arabic' ? 'نادر' : language === 'turkish' ? 'Nadir' : language === 'indonesian' ? 'Langka' : 'Rare')}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Options */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                {language === 'arabic' ? 'خيارات إضافية' :
                 language === 'turkish' ? 'Ek Seçenekler' :
                 language === 'indonesian' ? 'Opsi Tambahan' :
                 'Additional Options'}
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-blue-600 mr-2" />
                  <span className="text-sm text-gray-700">
                    {language === 'arabic' ? 'تضمين النطق' :
                     language === 'turkish' ? 'Telaffuz dahil' :
                     language === 'indonesian' ? 'Sertakan pengucapan' :
                     'Include pronunciation'}
                  </span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded text-blue-600 mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">
                    {language === 'arabic' ? 'الكتابة العربية' :
                     language === 'turkish' ? 'Arap yazısı' :
                     language === 'indonesian' ? 'Tulisan Arab' :
                     'Arabic script'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateNames}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>
                  {language === 'arabic' ? 'جاري إنشاء الأسماء...' :
                   language === 'turkish' ? 'İsimler üretiliyor...' :
                   language === 'indonesian' ? 'Membuat nama...' :
                   'Generating Names...'}
                </span>
              </div>
            ) : (
              <>
                ✨ {language === 'arabic' ? 'إنشاء أسماء إسلامية' :
                     language === 'turkish' ? 'İslami İsimler Üret' :
                     language === 'indonesian' ? 'Buat Nama Islam' :
                     'Generate Islamic Names'}
              </>
            )}
          </button>
        </div>

        {/* Generated Names */}
        {generatedNames.length > 0 && (
          <div className="space-y-8">
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-8">
              {language === 'arabic' ? 'الأسماء المُنشأة لك' :
               language === 'turkish' ? 'Sizin İçin Üretilen İsimler' :
               language === 'indonesian' ? 'Nama yang Dibuat untuk Anda' :
               'Generated Names for You'}
            </h3>
            
            {generatedNames.map((nameData, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                <div className="flex flex-col lg:flex-row justify-between items-start mb-6">
                  <div className="mb-4 lg:mb-0">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className="text-4xl font-bold text-blue-600">{nameData.name}</h4>
                      {nameData.arabicScript && (
                        <h4 className="text-3xl font-bold text-blue-600" dir="rtl">{nameData.arabicScript}</h4>
                      )}
                    </div>
                    <p className="text-xl text-gray-700 font-medium">{nameData.meaning}</p>
                    <p className="text-sm text-gray-500">
                      {language === 'arabic' ? 'الأصل:' :
                       language === 'turkish' ? 'Köken:' :
                       language === 'indonesian' ? 'Asal:' :
                       'Origin:'} {nameData.origin}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">
                      {language === 'arabic' ? 'النطق' :
                       language === 'turkish' ? 'Telaffuz' :
                       language === 'indonesian' ? 'Pengucapan' :
                       'Pronunciation'}
                    </p>
                    <p className="text-lg font-medium text-gray-700">{nameData.pronunciation}</p>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h5 className="font-semibold text-blue-800 mb-3 flex items-center">
                    <span className="mr-2">✨</span>
                    {language === 'arabic' ? 'الأهمية الروحية' :
                     language === 'turkish' ? 'Ruhani Önem' :
                     language === 'indonesian' ? 'Makna Spiritual' :
                     'Spiritual Significance'}
                  </h5>
                  <p className="text-blue-700 leading-relaxed" dir={language === 'arabic' ? 'rtl' : 'ltr'}>
                    {nameData.spiritualSignificance}
                  </p>
                </div>
              </div>
            ))}
            
            <div className="text-center">
              <button
                onClick={generateNames}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-2xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                {language === 'arabic' ? 'إنشاء المزيد من الأسماء' :
                 language === 'turkish' ? 'Daha Fazla İsim Üret' :
                 language === 'indonesian' ? 'Buat Lebih Banyak Nama' :
                 'Generate More Names'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IslamicNameGenerator