// OpenAI Fine-tuning Service for As-Saadi Tafsir Model
// This handles the actual fine-tuning process with OpenAI

import { asSaadiTrainingGenerator } from './training-data-generator'
import fs from 'fs'
import path from 'path'

class AsSaadiFinetuningService {
  private apiKey: string
  private baseUrl = 'https://api.openai.com/v1'
  
  constructor(apiKey: string) {
    this.apiKey = apiKey
  }
  
  // Step 1: Generate and save training data
  async prepareTrainingData(): Promise<string> {
    console.log('📝 Preparing As-Saadi training data...')
    
    const trainingData = await asSaadiTrainingGenerator.generateFullTrainingSet()
    
    // Save to file
    const filePath = path.join(__dirname, 'as-saadi-training-data.jsonl')
    fs.writeFileSync(filePath, trainingData)
    
    console.log(`💾 Training data saved to: ${filePath}`)
    console.log(`📊 File size: ${fs.statSync(filePath).size} bytes`)
    
    return filePath
  }
  
  // Step 2: Upload training file to OpenAI
  async uploadTrainingFile(filePath: string): Promise<string> {
    console.log('📤 Uploading training file to OpenAI...')
    
    try {
      const formData = new FormData()
      const fileBuffer = fs.readFileSync(filePath)
      const blob = new Blob([fileBuffer], { type: 'application/jsonl' })
      
      formData.append('file', blob, 'as-saadi-training-data.jsonl')
      formData.append('purpose', 'fine-tune')
      
      const response = await fetch(`${this.baseUrl}/files`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: formData
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('✅ File uploaded successfully!')
      console.log(`📁 File ID: ${result.id}`)
      
      return result.id
    } catch (error) {
      console.error('❌ Upload failed:', error)
      throw error
    }
  }
  
  // Step 3: Start fine-tuning job
  async startFineTuning(fileId: string): Promise<string> {
    console.log('🎯 Starting As-Saadi fine-tuning job...')
    
    try {
      const response = await fetch(`${this.baseUrl}/fine_tuning/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          training_file: fileId,
          model: 'gpt-4o-mini-2024-07-18',
          suffix: 'as-saadi-tafsir',
          hyperparameters: {
            n_epochs: 3 // Adjust based on data size
          }
        })
      })
      
      if (!response.ok) {
        throw new Error(`Fine-tuning failed: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      console.log('✅ Fine-tuning job started!')
      console.log(`🆔 Job ID: ${result.id}`)
      console.log(`📈 Status: ${result.status}`)
      
      return result.id
    } catch (error) {
      console.error('❌ Fine-tuning failed:', error)
      throw error
    }
  }
  
  // Step 4: Check fine-tuning status
  async checkFineTuningStatus(jobId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/fine_tuning/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      })
      
      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      
      console.log(`📊 Fine-tuning Status: ${result.status}`)
      console.log(`🎯 Model: ${result.fine_tuned_model || 'Not ready yet'}`)
      
      if (result.status === 'succeeded') {
        console.log('🎉 Fine-tuning completed successfully!')
        console.log(`🚀 Fine-tuned model: ${result.fine_tuned_model}`)
      } else if (result.status === 'failed') {
        console.log('❌ Fine-tuning failed!')
        console.log(`❓ Error: ${JSON.stringify(result.error, null, 2)}`)
      }
      
      return result
    } catch (error) {
      console.error('❌ Status check failed:', error)
      throw error
    }
  }
  
  // Complete fine-tuning process
  async runFullFineTuningProcess(): Promise<string> {
    try {
      console.log('🚀 Starting complete As-Saadi fine-tuning process...')
      
      // Step 1: Prepare training data
      const filePath = await this.prepareTrainingData()
      
      // Step 2: Upload to OpenAI
      const fileId = await this.uploadTrainingFile(filePath)
      
      // Step 3: Start fine-tuning
      const jobId = await this.startFineTuning(fileId)
      
      console.log('⏳ Fine-tuning in progress...')
      console.log(`🔍 Check status with: checkFineTuningStatus("${jobId}")`)
      console.log('⏱️ This typically takes 10-30 minutes')
      
      return jobId
    } catch (error) {
      console.error('❌ Fine-tuning process failed:', error)
      throw error
    }
  }
  
  // Test the fine-tuned model
  async testFineTunedModel(modelId: string, testPrompt: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: modelId,
          messages: [
            {
              role: 'system',
              content: 'You are Sheikh Abdurrahman As-Saadi, providing authentic Quranic tafsir.'
            },
            {
              role: 'user',
              content: testPrompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        })
      })
      
      if (!response.ok) {
        throw new Error(`Test failed: ${response.status} ${response.statusText}`)
      }
      
      const result = await response.json()
      const aiResponse = result.choices[0].message.content
      
      console.log('🧪 Fine-tuned model test:')
      console.log(`❓ Prompt: ${testPrompt}`)
      console.log(`💬 Response: ${aiResponse}`)
      
      return aiResponse
    } catch (error) {
      console.error('❌ Model test failed:', error)
      throw error
    }
  }
}

export { AsSaadiFinetuningService }