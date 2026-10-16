import { useEffect, useRef, useState } from "react";
import { api } from "../../services/api";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import MenuAuraviva from "../MenuAuraviva/MenuAuraviva";
import { artigos, criarSlugArtigo } from "../Blog/artigos";
import AcompanhamentoPedidos from "./AcompanhamentoPedidos";
import { api, sincronizarPedidos } from "../../services/api";
import { produtos } from "../Produto/Produto";
import styles from "./Perfil.module.css";

const CHAVE_USUARIO = "auraviva-usuario";
const CHAVE_FOTO = "auraviva-foto-perfil";
const CHAVE_WISHLIST = "auraviva-wishlist";
const CHAVE_PEDIDOS = "auraviva-pedidos";
const CHAVE_ENDERECOS = "auraviva-enderecos";
const CHAVE_SUPORTE = "auraviva-solicitacoes-suporte";
const CHAVE_AVALIACOES = "auraviva-avaliacoes";

const enderecoVazio = {
  pais: "Brasil",
  estado: "",
  municipio: "",
  cidade: "",
  bairro: "",
  logradouro: "",
  numero: "",
  complemento: "",
  cep: "",
  referencia: "",
};

const criarIdAvaliacao = () => `AVA-${Date.now()}`;

const obterChaveFeedbackBlog = () => {
  const usuarioSalvo = lerLocalStorage(CHAVE_USUARIO, {});
  const identificador = (usuarioSalvo.email || usuarioSalvo.nome || "visitante").trim().toLowerCase();
  return `auraviva-blog-feedback-${identificador || "visitante"}`;
};

const obterAutorAtual = () => {
  const usuarioSalvo = lerLocalStorage(CHAVE_USUARIO, {});
  const nome = (usuarioSalvo.nome || "Você").trim();
  return nome || "Você";
};

const secoes = [
  { id: "perfil", nome: "Meu perfil", icone: "person" },
  { id: "pedidos", nome: "Meus pedidos", icone: "inventory_2" },
  { id: "entregas", nome: "Acompanhamento de entregas", icone: "local_shipping" },
  { id: "sementes", nome: "Minhas sementes e recomendações", icone: "psychiatry" },
  { id: "suporte", nome: "Ajuda e suporte", icone: "support_agent" },
  { id: "avaliacoes", nome: "Minhas avaliações", icone: "reviews" },
  { id: "documentos", nome: "Documentos dos pedidos", icone: "description" },
  { id: "enderecos", nome: "Meus endereços", icone: "location_on" },
  { id: "carteira", nome: "Minha carteira", icone: "account_balance_wallet" },
  { id: "comentarios", nome: "Comentários no blog", icone: "chat_bubble" },
  { id: "curtidas", nome: "Curtidas no blog", icone: "favorite" },
  { id: "desejos", nome: "Minha lista de desejos", icone: "bookmark" },
  { id: "conta", nome: "Minha conta", icone: "manage_accounts" },
  { id: "notificacoes", nome: "Notificações", icone: "notifications" },
  { id: "privacidade", nome: "Segurança e privacidade", icone: "security" },
  { id: "configuracoes", nome: "Configurações", icone: "settings" },
  { id: "sair", nome: "Sair da conta", icone: "logout" },
];

const estadosVazios = {
  pedidos: {
    icone: "inventory_2",
    titulo: "Seus pedidos aparecerão aqui",
    descricao: "Quando você fizer uma compra, poderá acompanhar o andamento por esta página.",
    acao: "Explorar produtos",
  },
  enderecos: {
    icone: "location_on",
    titulo: "Nenhum endereço cadastrado",
    descricao: "Seus endereços de entrega ficarão organizados aqui para facilitar suas próximas compras.",
  },
  carteira: {
    icone: "account_balance_wallet",
    titulo: "Sua carteira está vazia",
    descricao: "Créditos e formas de pagamento salvos serão exibidos aqui quando esse recurso estiver disponível.",
  },
  comentarios: {
    icone: "chat_bubble",
    titulo: "Você ainda não comentou no blog",
    descricao: "Seus comentários nas publicações da Auraviva aparecerão aqui.",
    acao: "Visitar o blog",
    destino: "/auraviva/blog",
  },
  curtidas: {
    icone: "favorite",
    titulo: "Nenhuma curtida por enquanto",
    descricao: "As publicações do blog que você curtir ficarão reunidas nesta área.",
    acao: "Visitar o blog",
    destino: "/auraviva/blog",
  },
  desejos: {
    icone: "bookmark",
    titulo: "Sua lista de desejos está vazia",
    descricao: "Salve produtos para encontrá-los facilmente quando quiser voltar a eles.",
    acao: "Encontrar sementes",
    destino: "/auraviva/produtos",
  },
};

const lerLocalStorage = (chave, valorPadrao) => {
  try {
    const valorSalvo = localStorage.getItem(chave);
    return valorSalvo ? JSON.parse(valorSalvo) : valorPadrao;
  } catch {
    return valorPadrao;
  }
};

const obterComentariosDoBlog = () => {
  const feedback = lerLocalStorage(obterChaveFeedbackBlog(), {});
  const autorAtual = obterAutorAtual();

  return Object.entries(feedback).flatMap(([slug, valor]) => {
    const titulo = artigos.find((artigo) => criarSlugArtigo(artigo.titulo) === slug)?.titulo || slug;

    return (valor?.comments ?? [])
      .filter((comentario) => {
        const autor = comentario?.autor;
        return !autor || autor === autorAtual || autor === "Você";
      })
      .map((comentario) => ({
        ...comentario,
        slug,
        titulo,
      }));
  });
};

