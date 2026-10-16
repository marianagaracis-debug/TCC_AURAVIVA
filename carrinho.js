const CHAVE_CARRINHO = "auraviva-carrinho";

export const adicionarProdutoAoCarrinho = (produto, quantidade) => {
  const preco = Number(
    produto.preco.replace("R$", "").replace(/\./g, "").replace(",", ".").trim()
  );
  const item = {
    id: produto.nome,
    nome: produto.nome,
    categoria: produto.categoria,
    preco,
    imagem: produto.imagem,
    quantidade,
  };
  const carrinhoAtual = JSON.parse(localStorage.getItem(CHAVE_CARRINHO) || "[]");
  const itemExistente = carrinhoAtual.find((produtoSalvo) => produtoSalvo.id === item.id);
  const carrinhoAtualizado = itemExistente
    ? carrinhoAtual.map((produtoSalvo) => produtoSalvo.id === item.id
      ? { ...produtoSalvo, quantidade: produtoSalvo.quantidade + quantidade }
      : produtoSalvo)
    : [...carrinhoAtual, item];

  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinhoAtualizado));
};
