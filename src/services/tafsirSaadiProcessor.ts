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

  // Initialize with sample data from Volume 1 (Al-Fatiha to Al-Baqarah)
  private async initializeData() {
    // This will be populated with actual PDF data
    this.tafsirData = {
      entries: [
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
        }
        // More entries will be added as we process the PDF
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
      // Fallback for verses not yet processed
      const prompt = `
As an Islamic scholar, provide an authentic explanation of Quran ${surah}:${ayah}.

Please provide:
1. **Verse Context**: Historical and textual context
2. **Core Meaning**: Main message and teachings
3. **Contemporary Application**: How this applies to Muslims today
4. **Spiritual Reflection**: Personal and spiritual insights

${userQuestion ? `\n**Specific Question:** ${userQuestion}` : ''}

Base your explanation on classical Islamic scholarship and authentic sources. Keep it accessible for modern Muslims while maintaining scholarly accuracy.
`
      
      return prompt
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