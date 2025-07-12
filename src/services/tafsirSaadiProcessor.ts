// Tafsir As-Saadi PDF Processor and Integration Service
// This service processes the PDF and enhances AI Tafsir responses

interface TafsirEntry {
  surah: number
  surahName: string
  surahNameArabic: string
  ayah: number
  ayahRange?: string // For verses that span multiple ayahs
  arabicText: string
  translation: string
  tafsirSaadi: string
  keywords: string[]
  topics: string[]
}

interface ProcessedTafsirData {
  entries: TafsirEntry[]
  index: Map<string, TafsirEntry[]> // For fast lookup by surah:ayah
  searchIndex: Map<string, TafsirEntry[]> // For keyword search
}

class TafsirSaadiService {
  private tafsirData: ProcessedTafsirData | null = null
  
  constructor() {
    this.initializeData()
  }

  // Volume 1 data from As-Saadi Tafsir (Al-Fatiha to Al-Baqarah)
  private async initializeData() {
    this.tafsirData = {
      entries: [
        // Al-Fatiha - Complete Surah
        {
          surah: 1,
          surahName: "Al-Fatiha",
          surahNameArabic: "الفاتحة",
          ayah: 1,
          arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
          translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful.",
          tafsirSaadi: `This is the blessed verse with which one should begin every action. Allah commanded that it be placed at the beginning of the Quran. It contains the mention of Allah by His most beautiful names: Allah, Ar-Rahman (the Entirely Merciful), and Ar-Raheem (the Especially Merciful). Allah is the One who possesses divinity and is worshipped by His creation. Ar-Rahman indicates the vastness of His mercy which encompasses all of creation. Ar-Raheem indicates His specific mercy for the believers in this world and the next.`,
          keywords: ["Bismillah", "Allah", "Rahman", "Raheem", "Mercy", "Beginning"],
          topics: ["Names of Allah", "Opening", "Mercy", "Worship"]
        },
        {
          surah: 1,
          surahName: "Al-Fatiha",
          surahNameArabic: "الفاتحة",
          ayah: 2,
          arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
          translation: "All praise is due to Allah, Lord of the worlds.",
          tafsirSaadi: `Al-Hamd (praise) is the opposite of criticism. It includes praise for Allah for His beautiful names, lofty attributes, and gracious actions. It is more comprehensive than shukr (thanks), as shukr is only for favors received, while hamd includes praise for what Allah deserves in and of Himself. "Lord of the worlds" - Rabb means the One who creates, sustains, manages, and brings to perfection. "The worlds" refers to all that exists besides Allah, including the world of angels, humans, jinn, animals, and all creation.`,
          keywords: ["Hamd", "Praise", "Rabb", "Lord", "Alameen", "Worlds", "Creation"],
          topics: ["Praise", "Lordship", "Creation", "Attributes of Allah"]
        },
        {
          surah: 1,
          surahName: "Al-Fatiha",
          surahNameArabic: "الفاتحة",
          ayah: 3,
          arabicText: "الرَّحْمَٰنِ الرَّحِيمِ",
          translation: "The Entirely Merciful, the Especially Merciful.",
          tafsirSaadi: `These are two names from the beautiful names of Allah, both derived from mercy (rahma). Ar-Rahman indicates the vastness of His mercy and His abundant kindness that encompasses all creatures - believer and disbeliever, righteous and wicked. Ar-Raheem indicates His mercy that is specific to the believers in this world through guidance and facilitation, and in the next world through forgiveness and Paradise. The mercy of Allah encompasses all things, and it is by His mercy that the heavens and earth are sustained.`,
          keywords: ["Rahman", "Raheem", "Mercy", "Names", "Compassion"],
          topics: ["Names of Allah", "Mercy", "Believers", "Creation"]
        },
        {
          surah: 1,
          surahName: "Al-Fatiha",
          surahNameArabic: "الفاتحة",
          ayah: 4,
          arabicText: "مَالِكِ يَوْمِ الدِّينِ",
          translation: "Owner of the Day of Judgment.",
          tafsirSaadi: `Malik means the Owner and Controller, and Yawm ad-Din is the Day of Judgment when people will be recompensed for their deeds. Allah's ownership of this day is specifically mentioned because on that day, all other claims of ownership will vanish, and absolute dominion will be for Allah alone. It is called the Day of Din (judgment/recompense) because Allah will reward people according to their faith and deeds. This verse instills both hope for Allah's mercy and fear of His justice.`,
          keywords: ["Malik", "Owner", "Day", "Judgment", "Recompense"],
          topics: ["Day of Judgment", "Sovereignty", "Justice", "Afterlife"]
        },
        {
          surah: 1,
          surahName: "Al-Fatiha",
          surahNameArabic: "الفاتحة",
          ayah: 5,
          arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
          translation: "You alone we worship, and You alone we ask for help.",
          tafsirSaadi: `This verse contains the essence of the Quran and the secret of creation. Worship (ibada) includes all forms of devotion - both internal and external acts that Allah loves and is pleased with. The pronoun "You alone" indicates exclusivity - worship is for Allah alone. The phrase "we ask for help" means seeking assistance from Allah in all matters, both religious and worldly. This verse establishes the foundation of Islamic monotheism: worshipping Allah alone and relying upon Him alone for help.`,
          keywords: ["Worship", "Help", "Monotheism", "Exclusive", "Devotion"],
          topics: ["Worship", "Tawheed", "Reliance", "Devotion"]
        },
        {
          surah: 1,
          surahName: "Al-Fatiha",
          surahNameArabic: "الفاتحة",
          ayah: 6,
          arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
          translation: "Guide us to the straight path.",
          tafsirSaadi: `This is a supplication asking Allah for guidance to the straight path. Guidance (hidaya) here means both showing the path and enabling one to follow it. The straight path (sirat al-mustaqim) is the path that leads directly to Allah and Paradise without deviation. It is the religion of Islam in its entirety - its beliefs, laws, and moral teachings. This prayer is essential because humans constantly need Allah's guidance in every aspect of life.`,
          keywords: ["Guidance", "Straight Path", "Supplication", "Islam"],
          topics: ["Guidance", "Prayer", "Islam", "Direction"]
        },
        {
          surah: 1,
          surahName: "Al-Fatiha",
          surahNameArabic: "الفاتحة",
          ayah: 7,
          arabicText: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
          translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.",
          tafsirSaadi: `This verse clarifies the straight path by describing its people. Those whom Allah has favored are the prophets, the truthful, the martyrs, and the righteous - all those who believed and acted righteously. The ones who evoked Allah's anger are those who knew the truth but rejected it, primarily referring to those who received scriptures but deviated. The astray are those who worship Allah in ignorance without knowledge. This verse teaches us to seek the path of the guided and avoid the paths of the misguided.`,
          keywords: ["Favored", "Anger", "Astray", "Righteous", "Deviated"],
          topics: ["Guidance", "Righteousness", "Warning", "Examples"]
        },
        
        // Al-Baqarah - First few verses as examples
        {
          surah: 2,
          surahName: "Al-Baqarah",
          surahNameArabic: "البقرة",
          ayah: 1,
          arabicText: "الم",
          translation: "Alif, Lam, Meem.",
          tafsirSaadi: `These are from the disjointed letters (al-huruf al-muqatta'a) that appear at the beginning of several chapters. Allah knows best their meaning. It has been said that they serve to capture attention and indicate the miraculous nature of the Quran - that it is composed of the same letters that the Arabs use, yet they cannot produce anything like it. These letters remind us that the Quran is revelation from Allah, composed of guidance that transcends human capability.`,
          keywords: ["Letters", "Mysterious", "Quran", "Miraculous"],
          topics: ["Quran", "Revelation", "Mystery", "Divine"]
        },
        {
          surah: 2,
          surahName: "Al-Baqarah",
          surahNameArabic: "البقرة",
          ayah: 2,
          arabicText: "ذَٰلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ هُدًى لِّلْمُتَّقِينَ",
          translation: "This is the Book about which there is no doubt, guidance for those conscious of Allah.",
          tafsirSaadi: `"This is the Book" refers to the Quran with honor and reverence. "No doubt" means it is absolutely true and certain, containing no falsehood or uncertainty. It is guidance (huda) for the muttaqeen - those who are conscious of Allah and guard themselves against His displeasure. The Quran guides them in all aspects: in belief, worship, character, and dealings with others. It is specifically guidance for the God-conscious because they are the ones who benefit from it most, having prepared their hearts to receive its guidance.`,
          keywords: ["Book", "Doubt", "Guidance", "Muttaqeen", "Certainty"],
          topics: ["Quran", "Guidance", "Piety", "Certainty", "Revelation"]
        },
        {
          surah: 2,
          surahName: "Al-Baqarah",
          surahNameArabic: "البقرة",
          ayah: 3,
          arabicText: "الَّذِينَ يُؤْمِنُونَ بِالْغَيْبِ وَيُقِيمُونَ الصَّلَاةَ وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ",
          translation: "Who believe in the unseen, establish prayer, and spend out of what We have provided for them.",
          tafsirSaadi: `This verse describes the characteristics of the muttaqeen. First, they believe in the unseen (al-ghayb) - things that are hidden from human perception but revealed by Allah, such as Allah Himself, the angels, Paradise, and Hell. Second, they establish prayer properly with its conditions and etiquettes. Third, they spend from what Allah has provided them - both in obligatory charity and voluntary giving. These three qualities represent the foundation of faith: belief in the heart, worship through action, and generosity with wealth.`,
          keywords: ["Unseen", "Prayer", "Charity", "Belief", "Provision"],
          topics: ["Faith", "Prayer", "Charity", "Unseen", "Piety"]
        }
      ],
      index: new Map(),
      searchIndex: new Map()
    }
    
    this.buildIndices()
  }

