const quill = new Quill('#editor', { theme: 'snow' });

// RapidAPI Config
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// GPT-4 Script Analysis
async function analyzeScript() {
  const script = quill.getText();
  
  const response = await fetch('https://ai-sentiment-analysis-text-insights-emotion-detection.p.rapidapi.com/analyzeBulkSentiment?noqueue=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'rapidapi.com'
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
  const text = quill.getText().substring(0, 100); // Use first line as prompt
  
  const response = await fetch('https://open-ai21.p.rapidapi.com/texttoimage2', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'rapidapi.com'
    },
    body: JSON.stringify({
      text: text
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
    async function generateVoiceover(text) {
        const response = await fetch('https://large-text-to-speech.p.rapidapi.com/tts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': 'rapidapi.com'
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
    const response = await fetch('https://runwayml-api1.p.rapidapi.com/generate/text', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'rapidapi.com'
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