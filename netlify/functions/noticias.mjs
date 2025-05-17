import fetch from 'node-fetch';

export async function handler(event, context) {
  // Endpoint da GNews API para notícias de bitcoin em português
  const API_KEY = 'b595542aba3a328d48c314adafc8366d';
  const url = `https://gnews.io/api/v4/search?q=bitcoin&lang=pt&token=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    // Adaptar para o formato esperado pelo frontend
    const articles = (data.articles || []).map(post => ({
      title: post.title,
      url: post.url,
      source: { name: post.source?.name || 'GNews' },
      publishedAt: post.publishedAt,
      description: post.description || '',
      urlToImage: post.image || undefined
    }));
    return {
      statusCode: 200,
      body: JSON.stringify({ articles }),
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  } catch (error) {
    console.error('Erro ao buscar notícias da GNews:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao buscar notícias.', details: error.message }),
    };
  }
} 