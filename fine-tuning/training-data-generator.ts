// Fine-tuning Training Data Generator for As-Saadi Tafsir
// This generates conversation pairs for OpenAI fine-tuning

import { tafsirSaadiService } from '../src/services/tafsirSaadiProcessor'

interface TrainingExample {
  messages: Array<{
    role: 'system' | 'user' | 'assistant'
    content: string
  }>
}

class AsSaadiTrainingGenerator {
  
  // Generate training examples from As-Saadi database
  generateTrainingData(): TrainingExample[] {
    const trainingExamples: TrainingExample[] = []
    
    // System message that defines As-Saadi style
    const systemMessage = `You are Sheikh Abdurrahman As-Saadi, the renowned Islamic scholar and mufassir. You explain Quranic verses with:

1. Clear, accessible language that ordinary Muslims can understand
2. Focus on practical guidance and spiritual benefits
3. Emphasis on Allah's names, attributes, and wisdom
4. Contemporary applications without deviating from classical understanding
5. Concise yet comprehensive explanations
6. Connection between verses and daily Muslim life

Respond exactly as As-Saadi would - wise, clear, practical, and spiritually uplifting.`

    // Get all available As-Saadi entries
    const entries = this.getAllAsSaadiEntries()
    
    entries.forEach(entry => {
      // Generate multiple question types for each verse
      const questionVariations = this.generateQuestionVariations(entry)
      
      questionVariations.forEach(question => {
        const trainingExample: TrainingExample = {
          messages: [
            {
              role: 'system',
              content: systemMessage
            },
            {
              role: 'user', 
              content: question
            },
            {
              role: 'assistant',
              content: this.generateAsSaadiStyleResponse(entry, question)
            }
          ]
        }
        trainingExamples.push(trainingExample)
      })
    })
    
    return trainingExamples
  }
  
  // Get all As-Saadi entries from the database
  private getAllAsSaadiEntries() {
    // This would get all entries from tafsirSaadiService
    return [
      // Al-Fatiha entries
      { surah: 1, ayah: 1, surahName: 'Al-Fatiha', arabicText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', tafsirSaadi: 'This is the blessed verse with which one should begin every action. Allah commanded that it be placed at the beginning of the Quran. It contains the mention of Allah by His most beautiful names: Allah, Ar-Rahman (the Entirely Merciful), and Ar-Raheem (the Especially Merciful). Allah is the One who possesses divinity and is worshipped by His creation. Ar-Rahman indicates the vastness of His mercy which encompasses all of creation. Ar-Raheem indicates His specific mercy for the believers in this world and the next.' },
      // Add all other entries...
    ]
  }
  
  // Generate different question variations for each verse
  private generateQuestionVariations(entry: any): string[] {
    const variations = [
      // Direct verse questions
      `Explain ${entry.surahName} ${entry.surah}:${entry.ayah}`,
      `What does "${entry.translation}" mean?`,
      `Tell me about the verse "${entry.arabicText}"`,
      
      // Contextual questions
      `What is the significance of this verse in ${entry.surahName}?`,
      `How should we understand the meaning of "${entry.translation}"?`,
      `What practical guidance does this ayah give us?`,
      
      // Thematic questions based on content
      ...(entry.ayah === 1 && entry.surah === 1 ? [
        'Explain Bismillah',
        'What does "In the name of Allah" mean?',
        'Why do we start with Bismillah?',
        'Tell me about Allah\'s mercy in Bismillah'
      ] : []),
      
      ...(entry.ayah === 2 && entry.surah === 1 ? [
        'What does "All praise is due to Allah" mean?',
        'Explain "Lord of the worlds"',
        'What is the meaning of Hamd?'
      ] : []),
      
      // Contemporary application questions
      `How does this verse apply to modern Muslim life?`,
      `What can we learn from this ayah today?`,
      `How should this verse guide our daily actions?`
    ]
    
    return variations
  }
  
  // Generate As-Saadi style responses
  private generateAsSaadiStyleResponse(entry: any, question: string): string {
    // Create response in As-Saadi's characteristic style
    let response = ''
    
    // Start with acknowledgment
    if (question.toLowerCase().includes('bismillah') || entry.ayah === 1) {
      response = `This blessed verse contains the essence of Allah's mercy and guidance. `
    } else {
      response = `This noble verse teaches us important principles for our faith and practice. `
    }
    
    // Add As-Saadi's actual explanation
    response += entry.tafsirSaadi
    
    // Add contemporary application in As-Saadi style
    response += this.generateContemporaryApplication(entry, question)
    
    return response
  }
  
  // Generate contemporary applications in As-Saadi style
  private generateContemporaryApplication(entry: any, question: string): string {
    const applications = {
      1: { // Al-Fatiha
        1: '\n\nTherefore, the believer should begin every significant action by invoking Allah\'s name, seeking His blessing and guidance. This reminds us that all success comes from Allah alone, and helps purify our intentions.',
        2: '\n\nThis teaches us to always acknowledge Allah as the source of all good, to be grateful for His countless blessings, and to remember that He alone deserves our worship and submission.',
        3: '\n\nReflecting on Allah\'s mercy should increase our hope in His forgiveness, encourage us to seek His mercy through righteous deeds, and remind us to show mercy to others as Allah shows mercy to us.',
        4: '\n\nThis verse reminds us that we will all face judgment, encouraging us to prepare through good deeds, seeking forgiveness, and living according to Allah\'s guidance.',
        5: '\n\nThis establishes the foundation of our relationship with Allah - worship Him alone and rely on Him alone. In all our affairs, we should turn to Allah for help and guidance.',
        6: '\n\nThis daily supplication reminds us to constantly seek Allah\'s guidance in every aspect of life, making it a regular part of our prayers and daily remembrance.',
        7: '\n\nThis teaches us to follow the example of the righteous and avoid the paths of those who went astray, constantly evaluating our actions against the standard of the Quran and Sunnah.'
      },
      2: { // Al-Baqarah
        1: '\n\nThese letters remind us of the miraculous nature of the Quran and that Allah\'s knowledge encompasses all things, encouraging us to approach the Quran with humility and wonder.',
        2: '\n\nThis should increase our certainty in the Quran\'s guidance and motivate us to study it regularly, implement its teachings, and share its wisdom with others.',
        3: '\n\nThis verse encourages us to strengthen our faith in the unseen, maintain regular prayer, and be generous with our wealth for Allah\'s sake.'
      }
    }
    
    return applications[entry.surah]?.[entry.ayah] || '\n\nMay Allah help us implement this guidance in our daily lives and increase us in understanding of His Book.'
  }
  
  // Export training data in OpenAI format
  exportForOpenAI(examples: TrainingExample[]): string {
    return examples.map(example => JSON.stringify(example)).join('\n')
  }
  
  // Generate comprehensive training dataset
  async generateFullTrainingSet(): Promise<string> {
    console.log('🚀 Generating As-Saadi fine-tuning training data...')
    
    const trainingData = this.generateTrainingData()
    console.log(`📊 Generated ${trainingData.length} training examples`)
    
    const openAIFormat = this.exportForOpenAI(trainingData)
    console.log('✅ Training data ready for OpenAI fine-tuning')
    
    return openAIFormat
  }
}

export const asSaadiTrainingGenerator = new AsSaadiTrainingGenerator()