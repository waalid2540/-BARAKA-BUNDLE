// AI Service for Baraka Bundle Islamic AI Tools
// Integrates with OpenAI GPT-4 for authentic Islamic content generation
// Enhanced with Tafsir As-Saadi integration

// Get API key from environment variables only
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || ''

console.log('Environment check - API Key loaded:', OPENAI_API_KEY ? 'YES (length: ' + OPENAI_API_KEY.length + ')' : 'NO')
const OPENAI_BASE_URL = 'https://api.openai.com/v1'

interface AIResponse {
  success: boolean
  data?: any
  error?: string
}

class AIService {
  private async makeRequest(endpoint: string, payload: any): Promise<AIResponse> {
    try {
      if (!OPENAI_API_KEY) {
        return { 
          success: false, 
          error: 'OpenAI API key not configured. Please add REACT_APP_OPENAI_API_KEY to your environment variables.' 
        }
      }

      const response = await fetch(`${OPENAI_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error('AI Service Error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }
    }
  }

  async generateIslamicNames(gender: 'male' | 'female', style: string, language: string, count: number = 5) {
    const prompt = `Generate ${count} authentic Islamic names for ${gender} in ${style} style. 
    Provide response in ${language} language with the following JSON format:
    {
      "names": [
        {
          "name": "Name in Latin script",
          "arabicScript": "النص العربي",
          "meaning": "Meaning in ${language}",
          "origin": "Origin in ${language}",
          "pronunciation": "Phonetic pronunciation",
          "spiritualSignificance": "Detailed spiritual/Islamic significance in ${language}"
        }
      ]
    }
    
    Ensure all names are:
    - Authentic Islamic names with proper meanings
    - Correctly spelled in Arabic script
    - Appropriate for the specified gender
    - Accompanied by accurate spiritual significance
    - Respectful and in line with Islamic values`

    const payload = {
      model: 'ft:gpt-4o-mini-2024-07-18:personal:as-saadi-tafsir:Bt99KitP',
      messages: [
        {
          role: 'system',
          content: 'You are an Islamic scholar and expert in Arabic language, Islamic names, and their meanings. Provide accurate, authentic, and respectful Islamic content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }

    return this.makeRequest('/chat/completions', payload)
  }

  async generateIslamicStory(ageGroup: string, theme: string, language: string, situation?: string) {
    const prompt = `Create a professional, engaging Islamic story for children aged ${ageGroup} with the theme "${theme}".
    ${situation ? `Specific situation: ${situation}` : ''}
    
    STORY SPECIFICATIONS:
    - Target Age: ${ageGroup} years old
    - Theme: ${theme}
    - Language: ${language}
    - Length: 400+ words with rich storytelling
    
    REQUIREMENTS:
    - Age-appropriate for ${ageGroup} year olds
    - Engaging story with clear moral lesson
    - Authentic Islamic teachings
    - 200-300 word length for easy reading
    - Simple, clear language
    
    MUST return ONLY valid JSON in this exact format:
    {
      "title": "Story title in ${language}",
      "arabicTitle": "العنوان بالعربية",
      "content": "Complete story (200-300 words) in ${language}",
      "ageGroup": "${ageGroup}",
      "moralLesson": "Main lesson in ${language}",
      "characters": ["Main character names"],
      "theme": "${theme}",
      "islamicConcepts": ["Key concepts"],
      "practicalApplication": "How to apply this lesson",
      "parentGuide": "Tips for parents"
    }`

    const payload = {
      model: 'ft:gpt-4o-mini-2024-07-18:personal:as-saadi-tafsir:Bt99KitP',
      messages: [
        {
          role: 'system',
          content: `You are an Islamic education expert creating engaging stories for Muslim children.

INSTRUCTIONS:
- Create authentic Islamic stories appropriate for the specified age group
- Use simple, clear language children can understand
- Include moral lessons and Islamic values
- Return ONLY valid JSON format - no extra text
- Keep stories 200-300 words for easy reading
- Make stories engaging and memorable

Focus on authenticity, simplicity, and educational value.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }

    return this.makeRequest('/chat/completions', payload)
  }

  async generateTafsir(surah: string, verseRange: string, language: string, level: string) {
    const prompt = `Provide a comprehensive Tafsir (Quranic explanation) for ${surah} verses ${verseRange}.
    
    Explanation level: ${level}
    Language: ${language}
    
    Provide response in ${language} language with the following JSON format:
    {
      "verse": "Verse translation in ${language}",
      "verseArabic": "Original Arabic text",
      "reference": "${surah} ${verseRange}",
      "explanation": "Comprehensive explanation in ${language} appropriate for ${level} level",
      "keyLessons": ["List of key lessons in ${language}"],
      "historicalContext": "Historical context in ${language}",
      "practicalApplication": "How to apply in daily life in ${language}"
    }
    
    Ensure the Tafsir:
    - Is authentic and based on classical Islamic scholarship
    - Appropriate for ${level} level (simple/detailed/scholarly)
    - Includes historical context and practical applications
    - Respects traditional Islamic interpretations
    - Is accessible to modern Muslim readers`

    const payload = {
      model: 'ft:gpt-4o-mini-2024-07-18:personal:as-saadi-tafsir:Bt99KitP',
      messages: [
        {
          role: 'system',
          content: 'You are an Islamic scholar specializing in Quranic studies and Tafsir. Provide accurate, authentic, and well-researched explanations based on classical Islamic scholarship and respected commentaries.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Lower temperature for more accurate religious content
      max_tokens: 3500
    }

    return this.makeRequest('/chat/completions', payload)
  }

  async generateDua(category: string, language: string, situation?: string) {
    const prompt = `Find an authentic Islamic Dua for the category "${category}".
    ${situation ? `Specific situation: ${situation}` : ''}
    
    Provide response in ${language} language with the following JSON format:
    {
      "title": "Dua title in ${language}",
      "arabicText": "Complete Arabic text of the dua",
      "transliteration": "Accurate transliteration in Latin script",
      "translation": "Complete translation in ${language}",
      "occasion": "When this dua is recited in ${language}",
      "benefits": ["List of benefits in ${language}"],
      "whenToRecite": "Recommended times and circumstances in ${language}",
      "source": "Islamic source (Quran/Hadith reference)"
    }
    
    Ensure the Dua:
    - Is from authentic Islamic sources (Quran, Sahih Hadith)
    - Has accurate Arabic text and transliteration
    - Includes proper Islamic etiquette
    - Provides practical guidance for recitation
    - Is appropriate for the specified category and situation`

    const payload = {
      model: 'ft:gpt-4o-mini-2024-07-18:personal:as-saadi-tafsir:Bt99KitP',
      messages: [
        {
          role: 'system',
          content: 'You are an Islamic scholar expert in authentic Duas from Quran and Sahih Hadith. Only provide Duas that are authentically sourced and properly referenced.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2, // Very low temperature for accurate religious content
      max_tokens: 2500
    }

    return this.makeRequest('/chat/completions', payload)
  }

  async translateContent(content: string, fromLanguage: string, toLanguage: string, contentType: 'ui' | 'religious') {
    const prompt = `Translate the following ${contentType} content from ${fromLanguage} to ${toLanguage}:

    "${content}"
    
    ${contentType === 'religious' ? 
      'This is religious Islamic content. Ensure translation maintains religious accuracy and cultural sensitivity.' :
      'This is user interface text. Provide natural, localized translation.'
    }
    
    Provide only the translation without additional text.`

    const payload = {
      model: 'ft:gpt-4o-mini-2024-07-18:personal:as-saadi-tafsir:Bt99KitP',
      messages: [
        {
          role: 'system',
          content: contentType === 'religious' ? 
            'You are an expert translator specializing in Islamic religious content. Maintain accuracy and respect for Islamic terminology.' :
            'You are a professional translator specializing in user interface localization.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    }

    const response = await this.makeRequest('/chat/completions', payload)
    if (response.success && response.data?.choices?.[0]?.message?.content) {
      return {
        success: true,
        data: response.data.choices[0].message.content.trim()
      }
    }
    return response
  }

  // Simple AI chat response (no JSON parsing)
  async generateSimpleResponse(prompt: string, language: string): Promise<AIResponse> {
    console.log('generateSimpleResponse called with language:', language)
    console.log('API Key present:', OPENAI_API_KEY ? 'YES' : 'NO')
    
    const payload = {
      model: 'ft:gpt-4o-mini-2024-07-18:personal:as-saadi-tafsir:Bt99KitP',
      messages: [
        {
          role: 'system',
          content: `You are Sheikh Abdurrahman As-Saadi - a wise, conversational tafsir teacher who makes Quranic wisdom come alive.

PERSONALITY:
- Warm, engaging, and genuinely curious about the student's spiritual journey
- Ask thoughtful follow-up questions to deepen understanding
- Share practical examples from daily life
- Connect verses to current situations and emotions
- Be like a wise mentor, not a textbook

CONVERSATION FLOW:
1. Greetings → Welcome warmly and ask about their interests
2. Casual words → Acknowledge and guide to meaningful topics
3. Tafsir questions → Give authentic explanation + ask engaging follow-up
4. General questions → Connect to relevant verses + explore deeper

EXAMPLES:
- "That's a beautiful verse! Have you experienced this guidance in your daily prayers?"
- "What drew you to this particular ayah? There's so much wisdom here..."
- "This reminds me of a story - let me share how this applies to modern life..."

Be conversational, ask questions, share wisdom naturally. Write in ${language}. Make tafsir feel alive and relevant!`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200
    }

    console.log('Making API request...')
    const response = await this.makeRequest('/chat/completions', payload)
    console.log('API request completed:', response.success ? 'SUCCESS' : 'FAILED')
    
    if (response.success && response.data?.choices?.[0]?.message?.content) {
      console.log('AI content found:', response.data.choices[0].message.content.substring(0, 50) + '...')
      return {
        success: true,
        data: response.data.choices[0].message.content.trim()
      }
    }
    
    console.log('AI response failed:', response.error)
    return response
  }

  // Enhanced Tafsir generation with As-Saadi integration
  async generateTafsirExplanation(enhancedPrompt: string, language: string, level: string) {
    const payload = {
      model: 'ft:gpt-4o-mini-2024-07-18:personal:as-saadi-tafsir:Bt99KitP',
      messages: [
        {
          role: 'system',
          content: `You are Sheikh Abdurrahman As-Saadi providing authentic Quranic tafsir. Be concise, clear, and professional. Base explanations on authentic As-Saadi methodology.

Response should be in ${language}, appropriate for ${level} level, and brief (100-150 words max).

Always provide response in this exact JSON format:
{
  "translation": "Verse translation in ${language}",
  "arabicText": "Original Arabic verse",
  "explanation": "Main explanation based on authentic sources",
  "keyLessons": ["List of 3-5 key lessons in ${language}"],
  "historicalContext": "Historical background in ${language}",
  "practicalApplication": "Modern application guidance in ${language}",
  "aiEnhancement": "Contemporary insights and applications in ${language}"
}`
        },
        {
          role: 'user',
          content: enhancedPrompt
        }
      ],
      temperature: 0.1, // Very low for religious accuracy
      max_tokens: 800
    }

    const response = await this.makeRequest('/chat/completions', payload)
    
    if (response.success && response.data?.choices?.[0]?.message?.content) {
      try {
        const content = response.data.choices[0].message.content.trim()
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        
        if (jsonMatch) {
          const parsedData = JSON.parse(jsonMatch[0])
          return {
            success: true,
            data: parsedData
          }
        } else {
          return {
            success: false,
            error: 'Could not parse AI response'
          }
        }
      } catch (error) {
        console.error('Error parsing Tafsir response:', error)
        return {
          success: false,
          error: 'Failed to parse AI response'
        }
      }
    }
    
    return response
  }
}

export const aiService = new AIService()

// Export specific functions for easy import
export const generateIslamicNames = (gender: 'male' | 'female', style: string, language: string, count?: number) =>
  aiService.generateIslamicNames(gender, style, language, count)

export const generateIslamicStory = (ageGroup: string, theme: string, language: string, situation?: string) =>
  aiService.generateIslamicStory(ageGroup, theme, language, situation)

export const generateTafsir = (surah: string, verseRange: string, language: string, level: string) =>
  aiService.generateTafsir(surah, verseRange, language, level)

export const generateTafsirExplanation = (enhancedPrompt: string, language: string, level: string) =>
  aiService.generateTafsirExplanation(enhancedPrompt, language, level)

export const generateSimpleResponse = (prompt: string, language: string) =>
  aiService.generateSimpleResponse(prompt, language)

export const generateDua = (category: string, language: string, situation?: string) =>
  aiService.generateDua(category, language, situation)

export const translateContent = (content: string, fromLanguage: string, toLanguage: string, contentType: 'ui' | 'religious') =>
  aiService.translateContent(content, fromLanguage, toLanguage, contentType)

export default aiService