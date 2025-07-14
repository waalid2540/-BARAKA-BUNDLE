# 🕌 As-Saadi Tafsir Fine-tuning System

This system creates a custom AI model trained specifically on Sheikh Abdurrahman As-Saadi's tafsir methodology.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd fine-tuning
npm install
```

### 2. Set API Key
```bash
export REACT_APP_OPENAI_API_KEY="your-openai-api-key"
```

### 3. Start Fine-tuning
```bash
npm run train
```

### 4. Check Status
```bash
npm run status
```

## 📊 What It Does

### Training Data Generated:
- **200+ conversation examples** from As-Saadi explanations
- **Multiple question formats** for each verse
- **As-Saadi's authentic voice** and methodology
- **Contemporary applications** in his style

### Verses Covered:
- **Al-Fatiha 1-7** (complete surah)
- **Al-Baqarah 1-3** (opening verses)
- **Expandable** to full Quran coverage

### Training Examples:
```json
{
  "messages": [
    {
      "role": "system", 
      "content": "You are Sheikh As-Saadi, explaining Quran..."
    },
    {
      "role": "user",
      "content": "Explain Bismillah"
    },
    {
      "role": "assistant", 
      "content": "This blessed verse contains..."
    }
  ]
}
```

## ⏱️ Timeline

1. **Training Data Generation**: 2 minutes
2. **Upload to OpenAI**: 1 minute  
3. **Fine-tuning Process**: 10-30 minutes
4. **Model Ready**: Custom As-Saadi AI!

## 🎯 After Completion

### Update Your AI Service:
Replace the model in `src/services/aiService.ts`:
```typescript
// Before
model: 'gpt-4o-mini'

// After  
model: 'ft:gpt-4o-mini-2024-07-18:your-org:as-saadi-tafsir:abc123'
```

### Benefits:
- ✅ **Authentic As-Saadi voice** in every response
- ✅ **Consistent methodology** across all answers
- ✅ **Better understanding** of Islamic scholarship
- ✅ **More accurate tafsir** style and approach

## 📈 Monitoring

The system automatically:
- ✅ Tracks training progress
- ✅ Saves job IDs for reference
- ✅ Tests the final model
- ✅ Provides clear next steps

## 🔍 Commands

```bash
# Start training
npm run train

# Check status
npm run status

# Check specific job
npm run status job-12345

# Manual status check
node check-status.ts job-12345
```

## 💡 Notes

- **Cost**: ~$10-20 for fine-tuning
- **Time**: 10-30 minutes training
- **Quality**: Dramatically improved As-Saadi authenticity
- **Scalable**: Easy to add more volumes

## 🎉 Result

A custom AI that responds **exactly like Sheikh As-Saadi** would - authentic, clear, practical, and spiritually uplifting!