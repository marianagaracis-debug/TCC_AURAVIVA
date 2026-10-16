-- =====================================================
-- AURAVIVA - Script 3 de 3: consultas de conferencia (SQL Server)
-- =====================================================
SELECT name AS tabela FROM sys.tables ORDER BY name;                 -- deve listar 7 tabelas

SELECT id, nome, username, nivelAcesso, statusUsuario FROM dbo.Usuario;

SELECT estacao, COUNT(*) AS qtd_produtos, SUM(quantidadeEstoque) AS estoque_total
FROM dbo.Produto GROUP BY estacao;

SELECT v.id, u.nome AS cliente, v.statusVenda, v.frete, v.valorTotal
FROM dbo.Venda v JOIN dbo.Usuario u ON u.id = v.idUsuario;

SELECT iv.idVenda, p.nome AS produto, iv.quantidade, iv.precoUnitario,
       iv.quantidade * iv.precoUnitario AS subtotal
FROM dbo.Item_Venda iv JOIN dbo.Produto p ON p.id = iv.idProduto
ORDER BY iv.idVenda;

SELECT id, emissor, email, statusMensagem FROM dbo.Mensagem;
