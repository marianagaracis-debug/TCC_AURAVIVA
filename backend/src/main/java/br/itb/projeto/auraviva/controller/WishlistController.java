package br.itb.projeto.auraviva.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.auraviva.model.entity.Produto;
import br.itb.projeto.auraviva.model.entity.Wishlist;
import br.itb.projeto.auraviva.model.repository.ProdutoRepository;
import br.itb.projeto.auraviva.model.repository.WishlistRepository;
import br.itb.projeto.auraviva.service.UsuarioService;
import br.itb.projeto.auraviva.service.exception.RecursoNaoEncontradoException;

@RestController
@RequestMapping("/wishlist")
public class WishlistController {

    private final WishlistRepository wishlistRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioService usuarioService;

    public WishlistController(WishlistRepository wishlistRepository,
            ProdutoRepository produtoRepository,
            UsuarioService usuarioService) {
        this.wishlistRepository = wishlistRepository;
        this.produtoRepository  = produtoRepository;
        this.usuarioService     = usuarioService;
    }

    // Retorna os produtos salvos na lista de desejos do cliente logado
    @GetMapping
    public ResponseEntity<List<Produto>> minha(Authentication auth) {
        Long idUsuario = usuarioService.findByUsername(auth).getId();
        List<Long> ids = wishlistRepository.findByIdUsuario(idUsuario)
                .stream().map(Wishlist::getIdProduto).toList();
        if (ids.isEmpty()) return ResponseEntity.ok(List.of());
        return ResponseEntity.ok(produtoRepository.findAllById(ids));
    }

    // Adiciona um produto à lista de desejos
    @PostMapping("/{idProduto}")
    public ResponseEntity<Wishlist> adicionar(@PathVariable Long idProduto, Authentication auth) {
        Long idUsuario = usuarioService.findByUsername(auth).getId();
        // Produto deve existir
        produtoRepository.findById(idProduto)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto não encontrado."));
        // Idempotente: não duplica
        return wishlistRepository.findByIdUsuarioAndIdProduto(idUsuario, idProduto)
                .map(item -> ResponseEntity.ok(item))
                .orElseGet(() -> {
                    Wishlist item = new Wishlist();
                    item.setIdUsuario(idUsuario);
                    item.setIdProduto(idProduto);
                    item.setAdicionadoEm(LocalDateTime.now());
                    return ResponseEntity.status(HttpStatus.CREATED).body(wishlistRepository.save(item));
                });
    }

    // Remove um produto da lista de desejos
    @DeleteMapping("/{idProduto}")
    public ResponseEntity<Void> remover(@PathVariable Long idProduto, Authentication auth) {
        Long idUsuario = usuarioService.findByUsername(auth).getId();
        wishlistRepository.deleteByIdUsuarioAndIdProduto(idUsuario, idProduto);
        return ResponseEntity.noContent().build();
    }
}
