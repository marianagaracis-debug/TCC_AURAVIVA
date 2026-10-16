import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import MenuAuraviva from "../MenuAuraviva/MenuAuraviva"
import mascoteGirassol from "../../assets/mascote-girassol.png"
import styles from "./Blog.module.css"
import { artigos as artigosEstaticos, criarSlugArtigo } from "./artigos"
import { api } from "../../services/api"

// Converte um registro do banco para o formato que as telas usam
const bdParaArtigo = (b) => ({
  id: b.id,
  titulo: b.titulo,
  subtitulo: b.resumo || "",
  texto: b.resumo || b.conteudo?.substring(0, 120) || "",
  conteudo: b.conteudo || "",
  categoria: "Blog",
  imagem: b.imagemUrl || (b.imagem ? `data:image/jpeg;base64,${b.imagem}` : ""),
  autor: b.autor || "Equipe Auraviva",
  dataPublicacao: b.dataPublicacao || new Date().toISOString(),
  slug: `bd-${b.id}`,
})

const CHAVE_USUARIO = "auraviva-usuario";

const obterUsuarioAtual = () => {
  try {
    const usuarioSalvo = JSON.parse(localStorage.getItem(CHAVE_USUARIO) || "{}") || {};
    return (usuarioSalvo.nome || "Você").trim() || "Você";
  } catch {
    return "Você";
  }
};

const obterChaveFeedbackBlog = () => {
  try {
    const usuarioSalvo = JSON.parse(localStorage.getItem(CHAVE_USUARIO) || "{}") || {};
    const identificador = (usuarioSalvo.email || usuarioSalvo.nome || "visitante").trim().toLowerCase();
    return `auraviva-blog-feedback-${identificador || "visitante"}`;
  } catch {
    return "auraviva-blog-feedback-visitante";
  }
};

const iniciarFeedbackArtigos = (lista = artigosEstaticos) =>
  lista.reduce((acumulador, artigo) => {
    const slug = artigo.slug || criarSlugArtigo(artigo.titulo);
    acumulador[slug] = {
      liked: false,
      likes: 18 + (slug.length % 9) * 3,
      comments: [],
    };
    return acumulador;
  }, {});

const lerFeedbackArtigos = () => {
  try {
    const salvo = localStorage.getItem(obterChaveFeedbackBlog());
    const base = iniciarFeedbackArtigos();

    if (!salvo) {
      return base;
    }

    const dadosSalvos = JSON.parse(salvo);
    const autorAtual = obterUsuarioAtual();

    return Object.entries(base).reduce((acumulador, [slug, valorPadrao]) => {
      const salvoAtual = dadosSalvos?.[slug] ?? {};
      const comentariosUsuario = Array.isArray(salvoAtual.comments)
        ? salvoAtual.comments.filter((comentario) => !comentario?.autor || comentario.autor === autorAtual || comentario.autor === "Você")
        : valorPadrao.comments;

      acumulador[slug] = {
        ...valorPadrao,
        ...salvoAtual,
        comments: comentariosUsuario,
      };
      return acumulador;
    }, {});
  } catch {
    return iniciarFeedbackArtigos();
  }
};

const salvarFeedbackArtigos = (proximoEstado) => {
  try {
    localStorage.setItem(obterChaveFeedbackBlog(), JSON.stringify(proximoEstado));
  } catch {
    // Ignora falhas de armazenamento local no navegador.
  }
};

const videos = [
  {
    titulo: "Organismos Geneticamente Modificados (OGMs) e Transgênicos",
    descricao: "Entenda o que são organismos geneticamente modificados e transgênicos, suas diferenças e aplicações na agricultura.",
    imagem: "https://apiboficial.org/files/2023/10/photo_5015121157514439669_y-1-1080x675.jpg",
    videoUrl: "https://youtu.be/wwGO2iKaQXE?si=XQ8l0OyGAOq_r2Md",
    duracao: "02 min e 30 seg",
  },
  {
    titulo: "Desenvolvimento de plantas transgênicas | Ciência SP",
    descricao: "Como a modificação genética do milho pode aumentar sua resistência a pragas e às mudanças climáticas, além de melhorar a produtividade.",
    imagem: "https://controversia.com.br/wp-content/uploads/2016/10/Milho-Transgenico.jpg",
    videoUrl: "https://youtu.be/4P4QT163ms8?si=iZiLgVJBNOsHl75T",
    duracao: "1 min e 20 seg",
  },
  {
    titulo: "Agricultura e o Fim do Mundo | Capítulo 7",
    descricao: "O papel das sementes transgênicas na Revolução Verde e sua relação com a agricultura e a degradação dos solos ao longo da história.",
    imagem: "https://s2-globorural.glbimg.com/sbARGhC45VIda2wLvDADi8ZReCY=/0x0:2000x1333/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_afe5c125c3bb42f0b5ae633b58923923/internal_photos/bs/2023/b/A/NS8v8bT02OhsuKICV3xA/close-up-cientista-com-planta-1-.jpg",
    videoUrl: "https://youtu.be/M2rd8xeFdcE?si=g3oAPj_DpK1uC2TC",
    duracao: "13 min e 22 seg",
  },
];

