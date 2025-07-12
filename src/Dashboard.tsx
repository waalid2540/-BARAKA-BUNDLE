import React, { useState } from 'react'

const Dashboard = () => {
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('english')

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

  const tools = [
    {
      id: 'name-generator',
      title: 'Islamic Name Generator',
      description: 'Generate beautiful Islamic names with meanings in your language',
      icon: '👶',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'kids-stories',
      title: 'AI Islamic Stories for Kids',
      description: 'Create engaging Islamic stories for children in any language',
      icon: '📚',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'ai-tafsir-chatbot',
      title: 'AI Tafsir Chatbot',
      description: 'Chat with AI about Quranic verses using authentic Tafsir As-Saadi',
      icon: '🤖',
      color: 'from-green-500 to-blue-600',
      bgColor: 'bg-gradient-to-r from-green-50 to-blue-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'dua-generator',
      title: 'AI Du\'a Generator',
      description: 'Find perfect prayers with pronunciation in multiple languages',
      icon: '🤲',
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    }
  ]

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId)
    // Navigate to the specific tool
    const routes = {
      'name-generator': '/islamic-name-generator',
      'kids-stories': '/islamic-kids-stories',
      'tafsir-generator': '/tafsir-generator',
      'ai-tafsir-chatbot': '/ai-tafsir-chatbot',
      'dua-generator': '/dua-generator'
    }
    const route = routes[toolId as keyof typeof routes]
    if (route) {
      window.location.href = route
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-red-600 rounded-2xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">ب</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
                  Baraka Bundle
                </h1>
                <p className="text-gray-600">Islamic AI Tools Dashboard</p>
              </div>
            </div>
            
            {/* Language Selector */}
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-700">Language:</span>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

      {/* Welcome Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Assalamu Alaikum! Welcome to Your Islamic AI Tools
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Choose any tool below to get started. All tools support multiple languages and are powered by 
            authentic Islamic scholarship combined with cutting-edge AI technology.
          </p>
          <div className="inline-flex items-center px-6 py-3 bg-green-100 text-green-800 rounded-full font-medium">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></span>
            Language: {languages.find(l => l.code === selectedLanguage)?.flag} {languages.find(l => l.code === selectedLanguage)?.name}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolSelect(tool.id)}
              className={`${tool.bgColor} ${tool.borderColor} border-2 rounded-3xl p-8 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
            >
              <div className={`w-20 h-20 bg-gradient-to-r ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-4xl">{tool.icon}</span>
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{tool.title}</h3>
              <p className="text-gray-700 mb-6 text-lg leading-relaxed">{tool.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Open Tool</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <div className="text-sm text-gray-500">
                  Multi-language support
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Support Section */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-blue-900 rounded-3xl p-10 text-white text-center max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold mb-4">🕌 Supporting the Ummah</h3>
          <p className="text-xl text-gray-300 mb-6">
            Your purchase helps fund Islamic infrastructure development.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="text-3xl mb-3">🏗️</div>
              <div className="font-bold text-lg mb-2">50% Revenue</div>
              <div className="text-gray-300 text-sm">Allocated to Masjid Madina USA</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="text-3xl mb-3">🌍</div>
              <div className="font-bold text-lg mb-2">1.2B Muslims</div>
              <div className="text-gray-300 text-sm">Served worldwide in multiple languages</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
              <div className="text-3xl mb-3">🤖</div>
              <div className="font-bold text-lg mb-2">AI + Islamic Scholarship</div>
              <div className="text-gray-300 text-sm">Built by Imam & SaaS Engineer</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Dashboard