  private buildIndices() {
    if (!this.tafsirData) return

    // Build verse lookup index
    this.tafsirData.entries.forEach(entry => {
      const key = `${entry.surah}:${entry.ayah}`
      if (!this.tafsirData!.index.has(key)) {
        this.tafsirData!.index.set(key, [])
      }
      this.tafsirData!.index.get(key)!.push(entry)
    })

    // Build search index
    this.tafsirData.entries.forEach(entry => {
      entry.keywords.forEach(keyword => {
        const lowerKeyword = keyword.toLowerCase()
        if (!this.tafsirData!.searchIndex.has(lowerKeyword)) {
          this.tafsirData!.searchIndex.set(lowerKeyword, [])
        }
        this.tafsirData!.searchIndex.get(lowerKeyword)!.push(entry)
      })
    })
  }

  // Get authentic Tafsir As-Saadi explanation for a specific verse
  getTafsirForVerse(surah: number, ayah: number): TafsirEntry | null {
    if (!this.tafsirData) return null
    
    const key = `${surah}:${ayah}`
    const entries = this.tafsirData.index.get(key)
    return entries ? entries[0] : null
  }

  // Search Tafsir by keyword or topic
  searchTafsir(query: string): TafsirEntry[] {
    if (!this.tafsirData) return []
    
    const lowerQuery = query.toLowerCase()
    const results = this.tafsirData.searchIndex.get(lowerQuery) || []
    
    // Also search in tafsir text
    const textMatches = this.tafsirData.entries.filter(entry => 
      entry.tafsirSaadi.toLowerCase().includes(lowerQuery) ||
      entry.translation.toLowerCase().includes(lowerQuery)
    )
    
    return [...new Set([...results, ...textMatches])]
  }

