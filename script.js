const quill = new Quill('#editor', { theme: 'snow' });

// RapidAPI Config
const RAPIDAPI_KEY = '7008b40800mshf5151d0bd0f91a4p1242b7jsnfca887897331'; // Get from RapidAPI Dashboard

// GPT-4 Script Analysis
async function analyzeScript() {
  const script = quill.getText();
  
  const response = await fetch('https://ai-sentiment-analysis-text-insights-emotion-detection.p.rapidapi.com/analyzeBulkSentiment?noqueue=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'openai-api4.p.rapidapi.com'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{
        role: 'user',
        content: `Analyze this screenplay for plot and dialogue:\n\n${script}`
      }]
    })
  });
  
  const data = await response.json();
  document.getElementById('feedback').innerHTML = data.choices[0].message.content;
}

// Stable Diffusion Storyboards
async function generateStoryboard() {
  const prompt = quill.getText().split('\n')[0]; // Use first line as prompt
  
  const response = await fetch('https://chatgpt-vision1.p.rapidapi.com/texttoimage3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'stable-diffusion.p.rapidapi.com'
    },
    body: JSON.stringify({
      prompt: prompt,
      num_images: 4
    })
  });
  
  const data = await response.json();
  const container = document.getElementById('storyboard');
  container.innerHTML = '';
  
  data.images.forEach(url => {
    const img = document.createElement('img');
    img.src = url;
    container.appendChild(img);
  });
}

async function generateVideo() {
    const script = quill.getText();
    
    // Step 1: Generate audio (using Resemble.AI or other TTS)
    // Using Resemble.AI (RapidAPI)
    async function generateVoiceover(text) {
        const response = await fetch('https://large-text-to-speech.p.rapidapi.com/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'resemble-ai.p.rapidapi.com'
          },
          body: JSON.stringify({
          project_uuid: 'YOUR_PROJECT_ID',
          voice: 'sarah', // Pre-built voice
          text: text.substring(0, 200) // Character limit
          })
        });
    
        const data = await response.json();
        return data.audio_url; // URL of generated audio
    }
    // Step 2: Create video with avatar
    const response = await fetch('https://runwayml.p.rapidapi.com/generate/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'text-to-video.p.rapidapi.com'
      },
      body: JSON.stringify({
        "avatar": "anna", // Pre-built avatar
        "voice": "default",
        "text": script.substring(0, 300), // Limit to 300 chars for MVP
        "audioUrl": audioUrl // Optional: Use pre-generated voiceover
      })
    });
  
    const data = await response.json();
    const videoUrl = data.videoUrl;
    
    // Embed video
    const container = document.getElementById('video-container');
    container.innerHTML = `<video controls><source src="${videoUrl}" type="video/mp4"></video>`;
}