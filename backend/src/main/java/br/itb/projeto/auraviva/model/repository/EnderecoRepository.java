package br.itb.projeto.auraviva.model.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.itb.projeto.auraviva.model.entity.Endereco;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {
    List<Endereco> findByIdUsuario(Long idUsuario);
    void deleteByIdAndIdUsuario(Long id, Long idUsuario);
}
