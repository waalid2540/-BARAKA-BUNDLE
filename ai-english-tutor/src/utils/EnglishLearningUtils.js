// English Learning Utilities for CheckpointEnglish

export class EnglishLearningUtils {
  
  // Analyze user's English proficiency level
  static analyzeEnglishLevel(message) {
    const indicators = {
      beginner: {
        keywords: ['simple', 'basic', 'help', 'difficult', 'hard', 'don\'t understand'],
        grammar: /\b(me no|me want|very good|very bad)\b/i,
        vocabulary: ['good', 'bad', 'nice', 'like', 'want', 'need'],
        sentenceLength: 5
      },
      intermediate: {
        keywords: ['practice', 'improve', 'better', 'sometimes', 'usually'],
        grammar: /\b(I am|I have|I can|I will)\b/i,
        vocabulary: ['experience', 'opportunity', 'situation', 'important'],
        sentenceLength: 10
      },
      advanced: {
        keywords: ['sophisticated', 'nuanced', 'comprehensive', 'elaborate'],
        grammar: /\b(would have been|might have|could have)\b/i,
        vocabulary: ['furthermore', 'consequently', 'nevertheless', 'substantial'],
        sentenceLength: 15
      }
    };

    const words = message.toLowerCase().split(' ');
    const sentenceLength = words.length;
    
    let scores = {
      beginner: 0,
      intermediate: 0,
      advanced: 0
    };

    // Analyze based on different factors
    Object.keys(indicators).forEach(level => {
      const indicator = indicators[level];
      
      // Check keywords
      indicator.keywords.forEach(keyword => {
        if (message.toLowerCase().includes(keyword)) {
          scores[level] += 2;
        }
      });
      
      // Check vocabulary
      indicator.vocabulary.forEach(word => {
        if (words.includes(word)) {
          scores[level] += 1;
        }
      });
      
      // Check grammar patterns
      if (indicator.grammar.test(message)) {
        scores[level] += 3;
      }
      
      // Check sentence complexity
      if (sentenceLength <= indicator.sentenceLength) {
        scores[level] += 1;
      }
    });

    // Determine level
    const maxScore = Math.max(...Object.values(scores));
    const detectedLevel = Object.keys(scores).find(level => scores[level] === maxScore);
    
    return {
      level: detectedLevel || 'intermediate',
      confidence: maxScore > 3 ? 'high' : maxScore > 1 ? 'medium' : 'low',
      scores
    };
  }

  // Generate personalized learning suggestions
  static generateLearningSuggestions(userLevel, topic) {
    const suggestions = {
      beginner: {
        grammar: [
          "Let's practice basic sentence structure: Subject + Verb + Object",
          "Try forming simple present tense sentences",
          "Practice using 'is', 'am', 'are' correctly"
        ],
        vocabulary: [
          "Learn 5 new everyday words daily",
          "Practice common verbs: eat, sleep, work, study",
          "Build vocabulary with family and food words"
        ],
        pronunciation: [
          "Focus on clear pronunciation of vowel sounds",
          "Practice stress patterns in common words",
          "Work on basic intonation patterns"
        ],
        conversation: [
          "Practice introducing yourself",
          "Learn to ask and answer simple questions",
          "Practice ordering food and asking for directions"
        ]
      },
      intermediate: {
        grammar: [
          "Master past and future tenses",
          "Practice conditional sentences (if/when)",
          "Learn to use modal verbs (can, should, must)"
        ],
        vocabulary: [
          "Learn phrasal verbs and idioms",
          "Expand academic and professional vocabulary",
          "Practice synonyms and antonyms"
        ],
        pronunciation: [
          "Work on connected speech and linking",
          "Practice word stress in longer words",
          "Focus on intonation for questions and statements"
        ],
        conversation: [
          "Practice expressing opinions and preferences",
          "Learn to give advice and make suggestions",
          "Discuss past experiences and future plans"
        ]
      },
      advanced: {
        grammar: [
          "Master complex sentence structures",
          "Practice subjunctive mood and advanced conditionals",
          "Perfect your use of passive voice"
        ],
        vocabulary: [
          "Learn nuanced vocabulary for specific topics",
          "Master academic and professional terminology",
          "Practice collocations and fixed expressions"
        ],
        pronunciation: [
          "Refine accent and regional variations",
          "Master prosody and rhythm patterns",
          "Perfect emphasis and emotional expression"
        ],
        conversation: [
          "Practice debate and argumentation",
          "Discuss complex abstract topics",
          "Master formal and informal registers"
        ]
      }
    };

    const levelSuggestions = suggestions[userLevel] || suggestions.intermediate;
    const topicSuggestions = levelSuggestions[topic] || levelSuggestions.conversation;
    
    return topicSuggestions[Math.floor(Math.random() * topicSuggestions.length)];
  }

