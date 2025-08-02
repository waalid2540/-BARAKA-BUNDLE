# 🎓 AI English Tutor Avatar

An interactive English learning application featuring HeyGen AI avatar integration for CheckpointEnglish.com.

## ✨ Features

- **🤖 AI Avatar Integration**: Interactive conversations with Thaddeus using HeyGen technology
- **🗣️ Speech Recognition**: Practice pronunciation with real-time voice input
- **🔊 Text-to-Speech**: Natural voice responses for immersive learning
- **💬 Smart Conversations**: AI-powered English learning dialogues
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices
- **🌟 CheckpointEnglish Integration**: Direct links to the full learning platform

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd ai-english-tutor
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## 🎯 How to Use

1. **Start Learning**: Click the floating avatar (Thaddeus) to begin
2. **Voice Practice**: Use the voice button to practice speaking English
3. **Chat Interface**: Type messages to practice written English
4. **Get Feedback**: Receive instant AI-powered responses and corrections
5. **Visit CheckpointEnglish**: Click the link for advanced learning features

## 🛠️ Technology Stack

- **React 18**: Modern React with hooks and functional components
- **HeyGen API**: Advanced AI avatar technology for realistic interactions
- **Web Speech API**: Browser-native speech recognition and synthesis
- **CSS3**: Modern styling with animations and responsive design
- **CheckpointEnglish Integration**: Seamless connection to the main platform

## 📁 Project Structure

```
ai-english-tutor/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── AITutorAvatar.jsx    # Main avatar component
│   │   └── AITutorAvatar.css    # Avatar styling
│   ├── App.js                   # Main application component
│   ├── App.css                  # Application styling
│   ├── index.js                 # React DOM entry point
│   └── index.css                # Global styles
└── package.json
```

## 🔧 Configuration

### HeyGen Avatar Setup

The application uses a specific HeyGen avatar (Thaddeus_ProfessionalLook2_public). To use a different avatar:

1. Update the avatar URL in `AITutorAvatar.jsx`
2. Modify the avatar ID in the HeyGen embed script
3. Adjust styling if needed for different avatar dimensions

### CheckpointEnglish Integration

- Update the CheckpointEnglish URL in `App.js` and `AITutorAvatar.jsx`
- Customize the redirect behavior in the `redirectToCheckpoint` function
- Modify branding and messaging as needed

## 🎨 Customization

### Styling

- Modify `AITutorAvatar.css` for avatar appearance and chat interface
- Update `App.css` for main application styling
- Adjust colors, fonts, and animations in the CSS files

### AI Responses

- Update conversation responses in the `generateAIResponse` function
- Add new learning categories and keywords
- Customize welcome messages and learning content

## 📱 Mobile Support

The application is fully responsive and supports:
- Touch interactions for mobile devices
- Adaptive layouts for different screen sizes
- Mobile-optimized voice controls
- Gesture-friendly interface elements

## 🌐 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Hosting Service

The built files in the `build` folder can be deployed to:
- Netlify
- Vercel
- GitHub Pages
- Any static hosting service

## 🔒 Privacy & Security

- Speech recognition is processed locally in the browser
- No personal data is stored without consent
- HeyGen integration follows their privacy policies
- All voice data is processed client-side when possible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- HeyGen for the AI avatar technology
- CheckpointEnglish for the educational platform integration
- React team for the excellent framework
- Open source community for various libraries and tools

## 📞 Support

For support and questions:
- Visit [CheckpointEnglish.com](https://checkpointenglish.com)
- Open an issue in this repository
- Contact the development team

---

**Start your English learning journey today with AI-powered conversation practice!** 🚀