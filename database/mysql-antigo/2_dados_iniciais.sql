-- =====================================================
-- AURAVIVA - Script 2 de 3: dados iniciais (para testes)
-- Rode DEPOIS do script 1.
-- =====================================================

USE bd_auraviva_2x;

-- -----------------------------------------------------
-- USUARIOS  (senha de todos: 12345678)
-- O hash abaixo e o BCrypt de "12345678".
-- -----------------------------------------------------
INSERT INTO Usuario (nome, username, password, nivelAcesso, telefone, dataCadastro, statusUsuario) VALUES
('Administrador AuraViva', 'admin@auraviva.com.br', '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'ADMIN', '(11) 4002-8922',   NOW(), 'ATIVO'),
('Maria Oliveira',         'maria@email.com',       '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER',  '(11) 98765-4321', NOW(), 'ATIVO'),
('Joao Pereira',           'joao@email.com',        '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER',  '(31) 99123-4567', NOW(), 'ATIVO'),
('Ana Souza',              'ana@email.com',         '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER',  NULL,              NOW(), 'INATIVO');

-- -----------------------------------------------------
-- PRODUTOS
-- -----------------------------------------------------
INSERT INTO Produto (nome, descricao, tipoSemente, especie, variedade, estacao, transgenico, preco, quantidadeEstoque, destaque, imagemUrl, dataCadastro, statusProduto) VALUES
('Tomate Cereja Transgenico',   'Tomate cereja de alta produtividade, resistente a pragas.', 'Tomate',   'Solanum lycopersicum', 'Cereja Dourado', 'VERAO',   1, 12.90, 150, 1, 'https://agristar.com.br/upload/products/original/04529.jpg',            NOW(), 'ATIVO'),
('Milho Hibrido Doce',          'Milho doce transgenico, ideal para plantio de verao.',      'Milho',    'Zea mays',             'Doce Super',     'VERAO',   1, 34.50, 320, 1, 'https://images.pexels.com/photos/547263/pexels-photo-547263.jpeg',   NOW(), 'ATIVO'),
('Pimentao Vermelho Resistente','Pimentao com resistencia a doencas foliares.',              'Pimentao', 'Capsicum annuum',      'Vermelho Max',   'VERAO',   1,  9.75,  80, 0, 'https://images.pexels.com/photos/128536/pexels-photo-128536.jpeg',   NOW(), 'ATIVO'),
('Trigo Sarraceno Resistente',  'Trigo transgenico proprio para o frio do inverno.',         'Trigo',    'Triticum aestivum',    'Inverno Forte',  'INVERNO', 1, 28.00, 210, 1, 'https://images.pexels.com/photos/326082/pexels-photo-326082.jpeg',   NOW(), 'ATIVO'),
('Couve Manteiga Convencional', 'Couve manteiga nao transgenica, semente pura.',             'Couve',    'Brassica oleracea',    'Manteiga Verde', 'INVERNO', 0,  6.40,  95, 0, 'https://images.pexels.com/photos/1751145/pexels-photo-1751145.jpeg',  NOW(), 'ATIVO'),
('Cebola Roxa de Inverno',      'Cebola roxa adaptada ao plantio de inverno.',               'Cebola',   'Allium cepa',          'Roxa Inverno',   'INVERNO', 0, 11.20,   0, 0, 'https://images.pexels.com/photos/533342/pexels-photo-533342.jpeg',   NOW(), 'INATIVO');

-- -----------------------------------------------------
-- BLOG
-- -----------------------------------------------------
INSERT INTO Blog (titulo, resumo, conteudo, autor, dataPublicacao, statusBlog) VALUES
('Como plantar sementes transgenicas no verao',
 'Confira o passo a passo para obter alta produtividade no plantio de verao.',
 'As sementes transgenicas de verao exigem solo umido, adubacao equilibrada e espacamento adequado. Neste guia mostramos cada etapa do plantio a colheita...',
 'Equipe AuraViva', NOW(), 'ATIVO'),
('Sementes de inverno: guia completo',
 'Tudo o que voce precisa saber para cultivar durante a estacao fria.',
 'O inverno pede sementes resistentes ao frio. Apresentamos as melhores variedades, tempo de germinacao e cuidados com a irrigacao...',
 'Equipe AuraViva', NOW(), 'ATIVO');

-- -----------------------------------------------------
-- VENDAS  (valorTotal = itens + frete)
-- Venda 1: (2 x 12,90) + (1 x 34,50) + frete 25,00 = 85,30
-- Venda 2: (2 x 28,00)               + frete 18,50 = 74,50
-- -----------------------------------------------------
INSERT INTO Venda (idUsuario, dataVenda, statusVenda, frete, valorTotal, dataAtualizacao) VALUES
(2, NOW(), 'CONCLUIDO', 25.00, 85.30, NOW()),
(3, NOW(), 'PENDENTE',  18.50, 74.50, NULL);

INSERT INTO Item_Venda (idVenda, idProduto, quantidade, precoUnitario) VALUES
(1, 1, 2, 12.90),
(1, 2, 1, 34.50),
(2, 4, 2, 28.00);

-- -----------------------------------------------------
-- MENSAGENS (formulario de contato)
-- -----------------------------------------------------
INSERT INTO Mensagem (dataMensagem, emissor, email, telefone, texto, statusMensagem) VALUES
(NOW(), 'Carlos Mendes',  'carlos@email.com',   '(11) 91234-5678', 'Gostaria de saber sobre a disponibilidade de sementes de milho para o plantio de verao.', 'ATIVO'),
(NOW(), 'Fernanda Lima',  'fernanda@email.com', NULL,              'Voces trabalham com sementes convencionais de couve?',                                    'ATIVO');
