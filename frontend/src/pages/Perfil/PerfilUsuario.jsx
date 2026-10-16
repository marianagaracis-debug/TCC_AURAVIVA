import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuAuraviva from "../MenuAuraviva/MenuAuraviva";
import AcompanhamentoPedidos from "./AcompanhamentoPedidos";
import { api, sincronizarPedidos, statusDoBanco } from "../../services/api";
import { produtos as catalogoBase } from "../Produto/Produto";
import {
  CHAVE_ATIVIDADES,
  CHAVE_PRODUTOS,
  lerDadosLocais,
  obterProdutosGerenciaveis,
  registrarAtividade,
} from "../../utils/gestaoLoja";
import styles from "./Perfil.module.css";

const CHAVE_PEDIDOS = "auraviva-pedidos";
const CHAVE_FOTO_FUNCIONARIO = "auraviva-foto-funcionario";
const ESTOQUE_BAIXO = 5;

// -------- Componente interno: painel de blog para funcionários --------
const artigoVazio = { titulo: "", resumo: "", conteudo: "", autor: "", imagemUrl: "" };

const BlogPanel = ({ setMensagem }) => {
  const [artigos, setArtigos] = useState([]);
  const [edicao, setEdicao] = useState(null); // null = form oculto, {} = novo, obj = editar
  const [form, setForm]     = useState({ ...artigoVazio });
  const [carregando, setCarregando] = useState(true);

  const carregarArtigos = () => {
    setCarregando(true);
    api.listarBlog()
      .then(setArtigos)
      .catch(() => setArtigos([]))
      .finally(() => setCarregando(false));
  };

  useEffect(() => { carregarArtigos(); }, []);

  const abrirNovo = () => { setEdicao({}); setForm({ ...artigoVazio }); };
  const abrirEdicao = (a) => { setEdicao(a); setForm({ titulo: a.titulo, resumo: a.resumo || "", conteudo: a.conteudo || "", autor: a.autor || "", imagemUrl: a.imagemUrl || "" }); };
  const cancelar = () => { setEdicao(null); setForm({ ...artigoVazio }); };

  const salvar = async (event) => {
    event.preventDefault();
    if (!form.titulo.trim()) { setMensagem("O título é obrigatório."); return; }
    try {
      if (edicao?.id) {
        await api.editarArtigo(edicao.id, form);
        setMensagem("Artigo atualizado.");
      } else {
        await api.criarArtigo(form);
        setMensagem("Artigo publicado.");
      }
      cancelar();
      carregarArtigos();
    } catch (erro) { setMensagem(erro.message || "Não foi possível salvar."); }
  };

  const inativar = async (id) => {
    try {
      await api.inativarArtigo(id);
      setMensagem("Artigo inativado.");
      carregarArtigos();
    } catch (erro) { setMensagem(erro.message || "Não foi possível inativar."); }
  };

  if (carregando) return <p>Carregando artigos…</p>;

  return (
    <div>
      <button type="button" className={styles.primaryButton} onClick={abrirNovo} style={{marginBottom:"1rem"}}>+ Novo artigo</button>
      {edicao !== null && (
        <form onSubmit={salvar} style={{display:"flex",flexDirection:"column",gap:"0.75rem",marginBottom:"1.5rem",background:"var(--surface-2,#f8f8f8)",padding:"1rem",borderRadius:"0.75rem"}}>
          <h3 style={{margin:0}}>{edicao?.id ? "Editar artigo" : "Novo artigo"}</h3>
          <input placeholder="Título *" value={form.titulo} onChange={(e) => setForm((f) => ({...f, titulo: e.target.value}))} required style={{padding:"0.5rem",borderRadius:"0.5rem",border:"1px solid #ddd"}} />
          <input placeholder="Autor" value={form.autor} onChange={(e) => setForm((f) => ({...f, autor: e.target.value}))} style={{padding:"0.5rem",borderRadius:"0.5rem",border:"1px solid #ddd"}} />
          <input placeholder="URL da imagem de capa" value={form.imagemUrl} onChange={(e) => setForm((f) => ({...f, imagemUrl: e.target.value}))} style={{padding:"0.5rem",borderRadius:"0.5rem",border:"1px solid #ddd"}} />
          <textarea placeholder="Resumo (aparece na listagem)" rows={2} value={form.resumo} onChange={(e) => setForm((f) => ({...f, resumo: e.target.value}))} style={{padding:"0.5rem",borderRadius:"0.5rem",border:"1px solid #ddd",resize:"vertical"}} />
          <textarea placeholder="Conteúdo completo do artigo" rows={6} value={form.conteudo} onChange={(e) => setForm((f) => ({...f, conteudo: e.target.value}))} style={{padding:"0.5rem",borderRadius:"0.5rem",border:"1px solid #ddd",resize:"vertical"}} />
          <div style={{display:"flex",gap:"0.5rem"}}>
            <button type="submit" className={styles.primaryButton}>Salvar</button>
            <button type="button" className={styles.secondaryButton} onClick={cancelar}>Cancelar</button>
          </div>
        </form>
      )}
      {artigos.length === 0 ? (
        <p>Nenhum artigo publicado ainda.</p>
      ) : (
        <ul style={{listStyle:"none",padding:0,display:"flex",flexDirection:"column",gap:"0.75rem"}}>
          {artigos.map((a) => (
            <li key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0.75rem 1rem",background:"var(--surface-2,#f8f8f8)",borderRadius:"0.75rem"}}>
              <div>
                <strong>{a.titulo}</strong>
                <span style={{fontSize:"0.8rem",color:"var(--text-muted,#888)",marginLeft:"0.5rem"}}>{a.statusBlog || "ATIVO"}</span>
                <p style={{margin:"0.25rem 0 0",fontSize:"0.85rem",color:"var(--text-muted,#666)"}}>{a.resumo?.substring(0,80)}{a.resumo?.length > 80 ? "…" : ""}</p>
              </div>
              <div style={{display:"flex",gap:"0.5rem",flexShrink:0}}>
                <button type="button" className={styles.secondaryButton} onClick={() => abrirEdicao(a)}>Editar</button>
                {a.statusBlog !== "INATIVO" && (
                  <button type="button" className={styles.secondaryButton} onClick={() => inativar(a.id)}>Inativar</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const secoes = [
  { id: "visao-geral", nome: "Visão geral", icone: "dashboard" },
  { id: "perfil", nome: "Meu perfil", icone: "person" },
  { id: "pedidos", nome: "Pedidos", icone: "inventory_2" },
  { id: "produtos", nome: "Produtos e sementes", icone: "psychiatry" },
  { id: "estoque", nome: "Estoque e lotes", icone: "shelves" },
  { id: "clientes", nome: "Clientes", icone: "groups" },
  { id: "entregas", nome: "Entregas e frete", icone: "local_shipping" },
  { id: "conteudos", nome: "Blog e conteúdos", icone: "article" },
  { id: "relatorios", nome: "Relatórios", icone: "bar_chart" },
  { id: "funcionarios", nome: "Funcionários e permissões", icone: "manage_accounts" },
  { id: "seguranca", nome: "Segurança e atividades", icone: "security" },
  { id: "configuracoes", nome: "Configurações", icone: "settings" },
  { id: "sair", nome: "Sair da conta", icone: "logout" },
];

const formatarPreco = (valor) => {
  if (typeof valor === "number") {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }
  return valor || "";
};

const identificarProduto = (produto) => produto.id || produto.nome;

const converterPreco = (valor) => {
  if (typeof valor === "number") return valor;
  const normalizado = String(valor || "").replace(/[^\d,.-]/g, "");
  return Number(normalizado.includes(",")
    ? normalizado.replace(/\./g, "").replace(",", ".")
    : normalizado);
};

const formatarData = (valor) => {
  if (!valor) return "Não informado";
  const data = new Date(valor);
  return Number.isNaN(data.getTime())
    ? "Não informado"
    : data.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
};

const categoriasProduto = {
  vegetais: "Vegetais",
  leguminosas: "Leguminosas",
  frutas: "Frutas",
  graos: "Grãos",
  flores: "Flores",
  outros: "Outros cultivos",
};

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const [funcionario, setFuncionario] = useState(() => lerDadosLocais("auraviva-sessao", {}));
  const [foto, setFoto] = useState(() => localStorage.getItem(CHAVE_FOTO_FUNCIONARIO) || "");
  const [secaoAtiva, setSecaoAtiva] = useState("visao-geral");
  const [mensagem, setMensagem] = useState("");
  const [pedidos, setPedidos] = useState(() => {
    const salvos = lerDadosLocais(CHAVE_PEDIDOS, []);
    return Array.isArray(salvos) ? salvos : [];
  });
  const [produtos, setProdutos] = useState(() => obterProdutosGerenciaveis(catalogoBase));
  const [produtoEdicao, setProdutoEdicao] = useState(null);
  const [pesquisaPedidos, setPesquisaPedidos] = useState("");
  const [pesquisaClientes, setPesquisaClientes] = useState("");
  const [clientes, setClientes] = useState(() => {
    const salvos = lerDadosLocais("auraviva-clientes", []);
    const lista = Array.isArray(salvos) ? salvos : [];
    const legado = lerDadosLocais("auraviva-usuario", null);
    return legado && !lista.some((cliente) => cliente.email === legado.email)
      ? [...lista, legado]
      : lista;
  });
  const [movimento, setMovimento] = useState({ produtoId: "", tipo: "entrada", quantidade: "", lote: "" });
  const [senha, setSenha] = useState({ atual: "", nova: "", confirmacao: "" });
  const [atividades, setAtividades] = useState(() => {
    const salvas = lerDadosLocais(CHAVE_ATIVIDADES, []);
    return Array.isArray(salvas) ? salvas : [];
  });

  // Traz do banco todos os pedidos e a lista de clientes cadastrados
  useEffect(() => {
    sincronizarPedidos(true)
      .then((lista) => setPedidos(lista))
      .catch(() => {});

    api.listarUsuarios()
      .then((usuarios) => setClientes((atuais) => usuarios
        .filter((usuario) => usuario.nivelAcesso === "USER")
        .map((usuario) => ({
          ...(atuais.find((cliente) => cliente.email === usuario.username) || {}),
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.username,
          tipoPerfil: "cliente",
          statusConta: usuario.statusUsuario === "ATIVO" ? "ativa" : "inativa",
          cadastroEm: usuario.dataCadastro,
        }))))
      .catch(() => {});
  }, []);

  const secao = secoes.find((item) => item.id === secaoAtiva);
  const produtosAtivos = useMemo(() => produtos.filter((produto) => produto.ativo !== false), [produtos]);
  const pedidosEmProcessamento = pedidos.filter((pedido) => ["recebido", "preparacao"].includes(pedido.status));
  const pedidosEnviadosEntregues = pedidos.filter((pedido) => ["enviado", "entrega", "entregue"].includes(pedido.status));
  const estoqueBaixo = produtosAtivos.filter((produto) =>
    Number.isFinite(Number(produto.estoque)) && Number(produto.estoque) <= ESTOQUE_BAIXO,
  );
  const pedidosFiltrados = pedidos.filter((pedido) => {
    const termo = pesquisaPedidos.trim().toLocaleLowerCase("pt-BR");
    const cliente = pedido.cliente || {};
    const dados = [
      pedido.id,
      pedido.status,
      pedido.codigoRastreio,
      cliente.nome,
      cliente.email,
      ...(Array.isArray(pedido.itens) ? pedido.itens.map((item) => item.nome) : []),
    ].join(" ").toLocaleLowerCase("pt-BR");
    return dados.includes(termo);
  });
  const clientesFiltrados = clientes.filter((cliente) =>
    `${cliente.nome || ""} ${cliente.email || ""}`.toLocaleLowerCase("pt-BR")
      .includes(pesquisaClientes.trim().toLocaleLowerCase("pt-BR")),
  );
  const iniciais = (funcionario.nome || "Funcionário")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0])
    .join("")
    .toUpperCase();

  const salvarPedidos = (atualizados) => {
    localStorage.setItem(CHAVE_PEDIDOS, JSON.stringify(atualizados));
    setPedidos(atualizados);
  };

  const atualizarPedido = (id, alteracoes, registrarEtapa = false) => {
    const atualizados = pedidos.map((pedido) => {
      if (pedido.id !== id) return pedido;
      const historicoAtual = Array.isArray(pedido.historico) ? pedido.historico : [];
      const historico = registrarEtapa
        ? [...historicoAtual, { status: alteracoes.status, data: new Date().toISOString() }]
        : historicoAtual;
      return { ...pedido, ...alteracoes, historico };
    });
    salvarPedidos(atualizados);

    // Muda etapa e rastreio no banco
    const pedidoAtual = atualizados.find((pedido) => pedido.id === id);
    if (alteracoes.status && pedidoAtual?.idVenda && statusDoBanco(alteracoes.status)) {
      api.atualizarStatusPedido(pedidoAtual.idVenda, statusDoBanco(alteracoes.status))
        .catch((falha) => setMensagem(`A etapa não foi salva no banco: ${falha.message}`));
    }
    if (pedidoAtual?.idVenda && (alteracoes.codigoRastreio !== undefined || alteracoes.previsaoEntrega !== undefined || alteracoes.enderecoEntrega !== undefined)) {
      api.atualizarRastreio(
        pedidoAtual.idVenda,
        alteracoes.codigoRastreio ?? pedidoAtual.codigoRastreio,
        alteracoes.previsaoEntrega ?? pedidoAtual.previsaoEntrega,
        alteracoes.enderecoEntrega ?? pedidoAtual.enderecoEntrega,
      ).catch(() => {});
    }

    if (registrarEtapa) {
      const atualizado = atualizados.find((pedido) => pedido.id === id);
      registrarAtividade(`Pedido ${id} atualizado para ${atualizado.status}.`);
      setAtividades(lerDadosLocais(CHAVE_ATIVIDADES, []));
    }
  };

  const salvarPerfil = (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const alteracoes = {
      nome: String(form.get("nome") || "").trim(),
      email: String(form.get("email") || "").trim().toLowerCase(),
      cargo: String(form.get("cargo") || "").trim(),
      departamento: String(form.get("departamento") || "").trim(),
      matricula: String(form.get("matricula") || "").trim(),
    };
    const atualizado = { ...funcionario, ...alteracoes };
    try {
      localStorage.setItem("auraviva-sessao", JSON.stringify(atualizado));
      localStorage.setItem("auraviva-funcionario", JSON.stringify(atualizado));
      setFuncionario(atualizado);
      registrarAtividade("Dados profissionais atualizados.");
      setAtividades(lerDadosLocais(CHAVE_ATIVIDADES, []));
      setMensagem("Seus dados permitidos foram atualizados.");
    } catch {
      setMensagem("Não foi possível salvar os dados neste navegador.");
    }
  };

  const carregarFoto = (event) => {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) {
      setMensagem("Escolha um arquivo de imagem.");
      return;
    }
    if (arquivo.size > 4 * 1024 * 1024) {
      setMensagem("A imagem deve ter no máximo 4 MB.");
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
        const fotoReduzida = canvas.toDataURL("image/jpeg", 0.82);
        try {
          localStorage.setItem(CHAVE_FOTO_FUNCIONARIO, fotoReduzida);
          setFoto(fotoReduzida);
          registrarAtividade("Foto do perfil atualizada.");
          setAtividades(lerDadosLocais(CHAVE_ATIVIDADES, []));
          setMensagem("Foto do perfil atualizada.");
        } catch {
          setMensagem("Não foi possível salvar a foto neste navegador.");
        }
      };
      imagem.onerror = () => setMensagem("Não foi possível abrir essa imagem.");
      imagem.src = leitor.result;
    };
    leitor.onerror = () => setMensagem("Não foi possível carregar essa imagem.");
    leitor.readAsDataURL(arquivo);
    event.target.value = "";
  };

  const salvarProduto = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nome = String(form.get("nome") || "").trim();
    const arquivo = form.get("fileProduto");
    const dados = {
      nome,
      imagemUrl: String(form.get("imagem") || "").trim() || undefined,
      categoriaId: String(form.get("categoriaId")),
      estacaoId: String(form.get("estacaoId")),
      preco: converterPreco(form.get("preco")),
      descricao: String(form.get("descricao") || "").trim(),
      estoque: Number(form.get("estoque")),
      lote: String(form.get("lote") || "").trim(),
      ativo: true,
    };
    try {
      let resultado;
      if (produtoEdicao?.id && !String(produtoEdicao.id).startsWith("produto-")) {
        resultado = await api.editarProduto(produtoEdicao.id, dados, arquivo?.size ? arquivo : null);
      } else {
        resultado = await api.criarProduto(dados, arquivo?.size ? arquivo : null);
      }
      // Atualiza lista local
      const atualizados = produtoEdicao
        ? produtos.map((item) => identificarProduto(item) === identificarProduto(produtoEdicao) ? { ...item, ...resultado } : item)
        : [...produtos, resultado];
      localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(atualizados));
      registrarAtividade(`${produtoEdicao ? "Produto editado" : "Produto cadastrado"}: ${nome}.`);
      setProdutos(atualizados);
      setAtividades(lerDadosLocais(CHAVE_ATIVIDADES, []));
      setProdutoEdicao(null);
      setMensagem("Produto salvo com sucesso.");
    } catch (erro) {
      setMensagem(erro.message || "Não foi possível salvar o produto.");
    }
  };

  const alternarProduto = async (produto) => {
    const novoAtivo = produto.ativo === false;
    try {
      if (produto.id && !String(produto.id).startsWith("produto-")) {
        if (novoAtivo) await api.ativarProduto(produto.id);
        else await api.inativarProduto(produto.id);
      }
    } catch { /* continua mesmo se a API falhar */ }
    const atualizado = { ...produto, ativo: novoAtivo };
    const atualizados = produtos.map((item) =>
      identificarProduto(item) === identificarProduto(produto) ? atualizado : item,
    );
    localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(atualizados));
    registrarAtividade(`Produto ${atualizado.ativo ? "ativado" : "desativado"}: ${produto.nome}.`);
    setProdutos(atualizados);
    setAtividades(lerDadosLocais(CHAVE_ATIVIDADES, []));
    setMensagem(`Produto ${atualizado.ativo ? "ativado" : "desativado"}.`);
  };

  const registrarMovimento = (event) => {
    event.preventDefault();
    const quantidade = Number(movimento.quantidade);
    const produto = produtos.find((item) => item.id === movimento.produtoId || item.nome === movimento.produtoId);
    if (!produto || !Number.isInteger(quantidade) || quantidade < 1) {
      setMensagem("Selecione um produto e informe uma quantidade inteira maior que zero.");
      return;
    }
    const saldoAtual = Number(produto.estoque) || 0;
    const novoSaldo = movimento.tipo === "entrada" ? saldoAtual + quantidade : saldoAtual - quantidade;
    if (novoSaldo < 0) {
      setMensagem("A saída não pode ser maior que a quantidade disponível.");
      return;
    }
    const atualizado = {
      ...produto,
      estoque: novoSaldo,
      lote: movimento.lote.trim() || produto.lote || "",
    };
    const atualizados = produtos.map((item) => identificarProduto(item) === identificarProduto(produto) ? atualizado : item);
    const movimentosSalvos = lerDadosLocais("auraviva-movimentos-estoque", []);
    const movimentos = Array.isArray(movimentosSalvos) ? movimentosSalvos : [];
    const registro = {
      id: `${Date.now()}`,
      produtoId: produto.id || produto.nome,
      produto: produto.nome,
      tipo: movimento.tipo,
      quantidade,
      saldo: novoSaldo,
      lote: atualizado.lote,
      data: new Date().toISOString(),
    };
    try {
      localStorage.setItem(CHAVE_PRODUTOS, JSON.stringify(atualizados));
      localStorage.setItem("auraviva-movimentos-estoque", JSON.stringify([registro, ...movimentos]));
      registrarAtividade(`Estoque de ${produto.nome}: ${movimento.tipo} de ${quantidade} unidade(s).`);
      setProdutos(atualizados);
      setAtividades(lerDadosLocais(CHAVE_ATIVIDADES, []));
      setMovimento({ ...movimento, quantidade: "", lote: "" });
      setMensagem("Movimentação de estoque registrada.");
    } catch {
      setMensagem("Não foi possível salvar a movimentação neste navegador.");
    }
  };

  const salvarObservacaoCliente = (event, email) => {
    event.preventDefault();
    const observacao = String(new FormData(event.currentTarget).get("observacao") || "").trim();
    const cliente = clientes.find((item) => item.email === email);
    if (!cliente) return;
    const atualizados = clientes.map((item) => item.email === email
      ? { ...item, observacaoSuporte: observacao }
      : item);
    try {
      localStorage.setItem("auraviva-clientes", JSON.stringify(atualizados));
      setClientes(atualizados);
      registrarAtividade(`Observação de suporte atualizada para ${cliente.nome || cliente.email}.`);
      setAtividades(lerDadosLocais(CHAVE_ATIVIDADES, []));
      setMensagem("Observação do cliente salva.");
    } catch {
      setMensagem("Não foi possível salvar a observação neste navegador.");
    }
  };

  const alterarSenha = (event) => {
    event.preventDefault();
    if (senha.atual !== funcionario.senha) {
      setMensagem("A senha atual não confere.");
      return;
    }
    if (senha.nova.length < 6) {
      setMensagem("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }
    if (senha.nova !== senha.confirmacao) {
      setMensagem("A confirmação da nova senha não confere.");
      return;
    }
    const atualizado = { ...funcionario, senha: senha.nova };
    try {
      localStorage.setItem("auraviva-funcionario", JSON.stringify(atualizado));
      localStorage.setItem("auraviva-sessao", JSON.stringify(atualizado));
      setFuncionario(atualizado);
      setSenha({ atual: "", nova: "", confirmacao: "" });
      registrarAtividade("Senha da conta atualizada.");
      setAtividades(lerDadosLocais(CHAVE_ATIVIDADES, []));
      setMensagem("Senha alterada. Como este protótipo usa armazenamento local, ela só é válida neste navegador.");
    } catch {
      setMensagem("Não foi possível atualizar a senha neste navegador.");
    }
  };

  const selecionarSecao = (id) => {
    if (id === "sair") {
      api.sair().catch(() => {});
      localStorage.removeItem("auraviva-sessao");
      navigate("/auraviva/login", { replace: true });
      return;
    }
    setMensagem("");
    setSecaoAtiva(id);
  };

  const renderizarPedidos = (lista) => lista.length > 0 ? (
    <AcompanhamentoPedidos pedidos={lista} modoGestao atualizarPedido={atualizarPedido} />
  ) : (
    <div className={styles.emptyState}>
      <span className={`material-symbols-outlined ${styles.emptyIcon}`} aria-hidden="true">inventory_2</span>
      <h3>Nenhum pedido para exibir</h3>
      <p>Os pedidos correspondentes aparecerão aqui.</p>
    </div>
  );

  const renderizarConteudo = () => {
    if (secaoAtiva === "visao-geral") {
      return (
        <div className={styles.employeeOverview}>
          <div className={styles.metricGrid}>
            {[
              { titulo: "Total de pedidos", valor: pedidos.length, icone: "inventory_2", secao: "pedidos" },
              { titulo: "Aguardando processamento", valor: pedidosEmProcessamento.length, icone: "pending_actions", secao: "pedidos" },
              { titulo: "Enviados e entregues", valor: pedidosEnviadosEntregues.length, icone: "local_shipping", secao: "entregas" },
              { titulo: "Produtos cadastrados", valor: produtosAtivos.length, icone: "psychiatry", secao: "produtos" },
              { titulo: "Sementes com estoque baixo", valor: estoqueBaixo.length, icone: "warning", secao: "estoque" },
            ].map((metrica) => (
              <button className={styles.metricCard} type="button" key={metrica.titulo} onClick={() => setSecaoAtiva(metrica.secao)}>
                <span className="material-symbols-outlined" aria-hidden="true">{metrica.icone}</span>
                <span>{metrica.titulo}</span>
                <strong>{metrica.valor}</strong>
              </button>
            ))}
          </div>
          <section className={styles.recentActivities}>
            <h3>Avisos e atividades recentes</h3>
            {estoqueBaixo.length > 0 && (
              <p className={styles.lowStockNotice}>
                Atenção: {estoqueBaixo.map((produto) => produto.nome).join(", ")} com estoque igual ou inferior a {ESTOQUE_BAIXO}.
              </p>
            )}
            {atividades.length > 0 ? (
              <ul>{atividades.slice(0, 8).map((atividade) => (
                <li key={atividade.id}><span>{atividade.descricao}</span><small>{atividade.autor} · {formatarData(atividade.data)}</small></li>
              ))}</ul>
            ) : <p>Nenhuma atividade administrativa registrada ainda.</p>}
          </section>
        </div>
      );
    }

    if (secaoAtiva === "perfil") {
      return (
        <div className={styles.employeeProfile}>
          <div className={styles.profileIdentity}>
            <div className={styles.avatar} aria-label={`Foto de ${funcionario.nome || "funcionário"}`}>
              {foto ? <img src={foto} alt="" /> : iniciais}
            </div>
            <label className={styles.photoButton}>
              <span className="material-symbols-outlined" aria-hidden="true">photo_camera</span>
              <span>Alterar foto ou avatar</span>
              <input type="file" accept="image/*" onChange={carregarFoto} />
            </label>
          </div>
          <form className={styles.employeeForm} onSubmit={salvarPerfil}>
            <div className={styles.employeeGrid}>
              <label>Nome completo<input name="nome" defaultValue={funcionario.nome || ""} required /></label>
              <label>E-mail corporativo<input name="email" type="email" defaultValue={funcionario.email || ""} required /></label>
              <label>Cargo<input name="cargo" defaultValue={funcionario.cargo || ""} placeholder="Ex.: Analista de operações" /></label>
              <label>Departamento<input name="departamento" defaultValue={funcionario.departamento || ""} placeholder="Ex.: Logística" /></label>
              <label>Matrícula ou identificador<input name="matricula" defaultValue={funcionario.matricula || ""} /></label>
              <label>Data de cadastro<input value={formatarData(funcionario.cadastroEm)} readOnly /></label>
              <label>Status da conta<input value={funcionario.statusConta === "inativa" ? "Inativa" : "Ativa"} readOnly /></label>
            </div>
            <p className={styles.localDataNote}>Cargo, departamento e matrícula são informações opcionais. O status é controlado por administrador autorizado.</p>
            <button type="submit" className={styles.primaryButton}>Salvar dados permitidos</button>
          </form>
        </div>
      );
    }

    if (secaoAtiva === "pedidos") {
      return (
        <>
          <label className={styles.searchField}>Pesquisar pedidos
            <input value={pesquisaPedidos} onChange={(event) => setPesquisaPedidos(event.target.value)} placeholder="Número, cliente, produto ou rastreio" />
          </label>
          {renderizarPedidos(pedidosFiltrados)}
        </>
      );
    }

    if (secaoAtiva === "entregas") {
      return (
        <>
          <p className={styles.localDataNote}>Pedidos em processamento, enviados e entregues. Atualize etapa e rastreio dentro do pedido.</p>
          {renderizarPedidos(pedidos.filter((pedido) => pedido.status !== "cancelado"))}
        </>
      );
    }

    if (secaoAtiva === "produtos") {
      return (
        <div className={styles.managementSection}>
          <form key={produtoEdicao ? (produtoEdicao.id || produtoEdicao.nome) : "novo"} className={styles.employeeForm} onSubmit={salvarProduto}>
            <div className={styles.formHeading}>
              <h3>{produtoEdicao ? `Editar ${produtoEdicao.nome}` : "Cadastrar produto ou semente"}</h3>
              <p>Cadastre produtos, ajuste preços, descrições, categorias e estoque inicial.</p>
            </div>
            <div className={styles.employeeGrid}>
              <label>Nome<input name="nome" defaultValue={produtoEdicao?.nome || ""} required /></label>
              <label>Preço (R$)<input name="preco" defaultValue={produtoEdicao?.preco || ""} placeholder="14,90" required /></label>
              <label>Categoria
                <select name="categoriaId" defaultValue={produtoEdicao?.categoriaId || "vegetais"}>
                  <option value="vegetais">Vegetais</option><option value="leguminosas">Leguminosas</option>
                  <option value="frutas">Frutas</option><option value="graos">Grãos</option>
                  <option value="flores">Flores</option><option value="outros">Outros cultivos</option>
                </select>
              </label>
              <label>Estação
                <select name="estacaoId" defaultValue={produtoEdicao?.estacaoId || "verao"}>
                  <option value="verao">Verão</option><option value="inverno">Inverno</option>
                </select>
              </label>
              <label>Imagem (URL)<input name="imagem" type="url" defaultValue={produtoEdicao?.imagem || ""} /></label>
              <label>Quantidade disponível<input name="estoque" type="number" min="0" step="1" defaultValue={produtoEdicao?.estoque ?? 0} required /></label>
              <label>Lote / rastreabilidade<input name="lote" defaultValue={produtoEdicao?.lote || ""} /></label>
              <label className={styles.fullWidth}>Descrição<textarea name="descricao" rows="3" defaultValue={produtoEdicao?.descricao || ""} /></label>
            </div>
            <div className={styles.inlineActions}>
              <button type="submit" className={styles.primaryButton}>{produtoEdicao ? "Salvar edição" : "Cadastrar produto"}</button>
              {produtoEdicao && <button type="button" className={styles.secondaryButton} onClick={() => setProdutoEdicao(null)}>Cancelar edição</button>}
            </div>
          </form>
          <div className={styles.tableSection}>
            <h3>Produtos cadastrados</h3>
            <div className={styles.tableScroll}>
              <table className={styles.managementTable}>
                <thead><tr><th>Produto</th><th>Categoria / estação</th><th>Preço</th><th>Estoque / lote</th><th>Status e ações</th></tr></thead>
                <tbody>{produtos.map((produto) => (
                  <tr key={produto.id || produto.nome}>
                    <td><strong>{produto.nome}</strong><small>{produto.descricao || "Sem descrição adicional"}</small></td>
                    <td>{produto.categoria}<small>{produto.estacao}</small></td>
                    <td>{formatarPreco(produto.preco)}</td>
                    <td>{produto.estoque ?? "Não informado"}<small>{produto.lote || "Lote não informado"}</small></td>
                    <td><span className={produto.ativo === false ? styles.inactiveStatus : styles.activeStatus}>{produto.ativo === false ? "Inativo" : "Ativo"}</span>
                      <div className={styles.tableActions}>
                        <button type="button" onClick={() => { setProdutoEdicao(produto); window.scrollTo({ top: 0, behavior: "smooth" }); }}>Editar</button>
                        <button type="button" onClick={() => alternarProduto(produto)}>{produto.ativo === false ? "Ativar" : "Desativar"}</button>
                      </div>
                    </td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    if (secaoAtiva === "estoque") {
      const movimentosSalvos = lerDadosLocais("auraviva-movimentos-estoque", []);
      const movimentos = Array.isArray(movimentosSalvos) ? movimentosSalvos : [];
      return (
        <div className={styles.managementSection}>
          <form className={styles.employeeForm} onSubmit={registrarMovimento}>
            <div className={styles.formHeading}><h3>Registrar entrada ou saída</h3><p>Atualize as quantidades e associe um lote quando necessário.</p></div>
            <div className={styles.employeeGrid}>
              <label>Produto<select value={movimento.produtoId} onChange={(event) => setMovimento({ ...movimento, produtoId: event.target.value })} required>
                <option value="">Selecione</option>{produtosAtivos.map((produto) => <option key={produto.id || produto.nome} value={produto.id || produto.nome}>{produto.nome}</option>)}
              </select></label>
              <label>Tipo<select value={movimento.tipo} onChange={(event) => setMovimento({ ...movimento, tipo: event.target.value })}><option value="entrada">Entrada</option><option value="saida">Saída</option></select></label>
              <label>Quantidade<input type="number" min="1" step="1" value={movimento.quantidade} onChange={(event) => setMovimento({ ...movimento, quantidade: event.target.value })} required /></label>
              <label>Lote<input value={movimento.lote} onChange={(event) => setMovimento({ ...movimento, lote: event.target.value })} placeholder="Opcional" /></label>
            </div>
            <button type="submit" className={styles.primaryButton}>Registrar movimentação</button>
          </form>
          <div className={styles.tableSection}>
            <h3>Saldo e lotes</h3>
            <div className={styles.tableScroll}><table className={styles.managementTable}>
              <thead><tr><th>Produto</th><th>Estoque disponível</th><th>Lote</th><th>Alerta</th></tr></thead>
              <tbody>{produtosAtivos.map((produto) => (
                <tr key={produto.id || produto.nome}><td>{produto.nome}</td><td>{produto.estoque ?? "Não informado"}</td><td>{produto.lote || "Não informado"}</td>
                  <td>{Number.isFinite(Number(produto.estoque)) && Number(produto.estoque) <= ESTOQUE_BAIXO ? <span className={styles.lowStockNotice}>Estoque baixo</span> : produto.estoque == null ? "Sem saldo cadastrado" : "Normal"}</td></tr>
              ))}</tbody>
            </table></div>
          </div>
          <div className={styles.recentActivities}><h3>Movimentações recentes</h3>
            {movimentos.length > 0 ? <ul>{movimentos.slice(0, 20).map((item) => <li key={item.id}><span>{item.tipo === "entrada" ? "Entrada" : "Saída"} de {item.quantidade} · {item.produto} · saldo {item.saldo} · lote {item.lote || "não informado"}</span><small>{formatarData(item.data)}</small></li>)}</ul> : <p>Nenhuma movimentação registrada.</p>}
          </div>
        </div>
      );
    }

    if (secaoAtiva === "clientes") {
      return (
        <div className={styles.managementSection}>
          <label className={styles.searchField}>Pesquisar clientes
            <input value={pesquisaClientes} onChange={(event) => setPesquisaClientes(event.target.value)} placeholder="Nome ou e-mail" />
          </label>
          {clientesFiltrados.length ? (
            <div className={styles.customerList}>{clientesFiltrados.map((cliente) => {
              const pedidosCliente = pedidos.filter((pedido) => pedido.cliente?.email === cliente.email);
              return (
                <article className={styles.customerCard} key={cliente.email}>
                  <h3>{cliente.nome || "Cliente"}</h3><p>{cliente.email}</p>
                  <p>{pedidosCliente.length} pedido(s) associado(s) à conta</p>
                  {pedidosCliente.length > 0 && <button type="button" className={styles.tableLink} onClick={() => { setPesquisaPedidos(cliente.email); setSecaoAtiva("pedidos"); }}>Ver histórico de pedidos</button>}
                  <form onSubmit={(event) => salvarObservacaoCliente(event, cliente.email)}>
                    <label>Observação de suporte
                      <textarea name="observacao" rows="2" defaultValue={cliente.observacaoSuporte || ""} />
                    </label>
                    <button type="submit" className={styles.secondaryButton}>Salvar observação</button>
                  </form>
                </article>
              );
            })}</div>
          ) : <p className={styles.localDataNote}>Nenhum cliente cadastrado foi encontrado. As contas antigas não são recuperadas automaticamente pelo navegador.</p>}
          <p className={styles.localDataNote}>A desativação de contas requer permissão administrativa; essa ação não está disponível para este perfil.</p>
        </div>
      );
    }

    if (secaoAtiva === "seguranca") {
      return (
        <div className={styles.managementSection}>
          <form className={styles.employeeForm} onSubmit={alterarSenha}>
            <div className={styles.formHeading}><h3>Alterar senha</h3><p>Confirme a senha atual e defina uma nova senha com pelo menos 6 caracteres.</p></div>
            <div className={styles.employeeGrid}>
              <label>Senha atual<input type="password" value={senha.atual} onChange={(event) => setSenha({ ...senha, atual: event.target.value })} required /></label>
              <label>Nova senha<input type="password" value={senha.nova} onChange={(event) => setSenha({ ...senha, nova: event.target.value })} minLength="6" required /></label>
              <label>Confirmar nova senha<input type="password" value={senha.confirmacao} onChange={(event) => setSenha({ ...senha, confirmacao: event.target.value })} minLength="6" required /></label>
            </div>
            <button type="submit" className={styles.primaryButton}>Alterar senha</button>
          </form>
          <div className={styles.accountDetails}>
            <dl>
              <div><dt>Último acesso</dt><dd>{formatarData(funcionario.ultimoAcessoEm)}</dd></div>
              <div><dt>Recuperação de acesso</dt><dd>Use a tela de login; a recuperação automática não está configurada.</dd></div>
              <div><dt>Permissões administrativas</dt><dd>Disponíveis somente para contas autorizadas por administrador.</dd></div>
            </dl>
          </div>
          <div className={styles.recentActivities}><h3>Atividades administrativas</h3>
            {atividades.length > 0 ? <ul>{atividades.map((atividade) => <li key={atividade.id}><span>{atividade.descricao}</span><small>{atividade.autor} · {formatarData(atividade.data)}</small></li>)}</ul> : <p>Nenhuma atividade registrada.</p>}
          </div>
        </div>
      );
    }

    if (secaoAtiva === "conteudos") {
      return <BlogPanel setMensagem={setMensagem} />;
    }

    const paineis = {
      conteudos: { titulo: "Blog e conteúdos", descricao: "Acesse as publicações da Auraviva.", acao: "Abrir blog", destino: "/auraviva/blog" },
      relatorios: { titulo: "Relatórios", descricao: "Resumo de vendas e operações do navegador atual.", acao: "Consultar pedidos", secao: "pedidos" },
      funcionarios: { titulo: "Funcionários e permissões", descricao: "Gerencie acessos apenas se sua conta tiver autorização administrativa.", aviso: "A gestão de permissões e a desativação de contas não estão habilitadas para este perfil." },
      configuracoes: { titulo: "Configurações", descricao: "Ajuste os dados do seu perfil e as preferências de segurança.", acao: "Segurança e senha", secao: "seguranca" },
    };
    const painel = paineis[secaoAtiva];
    return (
      <div className={styles.employeePanel}>
        <span className={`material-symbols-outlined ${styles.emptyIcon}`} aria-hidden="true">{secao.icone}</span>
        <h3>{painel.titulo}</h3><p>{painel.descricao}</p>
        {painel.acao && (painel.destino
          ? <Link className={styles.secondaryButton} to={painel.destino}>{painel.acao}</Link>
          : <button type="button" className={styles.secondaryButton} onClick={() => setSecaoAtiva(painel.secao)}>{painel.acao}</button>)}
        {painel.aviso && <p className={styles.localDataNote}>{painel.aviso}</p>}
      </div>
    );
  };

  return (
    <>
      <MenuAuraviva />
      <main className={styles.page}>
        <div className={styles.pageInner}>
          <header className={styles.accountHeader}>
            <div><span className={styles.eyebrow}>Área interna</span><h1>Painel do funcionário</h1></div>
            <div className={styles.identity}>
              <div className={styles.avatar} aria-hidden="true">{foto ? <img src={foto} alt="" /> : iniciais}</div>
              <div className={styles.identityText}><span>{funcionario.cargo || "Funcionário"}</span><strong>{funcionario.nome || "Conta Auraviva"}</strong></div>
            </div>
          </header>

          <div className={styles.accountLayout}>
            <nav className={styles.sidebar} aria-label="Seções do painel">
              {secoes.map((item) => (
                <button key={item.id} type="button"
                  className={`${styles.navItem} ${secaoAtiva === item.id ? styles.navItemActive : ""} ${item.id === "sair" ? styles.logoutItem : ""}`}
                  aria-current={secaoAtiva === item.id ? "page" : undefined}
                  onClick={() => selecionarSecao(item.id)}>
                  <span className="material-symbols-outlined" aria-hidden="true">{item.icone}</span>{item.nome}
                </button>
              ))}
            </nav>
            <section className={styles.content} aria-labelledby="secao-funcionario">
              <div className={styles.contentHeader}><span className={styles.sectionKicker}>Gestão da Auraviva</span><h2 id="secao-funcionario">{secao.nome}</h2></div>
              {mensagem && <p className={styles.statusMessage} role="status">{mensagem}</p>}
              {renderizarConteudo()}
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default PerfilUsuario;
