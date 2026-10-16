package br.itb.projeto.auraviva.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.auraviva.dto.RedefinirSenhaDTO;
import br.itb.projeto.auraviva.service.RecuperarSenhaService;

@RestController
@RequestMapping("/recuperar-senha")
public class RecuperarSenhaController {

    private final RecuperarSenhaService recuperarSenhaService;

    public RecuperarSenhaController(RecuperarSenhaService recuperarSenhaService) {
        this.recuperarSenhaService = recuperarSenhaService;
    }

    @PostMapping("/solicitar-codigo")
    public ResponseEntity<String> solicitarCodigo(@RequestParam String email) {
        try {
            recuperarSenhaService.solicitarCodigo(email);
            return ResponseEntity.ok("Codigo enviado para o e-mail informado.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/validar-codigo")
    public ResponseEntity<String> validarCodigo(@RequestParam String email, @RequestParam String codigo) {
        boolean valido = recuperarSenhaService.validarCodigo(email, codigo);
        if (valido) {
            return ResponseEntity.ok("Codigo valido.");
        } else {
            return ResponseEntity.badRequest().body("Codigo invalido ou expirado.");
        }
    }

    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@RequestBody RedefinirSenhaDTO dto) {
        try {
            recuperarSenhaService.redefinirSenha(dto.getEmail(), dto.getCodigo(), dto.getNovaSenha());
            return ResponseEntity.ok("Senha redefinida com sucesso.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
