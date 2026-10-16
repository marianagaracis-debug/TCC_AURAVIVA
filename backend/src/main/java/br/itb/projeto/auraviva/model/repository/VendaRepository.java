package br.itb.projeto.auraviva.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import br.itb.projeto.auraviva.model.entity.Venda;

@Repository
public interface VendaRepository extends JpaRepository<Venda, Long> {

    // Historico de pedidos de um cliente (PERFIL)
    List<Venda> findByIdUsuario(Long idUsuario);
}
