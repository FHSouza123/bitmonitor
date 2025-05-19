import { createClient } from '@supabase/supabase-js';

export async function handler(event, context) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Criar a tabela posts se não existir
    const { error } = await supabase
      .from('posts')
      .select('id')
      .limit(1);

    if (error && error.code === '42P01') { // Tabela não existe
      const { error: createError } = await supabase.rpc('create_posts_table');
      if (createError) throw createError;
    } else if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Banco de dados inicializado com sucesso' })
    };
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Erro ao inicializar banco de dados', details: error.message })
    };
  }
} 