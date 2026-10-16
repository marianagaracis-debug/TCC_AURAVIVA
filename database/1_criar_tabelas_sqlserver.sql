-- =====================================================
-- AURAVIVA - Script 1 de 3: tabelas (SQL Server / Somee)
-- Compativel com SQL Server 2016+ e com as entidades JPA do backend.
--
-- COMO USAR NO SOMEE:
--   1. No painel do Somee, crie o banco (SQL Server) e anote host, nome,
--      usuario e senha.
--   2. Abra o banco (SSMS, Azure Data Studio ou o "Query" do painel) e
--      execute este script e depois o 2_dados_iniciais_sqlserver.sql.
--   (nao ha CREATE DATABASE/USER aqui: no Somee o banco e o login ja
--    vem criados pelo painel)
--
-- ATENCAO: este script APAGA as tabelas do AuraViva se ja existirem.
-- =====================================================

IF OBJECT_ID('dbo.Item_Venda', 'U')      IS NOT NULL DROP TABLE dbo.Item_Venda;
IF OBJECT_ID('dbo.Venda', 'U')           IS NOT NULL DROP TABLE dbo.Venda;
IF OBJECT_ID('dbo.RecuperarSenha', 'U')  IS NOT NULL DROP TABLE dbo.RecuperarSenha;
IF OBJECT_ID('dbo.Mensagem', 'U')        IS NOT NULL DROP TABLE dbo.Mensagem;
IF OBJECT_ID('dbo.Blog', 'U')            IS NOT NULL DROP TABLE dbo.Blog;
IF OBJECT_ID('dbo.Produto', 'U')         IS NOT NULL DROP TABLE dbo.Produto;
IF OBJECT_ID('dbo.Usuario', 'U')         IS NOT NULL DROP TABLE dbo.Usuario;

-- =====================================================
-- 1. USUARIO (perfil + autenticacao)
-- =====================================================
CREATE TABLE dbo.Usuario (
    id               INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nome             NVARCHAR(120)  NOT NULL,
    username         NVARCHAR(254)  NOT NULL,          -- e-mail de acesso
    password         VARCHAR(100)   NOT NULL,          -- hash BCrypt
    nivelAcesso      VARCHAR(20)        NULL,          -- ADMIN | FUNCIONARIO | USER
    telefone         VARCHAR(20)        NULL,
    foto             VARBINARY(MAX)     NULL,
    dataCadastro     DATETIME2      NOT NULL DEFAULT SYSDATETIME(),
    dataAtualizacao  DATETIME2          NULL,
    statusUsuario    VARCHAR(20)    NOT NULL,          -- ATIVO | INATIVO | TROCAR_SENHA

    CONSTRAINT uq_usuario_username UNIQUE (username),
    CONSTRAINT chk_usuario_nivel   CHECK (nivelAcesso IN ('ADMIN', 'FUNCIONARIO', 'USER')),
    CONSTRAINT chk_usuario_status  CHECK (statusUsuario IN ('ATIVO', 'INATIVO', 'TROCAR_SENHA'))
);

-- =====================================================
-- 2. PRODUTO (catalogo / verao / inverno / estoque)
-- =====================================================
CREATE TABLE dbo.Produto (
    id                INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    nome              NVARCHAR(120)  NOT NULL,
    descricao         NVARCHAR(500)      NULL,
    tipoSemente       NVARCHAR(100)  NOT NULL,   -- categoria: Vegetais, Graos, Frutas...
    especie           NVARCHAR(80)       NULL,
    variedade         NVARCHAR(100)      NULL,
    estacao           VARCHAR(10)    NOT NULL,   -- VERAO | INVERNO
    transgenico       BIT            NOT NULL DEFAULT 1,
    preco             DECIMAL(10,2)  NOT NULL,
    quantidadeEstoque INT            NOT NULL DEFAULT 0,
    destaque          BIT            NOT NULL DEFAULT 0,   -- 1 = destaque na HOME
    imagemUrl         VARCHAR(500)       NULL,
    foto              VARBINARY(MAX)     NULL,
    dataCadastro      DATETIME2      NOT NULL DEFAULT SYSDATETIME(),
    dataAtualizacao   DATETIME2          NULL,
    statusProduto     VARCHAR(20)    NOT NULL,   -- ATIVO | INATIVO

    CONSTRAINT chk_produto_estacao CHECK (estacao IN ('VERAO', 'INVERNO')),
    CONSTRAINT chk_produto_preco   CHECK (preco >= 0),
    CONSTRAINT chk_produto_estoque CHECK (quantidadeEstoque >= 0),
    CONSTRAINT chk_produto_status  CHECK (statusProduto IN ('ATIVO', 'INATIVO'))
);

