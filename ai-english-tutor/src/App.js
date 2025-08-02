import React, { useState } from 'react';
import AITutorAvatar from './components/AITutorAvatar';
import DemoPage from './components/DemoPage';
import './App.css';

function App() {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <div className="App">
      <header className="app-header">
        <h1>📚 CheckpointEnglish AI Tutor</h1>
        <p>Practice English with Thaddeus, your AI conversation partner</p>
        <div className="header-actions">
          <button 
            className="demo-toggle"
            onClick={() => setShowDemo(!showDemo)}
          >
            {showDemo ? '🏠 Home' : '🎯 Demo & Features'}
          </button>
        </div>
      </header>
      
      <main className="app-main">
        {showDemo ? (
          <DemoPage />
        ) : (
          <div className="welcome-section">
            <div className="welcome-card">
              <h2>🎯 Master English Conversation</h2>
              <div className="features">
                <div className="feature">
                  <span className="icon">🗣️</span>
                  <div>
                    <h3>Voice Practice</h3>
                    <p>Speak naturally and get instant feedback</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="icon">🎭</span>
                  <div>
                    <h3>AI Avatar</h3>
                    <p>Interactive conversations with Thaddeus</p>
                  </div>
                </div>
                <div className="feature">
                  <span className="icon">📈</span>
                  <div>
                    <h3>Track Progress</h3>
                    <p>Monitor your English improvement</p>
                  </div>
                </div>
              </div>
              
              <div className="cta-section">
                <p>Click the floating avatar to start your learning journey!</p>
                <a 
                  href="https://checkpointenglish.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="checkpoint-link"
                >
                  🌟 Visit CheckpointEnglish.com for More Features
                </a>
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* AI Tutor Avatar - Always visible */}
      <AITutorAvatar 
        showWelcome={true}
        position="floating"
        checkpointRedirect={true}
      />
    </div>
  );
}

export default App;