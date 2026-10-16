import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../pages/Produto/Produto.module.css";
import { adicionarProdutoAoCarrinho } from "../utils/carrinho";

const ProductDetailsModal = ({ produto, onClose, onAdded }) => {
  const navigate = useNavigate();
  const [quantidade, setQuantidade] = useState(1);
  const descricao = produto.descricao
    || `As sementes de ${produto.nome} são uma escolha de qualidade para o cultivo de ${produto.categoria.toLowerCase()}. Com bom potencial de desenvolvimento e adaptação para o ${produto.estacao.toLowerCase()}, elas ajudam a transformar cada plantio em uma nova possibilidade.`;

  const adicionar = () => {
    adicionarProdutoAoCarrinho(produto, quantidade);
    onAdded();
  };

  const adicionarAListaDeDesejos = () => {
    const listaAtual = JSON.parse(localStorage.getItem("auraviva-wishlist") || "[]");
    const produtoJaSalvo = listaAtual.some((item) => item.id === produto.nome);

    if (!produtoJaSalvo) {
      localStorage.setItem("auraviva-wishlist", JSON.stringify([
        ...listaAtual,
        {
          ...produto,
          id: produto.nome,
          descricao,
        },
      ]));
    }

    onClose();
    navigate("/auraviva/perfil?secao=desejos");
  };

  return (
    <div className={styles.productOverlay} role="presentation" onClick={onClose}>
      <section
        className={styles.productDetails}
        role="dialog"
        aria-modal="true"
        aria-labelledby="produto-detalhe-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeDetails}
          onClick={onClose}
          aria-label="Fechar detalhes do produto"
        >
          ×
        </button>

        <div className={styles.productGallery}>
          <img src={produto.imagem} alt={produto.alt} />
          <div className={styles.productThumbnails}>
            <img src={produto.imagem} alt="" />
          </div>
          <p>{descricao}</p>
        </div>

        <div className={styles.productSummary}>
          <span className={styles.detailCategory}>{produto.categoria}</span>
          <h2 id="produto-detalhe-titulo">{produto.nome}</h2>
          <p className={styles.detailPrice}>{produto.preco}</p>
          <span className={styles.detailSeason}>{produto.estacao}</span>

          <label htmlFor="quantidade-produto-detalhe">Quantidade</label>
          <div className={styles.detailQuantity} id="quantidade-produto-detalhe">
            <button
              type="button"
              onClick={() => setQuantidade((atual) => Math.max(1, atual - 1))}
              aria-label="Diminuir quantidade"
            >
              −
            </button>
            <span>{quantidade}</span>
            <button
              type="button"
              onClick={() => setQuantidade((atual) => atual + 1)}
              aria-label="Aumentar quantidade"
            >
              +
            </button>
          </div>

          <div className={styles.detailActions}>
            <button type="button" className={styles.detailCartButton} onClick={adicionar}>
              Adicionar ao Carrinho
            </button>
            <button
              type="button"
              className={styles.wishlistButton}
              onClick={adicionarAListaDeDesejos}
              aria-label="Adicionar produto à lista de desejos"
              title="Adicionar à lista de desejos"
            >
              <span className="material-symbols-outlined" aria-hidden="true">favorite_border</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetailsModal;
