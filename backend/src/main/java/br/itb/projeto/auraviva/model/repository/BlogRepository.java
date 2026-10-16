package br.itb.projeto.auraviva.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.auraviva.model.entity.Blog;

@Repository
public interface BlogRepository extends JpaRepository<Blog, Long> {

    // Somente posts publicados para exibir no site
    List<Blog> findByStatusBlogOrderByDataPublicacaoDesc(String statusBlog);
}
