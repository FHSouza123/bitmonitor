const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Configuração do ambiente Supabase\n');

rl.question('Digite a URL do seu projeto Supabase: ', (supabaseUrl) => {
  rl.question('Digite a chave anônima do Supabase: ', (supabaseKey) => {
    const envContent = `# Supabase
SUPABASE_URL=${supabaseUrl}
SUPABASE_ANON_KEY=${supabaseKey}
`;

    // Criar arquivo .env
    fs.writeFileSync(path.join(__dirname, '..', '.env'), envContent);
    console.log('\nArquivo .env criado com sucesso!');

    // Criar arquivo .env.example
    fs.writeFileSync(
      path.join(__dirname, '..', '.env.example'),
      `# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
`
    );
    console.log('Arquivo .env.example criado com sucesso!');

    console.log('\nPróximos passos:');
    console.log('1. Adicione as mesmas variáveis de ambiente no painel do Netlify');
    console.log('2. Execute o comando: npm run build');
    console.log('3. Faça o deploy para o Netlify');

    rl.close();
  });
}); 