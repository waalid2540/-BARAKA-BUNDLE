// AI Service for Baraka Bundle Islamic AI Tools
// Integrates with OpenAI GPT-4 for authentic Islamic content generation

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || ''
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
      model: 'gpt-4',
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
    const prompt = `Create an Islamic story for children aged ${ageGroup} with the theme "${theme}".
    ${situation ? `Specific situation: ${situation}` : ''}
    
    Provide response in ${language} language with the following JSON format:
    {
      "title": "Story title in ${language}",
      "arabicTitle": "العنوان بالعربية",
      "content": "Full story content appropriate for age ${ageGroup} in ${language}",
      "ageGroup": "${ageGroup}",
      "moralLesson": "Key moral lesson in ${language}",
      "characters": ["List of main characters in ${language}"],
      "theme": "${theme}"
    }
    
    Ensure the story:
    - Is age-appropriate for ${ageGroup} year olds
    - Contains authentic Islamic teachings
    - Has clear moral lessons
    - Is engaging and educational
    - Respects Islamic values and traditions
    - Is culturally sensitive for global Muslim audience`

    const payload = {
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an Islamic educator and storyteller expert in creating age-appropriate Islamic content for children. Your stories should be authentic, educational, and engaging while maintaining Islamic values.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 3000
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
      model: 'gpt-4',
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
      model: 'gpt-4',
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
      model: 'gpt-4',
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
}

export const aiService = new AIService()
export default aiService