import { useState } from "react";
import { Link } from "react-router-dom";
import MenuAuraviva from "../MenuAuraviva/MenuAuraviva";
import { api } from "../../services/api";
import styles from "./HomeAuraviva.module.css";

const perguntas = [
  ["O que é a Auraviva?",
  "A Auraviva é uma empresa voltada à comercialização e distribuição de sementes, buscando conectar produtores rurais a produtos de qualidade por meio de parceiros especializados. Nosso objetivo é facilitar o acesso a sementes adequadas às diferentes necessidades do cultivo, oferecendo informações que auxiliem os agricultores na escolha dos produtos e contribuam para uma agricultura mais eficiente e sustentável."],
  ["Como posso entrar em contato?", 
  "Você pode entrar em contato com a equipe da Auraviva pelos canais de atendimento disponibilizados em nosso site, na seção Contato. Por meio deles, você poderá esclarecer dúvidas sobre produtos, pedidos, entregas e outras informações. Recomendamos informar o motivo do contato e, caso já tenha realizado uma compra, o número do pedido para facilitar o atendimento."],
  ["O que fazer caso o lacre esteja violado?",
  "Caso receba um produto com o lacre violado, a embalagem danificada ou sinais de alteração, recomendamos não utilizar as sementes antes de esclarecer a situação. Registre o estado da embalagem, guarde o produto e entre em contato com a equipe da Auraviva, informando o ocorrido e os dados do pedido. Assim, será possível avaliar o caso e orientar você sobre os próximos passos."],
  ["Como escolher a melhor semente?", 
  "A escolha da semente ideal depende de fatores como o tipo de cultura, as condições climáticas da região, as características do solo, a época de plantio e os objetivos da produção. Também é importante verificar as informações técnicas do produto, sua adaptação à região e as recomendações de cultivo. Em caso de dúvida, consulte um profissional de assistência técnica agrícola para identificar a opção mais adequada às suas necessidades."],
];

