package br.itb.projeto.auraviva.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import br.itb.projeto.auraviva.dto.UsuarioDTO;
import br.itb.projeto.auraviva.model.entity.Usuario;
import br.itb.projeto.auraviva.service.UsuarioService;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Cadastro publico de clientes (pagina de cadastro)
    @PostMapping("/create")
    public ResponseEntity<UsuarioDTO> create(@RequestBody Usuario usuario) {
        UsuarioDTO createdUsuario = usuarioService.create(usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUsuario);
    }

    // Cadastro de funcionario (aba "Funcionario"): exige o codigo da empresa
    @PostMapping("/create-funcionario")
    public ResponseEntity<UsuarioDTO> createFuncionario(
            @RequestBody Usuario usuario,
            @RequestHeader("X-Codigo-Funcionario") String codigo) {
        UsuarioDTO createdUsuario = usuarioService.createFuncionario(usuario, codigo);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdUsuario);
    }

    @PutMapping(
            value = "/{id}",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<Usuario> editar(
            @PathVariable Long id,
            @RequestPart(required = false) MultipartFile file,
            @RequestPart Usuario usuario) {

        Usuario usuarioAtualizado = usuarioService.editar(file, id, usuario);
        return ResponseEntity.ok(usuarioAtualizado);
    }

    @PutMapping("/{id}/alterar-senha")
    public ResponseEntity<Usuario> alterarSenha(@PathVariable Long id,
            @RequestParam String newPassword) {
        Usuario usuario = usuarioService.alterarSenha(id, newPassword);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}/inativar")
    public ResponseEntity<Usuario> inativar(@PathVariable Long id) {
        Usuario usuario = usuarioService.inativar(id);
        return ResponseEntity.ok(usuario);
    }

    @PutMapping("/{id}/ativar")
    public ResponseEntity<Usuario> ativar(@PathVariable Long id) {
        Usuario usuario = usuarioService.ativar(id);
        return ResponseEntity.ok(usuario);
    }

    // Dados do cliente logado (PERFIL)
    @GetMapping("/me")
    public UsuarioDTO me(Authentication authentication) {
        return usuarioService.findByUsername(authentication);
    }

    // Atualiza nome e telefone do proprio perfil
    @PutMapping("/me")
    public ResponseEntity<UsuarioDTO> atualizarMe(
            @RequestBody java.util.Map<String, String> campos,
            Authentication authentication) {
        return ResponseEntity.ok(usuarioService.atualizarMe(authentication, campos));
    }

    // Troca a propria senha (exige senha atual)
    @PutMapping("/me/alterar-senha")
    public ResponseEntity<Map<String, String>> alterarSenhaMe(
            @RequestBody java.util.Map<String, String> campos,
            Authentication authentication) {
        usuarioService.alterarSenhaMe(authentication, campos.get("senhaAtual"), campos.get("novaSenha"));
        return ResponseEntity.ok(Map.of("mensagem", "Senha alterada com sucesso."));
    }

    // Lista de clientes (area ADMIN)
    @GetMapping("/all")
    public ResponseEntity<List<UsuarioDTO>> findAll() {
        return ResponseEntity.ok(usuarioService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioDTO> findById(@PathVariable Long id) {
        return ResponseEntity.ok(usuarioService.findById(id));
    }
}
