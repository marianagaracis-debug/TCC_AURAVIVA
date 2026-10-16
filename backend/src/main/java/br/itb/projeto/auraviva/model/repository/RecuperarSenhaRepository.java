package br.itb.projeto.auraviva.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.itb.projeto.auraviva.model.entity.RecuperarSenha;

public interface RecuperarSenhaRepository extends JpaRepository<RecuperarSenha, Long> {

    Optional<RecuperarSenha> findByEmailAndCodigoAndStatusCodigoTrue(String email, String codigo);
}
