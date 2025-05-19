import { useState, useEffect, ChangeEvent } from 'react';

interface Post {
  id: string;
  texto: string;
  data: string;
  imagem?: string; // base64, pode ser undefined em posts antigos
}

const LOCAL_STORAGE_KEY = 'meu-diario-cripto-posts';
const ADMIN_PASSWORD = '198401*Fa';

const BlogDiario = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [novoPost, setNovoPost] = useState('');
  const [imagem, setImagem] = useState<string>('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [senha, setSenha] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [erroImagem, setErroImagem] = useState('');
  const [erroSenha, setErroSenha] = useState('');

  // Carregar posts do localStorage, garantindo compatibilidade
  useEffect(() => {
    const salvos = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (salvos) {
      try {
        const arr = JSON.parse(salvos);
        // Garante que todos os posts tenham o campo imagem
        setPosts(Array.isArray(arr) ? arr.map((p) => ({ imagem: '', ...p, ...p })) : []);
      } catch {
        setPosts([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(posts));
  }, [posts]);

  const handleSenha = () => {
    if (senha === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setErroSenha('');
      setShowAdminModal(false);
      setSenha('');
    } else {
      setErroSenha('Senha incorreta!');
    }
  };

  const handleImagem = (e: ChangeEvent<HTMLInputElement>) => {
    setErroImagem('');
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setErroImagem('A imagem deve ter no máximo 1MB.');
      setImagem('');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagem(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const publicar = () => {
    if (!novoPost.trim() || !imagem) return;
    const post: Post = {
      id: Date.now().toString(),
      texto: novoPost,
      data: new Date().toLocaleString('pt-BR'),
      imagem,
    };
    setPosts([post, ...posts]);
    setNovoPost('');
    setImagem('');
  };

  const excluirPost = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(posts.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4 relative">
      <h1 className="text-3xl font-bold text-white mb-6">Meu Diário Cripto</h1>

      {/* Ícone flutuante para admin */}
      {!isAdmin && (
        <button
          className="fixed bottom-8 right-8 z-50 bg-[#f7931a] hover:bg-[#e68a17] text-white rounded-full shadow-lg p-4 transition-colors"
          title="Entrar como admin"
          onClick={() => setShowAdminModal(true)}
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17v.01M12 13a4 4 0 100-8 4 4 0 000 8zm0 0v4m0 0h.01" />
          </svg>
        </button>
      )}

      {/* Modal de senha admin */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-[#181818] rounded-xl p-8 shadow border border-[#232323] w-full max-w-sm">
            <h2 className="text-xl text-white mb-4 font-bold">Acesso de Administrador</h2>
            <input
              type="password"
              className="w-full p-2 rounded bg-[#232323] text-white mb-2 focus:outline-none focus:ring-2 focus:ring-[#f7931a]"
              value={senha}
              onChange={e => setSenha(e.target.value)}
              placeholder="Senha de administrador"
              autoFocus
            />
            <div className="flex gap-2 mt-2">
              <button
                className="btn btn-primary px-6 py-2 font-semibold"
                onClick={handleSenha}
              >
                Entrar
              </button>
              <button
                className="btn btn-secondary px-6 py-2 font-semibold"
                onClick={() => { setShowAdminModal(false); setErroSenha(''); setSenha(''); }}
              >
                Cancelar
              </button>
            </div>
            {erroSenha && <div className="text-red-500 mt-2">{erroSenha}</div>}
          </div>
        </div>
      )}

      {/* Formulário de novo post (apenas admin) */}
      {isAdmin && (
        <div className="bg-[#181818] rounded-xl p-6 mb-8 shadow border border-[#232323]">
          <textarea
            className="w-full h-32 p-3 rounded bg-[#232323] text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#f7931a] mb-4"
            placeholder="Escreva aqui suas percepções, aprendizados ou desabafos sobre o mundo cripto..."
            value={novoPost}
            onChange={e => setNovoPost(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="mb-2 block text-white"
            onChange={handleImagem}
          />
          {erroImagem && <div className="text-red-500 mb-2">{erroImagem}</div>}
          <button
            className="btn btn-primary px-6 py-2 font-semibold"
            onClick={publicar}
            disabled={!novoPost.trim() || !imagem}
          >
            Publicar
          </button>
        </div>
      )}

      {/* Lista de posts */}
      <div className="space-y-6">
        {posts.length === 0 && (
          <div className="text-gray-400 text-center">Nenhum post ainda. Que tal começar agora?</div>
        )}
        {posts.map(post => (
          <div key={post.id} className="bg-[#232323] rounded-lg p-4 shadow border border-[#333] relative">
            <div className="text-xs text-gray-400 mb-2">{post.data}</div>
            {post.imagem && (
              <img src={post.imagem} alt="Imagem do post" className="mb-3 rounded max-h-64 w-auto mx-auto" />
            )}
            <div className="text-white whitespace-pre-line">{post.texto}</div>
            {isAdmin && (
              <button
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                title="Excluir post"
                onClick={() => excluirPost(post.id)}
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogDiario; 