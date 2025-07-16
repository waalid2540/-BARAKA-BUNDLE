// Quran 30for30 Life Lessons Data
// Comprehensive reflection database for spiritual growth

export interface LifeLessonReflection {
  day: number
  title: string
  verse: string
  surah: string
  ayah: number
  arabicText: string
  translation: string
  lifeLesson: string
  personalReflection: string
  contemporaryApplication: string
  journalingQuestions: string[]
  actionSteps: string[]
  spiritualInsight: string
  category: string
}

export const quranLifeLessons: LifeLessonReflection[] = [
  {
    day: 1,
    title: "The Power of Patience",
    verse: "2:153",
    surah: "Al-Baqarah",
    ayah: 153,
    arabicText: "يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ",
    translation: "O you who believe! Seek help through patience and prayer. Indeed, Allah is with the patient.",
    lifeLesson: "Patience is not passive waiting, but active trust in Allah's timing and wisdom.",
    personalReflection: "When life feels overwhelming, patience and prayer become your spiritual anchors that connect you to Allah's infinite mercy.",
    contemporaryApplication: "In our instant gratification culture, this verse teaches us that the best outcomes often require patient perseverance and consistent du'a.",
    journalingQuestions: [
      "How can I transform my impatience into trust in Allah's perfect timing?",
      "What current challenge is teaching me the value of patience?",
      "How has prayer helped me through difficult waiting periods?"
    ],
    actionSteps: [
      "Practice the 'pause before reaction' - take a breath and make istighfar when feeling impatient",
      "Set aside 5 minutes daily for patient reflection and du'a",
      "Identify one area where you can practice more patience this week"
    ],
    spiritualInsight: "Allah's companionship with the patient reminds us that we're never alone in our struggles - patience is a form of worship that draws us closer to Him.",
    category: "Patience"
  },
  {
    day: 2,
    title: "Gratitude Transforms Hearts",
    verse: "14:7",
    surah: "Ibrahim",
    ayah: 7,
    arabicText: "وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ",
    translation: "And when your Lord proclaimed: 'If you are grateful, I will certainly give you more.'",
    lifeLesson: "Gratitude is a magnet for Allah's blessings and a key to spiritual abundance.",
    personalReflection: "Every 'Alhamdulillah' opens the door to recognizing Allah's countless favors and transforms your perspective from lack to abundance.",
    contemporaryApplication: "In a world focused on what we don't have, gratitude redirects our attention to Allah's continuous gifts, bringing peace and contentment.",
    journalingQuestions: [
      "What are three blessings I often take for granted?",
      "How has expressing gratitude changed my relationship with Allah?",
      "What would change if I approached each day with a grateful heart?"
    ],
    actionSteps: [
      "Start a daily gratitude journal with 3 specific things you're thankful for",
      "Replace one complaint each day with a statement of gratitude",
      "Make du'a thanking Allah for blessings you usually overlook"
    ],
    spiritualInsight: "Allah's promise to increase blessings for the grateful reveals that gratitude itself is a form of worship that multiplies divine mercy in our lives.",
    category: "Gratitude"
  },
  {
    day: 3,
    title: "Trust in Allah's Plan",
    verse: "2:286",
    surah: "Al-Baqarah", 
    ayah: 286,
    arabicText: "لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا",
    translation: "Allah does not burden a soul beyond that it can bear.",
    lifeLesson: "Every challenge you face is within your capacity to handle with Allah's help - you are stronger than you think.",
    personalReflection: "When overwhelmed, remember that Allah knows your limits better than you do, and He has equipped you with everything needed for this moment.",
    contemporaryApplication: "In times of stress, anxiety, or feeling inadequate, this verse reminds us that Allah has already measured our capacity and won't exceed it.",
    journalingQuestions: [
      "What current burden can I surrender more fully to Allah?",
      "How have past challenges revealed inner strength I didn't know I had?",
      "Where do I need to trust Allah's wisdom over my own understanding?"
    ],
    actionSteps: [
      "When feeling overwhelmed, recite this verse and take three deep breaths",
      "Identify one worry you can release to Allah today through du'a",
      "Reflect on a past difficulty that revealed your hidden strength"
    ],
    spiritualInsight: "Allah's perfect knowledge of our capacity means every test is also a testament to our potential - He believes in us even when we don't believe in ourselves.",
    category: "Trust"
  },
  {
    day: 4,
    title: "The Mercy of Forgiveness",
    verse: "39:53",
    surah: "Az-Zumar",
    ayah: 53,
    arabicText: "قُلْ يَا عِبَادِيَ الَّذِينَ أَسْرَفُوا عَلَىٰ أَنفُسِهِمْ لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ",
    translation: "Say: 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah.'",
    lifeLesson: "No sin is too great for Allah's forgiveness when approached with sincere repentance and hope.",
    personalReflection: "Allah's mercy is greater than any mistake you've made - despair is not from Allah, but hope and seeking forgiveness always is.",
    contemporaryApplication: "In a world that often defines us by our worst moments, Allah offers infinite chances for redemption and spiritual renewal.",
    journalingQuestions: [
      "What past mistake am I ready to fully release to Allah's mercy?",
      "How can I extend the same forgiveness to myself that Allah offers?",
      "What would change if I truly believed Allah's mercy exceeds all sins?"
    ],
    actionSteps: [
      "Make sincere tawbah for something that has been weighing on your heart",
      "Practice self-forgiveness by replacing self-criticism with istighfar",
      "Forgive someone who has wronged you, seeking Allah's mercy for both of you"
    ],
    spiritualInsight: "Allah's invitation to never despair reveals that mercy, not judgment, is His default response to our human struggles - despair itself becomes a barrier to receiving His infinite grace.",
    category: "Forgiveness"
  },
  {
    day: 5,
    title: "Seeking Divine Guidance",
    verse: "1:6",
    surah: "Al-Fatiha",
    ayah: 6,
    arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    translation: "Guide us to the straight path.",
    lifeLesson: "Asking for guidance is not a sign of weakness but wisdom - even the most faithful need Allah's constant direction.",
    personalReflection: "Every decision, big or small, becomes an opportunity to seek Allah's guidance and align your path with His pleasure.",
    contemporaryApplication: "In a world of endless choices and conflicting advice, turning to Allah for guidance provides clarity and spiritual confidence.",
    journalingQuestions: [
      "What decision am I currently facing that needs Allah's guidance?",
      "How can I make seeking guidance a daily habit rather than a crisis response?",
      "When have I experienced clear guidance from Allah in my life?"
    ],
    actionSteps: [
      "Start each day asking Allah to guide your decisions and interactions",
      "Before major decisions, perform istikharah prayer",
      "Create a habit of asking 'What would please Allah?' before acting"
    ],
    spiritualInsight: "The fact that we recite this du'a in every prayer shows that guidance is not a one-time gift but a continuous need - spiritual growth requires ongoing divine direction.",
    category: "Guidance"
  }
]

// Helper functions for accessing reflections
export const getReflectionByDay = (day: number): LifeLessonReflection | undefined => {
  return quranLifeLessons.find(lesson => lesson.day === day)
}

export const getReflectionsByCategory = (category: string): LifeLessonReflection[] => {
  return quranLifeLessons.filter(lesson => 
    lesson.category.toLowerCase() === category.toLowerCase()
  )
}

export const getAllCategories = (): string[] => {
  return [...new Set(quranLifeLessons.map(lesson => lesson.category))]
}

export const getRandomReflection = (): LifeLessonReflection => {
  const randomIndex = Math.floor(Math.random() * quranLifeLessons.length)
  return quranLifeLessons[randomIndex]
}