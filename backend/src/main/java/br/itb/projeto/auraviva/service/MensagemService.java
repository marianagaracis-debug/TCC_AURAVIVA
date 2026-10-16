package br.itb.projeto.auraviva.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import br.itb.projeto.auraviva.model.entity.Mensagem;
import br.itb.projeto.auraviva.model.repository.MensagemRepository;
import br.itb.projeto.auraviva.service.exception.RecursoNaoEncontradoException;

@Service
public class MensagemService {

    private final MensagemRepository mensagemRepository;
    private final NotificacaoService notificacaoService;

    public MensagemService(MensagemRepository mensagemRepository, NotificacaoService notificacaoService) {
        this.mensagemRepository = mensagemRepository;
        this.notificacaoService = notificacaoService;
    }

    public Mensagem enviarMensagem(Mensagem mensagem) {

        mensagem.setDataMensagem(LocalDateTime.now());
        mensagem.setStatusMensagem("ATIVO");

        Mensagem mensagemEnviada = mensagemRepository.save(mensagem);

        // NOTIFICA EM TEMPO REAL (sino de mensagens no painel ADMIN)
        notificacaoService.notificarNovaMensagem();

        return mensagemEnviada;
    }

    public List<Mensagem> findAll() {
        return mensagemRepository.findAll();
    }

    public Mensagem findById(Long id) {
        return mensagemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Mensagem nao encontrada"));
    }

    public Mensagem abrirMensagem(Long id) {
        Mensagem _mensagem = mensagemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Mensagem nao encontrada"));

        _mensagem.setStatusMensagem("LIDO");
        _mensagem.setDataAtualizacao(LocalDateTime.now());

        return mensagemRepository.save(_mensagem);
    }

    public Mensagem inativar(Long id) {
        Mensagem _mensagem = mensagemRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Mensagem nao encontrada"));

        _mensagem.setStatusMensagem("INATIVO");
        _mensagem.setDataAtualizacao(LocalDateTime.now());

        return mensagemRepository.save(_mensagem);
    }
}
