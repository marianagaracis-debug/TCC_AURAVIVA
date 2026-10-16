package br.itb.projeto.auraviva.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.auraviva.model.entity.Endereco;
import br.itb.projeto.auraviva.model.repository.EnderecoRepository;
import br.itb.projeto.auraviva.service.UsuarioService;
import br.itb.projeto.auraviva.service.exception.RecursoNaoEncontradoException;

@RestController
@RequestMapping("/enderecos")
public class EnderecoController {

    private final EnderecoRepository enderecoRepository;
    private final UsuarioService usuarioService;

    public EnderecoController(EnderecoRepository enderecoRepository, UsuarioService usuarioService) {
        this.enderecoRepository = enderecoRepository;
        this.usuarioService = usuarioService;
    }

    // Lista todos os enderecos do cliente logado
    @GetMapping("/me")
    public ResponseEntity<List<Endereco>> meus(Authentication auth) {
        Long idUsuario = usuarioService.findByUsername(auth).getId();
        return ResponseEntity.ok(enderecoRepository.findByIdUsuario(idUsuario));
    }

    // Cria um novo endereco
    @PostMapping
    public ResponseEntity<Endereco> criar(@RequestBody Endereco endereco, Authentication auth) {
        Long idUsuario = usuarioService.findByUsername(auth).getId();
        if (endereco.getApelido() == null || endereco.getApelido().isBlank()) endereco.setApelido("Endereço");
        if (endereco.getLogradouro() == null || endereco.getLogradouro().isBlank())
            throw new IllegalArgumentException("Logradouro obrigatório.");
        if (endereco.getCidade() == null || endereco.getCidade().isBlank())
            throw new IllegalArgumentException("Cidade obrigatória.");
        if (endereco.getEstado() == null || endereco.getEstado().isBlank())
            throw new IllegalArgumentException("Estado obrigatório.");
        if (endereco.getCep() == null || endereco.getCep().isBlank())
            throw new IllegalArgumentException("CEP obrigatório.");
        endereco.setId(null);
        endereco.setIdUsuario(idUsuario);
        endereco.setDataCadastro(LocalDateTime.now());
        return ResponseEntity.status(HttpStatus.CREATED).body(enderecoRepository.save(endereco));
    }

    // Atualiza um endereco existente (dono apenas)
    @PutMapping("/{id}")
    public ResponseEntity<Endereco> editar(@PathVariable Long id,
            @RequestBody Endereco dados, Authentication auth) {
        Long idUsuario = usuarioService.findByUsername(auth).getId();
        Endereco endereco = enderecoRepository.findById(id)
                .filter(e -> e.getIdUsuario().equals(idUsuario))
                .orElseThrow(() -> new RecursoNaoEncontradoException("Endereço não encontrado."));
        if (dados.getApelido()    != null) endereco.setApelido(dados.getApelido());
        if (dados.getCep()        != null) endereco.setCep(dados.getCep());
        if (dados.getLogradouro() != null) endereco.setLogradouro(dados.getLogradouro());
        if (dados.getNumero()     != null) endereco.setNumero(dados.getNumero());
        if (dados.getComplemento()!= null) endereco.setComplemento(dados.getComplemento());
        if (dados.getBairro()     != null) endereco.setBairro(dados.getBairro());
        if (dados.getCidade()     != null) endereco.setCidade(dados.getCidade());
        if (dados.getEstado()     != null) endereco.setEstado(dados.getEstado());
        return ResponseEntity.ok(enderecoRepository.save(endereco));
    }

    // Exclui um endereco (dono apenas)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id, Authentication auth) {
        Long idUsuario = usuarioService.findByUsername(auth).getId();
        enderecoRepository.findById(id)
                .filter(e -> e.getIdUsuario().equals(idUsuario))
                .orElseThrow(() -> new RecursoNaoEncontradoException("Endereço não encontrado."));
        enderecoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
