import React, { useState } from 'react';
import './DemoPage.css';

const DemoPage = () => {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      icon: '🤖',
      title: 'AI Avatar Integration',
      description: 'Meet Thaddeus, your professional AI English tutor powered by HeyGen technology',
      details: 'Interactive conversations with a realistic AI avatar that responds naturally to your questions and provides personalized feedback.'
    },
    {
      icon: '🗣️',
      title: 'Speech Recognition',
      description: 'Practice pronunciation with real-time voice recognition',
      details: 'Built-in browser speech recognition allows you to practice speaking English with instant feedback on your pronunciation and fluency.'
    },
    {
      icon: '🎯',
      title: 'Conversation Practice',
      description: 'Engage in natural English conversations on various topics',
      details: 'Practice grammar, vocabulary, and conversation skills through interactive dialogues covering grammar, pronunciation, vocabulary, and everyday conversations.'
    },
    {
      icon: '📱',
      title: 'Mobile Responsive',
      description: 'Learn anywhere with full mobile device support',
      details: 'Optimized for all devices - practice English whether you\'re on desktop, tablet, or mobile phone.'
    },
    {
      icon: '🌟',
      title: 'CheckpointEnglish Integration',
      description: 'Seamless connection to the full learning platform',
      details: 'Direct integration with CheckpointEnglish.com for advanced features, progress tracking, and comprehensive English courses.'
    },
    {
      icon: '⚡',
      title: 'Instant Feedback',
      description: 'Get immediate responses and corrections',
      details: 'Real-time AI-powered feedback helps you improve your English skills quickly and effectively.'
    }
  ];

  const usageSteps = [
    {
      step: 1,
      title: 'Click the Avatar',
      description: 'Click on Thaddeus (the floating avatar) to start your learning session',
      icon: '👆'
    },
    {
      step: 2,
      title: 'Choose Your Method',
      description: 'Type your message or use the voice button to practice speaking',
      icon: '🎤'
    },
    {
      step: 3,
      title: 'Practice & Learn',
      description: 'Engage in conversation and receive instant feedback',
      icon: '💬'
    },
    {
      step: 4,
      title: 'Explore More',
      description: 'Visit CheckpointEnglish.com for advanced features and courses',
      icon: '🚀'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'features':
        return (
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <p className="feature-details">{feature.details}</p>
              </div>
            ))}
          </div>
        );
      
      case 'usage':
        return (
          <div className="usage-steps">
            {usageSteps.map((step, index) => (
              <div key={index} className="usage-step">
                <div className="step-number">
                  <span className="step-icon">{step.icon}</span>
                  <span className="step-num">{step.step}</span>
                </div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        );
      
      case 'demo':
        return (
          <div className="demo-section">
            <div className="demo-card">
              <h3>🎭 Try the AI Avatar</h3>
              <p>Click on Thaddeus (the floating avatar) to start a conversation!</p>
              <div className="demo-actions">
                <div className="demo-action">
                  <strong>💬 Type a message:</strong>
                  <p>"Hello, can you help me with English grammar?"</p>
                </div>
                <div className="demo-action">
                  <strong>🎤 Try voice commands:</strong>
                  <p>"I want to practice pronunciation"</p>
                </div>
                <div className="demo-action">
                  <strong>📚 Ask about learning:</strong>
                  <p>"What topics can we practice together?"</p>
                </div>
              </div>
            </div>
            
            <div className="demo-card">
              <h3>🌟 Full Platform Access</h3>
              <p>For comprehensive English learning with structured courses, progress tracking, and advanced features:</p>
              <a 
                href="https://checkpointenglish.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="platform-link"
              >
                Visit CheckpointEnglish.com
              </a>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="demo-page">
      <div className="demo-header">
        <h1>🎓 AI English Tutor Avatar</h1>
        <p>Interactive English learning with AI-powered conversation practice</p>
      </div>
      
      <div className="demo-tabs">
        <button 
          className={`tab-button ${activeTab === 'features' ? 'active' : ''}`}
          onClick={() => setActiveTab('features')}
        >
          ✨ Features
        </button>
        <button 
          className={`tab-button ${activeTab === 'usage' ? 'active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          📖 How to Use
        </button>
        <button 
          className={`tab-button ${activeTab === 'demo' ? 'active' : ''}`}
          onClick={() => setActiveTab('demo')}
        >
          🎯 Try It Now
        </button>
      </div>
      
      <div className="demo-content">
        {renderTabContent()}
      </div>
      
      <div className="demo-footer">
        <p>Ready to start learning? Click on Thaddeus below to begin! 👇</p>
      </div>
    </div>
  );
};

export default DemoPage;