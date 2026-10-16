package br.itb.projeto.auraviva.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.auraviva.model.entity.Item_Venda;

@Repository
public interface Item_VendaRepository extends JpaRepository<Item_Venda, Long> {

    // Itens que compoem uma venda
    List<Item_Venda> findByIdVenda(Long idVenda);
}