const curiosidades = [
  [
    "As sementes transgênicas podem ser desenhadas para resistir melhor a clima extremo?",
    "Sim. Por meio do melhoramento genético e da biotecnologia, pesquisadores desenvolvem variedades que podem apresentar maior tolerância à seca, ao calor e a determinadas doenças. Porém, a resistência depende da variedade e das condições de cultivo. Sementes artificiais e transgênicas são tecnologias diferentes."
  ],
  [
    "A tecnologia de sementes não substitui a importância do solo e da gestão agrícola?",
    "Exatamente! Mesmo com sementes de alta tecnologia, o desenvolvimento das plantas depende da qualidade do solo, da água e do manejo adequado. Práticas como rotação de culturas e conservação do solo ajudam a manter a produtividade e a sustentabilidade agrícola."
  ],
  [
    "O uso de sementes transgênicas é tema de debate internacional?",
    "Sim. As sementes transgênicas são discutidas por seus benefícios potenciais, impactos ambientais e aspectos econômicos. Por isso, é importante avaliar cada variedade com base em evidências científicas, considerando suas características e os procedimentos regulatórios aplicáveis."
  ],
  [
    "A inovação em sementes também pode reduzir perdas durante a colheita?",
    "Sim. Algumas variedades apresentam características que facilitam a colheita, como maior resistência ao tombamento das plantas e maturação mais uniforme. Entretanto, o resultado também depende das condições climáticas, do maquinário e do manejo agrícola."
  ],
];

