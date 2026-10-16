package br.itb.projeto.auraviva.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.itb.projeto.auraviva.model.entity.Wishlist;

public interface WishlistRepository extends JpaRepository<Wishlist, Long> {
    List<Wishlist> findByIdUsuario(Long idUsuario);
    Optional<Wishlist> findByIdUsuarioAndIdProduto(Long idUsuario, Long idProduto);
    void deleteByIdUsuarioAndIdProduto(Long idUsuario, Long idProduto);
}
