// Voice and Translation Service for Baraka Bundle
// Integrates with OpenAI Text-to-Speech and ElevenLabs for voice generation

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || ''
const ELEVENLABS_API_KEY = process.env.REACT_APP_ELEVENLABS_API_KEY || ''

interface VoiceOptions {
  text: string
  language: string
  voice?: 'male' | 'female' | 'child'
  speed?: number
}

interface TranslationRequest {
  text: string
  fromLanguage: string
  toLanguage: string
  contentType: 'story' | 'dua' | 'tafsir' | 'name'
}

class VoiceService {
  // OpenAI Text-to-Speech voices for different languages
  private voiceMapping = {
    english: { male: 'onyx', female: 'nova', child: 'shimmer' },
    arabic: { male: 'onyx', female: 'nova', child: 'shimmer' },
    turkish: { male: 'onyx', female: 'nova', child: 'shimmer' },
    indonesian: { male: 'onyx', female: 'nova', child: 'shimmer' },
    urdu: { male: 'onyx', female: 'nova', child: 'shimmer' },
    persian: { male: 'onyx', female: 'nova', child: 'shimmer' },
    bengali: { male: 'onyx', female: 'nova', child: 'shimmer' },
    malay: { male: 'onyx', female: 'nova', child: 'shimmer' },
    french: { male: 'onyx', female: 'nova', child: 'shimmer' },
    german: { male: 'onyx', female: 'nova', child: 'shimmer' }
  }

