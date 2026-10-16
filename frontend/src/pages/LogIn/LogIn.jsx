import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import styles from "./LogIn.module.css";

const CHAVE_USUARIO    = "auraviva-usuario";
const CHAVE_FUNCIONARIO = "auraviva-funcionario";
const CHAVE_SESSAO     = "auraviva-sessao";

// modoRecuperacao: null | "email" | "codigo" | "nova-senha"
const LogIn = () => {
  const navigate = useNavigate();
  const [modoCadastro,    setModoCadastro]    = useState(false);
  const [tipoAcesso,      setTipoAcesso]      = useState("cliente");
  const [dados,           setDados]           = useState({ nome: "", email: "", senha: "", confirmarSenha: "", codigoFuncionario: "" });
  const [carregando,      setCarregando]      = useState(false);
  const [mensagem,        setMensagem]        = useState("");
  // recuperacao de senha
  const [modoRecuperacao, setModoRecuperacao] = useState(null); // null | "email" | "codigo" | "nova-senha"
  const [emailRecuperacao,setEmailRecuperacao]= useState("");
  const [codigoDigitado,  setCodigoDigitado]  = useState("");
  const [novaSenha,       setNovaSenha]       = useState("");
  const [confirmarNova,   setConfirmarNova]   = useState("");

  const alternarModo = () => { setModoCadastro((v) => !v); setMensagem(""); };

  const atualizarCampo = (event) => {
    const { name, value } = event.target;
    setDados((d) => ({ ...d, [name]: value }));
  };

  const lerLocal = (chave) => {
    try { return JSON.parse(localStorage.getItem(chave) || "null"); }
    catch { return null; }
  };

  /* -------- Login / cadastro -------- */
  const enviarFormulario = async (event) => {
    event.preventDefault();
    if (carregando) return;
    const email = dados.email.trim().toLowerCase();
    setCarregando(true);

    try {
      if (modoCadastro) {
        if (dados.senha.length < 8) { setMensagem("A senha deve ter no mínimo 8 caracteres."); return; }
        if (dados.senha !== dados.confirmarSenha) { setMensagem("As senhas não coincidem."); return; }
        const usuario = { nome: dados.nome.trim(), username: email, password: dados.senha };
        if (tipoAcesso === "funcionario") {
          await api.cadastrarFuncionario(usuario, dados.codigoFuncionario);
        } else {
          await api.cadastrarCliente(usuario);
        }
        setMensagem(`Cadastro de ${tipoAcesso === "funcionario" ? "funcionário" : "cliente"} realizado! Agora você já pode entrar.`);
        setDados({ nome: "", email, senha: "", confirmarSenha: "", codigoFuncionario: "" });
        setModoCadastro(false);
        return;
      }

      await api.entrar(email, dados.senha);
      const perfil = await api.meuPerfil();
      const ehCliente = perfil.nivelAcesso === "USER";

      if ((tipoAcesso === "cliente") !== ehCliente) {
        await api.sair().catch(() => {});
        setMensagem(ehCliente
          ? "Esta conta é de cliente. Selecione a aba Cliente para entrar."
          : "Esta conta é de funcionário. Selecione a aba Funcionário para entrar.");
        return;
      }

      const chaveConta = ehCliente ? CHAVE_USUARIO : CHAVE_FUNCIONARIO;
      const anterior   = lerLocal(chaveConta);
      const sessao = {
        ...(anterior?.email === perfil.username ? anterior : {}),
        id: perfil.id,
        nome: perfil.nome,
        email: perfil.username,
        telefone: perfil.telefone || "",
        nivelAcesso: perfil.nivelAcesso,
        tipoPerfil: ehCliente ? "cliente" : "funcionario",
        cadastroEm: perfil.dataCadastro,
        statusConta: "ativa",
        ultimoAcessoEm: new Date().toISOString(),
      };

      localStorage.setItem(CHAVE_SESSAO,  JSON.stringify(sessao));
      localStorage.setItem(chaveConta, JSON.stringify(sessao));
      navigate(ehCliente ? "/auraviva/perfil" : "/auraviva/perfil-usuario");
    } catch (erro) {
      setMensagem(!modoCadastro && erro.status === 401 ? "E-mail ou senha inválidos." : erro.message);
    } finally {
      setCarregando(false);
    }
  };

  /* -------- Recuperação – etapa 1: solicitar código -------- */
  const solicitarCodigo = async (event) => {
    event.preventDefault();
    if (carregando || !emailRecuperacao.trim()) return;
    setCarregando(true);
    setMensagem("");
    try {
      await api.solicitarCodigo(emailRecuperacao.trim().toLowerCase());
      setModoRecuperacao("codigo");
      setMensagem("Código enviado para o e-mail informado. Verifique sua caixa de entrada.");
    } catch (erro) {
      setMensagem(erro.message || "Não foi possível enviar o código.");
    } finally {
      setCarregando(false);
    }
  };

  /* -------- Recuperação – etapa 2: validar código -------- */
  const validarCodigo = async (event) => {
    event.preventDefault();
    if (carregando || !codigoDigitado.trim()) return;
    setCarregando(true);
    setMensagem("");
    try {
      await api.validarCodigo(emailRecuperacao.trim().toLowerCase(), codigoDigitado.trim());
      setModoRecuperacao("nova-senha");
      setMensagem("");
    } catch (erro) {
      setMensagem(erro.message || "Código inválido ou expirado.");
    } finally {
      setCarregando(false);
    }
  };

  /* -------- Recuperação – etapa 3: nova senha -------- */
  const redefinirSenha = async (event) => {
    event.preventDefault();
    if (carregando) return;
    if (novaSenha.length < 8) { setMensagem("A senha deve ter no mínimo 8 caracteres."); return; }
    if (novaSenha !== confirmarNova) { setMensagem("As senhas não coincidem."); return; }
    setCarregando(true);
    setMensagem("");
    try {
      await api.redefinirSenha(emailRecuperacao.trim().toLowerCase(), codigoDigitado.trim(), novaSenha);
      setModoRecuperacao(null);
      setMensagem("Senha redefinida com sucesso! Você já pode entrar com a nova senha.");
    } catch (erro) {
      setMensagem(erro.message || "Não foi possível redefinir a senha.");
    } finally {
      setCarregando(false);
    }
  };

  /* -------- Tela de recuperação de senha -------- */
  if (modoRecuperacao === "email") {
    return (
      <main className={styles.page}>
        <div className={styles.backgroundShape} aria-hidden="true" />
        <section className={styles.panel} aria-labelledby="rec-titulo">
          <Link to="/auraviva/home" className={styles.logo}>Auraviva</Link>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Recuperar acesso</span>
            <h1 id="rec-titulo">Esqueci minha senha</h1>
            <p>Informe o e-mail da sua conta. Enviaremos um código de verificação.</p>
          </div>
          <form className={styles.formulario} onSubmit={solicitarCodigo}>
            <label>
              E-mail cadastrado
              <input type="email" placeholder="voce@email.com" value={emailRecuperacao}
                onChange={(e) => setEmailRecuperacao(e.target.value)} required />
            </label>
            <button type="submit" className={styles.submitButton} disabled={carregando}>
              {carregando ? "Enviando..." : "Enviar código"}
            </button>
          </form>
          {mensagem && <p className={styles.mensagem} role="status">{mensagem}</p>}
          <p className={styles.switchText}>
            Lembrou a senha?{" "}
            <button type="button" className={styles.switchButton}
              onClick={() => { setModoRecuperacao(null); setMensagem(""); }}>
              Voltar ao login
            </button>
          </p>
        </section>
      </main>
    );
  }

  if (modoRecuperacao === "codigo") {
    return (
      <main className={styles.page}>
        <div className={styles.backgroundShape} aria-hidden="true" />
        <section className={styles.panel} aria-labelledby="cod-titulo">
          <Link to="/auraviva/home" className={styles.logo}>Auraviva</Link>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Recuperar acesso</span>
            <h1 id="cod-titulo">Digite o código</h1>
            <p>Código enviado para <strong>{emailRecuperacao}</strong>.</p>
          </div>
          {mensagem && <p className={styles.mensagem} role="status">{mensagem}</p>}
          <form className={styles.formulario} onSubmit={validarCodigo}>
            <label>
              Código de 6 dígitos
              <input type="text" placeholder="000000" maxLength={6} value={codigoDigitado}
                onChange={(e) => setCodigoDigitado(e.target.value)} required />
            </label>
            <button type="submit" className={styles.submitButton} disabled={carregando}>
              {carregando ? "Verificando..." : "Confirmar código"}
            </button>
          </form>
          <p className={styles.switchText}>
            Não recebeu?{" "}
            <button type="button" className={styles.switchButton}
              onClick={() => { setModoRecuperacao("email"); setMensagem(""); setCodigoDigitado(""); }}>
              Reenviar código
            </button>
          </p>
        </section>
      </main>
    );
  }

  if (modoRecuperacao === "nova-senha") {
    return (
      <main className={styles.page}>
        <div className={styles.backgroundShape} aria-hidden="true" />
        <section className={styles.panel} aria-labelledby="ns-titulo">
          <Link to="/auraviva/home" className={styles.logo}>Auraviva</Link>
          <div className={styles.heading}>
            <span className={styles.eyebrow}>Recuperar acesso</span>
            <h1 id="ns-titulo">Nova senha</h1>
            <p>Crie uma nova senha para a sua conta.</p>
          </div>
          <form className={styles.formulario} onSubmit={redefinirSenha}>
            <label>
              Nova senha
              <input type="password" placeholder="Mínimo 8 caracteres" value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)} minLength={8} required />
            </label>
            <label>
              Confirmar nova senha
              <input type="password" placeholder="Repita a nova senha" value={confirmarNova}
                onChange={(e) => setConfirmarNova(e.target.value)} required />
            </label>
            <button type="submit" className={styles.submitButton} disabled={carregando}>
              {carregando ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
          {mensagem && <p className={styles.mensagem} role="status">{mensagem}</p>}
        </section>
      </main>
    );
  }

  /* -------- Tela principal de login / cadastro -------- */
  return (
    <main className={styles.page}>
      <div className={styles.backgroundShape} aria-hidden="true" />
      <section className={styles.panel} aria-labelledby="login-titulo">
        <Link to="/auraviva/home" className={styles.logo}>Auraviva</Link>
        <div className={styles.heading}>
          <span className={styles.eyebrow}>Bem-vindo à Auraviva</span>
          <h1 id="login-titulo">{modoCadastro ? "Crie sua conta" : "Acesse sua conta"}</h1>
          <p>
            {modoCadastro
              ? "Cadastre-se para acompanhar seus pedidos e encontrar novas sementes."
              : "Entre para continuar sua jornada de cultivo."}
          </p>
        </div>

        <form className={styles.formulario} onSubmit={enviarFormulario}>
          <div className={styles.accessTypes} role="group" aria-label="Tipo de acesso">
            <button type="button"
              className={tipoAcesso === "cliente" ? styles.accessTypeActive : ""}
              aria-pressed={tipoAcesso === "cliente"}
              onClick={() => { setTipoAcesso("cliente"); setMensagem(""); }}>
              Cliente
            </button>
            <button type="button"
              className={tipoAcesso === "funcionario" ? styles.accessTypeActive : ""}
              aria-pressed={tipoAcesso === "funcionario"}
              onClick={() => { setTipoAcesso("funcionario"); setMensagem(""); }}>
              Funcionário
            </button>
          </div>

          {modoCadastro && (
            <label>
              Nome completo
              <input name="nome" type="text" placeholder="Digite seu nome"
                value={dados.nome} onChange={atualizarCampo} required />
            </label>
          )}

          <label>
            E-mail
            <input name="email" type="email" placeholder="voce@email.com"
              value={dados.email} onChange={atualizarCampo} required />
          </label>

          <label>
            Senha
            <input name="senha" type="password" placeholder="Digite sua senha"
              value={dados.senha} onChange={atualizarCampo}
              minLength={modoCadastro ? 8 : undefined} required />
          </label>

          {modoCadastro && (
            <label>
              Confirmar senha
              <input name="confirmarSenha" type="password" placeholder="Repita sua senha"
                value={dados.confirmarSenha} onChange={atualizarCampo} required />
            </label>
          )}

          {modoCadastro && tipoAcesso === "funcionario" && (
            <label>
              Código de funcionário
              <input name="codigoFuncionario" type="password"
                placeholder="Informe o código da empresa"
                value={dados.codigoFuncionario} onChange={atualizarCampo} required />
            </label>
          )}

          {!modoCadastro && (
            <button type="button" className={styles.linkButton}
              onClick={() => {
                setEmailRecuperacao(dados.email.trim());
                setModoRecuperacao("email");
                setMensagem("");
              }}>
              Esqueci minha senha
            </button>
          )}

          <button type="submit" className={styles.submitButton} disabled={carregando}>
            {carregando
              ? "Aguarde..."
              : modoCadastro
                ? `Criar conta de ${tipoAcesso === "funcionario" ? "funcionário" : "cliente"}`
                : "Entrar"}
          </button>
        </form>

        {mensagem && <p className={styles.mensagem} role="status">{mensagem}</p>}

        <p className={styles.switchText}>
          {modoCadastro
            ? "Já possui uma conta?"
            : `Ainda não possui uma conta de ${tipoAcesso === "funcionario" ? "funcionário" : "cliente"}?`}{" "}
          <button type="button" className={styles.switchButton} onClick={alternarModo}>
            {modoCadastro ? "Entrar" : "Cadastre-se"}
          </button>
        </p>
      </section>
    </main>
  );
};

export default LogIn;
