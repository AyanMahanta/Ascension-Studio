const quill = new Quill('#editor', { theme: 'snow' });

// RapidAPI Config
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// GPT-4 Script Analysis
async function analyzeScript() {
  const script = quill.getText();

  try {
    const response = await fetch('https://cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY, // Replace with your key
        'X-RapidAPI-Host': 'cheapest-gpt-4-turbo-gpt-4-vision-chatgpt-openai-ai-api.p.rapidapi.com'
      },
      body: JSON.stringify({
        messages: [{
          role: "user",
          content: `Analyze this screenplay for plot structure, character development, and dialogue quality:\n\n${script}`
        }],
        model: "gpt-4o",
        max_tokens: 1000, // Increased for detailed analysis
        temperature: 0.7 // For more focused responses
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    const feedback = data.choices[0].message.content;
    
    // Format feedback with line breaks
    document.getElementById('feedback').innerHTML = 
      feedback.replace(/\n/g, '<br>');

  } catch (error) {
    console.error('Analysis failed:', error);
    alert('Failed to analyze script. Check console for details.');
  }
}

// Stable Diffusion Storyboards
async function generateStoryboard() {
  const prompt = quill.getText().split('\n')[0]; // Use first line as prompt

  try {
    const response = await fetch('https://open-ai21.p.rapidapi.com/texttoimage2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': RAPIDAPI_KEY, // Replace with your key
        'X-RapidAPI-Host': 'open-ai21.p.rapidapi.com'
      },
      body: JSON.stringify({
        text: prompt // API expects "text" field (not "prompt")
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    const container = document.getElementById('storyboard');
    container.innerHTML = ''; // Clear previous results

    // Create image element
    const img = document.createElement('img');
    img.src = data.imageUrl; // Verify response structure in API docs
    container.appendChild(img);

  } catch (error) {
    console.error('Storyboard generation failed:', error);
    alert('Failed to generate storyboard. Check console for details.');
  }
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