const HomeAuraviva = () => {
  const [faqAberto, setFaqAberto] = useState(null);
  const [contato, setContato] = useState({ nome: "", email: "", telefone: "", texto: "" });
  const [enviandoContato, setEnviandoContato] = useState(false);
  const [retornoContato, setRetornoContato] = useState("");
  const [emailNewsletter, setEmailNewsletter] = useState("");
  const [mensagemNewsletter, setMensagemNewsletter] = useState("");
  const [enviandoNewsletter, setEnviandoNewsletter] = useState(false);

  const inscreverNewsletter = async (event) => {
    event.preventDefault();
    if (!emailNewsletter.trim() || enviandoNewsletter) return;
    setEnviandoNewsletter(true);
    try {
      const resp = await api.inscreverNewsletter(emailNewsletter.trim());
      setMensagemNewsletter(resp?.mensagem || "Inscrição realizada! Obrigado.");
      setEmailNewsletter("");
    } catch (erro) {
      setMensagemNewsletter(erro.message || "Não foi possível realizar a inscrição.");
    } finally {
      setEnviandoNewsletter(false);
    }
  };

  const atualizarContato = (event) => {
    const { name, value } = event.target;
    setContato((atual) => ({ ...atual, [name]: value }));
  };

  const enviarContato = async (event) => {
    event.preventDefault();
    setEnviandoContato(true);
    setRetornoContato("");
    try {
      await api.enviarMensagem({
        emissor: contato.nome.trim(),
        email: contato.email.trim(),
        telefone: contato.telefone.trim(),
        texto: contato.texto.trim(),
      });
      setContato({ nome: "", email: "", telefone: "", texto: "" });
      setRetornoContato("Mensagem enviada! Responderemos em breve.");
    } catch (erro) {
      setRetornoContato(erro.message);
    } finally {
      setEnviandoContato(false);
    }
  };

  return (
    <div className={styles.page}>
      <MenuAuraviva />

      <section className={styles.heroVideo}>
        <video autoPlay muted loop className={styles.videoBg}>
          <source src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" type="video/mp4" />
          Seu navegador não suporta vídeos em HTML5.
        </video>

        <div className={styles.heroContent}>
          <h1>
            Cultivando um futuro que <span>impulsiona</span> a vida.
          </h1>
          <Link to="/auraviva/produtos" className={styles.btn}>
            Explorar Sementes
          </Link>
        </div>
      </section>

      <section className={styles.about}>
        <h2>Sobre Nós</h2>
        <p>
          A <strong>Auraviva</strong> é uma empresa especializada na revenda de sementes
          para o setor agrícola. Nosso objetivo é oferecer sementes de qualidade, com
          procedência confiável e tecnologia que contribua para uma produção mais eficiente.
        </p>
        <p>
          Buscamos atender nossos clientes com responsabilidade, bom atendimento e compromisso
          com a qualidade dos produtos.
        </p>
      </section>

      <section className={`${styles.cards} container`}>
        <div className={styles.card}>
          <img src="https://images.pexels.com/photos/2850521/pexels-photo-2850521.jpeg" alt="Sementes de verão" />
          <h3>Sementes de Verão</h3>
          <p>Descubra espécies que florescem sob o sol e trazem energia ao seu jardim.</p>
          <Link to="/auraviva/sementes-de-verao" className={styles.btn}>Explorar</Link>
        </div>

        <div className={styles.card}>
          <img src="https://images.pexels.com/photos/7538372/pexels-photo-7538372.jpeg" alt="Produtos" />
          <h3>Produtos</h3>
          <p>Veja nossos produtos e encontre sementes para o seu cultivo.</p>
          <Link to="/auraviva/produtos" className={styles.btn}>Ver mais</Link>
        </div>

        <div className={styles.card}>
          <img src="https://images.pexels.com/photos/10150783/pexels-photo-10150783.jpeg" alt="Sementes de inverno" />
          <h3>Sementes de Inverno</h3>
          <p>Explore plantas resistentes para as estações frias.</p>
          <Link to="/auraviva/sementes-de-inverno" className={styles.btn}>Explorar</Link>
        </div>
      </section>

      <main className={styles.faqContainer}>
        <h1 className={styles.faqTitle}>Perguntas Frequentes</h1>
        <p className={styles.subtitulo}>Confira as dúvidas mais comuns.</p>

        {perguntas.map(([pergunta, resposta], indice) => (
          <div
            key={pergunta}
            className={`${styles.faq} ${faqAberto === indice ? styles.ativo : ""}`}
          >
            <button
              type="button"
              className={styles.pergunta}
              onClick={() => setFaqAberto(faqAberto === indice ? null : indice)}
            >
              {pergunta}
              <span>{faqAberto === indice ? "−" : "+"}</span>
            </button>
            <div className={styles.resposta}>
              <p>{resposta}</p>
            </div>
          </div>
        ))}
      </main>

      <section className={styles.contato}>
        <div className={styles.overlay}>
          <h2>FALE CONOSCO</h2>
          <p>Tem alguma dúvida ou deseja fazer um pedido? Entre em contato conosco.</p>

          <form className={styles.formulario} onSubmit={enviarContato}>
            <div className={styles.linha}>
              <input name="nome" type="text" placeholder="Nome" maxLength={100} value={contato.nome} onChange={atualizarContato} required />
              <input name="email" type="email" placeholder="E-mail" maxLength={254} value={contato.email} onChange={atualizarContato} required />
            </div>
            <input name="telefone" type="tel" placeholder="Telefone" maxLength={20} value={contato.telefone} onChange={atualizarContato} required />
            <textarea name="texto" rows="5" placeholder="Mensagem" maxLength={400} value={contato.texto} onChange={atualizarContato} required />
            <button type="submit" disabled={enviandoContato}>{enviandoContato ? "Enviando..." : "Enviar"}</button>
            {retornoContato && <p role="status" style={{ margin: "8px 0 0", textAlign: "center" }}>{retornoContato}</p>}
          </form>
        </div>
      </section>

      <footer className={styles.siteFooter}>
        <div className={styles.footerColumns}>
          <div className={styles.footerCol}>
            <span className={`material-symbols-outlined ${styles.footerIcon}`}>lightbulb</span>
            <h3>Nossa Loja</h3>
            <p><strong>Endereço:</strong> Auraviva</p>
            <p>Setor agrícola, Brasil</p>
            <p><strong>Email:</strong> contato@auraviva.com</p>
          </div>

          <div className={styles.footerCol}>
            <span className={`material-symbols-outlined ${styles.footerIcon}`}>campaign</span>
            <h3>Companhia</h3>
            
              <p><a href="#">Sobre Nós</a></p>
              <p><a href="#">Sugestões</a></p>
              <p><a href="#">Catálogo de Produtos</a></p>
              <p><a href="#">Contato</a></p>
            
          </div>

          <div className={styles.footerCol}>
            <span className={`material-symbols-outlined ${styles.footerIcon}`}>forum</span>
            <h3>Siga-nos</h3>
            
              <p><a href="#">Facebook</a></p>
              <p><a href="#">Instagram</a></p>
              <p><a href="#">YouTube</a></p>
              <p><a href="#">LinkedIn</a></p>
            
          </div>

          <div className={styles.footerCol}>
            <span className={`material-symbols-outlined ${styles.footerIcon}`}>edit_note</span>
            <h3>Ajuda</h3>
            
              <p><a href="#">Termos e Condições</a></p>
              <p><a href="#">Política de Privacidade</a></p>
              <p><a href="#">FAQ</a></p>
            
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.subscribeBox}>
            <span className={`material-symbols-outlined ${styles.subscribeIcon}`}>send</span>
            <h3>Inscreva-se</h3>
            <br/>
            <form onSubmit={inscreverNewsletter}>
              <input
                type="email"
                placeholder="Digite seu e-mail"
                aria-label="Digite seu e-mail"
                value={emailNewsletter}
                onChange={(e) => setEmailNewsletter(e.target.value)}
                required
              />
              <button type="submit" disabled={enviandoNewsletter}>
                {enviandoNewsletter ? "Enviando…" : "Inscreva-se agora"}
              </button>
            </form>
            {mensagemNewsletter && (
              <p role="status" style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--color-brand-green, #2e7d32)" }}>
                {mensagemNewsletter}
              </p>
            )}
          </div>

          <div className={styles.paymentInfo}>
            <h3>Informações de Pagamento</h3>
            <p>Aceitamos os principais métodos de pagamento, incluindo cartão, PIX e PayPal.</p>
            <div className={styles.paymentBrands}>
              <span className={styles.paymentBrand}>VISA</span>
              <span className={`${styles.paymentBrand} ${styles.mastercard}`}>Mastercard</span>
              <span className={`${styles.paymentBrand} ${styles.elo}`}>elo</span>
              <span className={`${styles.paymentBrand} ${styles.pix}`}>PIX</span>
              <span className={`${styles.paymentBrand} ${styles.paypal}`}>PayPal</span>
              <span className={styles.paymentBrand}>AMEX</span>
              <span className={styles.paymentBrand}>Hipercard</span>
            </div>
          </div>
        </div>

        <div className={styles.footerCopyright}>
          <br />
          © {new Date().getFullYear()} Auraviva. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default HomeAuraviva