-- =====================================================
-- 3. BLOG
-- =====================================================
CREATE TABLE dbo.Blog (
    id              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    titulo          NVARCHAR(200)  NOT NULL,
    resumo          NVARCHAR(300)      NULL,
    conteudo        NVARCHAR(MAX)  NOT NULL,
    autor           NVARCHAR(120)      NULL,
    imagem          VARBINARY(MAX)     NULL,
    dataPublicacao  DATETIME2      NOT NULL DEFAULT SYSDATETIME(),
    dataAtualizacao DATETIME2          NULL,
    statusBlog      VARCHAR(20)    NOT NULL,   -- ATIVO (publicado) | INATIVO (rascunho)

    CONSTRAINT chk_blog_status CHECK (statusBlog IN ('ATIVO', 'INATIVO'))
);

-- =====================================================
-- 4. VENDA (pedidos / checkout)  valorTotal = itens + frete
-- =====================================================
CREATE TABLE dbo.Venda (
    id              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    idUsuario       INT            NOT NULL,
    dataVenda       DATETIME2      NOT NULL DEFAULT SYSDATETIME(),
    statusVenda     VARCHAR(20)    NOT NULL DEFAULT 'PENDENTE', -- PENDENTE | PAGO | ENVIADO | CONCLUIDO | CANCELADO
    frete           DECIMAL(10,2)  NOT NULL DEFAULT 0,
    valorTotal      DECIMAL(10,2)  NOT NULL DEFAULT 0,
    dataAtualizacao DATETIME2          NULL,

    CONSTRAINT fk_venda_usuario FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(id),
    CONSTRAINT chk_venda_frete  CHECK (frete >= 0),
    CONSTRAINT chk_venda_total  CHECK (valorTotal >= 0),
    CONSTRAINT chk_venda_status CHECK (statusVenda IN ('PENDENTE', 'PAGO', 'ENVIADO', 'CONCLUIDO', 'CANCELADO'))
);

-- =====================================================
-- 5. ITEM DA VENDA
-- =====================================================
CREATE TABLE dbo.Item_Venda (
    id            INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    idVenda       INT            NOT NULL,
    idProduto     INT            NOT NULL,
    quantidade    INT            NOT NULL,
    precoUnitario DECIMAL(10,2)  NOT NULL,

    CONSTRAINT fk_item_venda         FOREIGN KEY (idVenda)   REFERENCES dbo.Venda(id),
    CONSTRAINT fk_item_produto       FOREIGN KEY (idProduto) REFERENCES dbo.Produto(id),
    CONSTRAINT uq_item_venda_produto UNIQUE (idVenda, idProduto),
    CONSTRAINT chk_item_qtd          CHECK (quantidade > 0),
    CONSTRAINT chk_item_preco        CHECK (precoUnitario >= 0)
);

-- =====================================================
-- 6. MENSAGEM (formulario "Fale conosco")
-- =====================================================
CREATE TABLE dbo.Mensagem (
    id              INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    dataMensagem    DATETIME2      NOT NULL DEFAULT SYSDATETIME(),
    emissor         NVARCHAR(100)  NOT NULL,
    email           NVARCHAR(254)  NOT NULL,
    telefone        VARCHAR(20)        NULL,
    texto           NVARCHAR(400)  NOT NULL,
    dataAtualizacao DATETIME2          NULL,
    statusMensagem  VARCHAR(20)    NOT NULL DEFAULT 'ATIVO', -- ATIVO | LIDO | INATIVO

    CONSTRAINT chk_msg_status CHECK (statusMensagem IN ('ATIVO', 'LIDO', 'INATIVO'))
);

