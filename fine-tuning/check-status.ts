#!/usr/bin/env node

// Check Fine-tuning Status Script

import { AsSaadiFinetuningService } from './fine-tuning-service'

async function checkStatus(jobId?: string) {
  // Load environment variables
  require('dotenv').config()
  
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY
  
  if (!apiKey) {
    console.error('❌ Error: REACT_APP_OPENAI_API_KEY environment variable not found!')
    process.exit(1)
  }
  
  // Get job ID from argument or file
  let targetJobId = jobId || process.argv[2]
  
  if (!targetJobId) {
    try {
      const fs = require('fs')
      targetJobId = fs.readFileSync('fine-tuning-job-id.txt', 'utf8').trim()
      console.log(`📄 Using job ID from file: ${targetJobId}`)
    } catch (error) {
      console.error('❌ No job ID provided and no saved job ID found!')
      console.log('💡 Usage: node check-status.js <job-id>')
      process.exit(1)
    }
  }
  
  const finetuningService = new AsSaadiFinetuningService(apiKey)
  
  try {
    console.log('🔍 Checking As-Saadi fine-tuning status...')
    console.log('==========================================')
    console.log('')
    
    const status = await finetuningService.checkFineTuningStatus(targetJobId)
    
    console.log('')
    console.log('📊 Status Details:')
    console.log(`   Status: ${status.status}`)
    console.log(`   Model: ${status.fine_tuned_model || 'Not ready yet'}`)
    console.log(`   Created: ${new Date(status.created_at * 1000).toLocaleString()}`)
    
    if (status.status === 'succeeded') {
      console.log('')
      console.log('🎉 SUCCESS! Your As-Saadi model is ready!')
      console.log(`🚀 Model ID: ${status.fine_tuned_model}`)
      console.log('')
      console.log('⚡ Next step: Update your AI service to use this model')
      console.log('   Update the model name in your aiService.ts file')
      
      // Save the model ID
      const fs = require('fs')
      fs.writeFileSync('fine-tuned-model-id.txt', status.fine_tuned_model)
      console.log('💾 Model ID saved to fine-tuned-model-id.txt')
      
      // Test the model
      console.log('')
      console.log('🧪 Testing the fine-tuned model...')
      const testResponse = await finetuningService.testFineTunedModel(
        status.fine_tuned_model,
        'Explain Bismillah'
      )
      
    } else if (status.status === 'running') {
      console.log('')
      console.log('⏳ Still training... Check again in a few minutes')
      
    } else if (status.status === 'failed') {
      console.log('')
      console.log('❌ Training failed!')
      console.log('🔍 Check the error details above')
    }
    
  } catch (error) {
    console.error('❌ Status check failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  checkStatus()
}

export { checkStatus }