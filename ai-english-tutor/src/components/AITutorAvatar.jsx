import React, { useEffect, useState, useRef } from 'react';
import './AITutorAvatar.css';
import { EnglishLearningUtils } from '../utils/EnglishLearningUtils';

const AITutorAvatar = ({ 
  showWelcome = true, 
  position = 'floating', // 'floating', 'embedded', 'fullscreen'
  onAvatarReady = () => {},
  checkpointRedirect = true,
  openaiApiKey = process.env.REACT_APP_OPENAI_API_KEY,
  checkpointApiUrl = process.env.REACT_APP_CHECKPOINT_API_URL || 'https://api.checkpointenglish.com'
}) => {
  const [isAvatarLoaded, setIsAvatarLoaded] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userLevel, setUserLevel] = useState('intermediate');
  const [showPracticeExercise, setShowPracticeExercise] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(null);
  const avatarContainerRef = useRef(null);

  // Load HeyGen Avatar Script
  useEffect(() => {
    const loadHeyGenScript = () => {
      // Remove any existing HeyGen elements
      const existingElements = document.querySelectorAll('#heygen-streaming-embed');
      existingElements.forEach(el => el.remove());

      // Your HeyGen embed script
      const script = document.createElement('script');
      script.innerHTML = `
        (function(window){
          const host="https://labs.heygen.com";
          const url=host+"/guest/streaming-embed?share=eyJxdWFsaXR5IjoiaGlnaCIsImF2YXRhck5hbWUiOiJUaGFkZGV1c19Qcm9mZXNzaW9uYWxMb29r%0D%0AMl9wdWJsaWMiLCJwcmV2aWV3SW1nIjoiaHR0cHM6Ly9maWxlczIuaGV5Z2VuLmFpL2F2YXRhci92%0D%0AMy9jMGI1YjhhZWNlZmI0MWUyYmIyNTg5YmE1OGJlZTFhYl81NTk1MC9wcmV2aWV3X3RhbGtfMS53%0D%0AZWJwIiwibmVlZFJlbW92ZUJhY2tncm91bmQiOnRydWUsImtub3dsZWRnZUJhc2VJZCI6ImRlbW8t%0D%0AMSIsInVzZXJuYW1lIjoiNTZjN2QzZTdiYzQyNDEwZTg2ZDA3YjIwY2EwM2Y0OTMifQ%3D%3D&inIFrame=1";
          const clientWidth=document.body.clientWidth;
          const wrapDiv=document.createElement("div");
          wrapDiv.id="heygen-streaming-embed";
          
          const container=document.createElement("div");
          container.id="heygen-streaming-container";
          
          const stylesheet=document.createElement("style");
          stylesheet.innerHTML=\`
            #heygen-streaming-embed {
              z-index: 9999;
              position: fixed;
              left: 40px;
              bottom: 40px;
              width: 200px;
              height: 200px;
              border-radius: 50%;
              border: 3px solid #FF6B35;
              box-shadow: 0px 12px 32px 0px rgba(255, 107, 53, 0.4);
              transition: all ease-in-out 0.3s;
              overflow: hidden;
              background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
              cursor: pointer;
              opacity: 0;
              visibility: hidden;
            }
            #heygen-streaming-embed::before {
              content: 'CheckpointEnglish';
              position: absolute;
              bottom: -35px;
              left: 50%;
              transform: translateX(-50%);
              background: rgba(255, 107, 53, 0.95);
              color: white;
              padding: 6px 12px;
              border-radius: 12px;
              font-size: 12px;
              font-weight: 600;
              white-space: nowrap;
              opacity: 0;
              transition: opacity 0.3s ease;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            }
            #heygen-streaming-embed.show {
              opacity: 1;
              visibility: visible;
              animation: bounceIn 1s ease-out;
            }
            #heygen-streaming-embed.show::before {
              opacity: 1;
            }
            #heygen-streaming-embed.expand {
              \${clientWidth<540?"height: 400px; width: 96%; left: 50%; bottom: 20px; transform: translateX(-50%);":"height: 500px; width: 400px; left: 40px; bottom: 40px;"}
              border-radius: 16px;
              border: 2px solid #FF6B35;
              box-shadow: 0px 20px 40px 0px rgba(255, 107, 53, 0.3);
            }
            #heygen-streaming-embed.expand::before {
              opacity: 0;
            }
            #heygen-streaming-embed:hover {
              transform: scale(1.05);
              box-shadow: 0px 16px 36px 0px rgba(255, 107, 53, 0.5);
            }
            #heygen-streaming-embed.expand:hover {
              transform: none;
            }
            #heygen-streaming-container {
              width: 100%;
              height: 100%;
              position: relative;
            }
            #heygen-streaming-container iframe {
              width: 100%;
              height: 100%;
              border: 0;
              border-radius: inherit;
            }
            @keyframes bounceIn {
              0% { transform: scale(0.3); opacity: 0; }
              50% { transform: scale(1.1); opacity: 0.8; }
              100% { transform: scale(1); opacity: 1; }
            }
          \`;
          
          const iframe=document.createElement("iframe");
          iframe.allowFullscreen=false;
          iframe.title="CheckpointEnglish AI Tutor";
          iframe.role="dialog";
          iframe.allow="microphone";
          iframe.src=url;
          
          let visible=false;
          let initial=false;
          
          window.addEventListener("message",(e=>{
            if(e.origin===host && e.data && e.data.type && "streaming-embed"===e.data.type) {
              if("init"===e.data.action) {
                initial=true;
                wrapDiv.classList.toggle("show", initial);
                window.dispatchEvent(new CustomEvent('heygenAvatarReady'));
              } else if("show"===e.data.action) {
                visible=true;
                wrapDiv.classList.toggle("expand", visible);
                window.dispatchEvent(new CustomEvent('heygenAvatarExpanded'));
              } else if("hide"===e.data.action) {
                visible=false;
                wrapDiv.classList.toggle("expand", visible);
                window.dispatchEvent(new CustomEvent('heygenAvatarCollapsed'));
              }
            }
          }));
          
          container.appendChild(iframe);
          wrapDiv.appendChild(stylesheet);
          wrapDiv.appendChild(container);
          document.body.appendChild(wrapDiv);
          
          // Add click to expand functionality
          wrapDiv.addEventListener('click', function(e) {
            if (!visible) {
              iframe.contentWindow.postMessage({type: 'user-interaction', action: 'expand'}, '*');
            }
          });
          
        })(globalThis);
      `;
      
      document.head.appendChild(script);
    };

    // Load the script
    loadHeyGenScript();

    // Listen for HeyGen events
    const handleAvatarReady = () => {
      setIsAvatarLoaded(true);
      onAvatarReady();
      
      // Auto-greet after 3 seconds
      setTimeout(() => {
        if (showWelcome) {
          speakWelcomeMessage();
        }
      }, 3000);
    };

    const handleAvatarExpanded = () => {
      setIsExpanded(true);
    };

    const handleAvatarCollapsed = () => {
      setIsExpanded(false);
    };

    window.addEventListener('heygenAvatarReady', handleAvatarReady);
    window.addEventListener('heygenAvatarExpanded', handleAvatarExpanded);
    window.addEventListener('heygenAvatarCollapsed', handleAvatarCollapsed);

    // Cleanup
    return () => {
      window.removeEventListener('heygenAvatarReady', handleAvatarReady);
      window.removeEventListener('heygenAvatarExpanded', handleAvatarExpanded);
      window.removeEventListener('heygenAvatarCollapsed', handleAvatarCollapsed);
      
      // Remove HeyGen elements
      const heygenElements = document.querySelectorAll('#heygen-streaming-embed');
      heygenElements.forEach(el => el.remove());
    };
  }, []);

  const speakWelcomeMessage = () => {
    const welcomeMessages = [
      "Welcome to CheckpointEnglish! I'm your AI English tutor, ready to help you master English conversation and grammar.",
      "Hello! Welcome to CheckpointEnglish, where English learning becomes natural and fun. I'm here to practice with you!",
      "Greetings! I'm your CheckpointEnglish AI tutor. Let's practice English together and boost your confidence in speaking!"
    ];
    
    const randomMessage = welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];
    
    // Add to chat messages
    setChatMessages(prev => [...prev, {
      type: 'avatar',
      text: randomMessage,
      timestamp: new Date()
    }]);

    // Use browser's speech synthesis as backup
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(randomMessage);
      utterance.voice = speechSynthesis.getVoices().find(voice => 
        voice.lang.includes('en') && voice.name.includes('Male')
      ) || speechSynthesis.getVoices()[0];
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const handleUserMessage = async (message) => {
    if (!message.trim()) return;

    // Analyze user's English level
    const levelAnalysis = EnglishLearningUtils.analyzeEnglishLevel(message);
    setUserLevel(levelAnalysis.level);

    // Analyze grammar mistakes
    const grammarMistakes = EnglishLearningUtils.analyzeGrammarMistakes(message);

    // Add user message to chat
    setChatMessages(prev => [...prev, {
      type: 'user',
      text: message,
      timestamp: new Date(),
      analysis: {
        level: levelAnalysis,
        grammarMistakes: grammarMistakes
      }
    }]);

    // Generate AI response with learning insights
    const aiResponse = await generateEnhancedAIResponse(message, levelAnalysis, grammarMistakes);
    
    setChatMessages(prev => [...prev, {
      type: 'avatar',
      text: aiResponse,
      timestamp: new Date()
    }]);

    // Update learning progress
    const userId = localStorage.getItem('checkpoint_user_id') || 'guest';
    const performance = { score: grammarMistakes.length === 0 ? 10 : Math.max(5, 10 - grammarMistakes.length) };
    const updatedProgress = EnglishLearningUtils.updateLearningProgress(userId, { type: 'conversation' }, performance);
    setUserProgress(updatedProgress);

    // Occasionally suggest practice exercises
    if (Math.random() < 0.3) { // 30% chance
      setTimeout(() => suggestPracticeExercise(), 2000);
    }

    setUserInput('');
  };

  const generateEnhancedAIResponse = async (userMessage, levelAnalysis, grammarMistakes) => {
    setIsTyping(true);
    
    try {
      // Create enhanced context for AI
      const enhancedContext = `
User Level: ${levelAnalysis.level} (confidence: ${levelAnalysis.confidence})
Grammar Mistakes Found: ${grammarMistakes.length}
${grammarMistakes.length > 0 ? 'Mistakes: ' + grammarMistakes.map(m => m.explanation).join(', ') : ''}
      `;

      // First try OpenAI API with enhanced context
      if (openaiApiKey) {
        const response = await callEnhancedOpenAI(userMessage, enhancedContext);
        if (response) {
          setIsTyping(false);
          return response;
        }
      }
      
      // Fallback to CheckpointEnglish API with analysis
      const checkpointResponse = await callCheckpointAPI(userMessage, levelAnalysis, grammarMistakes);
      if (checkpointResponse) {
        setIsTyping(false);
        return checkpointResponse;
      }
      
      // Enhanced fallback with learning insights
      const response = await getAdvancedFallbackResponse(userMessage, levelAnalysis, grammarMistakes);
      setIsTyping(false);
      return response;
      
    } catch (error) {
      console.error('Error generating AI response:', error);
      setIsTyping(false);
      return "I'm having trouble connecting right now. Let's try visiting CheckpointEnglish.com for the full learning experience!";
    }
  };

  const generateAIResponse = async (userMessage) => {
    // Legacy function for backward compatibility
    return await generateEnhancedAIResponse(userMessage, { level: 'intermediate', confidence: 'medium' }, []);
  };

  const callEnhancedOpenAI = async (message, context) => {
    if (!openaiApiKey) return null;
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiApiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are a professional English tutor for CheckpointEnglish. Your role is to:
1. Analyze the student's English level and provide appropriate feedback
2. Correct grammar mistakes gently and explain the corrections
3. Provide pronunciation tips when relevant
4. Suggest specific practice exercises based on their level
5. Always maintain an encouraging, supportive tone
6. Reference CheckpointEnglish platform for advanced features
7. Keep responses helpful but concise (max 200 words)
8. Adapt your teaching style to the student's proficiency level

Context about this student:
${context}

Be enthusiastic about English learning and provide personalized guidance.`
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })
      });

      const data = await response.json();
      
      if (data.choices && data.choices[0]) {
        let aiResponse = data.choices[0].message.content.trim();
        
        // Add CheckpointEnglish reference if not already mentioned
        if (!aiResponse.toLowerCase().includes('checkpoint')) {
          aiResponse += " 📚 Continue your journey at CheckpointEnglish.com!";
        }
        
        return aiResponse;
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
    }
    
    return null;
  };

  const callOpenAI = async (message) => {
    // Legacy function - use enhanced version
    return await callEnhancedOpenAI(message, 'Student level: intermediate');
  };

  const callCheckpointAPI = async (message) => {
    try {
      const response = await fetch(`${checkpointApiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          session_id: localStorage.getItem('checkpoint_session_id'),
          user_level: userProgress?.level || 'beginner'
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Store session ID for continuity
        if (data.session_id) {
          localStorage.setItem('checkpoint_session_id', data.session_id);
        }
        
        // Update user progress if provided
        if (data.user_progress) {
          setUserProgress(data.user_progress);
        }
        
        return data.response;
      }
    } catch (error) {
      console.error('CheckpointEnglish API error:', error);
    }
    
    return null;
  };

  const getEnhancedFallbackResponse = async (userMessage) => {
    // Enhanced responses with CheckpointEnglish branding
    const responses = {
      greeting: [
        "Welcome to CheckpointEnglish! I'm thrilled to help you master English. What would you like to practice today - conversation, grammar, or pronunciation?",
        "Hello! You've made a great choice joining CheckpointEnglish. I'm here to make your English learning journey enjoyable and effective!",
        "Greetings! At CheckpointEnglish, we believe every conversation is a step toward fluency. What English skills shall we work on together?"
      ],
      grammar: [
        "Grammar is the foundation of clear communication! Let me explain this concept step by step. CheckpointEnglish has comprehensive grammar courses to dive deeper.",
        "Excellent grammar question! Understanding this will boost your confidence. For structured grammar lessons, explore our CheckpointEnglish courses.",
        "Grammar mastery takes practice, but you're asking the right questions! CheckpointEnglish offers personalized grammar exercises for faster progress."
      ],
      pronunciation: [
        "Pronunciation is key to confident speaking! Let's practice this sound together. CheckpointEnglish has interactive pronunciation tools to perfect your accent.",
        "Great focus on pronunciation! Clear speech opens doors. Try our advanced pronunciation features on CheckpointEnglish.com for detailed feedback.",
        "Pronunciation practice is so valuable! Keep working on it. CheckpointEnglish offers speech analysis to track your improvement."
      ],
      vocabulary: [
        "Building vocabulary accelerates your fluency! This word is really useful. CheckpointEnglish has vocabulary builders tailored to your level.",
        "Fantastic vocabulary focus! Each new word expands your expression. Discover thousands more with CheckpointEnglish's smart vocabulary system.",
        "Vocabulary growth is essential! You're building a strong foundation. CheckpointEnglish tracks your progress and suggests optimal learning paths."
      ],
      conversation: [
        "Conversation practice is the heart of language learning! You're doing wonderfully. CheckpointEnglish offers conversation partners at every level.",
        "I love helping with conversations! Natural dialogue builds real fluency. Explore CheckpointEnglish for diverse conversation scenarios.",
        "Conversation skills improve with practice! You're on the right track. CheckpointEnglish connects you with conversation groups worldwide."
      ],
      business: [
        "Business English opens career opportunities! Let's practice professional communication. CheckpointEnglish has specialized business courses.",
        "Professional English is crucial for success! I can help you sound confident. Discover business-focused lessons on CheckpointEnglish.com.",
        "Business communication skills are valuable! Let's work on this together. CheckpointEnglish offers industry-specific English training."
      ],
      practice: [
        "Practice makes perfect! Regular conversation builds confidence. CheckpointEnglish provides daily practice opportunities tailored to your goals.",
        "Consistent practice is the secret to fluency! You're committed to improvement. Join our CheckpointEnglish community for constant practice.",
        "Practice is everything in language learning! Keep up this momentum. CheckpointEnglish gamifies practice to make it engaging and fun."
      ]
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
    } else if (lowerMessage.includes('grammar') || lowerMessage.includes('tense') || lowerMessage.includes('verb')) {
      return responses.grammar[Math.floor(Math.random() * responses.grammar.length)];
    } else if (lowerMessage.includes('pronounce') || lowerMessage.includes('pronunciation') || lowerMessage.includes('accent')) {
      return responses.pronunciation[Math.floor(Math.random() * responses.pronunciation.length)];
    } else if (lowerMessage.includes('word') || lowerMessage.includes('vocabulary') || lowerMessage.includes('meaning')) {
      return responses.vocabulary[Math.floor(Math.random() * responses.vocabulary.length)];
    } else if (lowerMessage.includes('business') || lowerMessage.includes('work') || lowerMessage.includes('professional')) {
      return responses.business[Math.floor(Math.random() * responses.business.length)];
    } else if (lowerMessage.includes('practice') || lowerMessage.includes('talk') || lowerMessage.includes('conversation')) {
      return responses.conversation[Math.floor(Math.random() * responses.conversation.length)];
    } else {
      return responses.practice[Math.floor(Math.random() * responses.practice.length)];
    }
  };

  const getAdvancedFallbackResponse = async (userMessage, levelAnalysis, grammarMistakes) => {
    let response = await getEnhancedFallbackResponse(userMessage);
    
    // Add personalized feedback based on analysis
    if (grammarMistakes.length > 0) {
      const mistake = grammarMistakes[0]; // Focus on first mistake
      response += `\n\n💡 Quick tip: I noticed "${mistake.original}" in your message. ${mistake.explanation}`;
    }
    
    // Add level-appropriate encouragement
    if (levelAnalysis.level === 'beginner') {
      response += '\n\n🌟 You\'re building a great foundation! Keep practicing simple sentences.';
    } else if (levelAnalysis.level === 'advanced') {
      response += '\n\n🎯 Your English is quite sophisticated! Let\'s work on nuanced expressions.';
    }
    
    // Suggest specific learning path
    const suggestion = EnglishLearningUtils.generateLearningSuggestions(levelAnalysis.level, 'conversation');
    response += `\n\n📚 Practice suggestion: ${suggestion}`;
    
    return response;
  };

  const suggestPracticeExercise = () => {
    const exercise = EnglishLearningUtils.generatePracticeExercise(userLevel, 'grammar');
    setCurrentExercise(exercise);
    
    const exerciseMessage = `🎯 Practice Time! Here's a quick exercise for you:\n\n${exercise.question}\n\nWould you like to try this exercise?`;
    
    setChatMessages(prev => [...prev, {
      type: 'avatar',
      text: exerciseMessage,
      timestamp: new Date(),
      isExercise: true
    }]);
  };

  const handleExerciseAnswer = (answer) => {
    const isCorrect = answer.toLowerCase() === currentExercise.answer.toLowerCase();
    const userId = localStorage.getItem('checkpoint_user_id') || 'guest';
    
    // Update progress based on exercise performance
    const performance = { score: isCorrect ? 15 : 5, exerciseCompleted: true };
    const updatedProgress = EnglishLearningUtils.updateLearningProgress(userId, { type: 'grammar' }, performance);
    setUserProgress(updatedProgress);
    
    const feedback = isCorrect 
      ? `✅ Excellent! ${currentExercise.explanation || 'You got it right!'}`
      : `❌ Not quite. The correct answer is "${currentExercise.answer}". ${currentExercise.explanation}`;
    
    setChatMessages(prev => [...prev, {
      type: 'avatar',
      text: feedback + '\n\nKeep practicing! CheckpointEnglish has hundreds more exercises.',
      timestamp: new Date()
    }]);
    
    setCurrentExercise(null);
    setShowPracticeExercise(false);
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognition.start();
    }
  };

  const redirectToCheckpoint = () => {
    if (checkpointRedirect) {
      window.open('https://checkpointenglish.com', '_blank');
    }
  };

  return (
    <div className="ai-tutor-avatar-wrapper">
      {/* Chat Interface Overlay */}
      {isExpanded && (
        <div className="avatar-chat-overlay">
          <div className="chat-header">
            <div className="header-main">
              <h3>🎓 CheckpointEnglish AI Tutor</h3>
              {userProgress && (
                <div className="progress-badge">
                  Level: {userLevel.charAt(0).toUpperCase() + userLevel.slice(1)} | 
                  Score: {Math.round((userProgress.grammarScore + userProgress.pronunciationScore + userProgress.conversationScore) / 3)}%
                </div>
              )}
            </div>
            <button 
              className="checkpoint-btn"
              onClick={redirectToCheckpoint}
            >
              Visit Full Platform
            </button>
          </div>
          
          <div className="chat-messages">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`message ${msg.type}`}>
                <div className="message-content">
                  {msg.text}
                </div>
                <div className="message-time">
                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="message avatar typing">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="typing-text">CheckpointEnglish AI is thinking...</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="chat-input-area">
            <div className="input-group">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUserMessage(userInput)}
                placeholder="Type your message or ask a question..."
                className="chat-input"
              />
              <button
                onClick={() => handleUserMessage(userInput)}
                className="send-btn"
                disabled={!userInput.trim()}
              >
                Send
              </button>
            </div>
            
            <div className="voice-controls">
              <button
                onClick={startListening}
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                disabled={isListening}
              >
                {isListening ? '🎤 Listening...' : '🎤 Voice'}
              </button>
              
              <button
                onClick={speakWelcomeMessage}
                className="speak-btn"
              >
                🔊 Welcome
              </button>
              
              <button
                onClick={suggestPracticeExercise}
                className="exercise-btn"
              >
                🎯 Practice
              </button>
              
              {userProgress && (
                <button
                  onClick={() => {
                    const stats = EnglishLearningUtils.formatLearningStats(userProgress);
                    const statsMessage = `📊 Your Progress:\n\nLevel: ${stats.level}\nSessions: ${stats.totalSessions}\nWords Learned: ${stats.wordsLearned}\nOverall Score: ${stats.overallScore}%\n\nStrengths: ${stats.strengths.join(', ')}\nFocus Areas: ${stats.improvements.join(', ')}`;
                    
                    setChatMessages(prev => [...prev, {
                      type: 'avatar',
                      text: statsMessage,
                      timestamp: new Date()
                    }]);
                  }}
                  className="stats-btn"
                >
                  📊 Stats
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Status Indicator */}
      {!isAvatarLoaded && (
        <div className="avatar-loading">
          <div className="loading-spinner"></div>
          <p>Loading your AI English tutor...</p>
        </div>
      )}

      {/* Instructions */}
      {isAvatarLoaded && !isExpanded && (
        <div className="avatar-instructions">
          <div className="instruction-tooltip">
            <p>👋 Click to start with CheckpointEnglish!</p>
            <p>🎯 Practice English conversation</p>
            <p>📚 Get AI-powered feedback</p>
            <p>🚀 Powered by OpenAI & CheckpointEnglish</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITutorAvatar;