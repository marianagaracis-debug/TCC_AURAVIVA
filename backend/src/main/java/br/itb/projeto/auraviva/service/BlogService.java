package br.itb.projeto.auraviva.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.itb.projeto.auraviva.model.entity.Blog;
import br.itb.projeto.auraviva.model.repository.BlogRepository;
import br.itb.projeto.auraviva.service.exception.RecursoNaoEncontradoException;

@Service
public class BlogService {

    private final BlogRepository blogRepository;

    public BlogService(BlogRepository blogRepository) {
        this.blogRepository = blogRepository;
    }

    /* ================= CREATE (area ADMIN) ================= */
    public Blog create(MultipartFile file, Blog blog) {

        blog.setStatusBlog("ATIVO");
        blog.setDataPublicacao(LocalDateTime.now());

        if (file != null && file.getSize() > 0) {
            try {
                blog.setImagem(file.getBytes());
            } catch (IOException e) {
                throw new IllegalArgumentException("Erro ao processar a imagem do post");
            }
        }

        return blogRepository.save(blog);
    }

    /* ================= EDITAR (area ADMIN) ================= */
    public Blog editar(MultipartFile file, Long id, Blog blog) {

        Blog _blog = blogRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Post nao encontrado"));

        _blog.setTitulo(blog.getTitulo());
        _blog.setResumo(blog.getResumo());
        _blog.setConteudo(blog.getConteudo());
        _blog.setAutor(blog.getAutor());
        _blog.setDataAtualizacao(LocalDateTime.now());

        if (file != null && file.getSize() > 0) {
            try {
                _blog.setImagem(file.getBytes());
            } catch (IOException e) {
                throw new IllegalArgumentException("Erro ao processar a imagem do post");
            }
        }

        return blogRepository.save(_blog);
    }

    /* ================= INATIVAR (despublicar) ================= */
    public Blog inativar(Long id) {
        Blog _blog = blogRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Post nao encontrado"));

        _blog.setStatusBlog("INATIVO");
        _blog.setDataAtualizacao(LocalDateTime.now());
        return blogRepository.save(_blog);
    }

    /* ================= CONSULTAS PUBLICAS ================= */

    // Pagina do BLOG (somente publicados, mais recentes primeiro)
    public List<Blog> findAllAtivos() {
        return blogRepository.findByStatusBlogOrderByDataPublicacaoDesc("ATIVO");
    }

    public List<Blog> findAll() {
        return blogRepository.findAll();
    }

    public Blog findById(Long id) {
        return blogRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Post nao encontrado"));
    }
}