const obterCurtidasDoBlog = () => {
  const feedback = lerLocalStorage(obterChaveFeedbackBlog(), {});

  return Object.entries(feedback)
    .filter(([, valor]) => valor?.liked)
    .map(([slug, valor]) => ({
      slug,
      titulo: artigos.find((artigo) => criarSlugArtigo(artigo.titulo) === slug)?.titulo || slug,
      likes: valor?.likes ?? 0,
      data: valor?.curtidoEm || "Hoje",
    }));
};

const Perfil = () => {
  const navigate = useNavigate();
  const usuarioSalvo = lerLocalStorage(CHAVE_USUARIO, {});
  const [usuario, setUsuario] = useState({
    nome: usuarioSalvo.nome || "Visitante",
    email: usuarioSalvo.email || "",
  });
  const [formulario, setFormulario] = useState({
    nome: usuarioSalvo.nome || "",
    email: usuarioSalvo.email || "",
  });
  const [foto, setFoto] = useState(() => localStorage.getItem(CHAVE_FOTO) || "");
  const [searchParams] = useSearchParams();
  const [secaoAtiva, setSecaoAtiva] = useState(() => searchParams.get("secao") || "perfil");
  const [mensagem, setMensagem] = useState("");
  const [listaDeDesejos, setListaDeDesejos] = useState(() => lerLocalStorage(CHAVE_WISHLIST, []));
  const [, setVersaoPedidos] = useState(0);
  const pedidosSalvos = lerLocalStorage(CHAVE_PEDIDOS, []);
  const pedidos = Array.isArray(pedidosSalvos)
    ? pedidosSalvos.filter((pedido) => !pedido.cliente?.email || pedido.cliente.email === usuarioSalvo.email)
    : [];
  const [enderecos, setEnderecos] = useState(() => {
    const salvos = lerLocalStorage(CHAVE_ENDERECOS, []);
    return Array.isArray(salvos) ? salvos : [];
  });
  const [novoEndereco, setNovoEndereco] = useState({ ...enderecoVazio });
  const [preferencias, setPreferencias] = useState(() => lerLocalStorage("auraviva-notificacoes", {
    pedidos: true,
    novidades: false,
  }));
  const mesAtual = new Date().getMonth();
  const estacaoInicial = mesAtual >= 8 && mesAtual <= 11 ? "verao" : "inverno";
  const [preferenciasCultivo, setPreferenciasCultivo] = useState(() => lerLocalStorage(
    `auraviva-preferencias-cultivo-${usuarioSalvo.email || "visitante"}`,
    { regiao: "", estacao: estacaoInicial },
  ));
  const [solicitacoes, setSolicitacoes] = useState(() => {
    const salvas = lerLocalStorage(CHAVE_SUPORTE, []);
    return Array.isArray(salvas) ? salvas.filter((solicitacao) => solicitacao.email === usuarioSalvo.email) : [];
  });
  const [avaliacoes, setAvaliacoes] = useState(() => {
    const salvas = lerLocalStorage(CHAVE_AVALIACOES, []);
    return Array.isArray(salvas) ? salvas.filter((avaliacao) => avaliacao.email === usuarioSalvo.email) : [];
  });
  const [avaliacaoEmEdicao, setAvaliacaoEmEdicao] = useState(null);
  const [consentimentos, setConsentimentos] = useState(() => lerLocalStorage(
    `auraviva-consentimentos-${usuarioSalvo.email || "visitante"}`,
    { novidades: false, personalizacao: true },
  ));

  // Traz os pedidos do banco
  useEffect(() => {
    sincronizarPedidos(false)
      .then(() => setVersaoPedidos((versao) => versao + 1))
      .catch(() => {});
  }, []);

  // Sincroniza endereços com o banco ao abrir a aba
  const enderecosSincronizados = useRef(false);
  useEffect(() => {
    if (secaoAtiva !== "enderecos" || enderecosSincronizados.current) return;
    enderecosSincronizados.current = true;
    api.listarEnderecos()
      .then((lista) => {
        setEnderecos(lista);
        localStorage.setItem(CHAVE_ENDERECOS, JSON.stringify(lista));
      })
      .catch(() => { /* mantém os locais */ });
  }, [secaoAtiva]);

  // Sincroniza wishlist com o banco ao abrir a aba
  const wishlistSincronizada = useRef(false);
  useEffect(() => {
    if (secaoAtiva !== "desejos" || wishlistSincronizada.current) return;
    wishlistSincronizada.current = true;
    api.listarWishlist()
      .then((lista) => {
        setListaDeDesejos(lista);
        localStorage.setItem(CHAVE_WISHLIST, JSON.stringify(lista));
      })
      .catch(() => { /* mantém os locais */ });
  }, [secaoAtiva]);

  const iniciais = usuario.nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase() || "A";
  const secao = secoes.find((item) => item.id === secaoAtiva);
  const produtosComprados = [...new Map(pedidos
    .flatMap((pedido) => Array.isArray(pedido.itens) ? pedido.itens : [])
    .map((item) => [item.id || item.nome, item])).values()];
  const avaliacoesPermitidas = new Set(produtosComprados.map((item) => item.id || item.nome));
  const produtosRecomendados = produtos.filter((produto) =>
    (!consentimentos.personalizacao || produto.estacaoId === preferenciasCultivo.estacao)
      && (!produtosComprados.some((item) => item.nome === produto.nome)),
  ).slice(0, 6);

  const atualizarFormulario = (event) => {
    const { name, value } = event.target;
    setFormulario((atual) => ({ ...atual, [name]: value }));
  };

  const atualizarEndereco = (event) => {
    const { name, value } = event.target;
    setNovoEndereco((atual) => ({ ...atual, [name]: value }));
  };

  const salvarEndereco = async (event) => {
    event.preventDefault();
    try {
      const criado = await api.criarEndereco({ ...novoEndereco });
      const lista = [...enderecos, criado];
      setEnderecos(lista);
      localStorage.setItem(CHAVE_ENDERECOS, JSON.stringify(lista));
      setNovoEndereco({ ...enderecoVazio });
      setMensagem("Endereço adicionado com sucesso.");
    } catch (erro) {
      // Fallback local se a API estiver fora
      const endereco = { ...novoEndereco, id: `local-${Date.now()}`, email: usuario.email };
      const lista = [...enderecos, endereco];
      localStorage.setItem(CHAVE_ENDERECOS, JSON.stringify(lista));
      setEnderecos(lista);
      setNovoEndereco({ ...enderecoVazio });
      setMensagem("Endereço salvo localmente. Sincronize quando a conexão voltar.");
    }
  };

  const removerEndereco = async (id) => {
    try {
      if (!String(id).startsWith("local-")) await api.excluirEndereco(id);
    } catch { /* ignora */ }
    const lista = enderecos.filter((e) => e.id !== id);
    localStorage.setItem(CHAVE_ENDERECOS, JSON.stringify(lista));
    setEnderecos(lista);
    setMensagem("Endereço removido.");
  };

  const salvarPerfil = async (event) => {
    event.preventDefault();
    const nome = formulario.nome.trim();
    try {
      await api.atualizarPerfil({ nome, telefone: formulario.telefone || "" });
      const usuarioCompleto = { ...lerLocalStorage(CHAVE_USUARIO, {}), nome };
      localStorage.setItem(CHAVE_USUARIO, JSON.stringify(usuarioCompleto));
      const sessaoAtual = lerLocalStorage("auraviva-sessao", null);
      if (sessaoAtual?.tipoPerfil === "cliente") {
        localStorage.setItem("auraviva-sessao", JSON.stringify({ ...sessaoAtual, nome }));
      }
      setUsuario((u) => ({ ...u, nome }));
      setMensagem("Seus dados foram atualizados.");
    } catch (erro) {
      setMensagem(erro.message || "Não foi possível atualizar os dados.");
    }
  };

  const carregarFoto = (event) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      setMensagem("Escolha um arquivo de imagem.");
      return;
    }

    if (arquivo.size > 8 * 1024 * 1024) {
      setMensagem("A imagem deve ter no máximo 8 MB.");
      return;
    }

    const leitor = new FileReader();
    leitor.onload = () => {
      const imagem = new Image();
      imagem.onload = () => {
        const tamanho = 320;
        const escala = Math.min(1, tamanho / Math.max(imagem.width, imagem.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(imagem.width * escala);
        canvas.height = Math.round(imagem.height * escala);
        canvas.getContext("2d").drawImage(imagem, 0, 0, canvas.width, canvas.height);
        const fotoOtimizada = canvas.toDataURL("image/jpeg", 0.82);

        try {
          localStorage.setItem(CHAVE_FOTO, fotoOtimizada);
          setFoto(fotoOtimizada);
          setMensagem("Sua foto de perfil foi atualizada.");
        } catch {
          setMensagem("Não foi possível salvar essa imagem. Tente escolher uma foto menor.");
        }
      };
      imagem.onerror = () => setMensagem("Não foi possível abrir essa imagem.");
      imagem.src = leitor.result;
    };
    leitor.onerror = () => setMensagem("Não foi possível carregar essa imagem.");
    leitor.readAsDataURL(arquivo);
    event.target.value = "";
  };

  const atualizarPreferencia = (event) => {
    const { name, checked } = event.target;
    const novasPreferencias = { ...preferencias, [name]: checked };
    setPreferencias(novasPreferencias);
    localStorage.setItem("auraviva-notificacoes", JSON.stringify(novasPreferencias));
  };

  const atualizarConsentimento = (event) => {
    const { name, checked } = event.target;
    const novosConsentimentos = { ...consentimentos, [name]: checked };
    localStorage.setItem(
      `auraviva-consentimentos-${usuario.email || "visitante"}`,
      JSON.stringify(novosConsentimentos),
    );
    setConsentimentos(novosConsentimentos);
  };

  const salvarPreferenciasCultivo = (event) => {
    event.preventDefault();
    localStorage.setItem(
      `auraviva-preferencias-cultivo-${usuario.email || "visitante"}`,
      JSON.stringify(preferenciasCultivo),
    );
    setMensagem("Suas preferências de cultivo foram salvas.");
  };

  const enviarSolicitacaoSuporte = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const solicitacao = {
      id: `SUP-${Date.now()}`,
      email: usuario.email,
      assunto: String(form.get("assunto") || "").trim(),
      categoria: String(form.get("categoria") || "duvida"),
      mensagem: String(form.get("mensagem") || "").trim(),
      status: "Recebida",
      criadaEm: new Date().toISOString(),
    };
    const todasSolicitacoes = lerLocalStorage(CHAVE_SUPORTE, []);
    const atualizadas = [solicitacao, ...(Array.isArray(todasSolicitacoes) ? todasSolicitacoes : [])];
    try {
      localStorage.setItem(CHAVE_SUPORTE, JSON.stringify(atualizadas));
      setSolicitacoes((atuais) => [solicitacao, ...atuais]);
      event.currentTarget.reset();
      setMensagem("Sua solicitação foi registrada neste navegador.");
    } catch {
      setMensagem("Não foi possível registrar a solicitação neste navegador.");
    }
  };

  const salvarAvaliacao = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const produtoId = String(form.get("produto") || "");
    const produto = produtosComprados.find((item) => (item.id || item.nome) === produtoId);
    if (!produto) {
      setMensagem("Selecione um produto de um pedido para avaliar.");
      return;
    }
    const avaliacao = {
      id: avaliacaoEmEdicao?.id || criarIdAvaliacao(),
      email: usuario.email,
      produtoId,
      produto: produto.nome,
      nota: Number(form.get("nota")),
      comentario: String(form.get("comentario") || "").trim(),
      atualizadaEm: new Date().toISOString(),
    };
    const todasAvaliacoes = lerLocalStorage(CHAVE_AVALIACOES, []);
    const outrasAvaliacoes = (Array.isArray(todasAvaliacoes) ? todasAvaliacoes : [])
      .filter((item) => item.id !== avaliacao.id);
    try {
      localStorage.setItem(CHAVE_AVALIACOES, JSON.stringify([...outrasAvaliacoes, avaliacao]));
      setAvaliacoes((atuais) => [...atuais.filter((item) => item.id !== avaliacao.id), avaliacao]);
      setAvaliacaoEmEdicao(null);
      event.currentTarget.reset();
      setMensagem("Sua avaliação foi salva.");
    } catch {
      setMensagem("Não foi possível salvar sua avaliação neste navegador.");
    }
  };

  const removerAvaliacao = (id) => {
    const todasAvaliacoes = lerLocalStorage(CHAVE_AVALIACOES, []);
    const atualizadas = (Array.isArray(todasAvaliacoes) ? todasAvaliacoes : [])
      .filter((item) => item.id !== id);
    try {
      localStorage.setItem(CHAVE_AVALIACOES, JSON.stringify(atualizadas));
      setAvaliacoes((atuais) => atuais.filter((item) => item.id !== id));
      setAvaliacaoEmEdicao((atual) => atual?.id === id ? null : atual);
      setMensagem("Avaliação removida.");
    } catch {
      setMensagem("Não foi possível remover a avaliação neste navegador.");
    }
  };

  const solicitarExclusaoConta = () => {
    const pedidosExclusao = lerLocalStorage("auraviva-solicitacoes-exclusao", []);
    const lista = Array.isArray(pedidosExclusao) ? pedidosExclusao : [];
    if (lista.some((pedido) => pedido.email === usuario.email && pedido.status === "Pendente")) {
      setMensagem("Já existe uma solicitação de exclusão pendente para esta conta.");
      return;
    }
    try {
      localStorage.setItem("auraviva-solicitacoes-exclusao", JSON.stringify([
        { email: usuario.email, criadaEm: new Date().toISOString(), status: "Pendente" },
        ...lista,
      ]));
      setMensagem("Solicitação registrada neste navegador. A exclusão exige análise e atendimento da equipe Auraviva.");
    } catch {
      setMensagem("Não foi possível registrar a solicitação neste navegador.");
    }
  };

  const encerrarSessao = () => {
    api.sair().catch(() => {});
    localStorage.removeItem("auraviva-sessao");
    navigate("/auraviva/login", { replace: true });
  };

  const removerDaListaDeDesejos = async (id) => {
    try {
      await api.removerWishlist(id);
    } catch { /* ignora: remove localmente de qualquer forma */ }
    const lista = listaDeDesejos ? listaDeDesejos.filter((p) => p.id !== id) : [];
    setListaDeDesejos(lista);
    localStorage.setItem(CHAVE_WISHLIST, JSON.stringify(lista));
  };

  const renderizarConteudo = () => {
    const comentariosBlog = obterComentariosDoBlog();
    const curtidasBlog = obterCurtidasDoBlog();

    if (secaoAtiva === "perfil") {
      return (
        <form className={styles.profileForm} onSubmit={salvarPerfil}>
          <div className={styles.formHeading}>
            <h3>Dados pessoais</h3>
            <p>Atualize as informações associadas à sua conta.</p>
          </div>
          <div className={styles.formGrid}>
            <label>
              Nome
              <input name="nome" value={formulario.nome} onChange={atualizarFormulario} placeholder="Seu nome" required />
            </label>
            <label>
              E-mail
              <input name="email" type="email" value={formulario.email} onChange={atualizarFormulario} placeholder="voce@email.com" required />
            </label>
          </div>
          <button type="submit" className={styles.primaryButton}>Salvar alterações</button>
        </form>
      );
    }

    if (secaoAtiva === "enderecos") {
      return (
        <div className={styles.addresses}>
          <form className={styles.addressForm} onSubmit={salvarEndereco}>
            <div className={styles.formHeading}>
              <h3>Adicionar endereço</h3>
              <p>Informe os dados completos para facilitar suas próximas entregas.</p>
            </div>
            <div className={styles.formGrid}>
              <label>
                País
                <input name="pais" value={novoEndereco.pais} onChange={atualizarEndereco} autoComplete="country-name" required />
              </label>
              <label>
                Estado / UF
                <input name="estado" value={novoEndereco.estado} onChange={atualizarEndereco} autoComplete="address-level1" required />
              </label>
              <label>
                Município
                <input name="municipio" value={novoEndereco.municipio} onChange={atualizarEndereco} required />
              </label>
              <label>
                Cidade
                <input name="cidade" value={novoEndereco.cidade} onChange={atualizarEndereco} autoComplete="address-level2" required />
              </label>
              <label>
                Bairro
                <input name="bairro" value={novoEndereco.bairro} onChange={atualizarEndereco} required />
              </label>
              <label>
                Rua / Avenida
                <input name="logradouro" value={novoEndereco.logradouro} onChange={atualizarEndereco} autoComplete="street-address" required />
              </label>
              <label>
                Número
                <input name="numero" value={novoEndereco.numero} onChange={atualizarEndereco} required />
              </label>
              <label>
                Complemento
                <input name="complemento" value={novoEndereco.complemento} onChange={atualizarEndereco} />
              </label>
              <label>
                CEP / Código postal
                <input name="cep" value={novoEndereco.cep} onChange={atualizarEndereco} autoComplete="postal-code" required />
              </label>
              <label>
                Ponto de referência
                <input name="referencia" value={novoEndereco.referencia} onChange={atualizarEndereco} />
              </label>
            </div>
            <button type="submit" className={styles.primaryButton}>Adicionar endereço</button>
          </form>

          {enderecos.length > 0 && (
            <div className={styles.savedAddresses}>
              <h3>Endereços cadastrados</h3>
              {enderecos.map((endereco, indice) => (
                <article className={styles.addressCard} key={endereco.id}>
                  <div className={styles.addressCardHeader}>
                    <h4>Endereço {indice + 1}</h4>
                    <button type="button" className={styles.secondaryButton} onClick={() => removerEndereco(endereco.id)}>
                      Remover
                    </button>
                  </div>
                  <p>{endereco.logradouro}, {endereco.numero}{endereco.complemento && ` - ${endereco.complemento}`}</p>
                  <p>{endereco.bairro}, {endereco.cidade} - {endereco.estado}</p>
                  <p>{endereco.municipio} · {endereco.cep}</p>
                  <p>{endereco.pais}{endereco.referencia && ` · Referência: ${endereco.referencia}`}</p>
                </article>
              ))}
            </div>
          )}
          <p className={styles.localDataNote}>Seus endereços ficam salvos apenas neste navegador.</p>
        </div>
      );
    }

    if (secaoAtiva === "conta") {
      return (
        <div className={styles.accountDetails}>
          <div className={styles.formHeading}>
            <h3>Informações da conta</h3>
            <p>Dados básicos usados para identificar sua conta Auraviva.</p>
          </div>
          <dl>
            <div><dt>Nome</dt><dd>{usuario.nome}</dd></div>
            <div><dt>E-mail</dt><dd>{usuario.email || "Não informado"}</dd></div>
            <div><dt>Conta</dt><dd>{usuario.email ? "Cadastrada" : "Ainda sem cadastro"}</dd></div>
          </dl>
          <button type="button" className={styles.secondaryButton} onClick={() => setSecaoAtiva("perfil")}>
            Editar dados pessoais
          </button>
        </div>
      );
    }

    if (secaoAtiva === "notificacoes") {
      return (
        <div className={styles.preferences}>
          <div className={styles.formHeading}>
            <h3>Preferências de notificações</h3>
            <p>Escolha quais atualizações gostaria de receber.</p>
          </div>
          <label className={styles.preferenceRow}>
            <span><strong>Atualizações de pedidos</strong><small>Avisos sobre o andamento das suas compras.</small></span>
            <input type="checkbox" name="pedidos" checked={preferencias.pedidos} onChange={atualizarPreferencia} />
          </label>
          <label className={styles.preferenceRow}>
            <span><strong>Novidades da Auraviva</strong><small>Conteúdos, sementes e novidades da loja.</small></span>
            <input type="checkbox" name="novidades" checked={preferencias.novidades} onChange={atualizarPreferencia} />
          </label>
        </div>
      );
    }

    if (secaoAtiva === "configuracoes") {
      return (
        <div className={styles.accountDetails}>
          <div className={styles.formHeading}>
            <h3>Configurações da conta</h3>
            <p>Gerencie suas preferências pessoais.</p>
          </div>
          <button type="button" className={styles.secondaryButton} onClick={() => setSecaoAtiva("notificacoes")}>
            Ajustar notificações
          </button>
          <p className={styles.localDataNote}>Seus dados de perfil ficam salvos neste navegador.</p>
        </div>
      );
    }

    if (secaoAtiva === "entregas") {
      const pedidosEmEntrega = pedidos.filter((pedido) => pedido.status !== "cancelado");
      return pedidosEmEntrega.length > 0 ? (
        <>
          <p className={styles.localDataNote}>Acompanhe cada etapa, previsão de entrega e código de rastreamento, quando disponíveis.</p>
          <AcompanhamentoPedidos pedidos={pedidosEmEntrega} />
        </>
      ) : (
        <div className={styles.emptyState}>
          <span className={`material-symbols-outlined ${styles.emptyIcon}`} aria-hidden="true">local_shipping</span>
          <h3>Nenhuma entrega em andamento</h3>
          <p>Quando você fizer um pedido, poderá acompanhar o envio por aqui.</p>
          <Link className={styles.secondaryButton} to="/auraviva/produtos">Explorar sementes</Link>
        </div>
      );
    }

    if (secaoAtiva === "sementes") {
      return (
        <div className={styles.customerSections}>
          <form className={styles.employeeForm} onSubmit={salvarPreferenciasCultivo}>
            <div className={styles.formHeading}>
              <h3>Preferências de cultivo</h3>
              <p>Escolha sua região e a época de plantio para consultar sugestões sazonais.</p>
            </div>
            <div className={styles.employeeGrid}>
              <label>Região de plantio
                <select value={preferenciasCultivo.regiao} onChange={(event) => setPreferenciasCultivo({ ...preferenciasCultivo, regiao: event.target.value })}>
                  <option value="">Selecione uma região</option>
                  <option value="norte">Norte</option><option value="nordeste">Nordeste</option>
                  <option value="centro-oeste">Centro-Oeste</option><option value="sudeste">Sudeste</option>
                  <option value="sul">Sul</option>
                </select>
              </label>
              <label>Época do ano
                <select value={preferenciasCultivo.estacao} onChange={(event) => setPreferenciasCultivo({ ...preferenciasCultivo, estacao: event.target.value })}>
                  <option value="verao">Verão</option><option value="inverno">Inverno</option>
                </select>
              </label>
            </div>
            <p className={styles.localDataNote}>As sugestões usam a estação selecionada. A região fica salva, mas o catálogo ainda não contém dados agronômicos regionais para filtrar produtos por localidade.</p>
            <button className={styles.primaryButton} type="submit">Salvar preferências</button>
          </form>
          {produtosComprados.length > 0 && (
            <section className={styles.customerSection}>
              <h3>Produtos dos seus pedidos</h3>
              <div className={styles.customerProductGrid}>
                {produtosComprados.map((item) => {
                  const produto = produtos.find((catalogo) => catalogo.nome === item.nome);
                  return (
                    <article className={styles.customerProductCard} key={item.id || item.nome}>
                      {produto?.imagem && <img src={produto.imagem} alt={produto.alt || produto.nome} />}
                      <div><span>{produto?.estacao || "Auraviva"}</span><h4>{item.nome}</h4>
                        <Link className={styles.tableLink} to={`/auraviva/produtos?q=${encodeURIComponent(item.nome)}`}>Consultar ficha do produto</Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
          <section className={styles.customerSection}>
            <h3>{consentimentos.personalizacao ? `Recomendadas para ${preferenciasCultivo.estacao === "verao" ? "o verão" : "o inverno"}` : "Sugestões do catálogo"}</h3>
            {produtosRecomendados.length > 0 ? (
              <div className={styles.customerProductGrid}>
                {produtosRecomendados.map((produto) => (
                  <article className={styles.customerProductCard} key={produto.nome}>
                    <img src={produto.imagem} alt={produto.alt || produto.nome} />
                    <div><span>{produto.categoria} · {produto.estacao}</span><h4>{produto.nome}</h4>
                      <Link className={styles.tableLink} to={`/auraviva/produtos?q=${encodeURIComponent(produto.nome)}`}>Ver ficha e produto</Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : <p className={styles.localDataNote}>Nenhuma recomendação disponível para esta estação.</p>}
            <p className={styles.localDataNote}>As sugestões são informativas e não substituem orientação agronômica local.</p>
          </section>
        </div>
      );
    }

    if (secaoAtiva === "suporte") {
      return (
        <div className={styles.customerSections}>
          <section className={styles.customerSection}>
            <h3>Dúvidas frequentes</h3>
            <details><summary>Como acompanho um pedido?</summary><p>Acesse “Acompanhamento de entregas” para consultar etapas, previsão e rastreamento disponíveis.</p></details>
            <details><summary>Como encontro informações de uma semente?</summary><p>Na área “Minhas sementes e recomendações”, abra a ficha do produto comprado ou recomendado.</p></details>
            <details><summary>Como falar com a equipe?</summary><p>Envie uma solicitação abaixo ou escreva para <a href="mailto:contato@auraviva.com">contato@auraviva.com</a>.</p></details>
          </section>
          <form className={styles.employeeForm} onSubmit={enviarSolicitacaoSuporte}>
            <div className={styles.formHeading}><h3>Entrar em contato</h3><p>Descreva sua dúvida e informe o número do pedido, se aplicável.</p></div>
            <div className={styles.employeeGrid}>
              <label>Assunto<input name="assunto" required maxLength="100" /></label>
              <label>Tipo de solicitação<select name="categoria"><option value="duvida">Dúvida</option><option value="pedido">Pedido ou entrega</option><option value="produto">Produto ou semente</option><option value="conta">Conta e privacidade</option></select></label>
              <label className={styles.fullWidth}>Mensagem<textarea name="mensagem" rows="4" required maxLength="1500" /></label>
            </div>
            <button type="submit" className={styles.primaryButton}>Enviar solicitação</button>
          </form>
          <section className={styles.customerSection}>
            <h3>Minhas solicitações</h3>
            {solicitacoes.length ? <div className={styles.activityList}>{solicitacoes.map((solicitacao) => (
              <article className={styles.activityCard} key={solicitacao.id}>
                <span className={styles.activityTag}>{solicitacao.status}</span>
                <h3>{solicitacao.assunto}</h3><p>{solicitacao.mensagem}</p><small>{solicitacao.id} · {solicitacao.categoria} · {solicitacao.criadaEm}</small>
              </article>
            ))}</div> : <p className={styles.localDataNote}>Você ainda não enviou solicitações.</p>}
            <p className={styles.localDataNote}>As solicitações são salvas localmente neste protótipo; ainda não há integração para encaminhá-las à equipe.</p>
          </section>
        </div>
      );
    }

    if (secaoAtiva === "avaliacoes") {
      const avaliacaoInicial = avaliacaoEmEdicao || {};
      return (
        <div className={styles.customerSections}>
          <form key={avaliacaoEmEdicao?.id || "nova-avaliacao"} className={styles.employeeForm} onSubmit={salvarAvaliacao}>
            <div className={styles.formHeading}><h3>{avaliacaoEmEdicao ? "Editar avaliação" : "Avaliar um produto"}</h3><p>As avaliações ficam disponíveis para produtos presentes nos seus pedidos.</p></div>
            {produtosComprados.length > 0 ? (
              <>
                <div className={styles.employeeGrid}>
                  <label>Produto
                    <select name="produto" defaultValue={avaliacaoInicial.produtoId || ""} required>
                      <option value="" disabled>Selecione um produto comprado</option>
                      {produtosComprados.map((item) => <option key={item.id || item.nome} value={item.id || item.nome}>{item.nome}</option>)}
                    </select>
                  </label>
                  <label>Nota
                    <select name="nota" defaultValue={avaliacaoInicial.nota || 5}>
                      <option value="5">5 — Excelente</option><option value="4">4 — Muito bom</option>
                      <option value="3">3 — Bom</option><option value="2">2 — Regular</option><option value="1">1 — Ruim</option>
                    </select>
                  </label>
                  <label className={styles.fullWidth}>Comentário<textarea name="comentario" rows="3" maxLength="1000" defaultValue={avaliacaoInicial.comentario || ""} /></label>
                </div>
                <div className={styles.inlineActions}>
                  <button type="submit" className={styles.primaryButton}>{avaliacaoEmEdicao ? "Salvar edição" : "Publicar avaliação"}</button>
                  {avaliacaoEmEdicao && <button type="button" className={styles.secondaryButton} onClick={() => setAvaliacaoEmEdicao(null)}>Cancelar</button>}
                </div>
              </>
            ) : <p className={styles.localDataNote}>Após fazer um pedido, você poderá avaliar os produtos comprados.</p>}
          </form>
          {avaliacoes.length > 0 ? (
            <div className={styles.activityList}>{avaliacoes.map((avaliacao) => (
              <article className={styles.activityCard} key={avaliacao.id}>
                <span className={styles.activityTag}>{"★".repeat(avaliacao.nota)} · {avaliacao.nota}/5</span>
                <h3>{avaliacao.produto}</h3><p>{avaliacao.comentario || "Sem comentário."}</p><small>{new Date(avaliacao.atualizadaEm).toLocaleDateString("pt-BR")}</small>
                {avaliacoesPermitidas.has(avaliacao.produtoId) && (
                  <div className={styles.inlineActions}>
                    <button type="button" className={styles.secondaryButton} onClick={() => setAvaliacaoEmEdicao(avaliacao)}>Editar</button>
                    <button type="button" className={styles.secondaryButton} onClick={() => removerAvaliacao(avaliacao.id)}>Excluir</button>
                  </div>
                )}
              </article>
            ))}</div>
          ) : <div className={styles.emptyState}><h3>Você ainda não avaliou produtos</h3><p>As avaliações de produtos são diferentes dos comentários que você faz no blog.</p></div>}
        </div>
      );
    }

    if (secaoAtiva === "documentos") {
      return pedidos.length ? (
        <div className={styles.customerSections}>
          <p className={styles.localDataNote}>Consulte resumo, itens, envio e referência de lote dos seus pedidos. Comprovantes de pagamento ainda não são gerados pelo sistema.</p>
          {pedidos.map((pedido) => (
            <article className={styles.orderCard} key={pedido.id}>
              <header className={styles.orderHeader}><div><span className={styles.orderKicker}>Pedido {pedido.id}</span><h3>{pedido.criadoEm ? new Date(pedido.criadoEm).toLocaleDateString("pt-BR") : "Data não informada"}</h3></div><span className={styles.orderStatus}>{pedido.status || "recebido"}</span></header>
              <div className={styles.orderItems}>
                {(Array.isArray(pedido.itens) ? pedido.itens : []).map((item) => (
                  <div key={item.id || item.nome}><span>{item.quantidade} × {item.nome}</span><strong>{item.preco ? `${item.preco}` : ""}</strong></div>
                ))}
              </div>
              <dl className={styles.deliveryInfo}>
                <div><dt>Total</dt><dd>{Number(pedido.subtotal || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</dd></div>
                <div><dt>Código de rastreamento</dt><dd>{pedido.codigoRastreio || "Ainda não disponível"}</dd></div>
                <div><dt>Previsão de entrega</dt><dd>{pedido.previsaoEntrega || "Ainda não disponível"}</dd></div>
                <div><dt>Lote / rastreabilidade</dt><dd>{pedido.lote || "Não informado"}</dd></div>
                <div><dt>Pagamento</dt><dd>{pedido.pagamento || "Informação não registrada"}</dd></div>
                {pedido.enderecoEntrega && <div><dt>Endereço de entrega</dt><dd>{[pedido.enderecoEntrega.logradouro, pedido.enderecoEntrega.numero, pedido.enderecoEntrega.bairro, pedido.enderecoEntrega.cidade, pedido.enderecoEntrega.estado, pedido.enderecoEntrega.cep].filter(Boolean).join(", ")}</dd></div>}
              </dl>
            </article>
          ))}
        </div>
      ) : <div className={styles.emptyState}><h3>Nenhum documento de pedido</h3><p>Os detalhes dos pedidos aparecerão aqui após sua primeira compra.</p></div>;
    }

    if (secaoAtiva === "privacidade") {
      return (
        <div className={styles.customerSections}>
          <section className={styles.customerSection}>
            <h3>Sessão atual</h3>
            <p>Esta conta está conectada neste navegador. O protótipo não mantém uma lista de sessões em outros dispositivos.</p>
            <button type="button" className={styles.secondaryButton} onClick={encerrarSessao}>Encerrar sessão atual</button>
          </section>
          <section className={styles.preferences}>
            <h3>Consentimentos</h3>
            <label className={styles.preferenceRow}><span><strong>Novidades e comunicações</strong><small>Receber novidades e informações da Auraviva.</small></span><input type="checkbox" name="novidades" checked={consentimentos.novidades} onChange={atualizarConsentimento} /></label>
            <label className={styles.preferenceRow}><span><strong>Personalização de recomendações</strong><small>Usar estação e região escolhidas para sugerir sementes.</small></span><input type="checkbox" name="personalizacao" checked={consentimentos.personalizacao} onChange={atualizarConsentimento} /></label>
          </section>
          <section className={styles.customerSection}>
            <h3>Solicitar exclusão da conta</h3>
            <p>A solicitação será encaminhada pelos canais de atendimento para análise conforme os procedimentos aplicáveis. Este protótipo apenas registra o pedido neste navegador.</p>
            <button type="button" className={styles.secondaryButton} onClick={solicitarExclusaoConta}>Solicitar exclusão da conta</button>
          </section>
        </div>
      );
    }

    if (secaoAtiva === "pedidos" && pedidos.length > 0) {
      return <AcompanhamentoPedidos pedidos={pedidos} />;
    }

    if (secaoAtiva === "comentarios" && comentariosBlog.length > 0) {
      return (
        <div className={styles.activityList}>
          {comentariosBlog.map((comentario) => (
            <article className={styles.activityCard} key={`${comentario.slug}-${comentario.id}`}>
              <span className={styles.activityTag}>Comentário</span>
              <h3>{comentario.titulo}</h3>
              <p>{comentario.texto}</p>
              <small>{comentario.data}</small>
            </article>
          ))}
        </div>
      );
    }

    if (secaoAtiva === "curtidas" && curtidasBlog.length > 0) {
      return (
        <div className={styles.activityList}>
          {curtidasBlog.map((artigo) => (
            <article className={styles.activityCard} key={`${artigo.slug}-curtida`}>
              <span className={styles.activityTag}>Curtida</span>
              <h3>{artigo.titulo}</h3>
              <p>Você curtiu este artigo no blog.</p>
              <small>{artigo.data}</small>
            </article>
          ))}
        </div>
      );
    }

    if (secaoAtiva === "desejos" && listaDeDesejos.length > 0) {
      return (
        <div className={styles.wishlistGrid}>
          {listaDeDesejos.map((produto) => (
            <article className={styles.wishlistItem} key={produto.id}>
              <img src={produto.imagem} alt={produto.nome} />
              <div>
                <span>{produto.categoria}</span>
                <h3>{produto.nome}</h3>
                <p>{produto.preco}</p>
                <button type="button" className={styles.secondaryButton} onClick={() => removerDaListaDeDesejos(produto.id)}>
                  Remover da lista
                </button>
              </div>
            </article>
          ))}
        </div>
      );
    }

    const estado = estadosVazios[secaoAtiva];
    return (
      <div className={styles.emptyState}>
        <span className={`material-symbols-outlined ${styles.emptyIcon}`} aria-hidden="true">{estado.icone}</span>
        <h3>{estado.titulo}</h3>
        <p>{estado.descricao}</p>
        {estado.acao && (
          <Link className={styles.secondaryButton} to={estado.destino || "/auraviva/produtos"}>
            {estado.acao}
          </Link>
        )}
      </div>
    );
  };

  return (
    <>
      <MenuAuraviva />
      <main className={styles.page}>
        <div className={styles.pageInner}>
          <header className={styles.accountHeader}>
            <div>
              <span className={styles.eyebrow}>Área do cliente</span>
              <h1>Minha conta</h1>
            </div>
            <div className={styles.identity}>
              <div className={styles.avatar} aria-label={`Foto de ${usuario.nome}`}>
                {foto ? <img src={foto} alt="" /> : <span>{iniciais}</span>}
              </div>
              <div className={styles.identityText}>
                <span>Sua conta Auraviva</span>
                <strong>{usuario.nome}</strong>
              </div>
              <label className={styles.photoButton} title="Alterar foto de perfil">
                <span className="material-symbols-outlined" aria-hidden="true">photo_camera</span>
                <span className={styles.visuallyHidden}>Alterar foto de perfil</span>
                <input type="file" accept="image/*" onChange={carregarFoto} />
              </label>
            </div>
          </header>

          <div className={styles.accountLayout}>
            <nav className={styles.sidebar} aria-label="Seções da conta">
              {secoes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.navItem} ${secaoAtiva === item.id ? styles.navItemActive : ""} ${item.id === "sair" ? styles.logoutItem : ""}`}
                  aria-current={secaoAtiva === item.id ? "page" : undefined}
                  onClick={() => {
                    if (item.id === "sair") {
                      encerrarSessao();
                      return;
                    }
                    setSecaoAtiva(item.id);
                    setMensagem("");
                  }}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">{item.icone}</span>
                  {item.nome}
                </button>
              ))}
            </nav>

            <section className={styles.content} aria-labelledby="secao-titulo">
              <div className={styles.contentHeader}>
                <span className={styles.sectionKicker}>Sua Auraviva</span>
                <h2 id="secao-titulo">{secao.nome}</h2>
              </div>
              {mensagem && <p className={styles.statusMessage} role="status">{mensagem}</p>}
              {renderizarConteudo()}
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Perfil;