const Blog = () => {
  const articleTrackRef = useRef(null);
  const [canScrollArticlesBack, setCanScrollArticlesBack] = useState(false);
  const [canScrollArticlesForward, setCanScrollArticlesForward] = useState(true);
  const [curiosidadeAberta, setCuriosidadeAberta] = useState(null);
  const [artigos, setArtigos] = useState(artigosEstaticos);
  const [feedbackArtigos, setFeedbackArtigos] = useState(() => lerFeedbackArtigos());
  const [comentariosAbertos, setComentariosAbertos] = useState({});
  const [novoComentario, setNovoComentario] = useState({});

  // Carrega artigos do banco; se vazio mantém os estáticos
  useEffect(() => {
    api.listarBlog()
      .then((lista) => {
        const ativos = lista.filter((b) => b.statusBlog === "ATIVO" || !b.statusBlog);
        if (ativos.length > 0) {
          const convertidos = ativos.map(bdParaArtigo);
          setArtigos(convertidos);
          setFeedbackArtigos(iniciarFeedbackArtigos(convertidos));
        }
      })
      .catch(() => { /* mantém os estáticos */ });
  }, []);

  const updateArticleControls = () => {
    const track = articleTrackRef.current;
    if (!track) return;

    setCanScrollArticlesBack(track.scrollLeft > 1);
    setCanScrollArticlesForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 1);
  };

  const scrollArticles = (direction) => {
    const track = articleTrackRef.current;
    const firstCard = track?.firstElementChild;
    if (!track || !firstCard) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    track.scrollBy({
      left: (firstCard.getBoundingClientRect().width + gap) * direction,
      behavior: "smooth",
    });
  };

  const alternarCurtida = (slug) => {
    setFeedbackArtigos((prev) => {
      const atual = prev[slug] ?? { liked: false, likes: 0, comments: [] };
      const proximoCurtido = !atual.liked;
      const proximoEstado = {
        ...prev,
        [slug]: {
          ...atual,
          liked: proximoCurtido,
          curtidoEm: proximoCurtido ? new Date().toISOString() : null,
          likes: Math.max(0, atual.likes + (proximoCurtido ? 1 : -1)),
        },
      };

      salvarFeedbackArtigos(proximoEstado);
      return proximoEstado;
    });
  };

  const alternarComentarios = (slug) => {
    setComentariosAbertos((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  const enviarComentario = (event, slug) => {
    event.preventDefault();
    const texto = (novoComentario[slug] || "").trim();

    if (!texto) {
      return;
    }

    setFeedbackArtigos((prev) => {
      const atual = prev[slug] ?? { liked: false, likes: 0, comments: [] };
      const proximoEstado = {
        ...prev,
        [slug]: {
          ...atual,
          comments: [
            ...atual.comments,
            {
              id: `${slug}-comentario-${Date.now()}`,
              autor: obterUsuarioAtual(),
              texto,
              data: "Agora",
            },
          ],
        },
      };

      salvarFeedbackArtigos(proximoEstado);
      return proximoEstado;
    });

    setNovoComentario((prev) => ({ ...prev, [slug]: "" }));
    setComentariosAbertos((prev) => ({ ...prev, [slug]: true }));
  };

  return (
  <div className={styles.page}>
    <MenuAuraviva />

    <main>
      <section className={styles.hero}>
        <div>
          <span className={styles.eyebrow}>Auraviva / conhecimento</span>
          <h1>Ideias que fazem o cultivo avançar.</h1>
          <p>
            Vídeos, artigos e materiais para entender as sementes artificiais e tomar decisões mais seguras no campo.
          </p>
        </div>
        <div className={styles.heroNote}>
          <span className="material-symbols-outlined">eco</span>
          <strong>Aprenda no seu ritmo</strong>
          <span>Conteúdo selecionado para quem cultiva com propósito.</span>
        </div>
      </section>

      <section className={styles.featureShelf} aria-labelledby="destaques-titulo">
        <div className={styles.shelfHeader}>
          <div>
            <span className={styles.shelfEyebrow}>Auraviva em movimento</span>
            <h2 id="destaques-titulo">Conteúdos em destaque</h2>
          </div>
        </div>

        <div className={styles.shelfTrack}>
          {videos.map((video) => {
            const conteudo = (
              <>
                <img src={video.imagem} alt={video.titulo} />
                {video.videoUrl && (
                  <span className={styles.shelfPlay}>
                    <span className="material-symbols-outlined">play_arrow</span>
                  </span>
                )}
              </>
            );

            return video.videoUrl ? (
              <a
                href={video.videoUrl}
                className={styles.shelfItem}
                key={`destaque-${video.titulo}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Assistir: ${video.titulo}`}
              >
                {conteudo}
              </a>
            ) : (
              <div
                className={`${styles.shelfItem} ${styles.shelfItemUnavailable}`}
                key={`destaque-${video.titulo}`}
              >
                {conteudo}
              </div>
            );
          })}
          <button type="button" className={`${styles.shelfItem} ${styles.shelfItemAccent}`}>
            <span className="material-symbols-outlined">article</span>
            <strong>Novos artigos<br />toda semana</strong>
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="videos-titulo">
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.kicker}>Assista</span>
            <h2 id="videos-titulo">Vídeos explicativos</h2>
          </div>
          <span className={styles.counter}>03 episódios</span>
        </div>

        <div className={styles.videoGrid}>
          {videos.map((video) => (
            <article className={styles.videoCard} key={video.titulo}>
              <div className={styles.videoCover}>
                <img src={video.imagem} alt={video.titulo} />
                {video.videoUrl && (
                  <a
                    className={styles.playButton}
                    href={video.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Assistir: ${video.titulo}`}
                    title={`Assistir: ${video.titulo}`}
                  >
                    <span className="material-symbols-outlined">play_arrow</span>
                  </a>
                )}
                <span className={styles.duration}>{video.duracao}</span>
              </div>
              <div className={styles.cardBody}>
                <h3>{video.titulo}</h3>
                <p>{video.descricao}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.resources} aria-labelledby="curiosidades-titulo">
        <div className={styles.resourceIntro}>
          <span className={styles.kicker}>Você sabia?</span>
          <h2 id="curiosidades-titulo">Além da semente</h2>
          <p>Descubra fatos, avanços científicos e informações interessantes sobre sementes, agricultura e inovação no campo.</p>
          <img
            className={styles.resourceMascot}
            src={mascoteGirassol}
            alt="Mascote de girassol sorridente"
          />
        </div>

        <div className={styles.faqContainer}>
          <h3 className={styles.faqTitle}>Você sabia que...</h3>
          <br/>

          {curiosidades.map(([pergunta, resposta], indice) => (
            <div
              key={pergunta}
              className={`${styles.faq} ${curiosidadeAberta === indice ? styles.ativo : ""}`}
            >
              <button
                type="button"
                className={styles.pergunta}
                onClick={() => setCuriosidadeAberta(curiosidadeAberta === indice ? null : indice)}
                aria-expanded={curiosidadeAberta === indice}
              >
                {pergunta}
                <span>{curiosidadeAberta === indice ? "−" : "+"}</span>
              </button>
              <div className={styles.resposta}>
                <p>{resposta}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="artigos-titulo">
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.kicker}>Leia</span>
            <h2 id="artigos-titulo">Artigos em destaque</h2>
          </div>
          <div className={styles.articleControls}>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={() => scrollArticles(-1)}
              disabled={!canScrollArticlesBack}
              aria-label="Ver artigos anteriores"
            >
              <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
            </button>
            <button
              type="button"
              className={styles.carouselButton}
              onClick={() => scrollArticles(1)}
              disabled={!canScrollArticlesForward}
              aria-label="Ver próximos artigos"
            >
              <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
            </button>
            <Link to="/auraviva/home" className={styles.textLink}>Voltar para início</Link>
          </div>
        </div>
        <div
          className={styles.articleGrid}
          ref={articleTrackRef}
          onScroll={updateArticleControls}
          role="region"
          aria-roledescription="carrossel"
          aria-label="Carrossel de artigos em destaque"
          tabIndex={0}
        >
          {artigos.map((artigo) => {
            const slug = artigo.slug || criarSlugArtigo(artigo.titulo);
            const feedbackArtigo = feedbackArtigos[slug] ?? { liked: false, likes: 0, comments: [] };

            return (
              <article className={styles.articleCard} key={artigo.titulo}>
                <img src={artigo.imagem} alt={artigo.titulo} className={styles.articleImage} />
                <div className={styles.articleContent}>
                  <span className={styles.articleCategory}>{artigo.categoria}</span>
                  <h3>{artigo.titulo}</h3>
                  <p>{artigo.subtitulo || artigo.texto}</p>

                  <div className={styles.articleMeta}>
                    <button
                      type="button"
                      className={`${styles.articleAction} ${feedbackArtigo.liked ? styles.liked : ""}`}
                      onClick={() => alternarCurtida(slug)}
                      aria-label={feedbackArtigo.liked ? `Descurtir artigo: ${artigo.titulo}` : `Curtir artigo: ${artigo.titulo}`}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {feedbackArtigo.liked ? "favorite" : "favorite_border"}
                      </span>
                      {feedbackArtigo.likes}
                    </button>

                    <button
                      type="button"
                      className={styles.articleAction}
                      onClick={() => alternarComentarios(slug)}
                      aria-expanded={Boolean(comentariosAbertos[slug])}
                    >
                      <span className="material-symbols-outlined" aria-hidden="true">comment</span>
                      {feedbackArtigo.comments.length}
                    </button>
                  </div>

                  <Link to={`/auraviva/blog/${artigo.id ? `bd-${artigo.id}` : slug}`} className={styles.readButton}>
                    Ler mais <span aria-hidden="true">→</span>
                  </Link>

                  {comentariosAbertos[slug] && (
                    <div className={styles.commentPanel}>
                      <div className={styles.commentList}>
                        {feedbackArtigo.comments.map((comentario) => (
                          <div className={styles.commentItem} key={comentario.id}>
                            <div className={styles.commentHeader}>
                              <strong>{comentario.autor}</strong>
                              <span>{comentario.data}</span>
                            </div>
                            <p>{comentario.texto}</p>
                          </div>
                        ))}
                      </div>

                      <form className={styles.commentForm} onSubmit={(event) => enviarComentario(event, slug)}>
                        <label htmlFor={`comentario-${slug}`} className={styles.commentLabel}>
                          Deixe seu comentário
                        </label>
                        <textarea
                          id={`comentario-${slug}`}
                          value={novoComentario[slug] || ""}
                          onChange={(event) =>
                            setNovoComentario((prev) => ({
                              ...prev,
                              [slug]: event.target.value,
                            }))
                          }
                          rows={3}
                          placeholder="Compartilhe sua opinião sobre este artigo..."
                        />
                        <button type="submit" className={styles.commentSubmit}>Enviar</button>
                      </form>
                    </div>
                  )}
                </div>
              </article>
            );
          })}

        </div>
      </section>
    </main>
     <footer>
          © 2025 Auraviva | Cresça com propósito 🌿
        </footer>
  </div>
  );
};

export default Blog

