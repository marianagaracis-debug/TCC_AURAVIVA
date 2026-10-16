import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MenuAuraviva from "../MenuAuraviva/MenuAuraviva";
import { artigos as artigosEstaticos, criarSlugArtigo } from "../Blog/artigos";
import { api } from "../../services/api";
import styles from "./Artigo.module.css";

const bdParaArtigo = (b) => ({
  id: b.id,
  titulo: b.titulo,
  subtitulo: b.resumo || "",
  texto: b.conteudo || b.resumo || "",
  categoria: "Blog",
  imagem: b.imagemUrl || (b.imagem ? `data:image/jpeg;base64,${b.imagem}` : ""),
  autor: b.autor || "Equipe Auraviva",
  dataPublicacao: b.dataPublicacao || new Date().toISOString(),
});

const Artigo = () => {
  const { slug } = useParams();
  const [artigo, setArtigo] = useState(() => {
    if (slug?.startsWith("bd-")) return null;
    return artigosEstaticos.find((item) => criarSlugArtigo(item.titulo) === slug) || null;
  });
  const [carregando, setCarregando] = useState(slug?.startsWith("bd-"));
  const [curtido, setCurtido] = useState(false);
  const [curtidas, setCurtidas] = useState(42);
  const [comentarios, setComentarios] = useState([
    { id: "comentario-1", autor: "Lucia", texto: "Gostei muito da explicação, ficou bem clara e acessível.", data: "Hoje" },
    { id: "comentario-2", autor: "Pedro", texto: "Excelente artigo para entender melhor os conceitos da área.", data: "Ontem" },
  ]);
  const [novoComentario, setNovoComentario] = useState("");

  useEffect(() => {
    if (!slug?.startsWith("bd-")) return;
    const id = slug.replace("bd-", "");
    setCarregando(true);
    api.buscarBlog(id)
      .then((b) => setArtigo(bdParaArtigo(b)))
      .catch(() => setArtigo(null))
      .finally(() => setCarregando(false));
  }, [slug]);

  if (carregando) {
    return (
      <div className={styles.page}>
        <MenuAuraviva />
        <main className={styles.notFound}><p>Carregando artigo…</p></main>
      </div>
    );
  }

  if (!artigo) {
    return (
      <div className={styles.page}>
        <MenuAuraviva />
        <main className={styles.notFound}>
          <span className={styles.category}>Artigo</span>
          <h1>Artigo não encontrado</h1>
          <p>Não encontramos esse conteúdo. Volte ao blog para escolher outro artigo.</p>
          <Link to="/auraviva/blog" className={styles.backLink}>Voltar ao blog</Link>
        </main>
      </div>
    );
  }

  const relacionados = artigosEstaticos
    .filter((item) => item.categoria === artigo.categoria && item !== artigo)
    .slice(0, 3);

  const handleCurtir = () => {
    setCurtido((atual) => {
      const proximo = !atual;
      setCurtidas((valorAtual) => valorAtual + (proximo ? 1 : -1));
      return proximo;
    });
  };

  const handleComentarioSubmit = (event) => {
    event.preventDefault();
    const texto = novoComentario.trim();

    if (!texto) {
      return;
    }

    setComentarios((atual) => [
      ...atual,
      {
        id: `comentario-${Date.now()}`,
        autor: "Você",
        texto,
        data: "Agora",
      },
    ]);
    setNovoComentario("");
  };

  return (
    <div className={styles.page}>
      <MenuAuraviva />
      <main className={styles.main}>
        <nav className={styles.breadcrumb} aria-label="Caminho de navegação">
          <Link to="/auraviva/blog">Blog</Link>
          <span aria-hidden="true">/</span>
          <span>{artigo.categoria}</span>
        </nav>

        <article className={styles.article}>
          <header className={styles.header}>
            <span className={styles.category}>{artigo.categoria}</span>
            <h1>{artigo.titulo}</h1>
            {artigo.subtitulo && <p>{artigo.subtitulo}</p>}
          </header>

          <img className={styles.image} src={artigo.imagem} alt={artigo.titulo} />

          <div className={styles.body}>
            <h2>{artigo.conteudo ? "Artigo completo" : "Sobre este assunto"}</h2>
            {artigo.conteudo ? (
              artigo.conteudo.map((secao, indice) => (
                <section className={styles.contentSection} key={secao.titulo || indice}>
                  {secao.titulo && <h3>{secao.titulo}</h3>}
                  {secao.texto && <p>{secao.texto}</p>}
                  {secao.itens && (
                    <ul>
                      {secao.itens.map((item) => <li key={item}>{item}</li>)}
                    </ul>
                  )}
                </section>
              ))
            ) : (
              <p>{artigo.texto}</p>
            )}
          </div>

          <div className={styles.interactions}>
            <button
              type="button"
              className={`${styles.likeButton} ${curtido ? styles.liked : ""}`}
              onClick={handleCurtir}
              aria-label={curtido ? "Descurtir artigo" : "Curtir artigo"}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {curtido ? "favorite" : "favorite_border"}
              </span>
              {curtidas} curtidas
            </button>
          </div>

          <section className={styles.commentsSection} aria-labelledby="comentarios-titulo">
            <div className={styles.commentsHeader}>
              <h2 id="comentarios-titulo">Comentários</h2>
              <span>{comentarios.length} opiniões</span>
            </div>

            <form className={styles.commentForm} onSubmit={handleComentarioSubmit}>
              <label htmlFor="novo-comentario" className={styles.commentLabel}>
                Deixe seu comentário
              </label>
              <textarea
                id="novo-comentario"
                value={novoComentario}
                onChange={(event) => setNovoComentario(event.target.value)}
                rows={4}
                placeholder="Compartilhe suas ideias sobre este conteúdo..."
              />
              <button type="submit" className={styles.commentSubmit}>Enviar comentário</button>
            </form>

            <div className={styles.commentList}>
              {comentarios.map((comentario) => (
                <article className={styles.commentItem} key={comentario.id}>
                  <div className={styles.commentMeta}>
                    <strong>{comentario.autor}</strong>
                    <span>{comentario.data}</span>
                  </div>
                  <p>{comentario.texto}</p>
                </article>
              ))}
            </div>
          </section>
        </article>

        {relacionados.length > 0 && (
          <section className={styles.related} aria-labelledby="relacionados-titulo">
            <h2 id="relacionados-titulo">Continue lendo</h2>
            <div className={styles.relatedList}>
              {relacionados.map((item) => (
                <Link
                  key={item.titulo}
                  to={`/auraviva/blog/${criarSlugArtigo(item.titulo)}`}
                  className={styles.relatedLink}
                >
                  <span>{item.categoria}</span>
                  <strong>{item.titulo}</strong>
                  <span aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <Link to="/auraviva/blog" className={styles.backLink}>← Voltar para todos os artigos</Link>
      </main>
    </div>
  );
};

export default Artigo;
