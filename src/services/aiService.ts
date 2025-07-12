// AI Service for Baraka Bundle Islamic AI Tools
// Integrates with OpenAI GPT-4 for authentic Islamic content generation
// Enhanced with Tafsir As-Saadi integration

import { API_CONFIG } from './config'

// Try multiple ways to get API key
const OPENAI_API_KEY = 
  process.env.REACT_APP_OPENAI_API_KEY || 
  // @ts-ignore - Import from config if available
  (window as any).OPENAI_API_KEY ||
  // Production config
  API_CONFIG.OPENAI_API_KEY ||
  // Fallback for production
  import.meta.env.VITE_OPENAI_API_KEY ||
  ''

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
      model: 'gpt-4o-mini',
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
      model: 'gpt-4o-mini',
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
      model: 'gpt-4o-mini',
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
      model: 'gpt-4o-mini',
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
      model: 'gpt-4o-mini',
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
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Dr. Ahmad, a respected Islamic scholar specializing in Quranic commentary and Tafsir As-Saadi. You provide professional, scholarly responses in ${language}. Keep responses concise (under 150 words), authoritative, and respectful. Always maintain academic tone while being accessible.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 300
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
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an Islamic scholar with deep knowledge of Quranic commentary, especially Tafsir As-Saadi by Sheikh Abdurrahman As-Saadi. When provided with authentic Tafsir As-Saadi content, base your explanations on that foundation while adding contemporary applications. Maintain scholarly accuracy and respect for traditional Islamic interpretation.

Response should be in ${language} and appropriate for ${level} level understanding.

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
      temperature: 0.2, // Very low for religious accuracy
      max_tokens: 4000
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