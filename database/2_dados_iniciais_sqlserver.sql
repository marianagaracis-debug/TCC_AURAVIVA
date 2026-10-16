-- =====================================================
-- AURAVIVA - Script 2 de 3: dados iniciais (SQL Server / Somee)
-- Rode DEPOIS do script 1, no mesmo banco.
-- O catalogo de produtos e o mesmo do site (51 sementes).
-- =====================================================

-- -----------------------------------------------------
-- USUARIOS (senha de todos: 12345678)
-- O hash abaixo e o BCrypt de "12345678".
-- -----------------------------------------------------
INSERT INTO dbo.Usuario (nome, username, password, nivelAcesso, telefone, statusUsuario) VALUES
(N'Administrador AuraViva', N'admin@auraviva.com.br',       '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'ADMIN',       '(11) 4002-8922',   'ATIVO'),
(N'Funcionario AuraViva',   N'funcionario@auraviva.com.br', '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'FUNCIONARIO', '(11) 4002-8923',   'ATIVO'),
(N'Maria Oliveira',         N'maria@email.com',             '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER',        '(11) 98765-4321',  'ATIVO'),
(N'Joao Pereira',           N'joao@email.com',              '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER',        '(31) 99123-4567',  'ATIVO'),
(N'Ana Souza',              N'ana@email.com',               '$2a$10$Su2UIixHK/L2kAMDQAB1AusVsF6eEzwVoyU/hUBnQKtc78yGO0nzi', 'USER',        NULL,               'INATIVO');

-- -----------------------------------------------------
-- PRODUTOS (mesmo catalogo do site; precos em reais)
-- -----------------------------------------------------
INSERT INTO dbo.Produto (nome, tipoSemente, estacao, transgenico, preco, quantidadeEstoque, destaque, imagemUrl, statusProduto) VALUES
(N'Milho Doce', N'Vegetais', 'VERAO', 0, 14.90, 150, 1, 'https://agristar.com.br/upload/products/original/04529.jpg', 'ATIVO'),
(N'Tomate Cereja', N'Vegetais', 'VERAO', 0, 12.90, 150, 1, 'https://images.pexels.com/photos/37730751/pexels-photo-37730751/free-photo-of-tomates-cereja-frescos-em-uma-tigela-branca.jpeg', 'ATIVO'),
(N'Pimentão Vermelho', N'Vegetais', 'VERAO', 0, 11.90, 100, 0, 'https://images.pexels.com/photos/30803822/pexels-photo-30803822/free-photo-of-natureza-morta-com-pimentoes-vermelhos.jpeg', 'ATIVO'),
(N'Pimentão Amarelo', N'Vegetais', 'VERAO', 0, 11.90, 100, 0, 'https://images.pexels.com/photos/37058364/pexels-photo-37058364.jpeg?cs=srgb&dl=pexels-sasif-awan-520122311-37058364.jpg&fm=jpg', 'ATIVO'),
(N'Pepino Japonês', N'Vegetais', 'VERAO', 0, 9.90, 100, 0, 'https://img.magnific.com/fotos-gratis/pepinos-maduros-frescos-na-placa-de-madeira_114579-68778.jpg?semt=ais_hybrid&w=740&q=80', 'ATIVO'),
(N'Abóbora Cabotiá', N'Vegetais', 'VERAO', 0, 13.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6Z8X0WSAjmaAEtVrIRj_KKAKyqgqnaJzwFA&s', 'ATIVO'),
(N'Cebola Baia Periforme', N'Vegetais', 'INVERNO', 0, 8.90, 100, 0, 'https://imagens.isla.com.br/isla/producao/71p06-51104.jpg', 'ATIVO'),
(N'Brócolis Ramoso', N'Vegetais', 'INVERNO', 0, 10.90, 100, 0, 'https://images.tcdn.com.br/img/img_prod/905552/brocolis_ramoso_organico_p_entregas_a_partir_de_terca_feira_2035_1_f80d87e6d51b6babb8cdf031971ec957.jpg', 'ATIVO'),
(N'Couve Manteiga', N'Vegetais', 'INVERNO', 0, 8.90, 100, 0, 'https://meuamigotemumsitio.com.br/wp-content/uploads/2023/04/Foto011920x1080-2-1024x576.webp', 'ATIVO'),
(N'Pimenta Dedo-de-Moça', N'Vegetais', 'VERAO', 0, 9.90, 100, 0, 'https://www.petz.com.br/blog/wp-content/uploads/2022/11/como-plantar-pimenta-dedo-de-moca.jpg', 'ATIVO'),
(N'Ervilha', N'Leguminosas', 'INVERNO', 0, 10.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaNxmwCv6JgpbzpmSiKw699sbXccsoAcRtGGvNkQTIXNuRRrTJIdmOaf4&s=10', 'ATIVO'),
(N'Feijão Vagem', N'Leguminosas', 'INVERNO', 0, 12.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKUqu3P59LcCmGHsF2YkWLYnjH_e8-Lvku3Et9eSmpSA&s=10', 'ATIVO'),
(N'Melância Crimson Sweet', N'Frutas', 'VERAO', 0, 14.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiRyjBpW_nN2mfx5kLpjRBXqh3Dr5yiMkxRjDVe98AAfY9tDq48W9qkX8&s=10', 'ATIVO'),
(N'Melão Amarelo', N'Frutas', 'VERAO', 0, 13.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfDl7HDgt3WqZ4pnIDivfb1tGakas6Jf6N6GF3402jvw&s=10', 'ATIVO'),
(N'Alface Crespa', N'Vegetais', 'INVERNO', 0, 7.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSopwgSjr8I1rJunqasNBleDNBBkcahpuV-uPFUKudPsg&s=10', 'ATIVO'),
(N'Cenoura Brasília', N'Vegetais', 'INVERNO', 0, 8.90, 100, 0, 'https://www.sitiodamata.com.br/media/catalog/product/cache/02a967fa0e464fd60865ccf512e40f92/c/e/cenoura-brasilia-agroeconomico-2-2-e1494768491984.jpg', 'ATIVO'),
(N'Soja', N'Leguminosas', 'VERAO', 0, 15.90, 150, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUdJL4r0CxfWtfZWR19ZSAuqlpttz3uHYEb9OmeWajYA&s=10', 'ATIVO'),
(N'Algodão', N'Outros cultivos', 'VERAO', 0, 16.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTSiPpZHEhcNo1XDdyQ_26eMLjYWYFwXxKlXFmxuVuPPQ&s=10', 'ATIVO'),
(N'Cana-de-açúcar', N'Outros cultivos', 'VERAO', 0, 14.90, 100, 0, 'https://blog.syngentadigital.ag/wp-content/uploads/2018/09/cana-de-acucar.jpeg', 'ATIVO'),
(N'Milho Amarelo', N'Grãos', 'VERAO', 0, 14.90, 100, 0, 'https://cdn.awsli.com.br/2500x2500/998/998380/produto/36839968/sementes-milho-itapoa-rara-cg42m32mcs.jpeg', 'ATIVO'),
(N'Milho Branco', N'Grãos', 'VERAO', 0, 14.90, 100, 0, 'https://www.thjardins.com.br/wp-content/uploads/2026/07/zea-mays-tennessee-red-cob-co-130731689.jpg', 'ATIVO'),
(N'Feijão Carioca', N'Leguminosas', 'INVERNO', 0, 13.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzTkGMjDvE8R6h_7Karv-Hw4fEXvOEY1gjc6afQNAONw&s=10', 'ATIVO'),
(N'Feijão Preto', N'Leguminosas', 'INVERNO', 0, 13.90, 100, 0, 'https://a-static.mlcdn.com.br/450pxx450px/feijao-preto-ipr-urutau-5-kg-de-sementes/jokisementes/1c7b2026cb7111ed840a4201ac185033/a299fe2dde15381a9cf86dd539dc92c2.jpeg', 'ATIVO'),
(N'Sorgo', N'Grãos', 'VERAO', 0, 15.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWda2Um9EOKfzxtnFup-HiQ1ASttD43KIf62WoVKzUOw&s=10', 'ATIVO'),
(N'Girassol', N'Flores', 'VERAO', 0, 16.90, 100, 0, 'https://s2-casaejardim.glbimg.com/p5EWKnajG4PdkUPsuV3GKP3H0ug=/0x0:667x1000/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/U/0/BsZ0X9QbCHnbE9ckg9jw/girassois-de-flores-florescendo-na-exploracao-agricola-coloque-com-ceu-azul-fundo-colorido-natural-bonito.jpg', 'ATIVO'),
(N'Trigo', N'Grãos', 'INVERNO', 0, 12.90, 150, 1, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT30uM5vGqW8rn1vqJn2evzBPYBkKiNNIc68S_Se3dXMubiTRWm-H1F1Nc&s=10', 'ATIVO'),
(N'Arroz', N'Grãos', 'VERAO', 0, 13.90, 100, 0, 'https://thumbs.dreamstime.com/b/semente-do-arroz-e-gr%C3%A3o-tailandesas-da-mistura-25369891.jpg', 'ATIVO'),
(N'Beterraba', N'Vegetais', 'INVERNO', 0, 9.90, 100, 0, 'https://s2-casaejardim.glbimg.com/abNumB_CkZubTrHRvRZHeGxHCx8=/0x0:620x455/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_a0b7e59562ef42049f4e191fe476fe7d/internal_photos/bs/2023/E/v/Vq51oCQ7AqILB8usgOxQ/2020-01-17-gettyimages-182175899.jpeg', 'ATIVO'),
(N'Canola', N'Outros cultivos', 'INVERNO', 0, 14.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM7SrjcNCNJqee2lo-f35ME-jLDiGTxHxjo-DP0B26J5ySXuURauvp_mqP&s=10', 'ATIVO'),
(N'Batata', N'Vegetais', 'INVERNO', 0, 11.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWNZIFLQfqsS83sLIuUNHUxwyUwihWFpWslVtTSHxQ3_JiIOY45b1hup4&s=10', 'ATIVO'),
(N'Alfafa', N'Outros cultivos', 'INVERNO', 0, 12.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQcb7T81Xa4Zjk6N6SOzh_A4EaSarWREA3Wr3uY4F2F5A&s=10', 'ATIVO'),
(N'Feijão Branco', N'Leguminosas', 'INVERNO', 0, 13.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoYTmk66lahznYQgksFGyVAeS0YMy3rlxgCFCln9DEZQ&s=10', 'ATIVO'),
(N'Feijão Vermelho', N'Leguminosas', 'INVERNO', 0, 13.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTawxmIjhRb8bWOHw0jXWPMwLsSYt1iLbUo1rLcbq_g5gASFML-H03ahcXQ&s=10', 'ATIVO'),
(N'Eucalipto', N'Outros cultivos', 'VERAO', 0, 17.90, 100, 0, 'https://vasoeflor.cdn.magazord.com.br/img/2023/10/produto/1976/eucaliptos.jpg?ims=fit-in/800x800/filters:fill(white)', 'ATIVO'),
(N'Mandioca', N'Vegetais', 'VERAO', 0, 16.90, 100, 0, 'https://res.cloudinary.com/dbw5mokn7/image/upload/v1779565712/borogodo/blog/post-mandioca-a-raiz-da-cozinha-brasileira.jpg', 'ATIVO'),
(N'Batata-doce', N'Vegetais', 'INVERNO', 0, 11.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUCBRrNNRuaAlKo8i0Q9rwiuHS5vWTp37PuIvXeAxsWqHz9U6Pk9wmVps&s=10', 'ATIVO'),
(N'Aveia', N'Grãos', 'INVERNO', 0, 12.90, 100, 0, 'https://www.vitao.com.br/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/3/0/300015499_-_AVEIA_FLOCOS_FINOS_SEM_GLUTEN_170g_C12_-_7896863499876_-_V01.01_-_AI2.webp', 'ATIVO'),
(N'Cevada', N'Grãos', 'INVERNO', 0, 13.90, 100, 0, 'https://agro2.com.br/wp-content/uploads/2022/08/graos-de-cevada-1.jpg', 'ATIVO'),
(N'Amendoim', N'Leguminosas', 'VERAO', 0, 14.90, 100, 0, 'https://imageswscdn.wslojas.com.br/files/24600/produto-amendoim-ccasca-runner-a-granel-100gr-6532190717.webp', 'ATIVO'),
(N'Café', N'Outros cultivos', 'VERAO', 0, 18.90, 100, 0, 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80', 'ATIVO'),
(N'Cacau', N'Outros cultivos', 'VERAO', 0, 17.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTEC8vUoS7qcFTwobC-bmlfM5aZph3Gc82v59-I9WHrUQqmRvcTXItRFAf&s=10', 'ATIVO'),
(N'Mamona', N'Outros cultivos', 'VERAO', 0, 15.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQIc2YCCZS3_gfj5BZNYWkIAGth3ghhkxlrsMlyU75MnhUuvv-OYzrie4A&s=10', 'ATIVO'),
(N'Pepino Caipira', N'Vegetais', 'VERAO', 0, 9.90, 100, 0, 'https://img.magnific.com/fotos-gratis/pepinos-maduros-frescos-na-placa-de-madeira_114579-68778.jpg?semt=ais_hybrid&w=740&q=80', 'ATIVO'),
(N'Pimentão Verde', N'Vegetais', 'VERAO', 0, 11.90, 100, 0, 'https://cdn.awsli.com.br/2500x2500/998/998380/produto/36843228/sementes-pimentao-verde-rara-znriencopd.jpeg', 'ATIVO'),
(N'Berinjela', N'Vegetais', 'VERAO', 0, 10.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9yDIVuU2RTBVVxfozyGVT3MBzZegxcBaLZoKN1PrX_w&s=10', 'ATIVO'),
(N'Abobrinha', N'Vegetais', 'VERAO', 0, 9.90, 100, 0, 'https://www.petz.com.br/blog/wp-content/uploads/2024/09/abobrinha_01-scaled.jpg', 'ATIVO'),
(N'Quiabo', N'Vegetais', 'VERAO', 0, 8.90, 100, 0, 'https://conteudo.imguol.com.br/blogs/171/files/2019/01/iStock-924389372-1024x683.jpg', 'ATIVO'),
(N'Melão Cantaloupe', N'Frutas', 'VERAO', 0, 14.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQejAJoTDlcn0QJLGalUHCcLdyE9h3TaN5sR00UE9e2clgk4CN8M7bkeSpv&s=10', 'ATIVO'),
(N'Mamão', N'Frutas', 'VERAO', 0, 13.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxHeqbQI1izy3BUIbf3o1KGtbxw3bd6QQK3nagrBfQCg&s=10', 'ATIVO'),
(N'Maracujá', N'Frutas', 'VERAO', 0, 12.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPhamWx8Mdq3bi463pLLMGYQ7DK_ACa2qo4f3-Jh3Zig&s=10', 'ATIVO'),
(N'Abacaxi', N'Frutas', 'VERAO', 0, 14.90, 100, 0, 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfbe5KIE2_JbMInpYQyfeAeVViZ_hwlQEBjcbx1sF8J9lxgOHyy4DQ5VVk&s=10', 'ATIVO');

-- -----------------------------------------------------
-- BLOG
-- -----------------------------------------------------
INSERT INTO dbo.Blog (titulo, resumo, conteudo, autor, statusBlog) VALUES
(N'Como plantar sementes no verao',
 N'Confira o passo a passo para obter alta produtividade no plantio de verao.',
 N'As sementes de verao exigem solo umido, adubacao equilibrada e espacamento adequado. Neste guia mostramos cada etapa do plantio a colheita...',
 N'Equipe AuraViva', 'ATIVO'),
(N'Sementes de inverno: guia completo',
 N'Tudo o que voce precisa saber para cultivar durante a estacao fria.',
 N'O inverno pede sementes resistentes ao frio. Apresentamos as melhores variedades, tempo de germinacao e cuidados com a irrigacao...',
 N'Equipe AuraViva', 'ATIVO');

-- -----------------------------------------------------
-- VENDAS (valorTotal = itens + frete; entrega gratis)
-- Venda 1 (Maria): 2 x Tomate Cereja + 1 x Milho Doce = 40.70
-- Venda 2 (Joao):  2 x Soja                            = 31.80
-- -----------------------------------------------------
INSERT INTO dbo.Venda (idUsuario, statusVenda, frete, valorTotal, dataAtualizacao) VALUES
((SELECT id FROM dbo.Usuario WHERE username = N'maria@email.com'), 'CONCLUIDO', 0, 40.70, SYSDATETIME()),
((SELECT id FROM dbo.Usuario WHERE username = N'joao@email.com'),  'PENDENTE',  0, 31.80, NULL);

INSERT INTO dbo.Item_Venda (idVenda, idProduto, quantidade, precoUnitario) VALUES
((SELECT MIN(id) FROM dbo.Venda), (SELECT id FROM dbo.Produto WHERE nome = N'Tomate Cereja'), 2, 12.90),
((SELECT MIN(id) FROM dbo.Venda), (SELECT id FROM dbo.Produto WHERE nome = N'Milho Doce'),    1, 14.90),
((SELECT MAX(id) FROM dbo.Venda), (SELECT id FROM dbo.Produto WHERE nome = N'Soja'),           2, 15.90);

-- -----------------------------------------------------
-- MENSAGENS (formulario de contato)
-- -----------------------------------------------------
INSERT INTO dbo.Mensagem (emissor, email, telefone, texto, statusMensagem) VALUES
(N'Carlos Mendes', N'carlos@email.com',   '(11) 91234-5678', N'Gostaria de saber sobre a disponibilidade de sementes de milho para o plantio de verao.', 'ATIVO'),
(N'Fernanda Lima', N'fernanda@email.com', NULL,              N'Voces trabalham com sementes convencionais de couve?', 'ATIVO');
