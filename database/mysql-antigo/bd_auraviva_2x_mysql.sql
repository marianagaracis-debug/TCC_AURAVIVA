-- =====================================================
-- AURAVIVA - SCRIPT COMPLETO (1 + 2): cria o banco, o usuario,
-- as tabelas e os dados iniciais de uma vez so.
-- Equivale a rodar 1_criar_banco_e_tabelas.sql e 2_dados_iniciais.sql.
-- SGBD: MySQL 8.0+
--
-- ATENCAO: APAGA o banco bd_auraviva_2x (se existir) e cria de novo.
-- Execute com um usuario administrador do MySQL (ex.: root).
-- =====================================================

DROP DATABASE IF EXISTS bd_auraviva_2x;
CREATE DATABASE bd_auraviva_2x
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Usuario do MySQL usado pelo backend (SOMENTE desenvolvimento local).
-- Mesmos dados do arquivo backend/.env.example
-- -----------------------------------------------------
CREATE USER IF NOT EXISTS 'auraviva'@'localhost' IDENTIFIED BY 'auraviva123';
CREATE USER IF NOT EXISTS 'auraviva'@'127.0.0.1' IDENTIFIED BY 'auraviva123';
CREATE USER IF NOT EXISTS 'auraviva'@'::1'       IDENTIFIED BY 'auraviva123';
GRANT ALL PRIVILEGES ON bd_auraviva_2x.* TO 'auraviva'@'localhost';
GRANT ALL PRIVILEGES ON bd_auraviva_2x.* TO 'auraviva'@'127.0.0.1';
GRANT ALL PRIVILEGES ON bd_auraviva_2x.* TO 'auraviva'@'::1';

USE bd_auraviva_2x;

-- =====================================================
-- 1. USUARIO (perfil + autenticacao)
-- =====================================================
CREATE TABLE Usuario (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    nome             VARCHAR(120)  NOT NULL,
    username         VARCHAR(254)  NOT NULL UNIQUE,  -- e-mail de acesso
    password         VARCHAR(100)  NOT NULL,         -- hash BCrypt
    nivelAcesso      VARCHAR(10)       NULL,         -- ADMIN | USER
    telefone         VARCHAR(20)       NULL,
    foto             LONGBLOB          NULL,
    dataCadastro     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao  DATETIME          NULL,
    statusUsuario    VARCHAR(20)   NOT NULL,         -- ATIVO | INATIVO | TROCAR_SENHA

    CONSTRAINT chk_usuario_nivel  CHECK (nivelAcesso IN ('ADMIN', 'USER')),
    CONSTRAINT chk_usuario_status CHECK (statusUsuario IN ('ATIVO', 'INATIVO', 'TROCAR_SENHA'))
) ENGINE = InnoDB;

-- =====================================================
-- 2. PRODUTO (produtos / verao / inverno / estoque)
-- =====================================================
CREATE TABLE Produto (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nome              VARCHAR(120)   NOT NULL,
    descricao         VARCHAR(500)       NULL,
    tipoSemente       VARCHAR(100)   NOT NULL,   -- Milho, Soja, Tomate, Trigo...
    especie           VARCHAR(80)        NULL,
    variedade         VARCHAR(100)       NULL,
    estacao           VARCHAR(10)    NOT NULL,   -- VERAO | INVERNO
    transgenico       BIT            NOT NULL DEFAULT 1, -- 1 = transgenica, 0 = convencional
    preco             DECIMAL(10,2)  NOT NULL,
    quantidadeEstoque INT            NOT NULL DEFAULT 0,
    destaque          BIT            NOT NULL DEFAULT 0, -- 1 = destaque na HOME
    imagemUrl         VARCHAR(500)       NULL,   -- URL da imagem (externa) exibida no site
    foto              LONGBLOB           NULL,   -- upload binario (opcional)
    dataCadastro      DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao   DATETIME           NULL,
    statusProduto     VARCHAR(20)    NOT NULL,   -- ATIVO | INATIVO

    CONSTRAINT chk_produto_estacao CHECK (estacao IN ('VERAO', 'INVERNO')),
    CONSTRAINT chk_produto_preco   CHECK (preco >= 0),
    CONSTRAINT chk_produto_estoque CHECK (quantidadeEstoque >= 0),
    CONSTRAINT chk_produto_status  CHECK (statusProduto IN ('ATIVO', 'INATIVO'))
) ENGINE = InnoDB;

