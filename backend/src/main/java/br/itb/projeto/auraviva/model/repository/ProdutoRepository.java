package br.itb.projeto.auraviva.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.auraviva.model.entity.Produto;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    // Pagina de SEMENTES DE VERAO / INVERNO
    List<Produto> findByEstacaoAndStatusProduto(String estacao, String statusProduto);

    // Destaques exibidos na HOME
    List<Produto> findByDestaqueTrueAndStatusProduto(String statusProduto);

    List<Produto> findByStatusProduto(String statusProduto);
}
