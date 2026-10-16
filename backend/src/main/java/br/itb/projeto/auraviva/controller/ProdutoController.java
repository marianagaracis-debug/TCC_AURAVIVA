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

import jakarta.validation.Valid;

import br.itb.projeto.auraviva.model.entity.Produto;
import br.itb.projeto.auraviva.service.ProdutoService;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    /* ========== CONSULTAS PUBLICAS (site) ========== */

    // Pagina de PRODUTOS (todos os ativos)
    @GetMapping("/all")
    public ResponseEntity<List<Produto>> findAllAtivos() {
        return ResponseEntity.ok(produtoService.findAllAtivos());
    }

    // Pagina de SEMENTES DE VERAO  -> /produtos/estacao/VERAO
    // Pagina de SEMENTES DE INVERNO -> /produtos/estacao/INVERNO
    @GetMapping("/estacao/{estacao}")
    public ResponseEntity<List<Produto>> findByEstacao(@PathVariable String estacao) {
        return ResponseEntity.ok(produtoService.findByEstacao(estacao));
    }

    // Destaques exibidos na HOME
    @GetMapping("/destaques")
    public ResponseEntity<List<Produto>> findDestaques() {
        return ResponseEntity.ok(produtoService.findDestaques());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.findById(id));
    }

    /* ========== AREA ADMIN ========== */

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Produto> create(
            @RequestPart(required = false) MultipartFile file,
            @Valid @RequestPart Produto produto) {

        Produto createdProduto = produtoService.create(file, produto);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduto);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Produto> editar(
            @PathVariable Long id,
            @RequestPart(required = false) MultipartFile file,
            @Valid @RequestPart Produto produto) {

        Produto produtoAtualizado = produtoService.editar(file, id, produto);
        return ResponseEntity.ok(produtoAtualizado);
    }

    @PutMapping("/{id}/inativar")
    public ResponseEntity<Produto> inativar(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.inativar(id));
    }

    @PutMapping("/{id}/ativar")
    public ResponseEntity<Produto> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.ativar(id));
    }
}