-- =====================================================
-- 7. RECUPERAR SENHA (codigos enviados por e-mail)
-- =====================================================
CREATE TABLE dbo.RecuperarSenha (
    id           INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    email        NVARCHAR(254)  NOT NULL,  -- username do usuario
    codigo       CHAR(6)        NOT NULL,
    geradoEm     DATETIME2      NOT NULL DEFAULT SYSDATETIME(),
    expiraEm     DATETIME2      NOT NULL,
    statusCodigo BIT            NOT NULL DEFAULT 1  -- 1 = ativo, 0 = ja usado
);

-- =====================================================
-- 8. ENDERECO (enderecos de entrega do cliente)
-- =====================================================
IF OBJECT_ID('dbo.Wishlist',   'U') IS NOT NULL DROP TABLE dbo.Wishlist;
IF OBJECT_ID('dbo.Newsletter', 'U') IS NOT NULL DROP TABLE dbo.Newsletter;
IF OBJECT_ID('dbo.Endereco',   'U') IS NOT NULL DROP TABLE dbo.Endereco;

CREATE TABLE dbo.Endereco (
    id           INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    idUsuario    INT           NOT NULL,
    apelido      NVARCHAR(60)  NOT NULL DEFAULT 'Endereço',
    cep          VARCHAR(9)    NOT NULL,
    logradouro   NVARCHAR(200) NOT NULL,
    numero       VARCHAR(20)       NULL,
    complemento  NVARCHAR(100)     NULL,
    bairro       NVARCHAR(100) NOT NULL,
    cidade       NVARCHAR(100) NOT NULL,
    estado       CHAR(2)       NOT NULL,
    dataCadastro DATETIME2     NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_endereco_usuario FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(id)
);

-- =====================================================
-- 9. WISHLIST (lista de desejos)
-- =====================================================
CREATE TABLE dbo.Wishlist (
    id           INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    idUsuario    INT NOT NULL,
    idProduto    INT NOT NULL,
    adicionadoEm DATETIME2 NOT NULL DEFAULT SYSDATETIME(),

    CONSTRAINT fk_wishlist_usuario FOREIGN KEY (idUsuario) REFERENCES dbo.Usuario(id),
    CONSTRAINT fk_wishlist_produto FOREIGN KEY (idProduto) REFERENCES dbo.Produto(id),
    CONSTRAINT uq_wishlist         UNIQUE (idUsuario, idProduto)
);

-- =====================================================
-- 10. NEWSLETTER (inscritos)
-- =====================================================
CREATE TABLE dbo.Newsletter (
    id          INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    email       NVARCHAR(254) NOT NULL,
    inscritoEm  DATETIME2     NOT NULL DEFAULT SYSDATETIME(),
    ativo       BIT           NOT NULL DEFAULT 1,

    CONSTRAINT uq_newsletter_email UNIQUE (email)
);

-- =====================================================
-- Colunas adicionadas em versoes posteriores
-- =====================================================

-- Rastreio na Venda
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Venda') AND name = 'codigoRastreio')
    ALTER TABLE dbo.Venda ADD codigoRastreio  VARCHAR(100) NULL;

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Venda') AND name = 'previsaoEntrega')
    ALTER TABLE dbo.Venda ADD previsaoEntrega VARCHAR(40)  NULL;

IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Venda') AND name = 'enderecoEntrega')
    ALTER TABLE dbo.Venda ADD enderecoEntrega NVARCHAR(500) NULL;

-- URL de imagem no Blog
IF NOT EXISTS (SELECT 1 FROM sys.columns WHERE object_id = OBJECT_ID('dbo.Blog') AND name = 'imagemUrl')
    ALTER TABLE dbo.Blog ADD imagemUrl VARCHAR(500) NULL;
