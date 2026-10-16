import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MenuAuraviva from "../MenuAuraviva/MenuAuraviva";
import { lerDadosLocais } from "../../utils/gestaoLoja";
import { api, formatarIdPedido } from "../../services/api";
import styles from "./Carrinho.module.css";

const CHAVE_CARRINHO = "auraviva-carrinho";

const formatarPreco = (valor) =>
  valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const Carrinho = () => {
  const navigate = useNavigate();
  const [itens, setItens] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
    } catch {
      return [];
    }
  });

  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
  }, [itens]);

  const atualizarQuantidade = (id, variacao) => {
    setItens((atuais) => atuais
      .map((item) => item.id === id
        ? { ...item, quantidade: Math.max(1, item.quantidade + variacao) }
        : item)
    );
  };

  const removerItem = (id) => {
    setItens((atuais) => atuais.filter((item) => item.id !== id));
  };

  const subtotal = itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const totalItens = itens.reduce((total, item) => total + item.quantidade, 0);

  const normalizar = (texto) => String(texto)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();

  const finalizarPedido = async () => {
    if (enviando) return;
    setErro("");

    const cliente = lerDadosLocais("auraviva-sessao", null);
    if (cliente?.tipoPerfil !== "cliente") {
      setErro("Entre com sua conta de cliente para finalizar o pedido.");
      window.setTimeout(() => navigate("/auraviva/login"), 1500);
      return;
    }

    setEnviando(true);
    try {
      // O carrinho guarda o nome do produto; aqui descobrimos o id dele no banco.
      const produtosDoBanco = await api.listarProdutos();
      const itensPedido = itens.map((item) => {
        const produto = produtosDoBanco.find((p) => normalizar(p.nome) === normalizar(item.nome));
        if (!produto) {
          throw new Error(`"${item.nome}" não está disponível no estoque da loja.`);
        }
        return { idProduto: produto.id, quantidade: item.quantidade };
      });

      const venda = await api.criarPedido(itensPedido);

      const criadoEm = venda.dataVenda || new Date().toISOString();
      const enderecos = lerDadosLocais("auraviva-enderecos", []);
      const pedidoLocal = {
        id: formatarIdPedido(venda.id),
        idVenda: venda.id,
        criadoEm,
        status: "recebido",
        itens,
        subtotal: Number(venda.valorTotal),
        cliente: { nome: cliente.nome, email: cliente.email },
        enderecoEntrega: Array.isArray(enderecos)
          ? enderecos.filter((endereco) => endereco.email === cliente.email).at(-1) || null
          : null,
        codigoRastreio: "",
        previsaoEntrega: "",
        historico: [{ status: "recebido", data: criadoEm }],
      };

      const pedidosSalvos = lerDadosLocais("auraviva-pedidos", []);
      const pedidos = Array.isArray(pedidosSalvos) ? pedidosSalvos : [];
      localStorage.setItem("auraviva-pedidos", JSON.stringify([pedidoLocal, ...pedidos]));
      localStorage.setItem(CHAVE_CARRINHO, JSON.stringify([]));
      setItens([]);
      navigate("/auraviva/perfil?secao=pedidos");
    } catch (falha) {
      if (falha.status === 401) {
        localStorage.removeItem("auraviva-sessao");
        setErro("Sua sessão expirou. Entre novamente para finalizar o pedido.");
        window.setTimeout(() => navigate("/auraviva/login"), 1500);
      } else {
        setErro(falha.message);
      }
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className={styles.page}>
      <MenuAuraviva />
      <main className={styles.content}>
        <div className={styles.heading}>
          <div>
            <p className={styles.eyebrow}>Sua seleção</p>
            <h1>Carrinho de compras</h1>
            <p className={styles.description}>Revise suas sementes antes de finalizar o pedido.</p>
          </div>
          <span className={styles.itemCount}>{totalItens} {totalItens === 1 ? "item" : "itens"}</span>
        </div>

        {itens.length === 0 ? (
          <section className={styles.emptyState}>
            <span className="material-symbols-outlined">shopping_bag</span>
            <h2>Seu carrinho está vazio</h2>
            <p>Escolha suas sementes favoritas e elas aparecerão aqui.</p>
            <Link to="/auraviva/produtos" className={styles.primaryButton}>Explorar produtos</Link>
          </section>
        ) : (
          <div className={styles.layout}>
            <section className={styles.items} aria-label="Itens do carrinho">
              {itens.map((item) => (
                <article className={styles.item} key={item.id}>
                  <img src={item.imagem} alt={item.nome} />
                  <div className={styles.itemInfo}>
                    <span>{item.categoria}</span>
                    <h2>{item.nome}</h2>
                    <strong>{formatarPreco(item.preco)}</strong>
                  </div>
                  <div className={styles.controls}>
                    <div className={styles.quantity}>
                      <button type="button" onClick={() => atualizarQuantidade(item.id, -1)} aria-label={`Diminuir quantidade de ${item.nome}`}>−</button>
                      <b>{item.quantidade}</b>
                      <button type="button" onClick={() => atualizarQuantidade(item.id, 1)} aria-label={`Aumentar quantidade de ${item.nome}`}>+</button>
                    </div>
                    <button type="button" className={styles.remove} onClick={() => removerItem(item.id)}>Remover</button>
                  </div>
                  <strong className={styles.itemTotal}>{formatarPreco(item.preco * item.quantidade)}</strong>
                </article>
              ))}
            </section>

            <aside className={styles.summary}>
              <h2>Resumo do pedido</h2>
              <div><span>Subtotal</span><strong>{formatarPreco(subtotal)}</strong></div>
              <div><span>Entrega</span><strong className={styles.free}>Grátis</strong></div>
              <div className={styles.total}><span>Total</span><strong>{formatarPreco(subtotal)}</strong></div>
              {erro && <p role="alert" style={{ color: "#b3261e", margin: "8px 0" }}>{erro}</p>}
              <button type="button" className={styles.primaryButton} onClick={finalizarPedido} disabled={enviando}>
                {enviando ? "Enviando..." : "Finalizar pedido"}
              </button>
              <Link to="/auraviva/produtos" className={styles.continue}>Continuar comprando</Link>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};

export default Carrinho;