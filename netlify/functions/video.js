// netlify/functions/video.js
exports.handler = async (event) => {
    const { prompt } = JSON.parse(event.body);
    const response = await fetch('https://text-to-video3.p.rapidapi.com/MediaToVideo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
        'X-RapidAPI-Host': 'text-to-video3.p.rapidapi.com'
      },
      body: JSON.stringify({ prompt })
    });
    return { statusCode: 200, body: JSON.stringify(await response.json()) };
  };