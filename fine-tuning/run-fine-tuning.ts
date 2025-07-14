#!/usr/bin/env node

// As-Saadi Fine-tuning Runner Script
// Run this to start the fine-tuning process

import { AsSaadiFinetuningService } from './fine-tuning-service'

async function main() {
  // Get API key from environment
  const apiKey = process.env.REACT_APP_OPENAI_API_KEY
  
  if (!apiKey) {
    console.error('❌ Error: REACT_APP_OPENAI_API_KEY environment variable not found!')
    console.log('💡 Please set your OpenAI API key:')
    console.log('   export REACT_APP_OPENAI_API_KEY="your-api-key-here"')
    process.exit(1)
  }
  
  const finetuningService = new AsSaadiFinetuningService(apiKey)
  
  try {
    console.log('🕌 As-Saadi Tafsir Fine-tuning Process')
    console.log('=====================================')
    console.log('')
    
    // Start the complete fine-tuning process
    const jobId = await finetuningService.runFullFineTuningProcess()
    
    console.log('')
    console.log('🎉 Fine-tuning process initiated successfully!')
    console.log(`🆔 Job ID: ${jobId}`)
    console.log('')
    console.log('⏳ Next steps:')
    console.log('1. Wait 10-30 minutes for training to complete')
    console.log('2. Check status periodically')
    console.log('3. Once completed, update your AI service to use the new model')
    console.log('')
    console.log('🔍 To check status, run:')
    console.log(`   node check-status.js ${jobId}`)
    
    // Save job ID for later reference
    const fs = require('fs')
    fs.writeFileSync('fine-tuning-job-id.txt', jobId)
    console.log('💾 Job ID saved to fine-tuning-job-id.txt')
    
  } catch (error) {
    console.error('❌ Fine-tuning failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { main }