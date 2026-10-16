package br.itb.projeto.auraviva.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.auraviva.model.entity.Newsletter;
import br.itb.projeto.auraviva.model.repository.NewsletterRepository;

@RestController
@RequestMapping("/newsletter")
public class NewsletterController {

    private final NewsletterRepository newsletterRepository;

    public NewsletterController(NewsletterRepository newsletterRepository) {
        this.newsletterRepository = newsletterRepository;
    }

    // Inscricao aberta (qualquer visitante pode se inscrever)
    @PostMapping("/inscrever")
    public ResponseEntity<Map<String, String>> inscrever(@RequestParam String email) {
        if (email == null || !email.contains("@")) {
            return ResponseEntity.badRequest().body(Map.of("erro", "E-mail inválido."));
        }
        String emailNorm = email.trim().toLowerCase();
        if (newsletterRepository.existsByEmail(emailNorm)) {
            return ResponseEntity.ok(Map.of("mensagem", "E-mail já cadastrado na newsletter."));
        }
        Newsletter inscrito = new Newsletter();
        inscrito.setEmail(emailNorm);
        inscrito.setInscritoEm(LocalDateTime.now());
        inscrito.setAtivo(true);
        newsletterRepository.save(inscrito);
        return ResponseEntity.ok(Map.of("mensagem", "Inscrição realizada com sucesso!"));
    }

    // Lista de inscritos (somente equipe)
    @GetMapping("/inscritos")
    public ResponseEntity<List<Newsletter>> inscritos() {
        return ResponseEntity.ok(newsletterRepository.findAll());
    }
}