  // Analyze grammar mistakes
  static analyzeGrammarMistakes(text) {
    const commonMistakes = [
      {
        pattern: /\ba\s+(?=[aeiou])/gi,
        correction: 'an',
        explanation: 'Use "an" before words starting with vowel sounds'
      },
      {
        pattern: /\ban\s+(?=[bcdfghjklmnpqrstvwxyz])/gi,
        correction: 'a',
        explanation: 'Use "a" before words starting with consonant sounds'
      },
      {
        pattern: /\bi\s+am\s+go/gi,
        correction: 'I am going',
        explanation: 'Use continuous tense: "I am going" not "I am go"'
      },
      {
        pattern: /\bme\s+and\s+/gi,
        correction: '... and I',
        explanation: 'Use "... and I" at the beginning of sentences'
      },
      {
        pattern: /\bdon\'t\s+have\s+no/gi,
        correction: 'don\'t have any',
        explanation: 'Avoid double negatives: use "don\'t have any"'
      }
    ];

    const mistakes = [];
    
    commonMistakes.forEach(mistake => {
      const matches = text.match(mistake.pattern);
      if (matches) {
        mistakes.push({
          original: matches[0],
          correction: mistake.correction,
          explanation: mistake.explanation,
          position: text.search(mistake.pattern)
        });
      }
    });

    return mistakes;
  }

  // Generate pronunciation feedback
  static generatePronunciationFeedback(text) {
    const difficultSounds = {
      'th': {
        words: ['think', 'this', 'through', 'thought'],
        tip: 'Place tongue between teeth and breathe out'
      },
      'r': {
        words: ['red', 'right', 'around', 'problem'],
        tip: 'Curl tongue slightly, don\'t touch the roof of mouth'
      },
      'l': {
        words: ['light', 'life', 'people', 'apple'],
        tip: 'Touch tongue tip to roof of mouth behind teeth'
      },
      'v/w': {
        words: ['very', 'work', 'value', 'vowel'],
        tip: 'For V: bite lower lip. For W: round lips'
      }
    };

    const textLower = text.toLowerCase();
    const feedback = [];

    Object.keys(difficultSounds).forEach(sound => {
      const soundInfo = difficultSounds[sound];
      const foundWords = soundInfo.words.filter(word => textLower.includes(word));
      
      if (foundWords.length > 0) {
        feedback.push({
          sound: sound,
          words: foundWords,
          tip: soundInfo.tip,
          practice: `Try repeating: ${foundWords.join(', ')}`
        });
      }
    });

    return feedback;
  }

  // Track learning progress
  static updateLearningProgress(userId, activity, performance) {
    const progress = JSON.parse(localStorage.getItem(`checkpoint_progress_${userId}`)) || {
      level: 'beginner',
      totalSessions: 0,
      wordsLearned: 0,
      grammarScore: 0,
      pronunciationScore: 0,
      conversationScore: 0,
      achievements: [],
      lastActivity: null
    };

    progress.totalSessions += 1;
    progress.lastActivity = new Date().toISOString();

    // Update specific scores based on activity
    switch (activity.type) {
      case 'conversation':
        progress.conversationScore = Math.min(100, progress.conversationScore + performance.score);
        break;
      case 'grammar':
        progress.grammarScore = Math.min(100, progress.grammarScore + performance.score);
        break;
      case 'pronunciation':
        progress.pronunciationScore = Math.min(100, progress.pronunciationScore + performance.score);
        break;
      case 'vocabulary':
        progress.wordsLearned += performance.newWords || 1;
        break;
    }

    // Check for achievements
    const newAchievements = this.checkAchievements(progress);
    progress.achievements = [...new Set([...progress.achievements, ...newAchievements])];

    // Update level based on overall progress
    const averageScore = (progress.grammarScore + progress.pronunciationScore + progress.conversationScore) / 3;
    if (averageScore >= 80) {
      progress.level = 'advanced';
    } else if (averageScore >= 50) {
      progress.level = 'intermediate';
    }

    localStorage.setItem(`checkpoint_progress_${userId}`, JSON.stringify(progress));
    return progress;
  }