-- =====================================================
-- 3. BLOG
-- =====================================================
CREATE TABLE Blog (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    titulo          VARCHAR(200)  NOT NULL,
    resumo          VARCHAR(300)      NULL,
    conteudo        LONGTEXT      NOT NULL,
    autor           VARCHAR(120)      NULL,
    imagem          LONGBLOB          NULL,
    dataPublicacao  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    dataAtualizacao DATETIME          NULL,
    statusBlog      VARCHAR(20)   NOT NULL,   -- ATIVO (publicado) | INATIVO (rascunho)

    CONSTRAINT chk_blog_status CHECK (statusBlog IN ('ATIVO', 'INATIVO'))
) ENGINE = InnoDB;

-- =====================================================
-- 4. VENDA (pedidos / checkout)
-- valorTotal = soma dos itens + frete
-- =====================================================
CREATE TABLE Venda (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario       INT            NOT NULL,
    dataVenda       DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    statusVenda     VARCHAR(20)    NOT NULL DEFAULT 'PENDENTE', -- PENDENTE | PAGO | ENVIADO | CONCLUIDO | CANCELADO
    frete           DECIMAL(10,2)  NOT NULL DEFAULT 0,
    valorTotal      DECIMAL(10,2)  NOT NULL DEFAULT 0,
    dataAtualizacao DATETIME           NULL,

    CONSTRAINT fk_venda_usuario FOREIGN KEY (idUsuario) REFERENCES Usuario(id),
    CONSTRAINT chk_venda_frete  CHECK (frete >= 0),
    CONSTRAINT chk_venda_total  CHECK (valorTotal >= 0),
    CONSTRAINT chk_venda_status CHECK (statusVenda IN ('PENDENTE', 'PAGO', 'ENVIADO', 'CONCLUIDO', 'CANCELADO'))
) ENGINE = InnoDB;

-- =====================================================
-- 5. ITEM DA VENDA
-- =====================================================
CREATE TABLE Item_Venda (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    idVenda       INT            NOT NULL,
    idProduto     INT            NOT NULL,
    quantidade    INT            NOT NULL,
    precoUnitario DECIMAL(10,2)  NOT NULL,

    CONSTRAINT fk_item_venda         FOREIGN KEY (idVenda)   REFERENCES Venda(id),
    CONSTRAINT fk_item_produto       FOREIGN KEY (idProduto) REFERENCES Produto(id),
    CONSTRAINT uq_item_venda_produto UNIQUE (idVenda, idProduto),
    CONSTRAINT chk_item_qtd          CHECK (quantidade > 0),
    CONSTRAINT chk_item_preco        CHECK (precoUnitario >= 0)
) ENGINE = InnoDB;

-- =====================================================
-- 6. MENSAGEM (formulario de contato)
-- =====================================================
CREATE TABLE Mensagem (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    dataMensagem    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    emissor         VARCHAR(100)  NOT NULL,
    email           VARCHAR(254)  NOT NULL,
    telefone        VARCHAR(20)       NULL,
    texto           VARCHAR(400)  NOT NULL,
    dataAtualizacao DATETIME          NULL,
    statusMensagem  VARCHAR(20)   NOT NULL DEFAULT 'ATIVO', -- ATIVO | LIDO | INATIVO

    CONSTRAINT chk_msg_status CHECK (statusMensagem IN ('ATIVO', 'LIDO', 'INATIVO'))
) ENGINE = InnoDB;

-- =====================================================
-- 7. RECUPERAR SENHA (codigos enviados por e-mail)
-- =====================================================
CREATE TABLE RecuperarSenha (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    email        VARCHAR(254)  NOT NULL,  -- username do usuario
    codigo       CHAR(6)       NOT NULL,
    geradoEm     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expiraEm     DATETIME      NOT NULL,
    statusCodigo BIT           NOT NULL DEFAULT 1  -- 1 = ativo, 0 = ja usado
) ENGINE = InnoDB;

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
