const quill = new Quill('#editor', { theme: 'snow' });

// RapidAPI Config
const RAPIDAPI_KEY = "7008b40800mshf5151d0bd0f91a4p1242b7jsnfca887897331";

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
  try {
    const response = await fetch('/.netlify/functions/video', {
      method: 'POST',
      body: JSON.stringify({ prompt: quill.getText() })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    const container = document.getElementById('video-container');
    
    // Clear previous content
    container.innerHTML = '';
    
    // Create video element
    const video = document.createElement('video');
    video.controls = true;
    video.src = data.videoUrl; // Verify response structure
    container.appendChild(video);

  } catch (error) {
    console.error('Video generation failed:', error);
    alert('Error: Video generation failed. Check console for details.');
  }
}