  // Check for achievements
  static checkAchievements(progress) {
    const achievements = [];
    
    if (progress.totalSessions >= 10 && !progress.achievements.includes('consistent_learner')) {
      achievements.push('consistent_learner');
    }
    
    if (progress.wordsLearned >= 50 && !progress.achievements.includes('vocabulary_builder')) {
      achievements.push('vocabulary_builder');
    }
    
    if (progress.grammarScore >= 80 && !progress.achievements.includes('grammar_master')) {
      achievements.push('grammar_master');
    }
    
    if (progress.pronunciationScore >= 80 && !progress.achievements.includes('pronunciation_pro')) {
      achievements.push('pronunciation_pro');
    }
    
    if (progress.conversationScore >= 80 && !progress.achievements.includes('conversation_champion')) {
      achievements.push('conversation_champion');
    }

    return achievements;
  }

  // Generate practice exercises
  static generatePracticeExercise(level, topic) {
    const exercises = {
      beginner: {
        grammar: {
          type: 'fill_blank',
          question: 'Complete the sentence: I ___ a student.',
          options: ['am', 'is', 'are'],
          answer: 'am',
          explanation: 'Use "am" with "I"'
        },
        vocabulary: {
          type: 'match',
          question: 'Match the word to its meaning: "Happy"',
          options: ['Sad', 'Joyful', 'Angry'],
          answer: 'Joyful',
          explanation: 'Happy means feeling joy or pleasure'
        }
      },
      intermediate: {
        grammar: {
          type: 'multiple_choice',
          question: 'Choose the correct form: If I ___ rich, I would travel the world.',
          options: ['was', 'were', 'am'],
          answer: 'were',
          explanation: 'Use "were" in hypothetical conditionals'
        },
        vocabulary: {
          type: 'definition',
          question: 'What does "procrastinate" mean?',
          answer: 'To delay or postpone action',
          explanation: 'Procrastinate means to put off doing something'
        }
      },
      advanced: {
        grammar: {
          type: 'error_correction',
          question: 'Find and correct the error: "The report was wrote by the team."',
          answer: 'The report was written by the team.',
          explanation: 'Past participle of "write" is "written", not "wrote"'
        },
        vocabulary: {
          type: 'context',
          question: 'Use "ubiquitous" in a sentence about technology.',
          example: 'Smartphones have become ubiquitous in modern society.',
          explanation: 'Ubiquitous means present everywhere'
        }
      }
    };

    const levelExercises = exercises[level] || exercises.intermediate;
    const topicExercise = levelExercises[topic] || levelExercises.grammar;
    
    return topicExercise;
  }

  // Format learning statistics
  static formatLearningStats(progress) {
    return {
      level: progress.level.charAt(0).toUpperCase() + progress.level.slice(1),
      totalSessions: progress.totalSessions,
      wordsLearned: progress.wordsLearned,
      overallScore: Math.round((progress.grammarScore + progress.pronunciationScore + progress.conversationScore) / 3),
      strengths: this.identifyStrengths(progress),
      improvements: this.identifyImprovements(progress),
      achievements: progress.achievements.length,
      lastActivity: progress.lastActivity ? new Date(progress.lastActivity).toLocaleDateString() : 'Never'
    };
  }

  // Identify user strengths
  static identifyStrengths(progress) {
    const strengths = [];
    if (progress.grammarScore >= 70) strengths.push('Grammar');
    if (progress.pronunciationScore >= 70) strengths.push('Pronunciation');
    if (progress.conversationScore >= 70) strengths.push('Conversation');
    if (progress.wordsLearned >= 30) strengths.push('Vocabulary');
    return strengths.length > 0 ? strengths : ['Building Foundation'];
  }

  // Identify areas for improvement
  static identifyImprovements(progress) {
    const improvements = [];
    if (progress.grammarScore < 60) improvements.push('Grammar');
    if (progress.pronunciationScore < 60) improvements.push('Pronunciation');
    if (progress.conversationScore < 60) improvements.push('Conversation');
    if (progress.wordsLearned < 20) improvements.push('Vocabulary');
    return improvements.length > 0 ? improvements : ['Keep Practicing!'];
  }
}