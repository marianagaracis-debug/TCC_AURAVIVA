package br.itb.projeto.auraviva.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.itb.projeto.auraviva.model.entity.Blog;
import br.itb.projeto.auraviva.service.BlogService;

@RestController
@RequestMapping("/blogs")
public class BlogController {

    private final BlogService blogService;

    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    /* ========== CONSULTA PUBLICA (site) ========== */

    // Pagina do BLOG (somente publicados)
    @GetMapping("/all")
    public ResponseEntity<List<Blog>> findAllAtivos() {
        return ResponseEntity.ok(blogService.findAllAtivos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Blog> findById(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.findById(id));
    }

    /* ========== AREA ADMIN ========== */

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Blog> create(
            @RequestPart(required = false) MultipartFile file,
            @RequestPart Blog blog) {

        Blog createdBlog = blogService.create(file, blog);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBlog);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Blog> editar(
            @PathVariable Long id,
            @RequestPart(required = false) MultipartFile file,
            @RequestPart Blog blog) {

        Blog blogAtualizado = blogService.editar(file, id, blog);
        return ResponseEntity.ok(blogAtualizado);
    }

    @PutMapping("/{id}/inativar")
    public ResponseEntity<Blog> inativar(@PathVariable Long id) {
        return ResponseEntity.ok(blogService.inativar(id));
    }
}
