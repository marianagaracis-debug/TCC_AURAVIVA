-- =====================================================
-- AURAVIVA - Script 1 de 3: criar banco, usuario e tabelas
-- SGBD: MySQL 8.0+
-- Estrutura compativel com as entidades JPA do backend
--
-- ATENCAO: este script APAGA o banco bd_auraviva_2x (se ele
-- ja existir) e cria tudo de novo.
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
