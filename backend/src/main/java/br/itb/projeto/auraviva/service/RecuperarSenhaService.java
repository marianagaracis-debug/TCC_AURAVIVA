package br.itb.projeto.auraviva.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.itb.projeto.auraviva.model.entity.RecuperarSenha;
import br.itb.projeto.auraviva.model.entity.Usuario;
import br.itb.projeto.auraviva.model.repository.RecuperarSenhaRepository;
import br.itb.projeto.auraviva.model.repository.UsuarioRepository;

@Service
public class RecuperarSenhaService {

    private final RecuperarSenhaRepository recuperarSenhaRepository;
    private final UsuarioRepository usuarioRepository;
    private final JavaMailSender mailSender;
    private final PasswordEncoder passwordEncoder;

    public RecuperarSenhaService(RecuperarSenhaRepository recuperarSenhaRepository,
            UsuarioRepository usuarioRepository,
            JavaMailSender mailSender,
            PasswordEncoder passwordEncoder) {
        this.recuperarSenhaRepository = recuperarSenhaRepository;
        this.usuarioRepository = usuarioRepository;
        this.mailSender = mailSender;
        this.passwordEncoder = passwordEncoder;
    }

    public void solicitarCodigo(String email) {
        Usuario usuario = usuarioRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado"));

        String codigo = gerarCodigo();
        LocalDateTime agora = LocalDateTime.now();
        LocalDateTime expiracao = agora.plusMinutes(15);

        RecuperarSenha recuperarSenha = new RecuperarSenha();
        recuperarSenha.setEmail(email);
        recuperarSenha.setCodigo(codigo);
        recuperarSenha.setGeradoEm(agora);
        recuperarSenha.setExpiraEm(expiracao);
        recuperarSenha.setStatusCodigo(true);

        recuperarSenhaRepository.save(recuperarSenha);

        enviarCodigo(email, codigo);
    }

    public void redefinirSenha(String email, String codigo, String novaSenha) {
        RecuperarSenha registro = recuperarSenhaRepository.findByEmailAndCodigoAndStatusCodigoTrue(email, codigo)
                .orElseThrow(() -> new RuntimeException("Codigo invalido ou expirado."));

        if (registro.getExpiraEm().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Codigo expirado.");
        }

        Usuario usuario = usuarioRepository.findByUsername(email)
                .orElseThrow(() -> new RuntimeException("Usuario nao encontrado."));

        usuario.setPassword(passwordEncoder.encode(novaSenha));
        usuario.setDataAtualizacao(LocalDateTime.now());
        usuarioRepository.save(usuario);

        registro.setStatusCodigo(false);
        recuperarSenhaRepository.save(registro);
    }

    public boolean validarCodigo(String email, String codigo) {
        return recuperarSenhaRepository.findByEmailAndCodigoAndStatusCodigoTrue(email, codigo)
                .filter(r -> r.getExpiraEm().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    private String gerarCodigo() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    private void enviarCodigo(String email, String codigo) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(email);
        mensagem.setSubject("Codigo de Recuperacao de senha - AuraViva");
        mensagem.setText("Seu codigo de recuperacao e: " + codigo
                + ".\n" + "Este codigo expira em 15 minutos."
                + "\n" + "Nao responda esse e-mail.");

        mailSender.send(mensagem);
    }
}