  async generateVoiceOver(options: VoiceOptions): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
    try {
      if (!OPENAI_API_KEY) {
        return this.generateBrowserTTS(options)
      }

      // Use OpenAI TTS for high-quality voice generation
      const voice = this.voiceMapping[options.language as keyof typeof this.voiceMapping]?.[options.voice || 'female'] || 'nova'
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: options.text,
          voice: voice,
          speed: options.speed || 1.0
        })
      })

      if (!response.ok) {
        throw new Error(`OpenAI TTS error: ${response.status}`)
      }

      const audioBlob = await response.blob()
      const audioUrl = URL.createObjectURL(audioBlob)
      
      return { success: true, audioUrl }
    } catch (error) {
      console.error('Voice generation error:', error)
      // Fallback to browser TTS
      return this.generateBrowserTTS(options)
    }
  }

  private generateBrowserTTS(options: VoiceOptions): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve({ success: false, error: 'Text-to-speech not supported in this browser' })
        return
      }

      const utterance = new SpeechSynthesisUtterance(options.text)
      
      // Configure voice based on language and preferences
      const voices = speechSynthesis.getVoices()
      const preferredVoice = voices.find(voice => 
        voice.lang.toLowerCase().includes(options.language.substring(0, 2)) &&
        (options.voice === 'female' ? voice.name.toLowerCase().includes('female') : true)
      ) || voices.find(voice => voice.lang.startsWith('en'))

      if (preferredVoice) {
        utterance.voice = preferredVoice
      }

      utterance.rate = options.speed || 0.9
      utterance.pitch = options.voice === 'child' ? 1.2 : 1.0
      utterance.volume = 1.0

      utterance.onend = () => {
        resolve({ success: true, audioUrl: 'browser-tts' })
      }

      utterance.onerror = (error) => {
        resolve({ success: false, error: error.error })
      }

      speechSynthesis.speak(utterance)
    })
  }

  async translateContent(request: TranslationRequest): Promise<{ success: boolean; translation?: string; error?: string }> {
    try {
      if (!OPENAI_API_KEY) {
        return { success: false, error: 'Translation service not configured' }
      }

      const prompt = this.buildTranslationPrompt(request)

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are an expert translator specializing in Islamic content. Maintain religious accuracy and cultural sensitivity. Provide only the translation without additional text.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`)
      }

      const data = await response.json()
      const translation = data.choices?.[0]?.message?.content?.trim()

      if (!translation) {
        throw new Error('No translation received')
      }

      return { success: true, translation }
    } catch (error) {
      console.error('Translation error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Translation failed' }
    }
  }

  private buildTranslationPrompt(request: TranslationRequest): string {
    const contextualGuidance = {
      story: 'This is an Islamic children\'s story. Maintain the moral lessons and ensure age-appropriate language.',
      dua: 'This is a religious Islamic prayer (dua). Preserve the spiritual meaning and respectful tone.',
      tafsir: 'This is Quranic explanation (tafsir). Maintain scholarly accuracy and religious terminology.',
      name: 'This is about Islamic names and their meanings. Preserve the spiritual significance and cultural context.'
    }

    return `Translate the following ${request.contentType} from ${request.fromLanguage} to ${request.toLanguage}:

"${request.text}"

Guidelines:
- ${contextualGuidance[request.contentType]}
- Use appropriate Islamic terminology in the target language
- Maintain cultural sensitivity and religious accuracy
- Ensure natural flow in the target language
- For Arabic text, preserve transliteration accuracy if applicable

Provide only the translation:`
  }

  // Auto-detect and translate stories for kids
  async generateMultilingualStory(story: any, targetLanguages: string[]): Promise<{
    success: boolean
    translations?: { [key: string]: any }
    error?: string
  }> {
    try {
      const translations: { [key: string]: any } = {}
      
      for (const lang of targetLanguages) {
        if (lang === 'english') {
          translations[lang] = story
          continue
        }

        // Translate each part of the story
        const titleTranslation = await this.translateContent({
          text: story.title,
          fromLanguage: 'english',
          toLanguage: lang,
          contentType: 'story'
        })

        const contentTranslation = await this.translateContent({
          text: story.content,
          fromLanguage: 'english',
          toLanguage: lang,
          contentType: 'story'
        })

        const lessonTranslation = await this.translateContent({
          text: story.moralLesson,
          fromLanguage: 'english',
          toLanguage: lang,
          contentType: 'story'
        })

        if (titleTranslation.success && contentTranslation.success && lessonTranslation.success) {
          translations[lang] = {
            ...story,
            title: titleTranslation.translation,
            content: contentTranslation.translation,
            moralLesson: lessonTranslation.translation
          }
        } else {
          console.warn(`Translation failed for ${lang}`)
        }
      }

      return { success: true, translations }
    } catch (error) {
      console.error('Multilingual story generation error:', error)
      return { success: false, error: 'Failed to generate multilingual story' }
    }
  }

  // Generate voice-over for story in multiple languages
  async generateStoryVoiceOvers(story: any, languages: string[]): Promise<{
    success: boolean
    voiceOvers?: { [key: string]: string }
    error?: string
  }> {
    try {
      const voiceOvers: { [key: string]: string } = {}

      for (const lang of languages) {
        const voiceResult = await this.generateVoiceOver({
          text: story.content,
          language: lang,
          voice: 'female', // Gentle female voice for kids stories
          speed: 0.9 // Slightly slower for children
        })

        if (voiceResult.success && voiceResult.audioUrl) {
          voiceOvers[lang] = voiceResult.audioUrl
        }
      }

      return { success: true, voiceOvers }
    } catch (error) {
      console.error('Story voice-over generation error:', error)
      return { success: false, error: 'Failed to generate story voice-overs' }
    }
  }

  // Check if voice synthesis is available
  isVoiceAvailable(): boolean {
    return 'speechSynthesis' in window || !!OPENAI_API_KEY
  }

  // Get available voices for language selection
  getAvailableVoices(): { language: string; voices: string[] }[] {
    if (!('speechSynthesis' in window)) {
      return []
    }

    const voices = speechSynthesis.getVoices()
    const voicesByLanguage: { [key: string]: string[] } = {}

    voices.forEach(voice => {
      const lang = voice.lang.toLowerCase().substring(0, 2)
      if (!voicesByLanguage[lang]) {
        voicesByLanguage[lang] = []
      }
      voicesByLanguage[lang].push(voice.name)
    })

    return Object.entries(voicesByLanguage).map(([language, voiceNames]) => ({
      language,
      voices: voiceNames
    }))
  }

  // Stop current speech
  stopSpeech(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
  }

  // Pause/Resume speech
  pauseSpeech(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.pause()
    }
  }

  resumeSpeech(): void {
    if ('speechSynthesis' in window) {
      speechSynthesis.resume()
    }
  }
}

export const voiceService = new VoiceService()
export default voiceService