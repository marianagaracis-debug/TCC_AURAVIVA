-- =====================================================
-- AURAVIVA - Script 3 de 3: consultas de conferencia
-- Use para ver se o banco foi criado e populado corretamente.
-- =====================================================

USE bd_auraviva_2x;

-- Quantidade de registros por tabela
SELECT 'Usuario'        AS tabela, COUNT(*) AS registros FROM Usuario
UNION ALL SELECT 'Produto',        COUNT(*) FROM Produto
UNION ALL SELECT 'Blog',           COUNT(*) FROM Blog
UNION ALL SELECT 'Venda',          COUNT(*) FROM Venda
UNION ALL SELECT 'Item_Venda',     COUNT(*) FROM Item_Venda
UNION ALL SELECT 'Mensagem',       COUNT(*) FROM Mensagem
UNION ALL SELECT 'RecuperarSenha', COUNT(*) FROM RecuperarSenha;

-- Pedidos com o nome do cliente
SELECT v.id AS pedido, u.nome AS cliente, v.statusVenda, v.frete, v.valorTotal, v.dataVenda
FROM Venda v
JOIN Usuario u ON u.id = v.idUsuario
ORDER BY v.id;

-- Itens de cada pedido (e conferencia: itens + frete deve ser igual ao valorTotal)
SELECT v.id AS pedido,
       SUM(i.quantidade * i.precoUnitario)            AS total_itens,
       v.frete,
       SUM(i.quantidade * i.precoUnitario) + v.frete  AS calculado,
       v.valorTotal                                   AS gravado
FROM Venda v
JOIN Item_Venda i ON i.idVenda = v.id
GROUP BY v.id, v.frete, v.valorTotal;

-- Produtos ativos por estacao
SELECT estacao, nome, preco, quantidadeEstoque, destaque
FROM Produto
WHERE statusProduto = 'ATIVO'
ORDER BY estacao, nome;
