package br.itb.projeto.auraviva.model.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.itb.projeto.auraviva.model.entity.Newsletter;

public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    Optional<Newsletter> findByEmail(String email);
    boolean existsByEmail(String email);
}
