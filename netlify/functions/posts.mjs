import { createClient } from '@supabase/supabase-js';

// Inicializa o cliente Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function handler(event, context) {
  // Configuração do CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE'
  };

  // Se for uma requisição OPTIONS (preflight), retorna apenas os headers
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers
    };
  }

  try {
    switch (event.httpMethod) {
      case 'GET':
        // Buscar todos os posts
        const { data: posts, error: fetchError } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ posts })
        };

      case 'POST':
        // Criar novo post
        const { texto, imagem } = JSON.parse(event.body);
        
        const { data: newPost, error: insertError } = await supabase
          .from('posts')
          .insert([
            { 
              texto,
              imagem,
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        return {
          statusCode: 201,
          headers,
          body: JSON.stringify({ post: newPost })
        };

      case 'DELETE':
        // Deletar post
        const { id } = JSON.parse(event.body);
        
        const { error: deleteError } = await supabase
          .from('posts')
          .delete()
          .eq('id', id);

        if (deleteError) throw deleteError;

        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ message: 'Post deletado com sucesso' })
        };

      default:
        return {
          statusCode: 405,
          headers,
          body: JSON.stringify({ error: 'Método não permitido' })
        };
    }
  } catch (error) {
    console.error('Erro:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erro interno do servidor', details: error.message })
    };
  }
} 