export const CHAVE_PRODUTOS = "auraviva-produtos";
export const CHAVE_ATIVIDADES = "auraviva-atividades";

export const lerDadosLocais = (chave, padrao) => {
  try {
    const valor = localStorage.getItem(chave);
    return valor ? JSON.parse(valor) : padrao;
  } catch {
    return padrao;
  }
};

export const obterProdutosGerenciaveis = (catalogoBase) => {
  const alteracoesSalvas = lerDadosLocais(CHAVE_PRODUTOS, []);
  const alteracoes = Array.isArray(alteracoesSalvas) ? alteracoesSalvas : [];
  const porId = new Map(alteracoes.map((produto) => [produto.id || produto.nome, produto]));
  const idsBase = new Set(catalogoBase.map((produto) => produto.id || produto.nome));
  const catalogoAtualizado = catalogoBase.map((produto) => ({
    ...produto,
    ...(porId.get(produto.id || produto.nome) || {}),
  }));
  const novosProdutos = alteracoes.filter((produto) => !idsBase.has(produto.id || produto.nome));

  return [...catalogoAtualizado, ...novosProdutos];
};

export const obterProdutosAtivos = (catalogoBase) =>
  obterProdutosGerenciaveis(catalogoBase).filter((produto) => produto.ativo !== false);

export const registrarAtividade = (descricao) => {
  const atividadesSalvas = lerDadosLocais(CHAVE_ATIVIDADES, []);
  const atividades = Array.isArray(atividadesSalvas) ? atividadesSalvas : [];
  const sessao = lerDadosLocais("auraviva-sessao", {});
  const atividade = {
    id: `${Date.now()}`,
    descricao,
    autor: sessao.nome || "Funcionário",
    data: new Date().toISOString(),
  };
  localStorage.setItem(CHAVE_ATIVIDADES, JSON.stringify([atividade, ...atividades].slice(0, 50)));
  return atividade;
};
