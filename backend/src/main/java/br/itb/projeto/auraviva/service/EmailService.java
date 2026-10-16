package br.itb.projeto.auraviva.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void enviarCodigo(String destino, String codigo) {
        SimpleMailMessage mensagem = new SimpleMailMessage();
        mensagem.setTo(destino);
        mensagem.setSubject("Recuperacao de senha - AuraViva");
        mensagem.setText("Seu codigo de recuperacao e: " + codigo
                + ".\n" + "Nao responda esse e-mail.");

        mailSender.send(mensagem);
    }
}