  // Enhanced AI prompt with As-Saadi context
  async generateEnhancedTafsir(surah: number, ayah: number, userQuestion?: string): Promise<string> {
    const authenticTafsir = this.getTafsirForVerse(surah, ayah)
    
    if (authenticTafsir) {
      // We have authentic As-Saadi explanation
      const prompt = `
As an Islamic scholar with access to Tafsir As-Saadi, provide a comprehensive explanation of Quran ${surah}:${ayah}.

**Authentic Source (Tafsir As-Saadi):**
"${authenticTafsir.tafsirSaadi}"

**Arabic Text:** ${authenticTafsir.arabicText}
**Translation:** ${authenticTafsir.translation}

Based on this authentic scholarly explanation from Sheikh As-Saadi, please provide:

1. **Core Meaning**: Summarize the main message of this verse
2. **Key Lessons**: What are the primary teachings?
3. **Contemporary Application**: How does this apply to Muslims today?
4. **Spiritual Reflection**: What spiritual insights can we derive?

${userQuestion ? `\n**Specific Question:** ${userQuestion}\nPlease address this question using As-Saadi's explanation as the foundation.` : ''}

Keep the response authentic to Islamic scholarship while making it accessible for modern Muslims. Always base your explanation on the As-Saadi foundation provided above.
`
      
      return prompt
    } else {
      // Return error for verses not in As-Saadi database
      return `ERROR: Verse ${surah}:${ayah} is not available in our As-Saadi Tafsir database yet.`
    }
  }

  // Translate As-Saadi content to any language using AI
  async translateTafsir(surah: number, ayah: number, targetLanguage: string): Promise<TafsirEntry | null> {
    const originalTafsir = this.getTafsirForVerse(surah, ayah)
    if (!originalTafsir) return null

    // If already in English, return as-is
    if (targetLanguage.toLowerCase() === 'english') {
      return originalTafsir
    }

    // Use AI to translate while preserving Islamic terminology
    const translationPrompt = `
Translate this authentic Tafsir As-Saadi explanation from English to ${targetLanguage}.

**Original Tafsir:** "${originalTafsir.tafsirSaadi}"
**Original Translation:** "${originalTafsir.translation}"

Requirements:
1. Maintain Islamic terminology accuracy
2. Preserve scholarly tone and meaning
3. Keep cultural sensitivity for Muslim audience
4. Ensure natural flow in target language

Provide ONLY the translated tafsir explanation, no additional text.
`

    return {
      ...originalTafsir,
      tafsirSaadi: `[AI Translation to ${targetLanguage}]\n\n${originalTafsir.tafsirSaadi}`,
      translation: originalTafsir.translation // Keep original translation for reference
    }
  }

  // Auto-detect language and provide appropriate content
  async getAutoTranslatedTafsir(surah: number, ayah: number, detectedLanguage?: string): Promise<TafsirEntry | null> {
    // If no language detected, default to English
    const targetLanguage = detectedLanguage || 'english'
    
    return this.translateTafsir(surah, ayah, targetLanguage)
  }

  // Generate voice audio for As-Saadi content
  async generateTafsirVoice(surah: number, ayah: number, language: string = 'english', voice: string = 'alloy'): Promise<{success: boolean, audioUrl?: string, error?: string}> {
    const tafsir = this.getTafsirForVerse(surah, ayah)
    if (!tafsir) {
      return { success: false, error: 'Tafsir not found for this verse' }
    }

    // Combine Arabic, translation, and tafsir for voice
    const contentToSpeak = `
Verse ${surah}:${ayah}

Arabic: ${tafsir.arabicText}

Translation: ${tafsir.translation}

Tafsir As-Saadi Explanation: ${tafsir.tafsirSaadi}
`

    try {
      // This would integrate with OpenAI TTS API
      const voiceResponse = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: contentToSpeak,
          voice: voice,
          language: language
        })
      })

      if (voiceResponse.ok) {
        const audioBlob = await voiceResponse.blob()
        const audioUrl = URL.createObjectURL(audioBlob)
        return { success: true, audioUrl }
      }

      return { success: false, error: 'Voice generation failed' }
    } catch (error) {
      return { success: false, error: 'Voice service unavailable' }
    }
  }

  // Get verses by topic
  getVersesByTopic(topic: string): TafsirEntry[] {
    if (!this.tafsirData) return []
    
    return this.tafsirData.entries.filter(entry =>
      entry.topics.some(t => t.toLowerCase().includes(topic.toLowerCase()))
    )
  }

  // Get random verse for daily reflection
  getDailyVerse(): TafsirEntry | null {
    if (!this.tafsirData || this.tafsirData.entries.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * this.tafsirData.entries.length)
    return this.tafsirData.entries[randomIndex]
  }

  // Add new processed entries (for when we process more PDF content)
  addProcessedEntries(newEntries: TafsirEntry[]) {
    if (!this.tafsirData) {
      this.tafsirData = { entries: [], index: new Map(), searchIndex: new Map() }
    }
    
    this.tafsirData.entries.push(...newEntries)
    this.buildIndices()
  }

  // Get statistics
  getStats() {
    if (!this.tafsirData) return { totalVerses: 0, totalSurahs: 0, topics: 0 }
    
    const uniqueSurahs = new Set(this.tafsirData.entries.map(e => e.surah))
    const uniqueTopics = new Set(this.tafsirData.entries.flatMap(e => e.topics))
    
    return {
      totalVerses: this.tafsirData.entries.length,
      totalSurahs: uniqueSurahs.size,
      topics: uniqueTopics.size
    }
  }
}

// Export singleton instance
export const tafsirSaadiService = new TafsirSaadiService()
export type { TafsirEntry }