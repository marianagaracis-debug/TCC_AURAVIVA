package br.itb.projeto.auraviva.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.itb.projeto.auraviva.dto.UsuarioDTO;
import br.itb.projeto.auraviva.model.entity.Usuario;
import br.itb.projeto.auraviva.model.repository.UsuarioRepository;
import br.itb.projeto.auraviva.service.exception.RecursoNaoEncontradoException;

@Service
public class UsuarioService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    private final String codigoFuncionario;

    public UsuarioService(UsuarioRepository usuarioRepository,
            PasswordEncoder passwordEncoder,
            @Value("${auraviva.codigo-funcionario}") String codigoFuncionario) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
        this.codigoFuncionario = codigoFuncionario;
    }

    /* ================= LOGIN ================= */
    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario nao encontrado"));

        if (!"ATIVO".equals(usuario.getStatusUsuario())) {
            throw new DisabledException("Usuario inativo ou precisa trocar senha");
        }

        return User.builder()
                .username(usuario.getUsername())
                .password(usuario.getPassword())
                // Defensivo: se nivelAcesso vier nulo (cadastro antigo), assume USER
                .roles(usuario.getNivelAcesso() != null ? usuario.getNivelAcesso() : "USER")
                .build();
    }

    /* ================= CREATE ================= */
    // Cadastro publico pelo site: sempre cria um CLIENTE (USER).
    public UsuarioDTO create(Usuario usuario) {
        return toDTO(salvarNovo(usuario, "USER"));
    }

    // Cadastro de FUNCIONARIO: exige o codigo de funcionario da empresa.
    public UsuarioDTO createFuncionario(Usuario usuario, String codigo) {
        if (codigo == null || !codigoFuncionario.equals(codigo.trim())) {
            throw new IllegalArgumentException("Codigo de funcionario invalido.");
        }
        return toDTO(salvarNovo(usuario, "FUNCIONARIO"));
    }

    private Usuario salvarNovo(Usuario usuario, String nivelAcesso) {
        if (usuario.getNome() == null || usuario.getNome().isBlank()) {
            throw new IllegalArgumentException("Informe o nome completo.");
        }
        if (usuario.getUsername() == null || !usuario.getUsername().contains("@")) {
            throw new IllegalArgumentException("Informe um e-mail valido.");
        }
        if (usuario.getPassword() == null || usuario.getPassword().length() < 8) {
            throw new IllegalArgumentException("A senha deve ter no minimo 8 caracteres.");
        }

        String email = usuario.getUsername().trim().toLowerCase();
        if (usuarioRepository.existsByUsername(email)) {
            throw new IllegalArgumentException("Este e-mail ja esta cadastrado.");
        }

        Usuario _usuario = new Usuario();
        _usuario.setNome(usuario.getNome().trim());
        _usuario.setUsername(email);
        _usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        _usuario.setTelefone(usuario.getTelefone());
        _usuario.setNivelAcesso(nivelAcesso);
        _usuario.setStatusUsuario("ATIVO");
        _usuario.setDataCadastro(LocalDateTime.now());

        return usuarioRepository.save(_usuario);
    }

    /* ================= EDITAR ================= */
    public Usuario editar(MultipartFile file, Long id, Usuario usuario) {

        Usuario _usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));

        _usuario.setNome(usuario.getNome());
        _usuario.setTelefone(usuario.getTelefone());
        _usuario.setNivelAcesso(usuario.getNivelAcesso());
        _usuario.setDataAtualizacao(LocalDateTime.now());

        if (file != null && file.getSize() > 0) {
            try {
                _usuario.setFoto(file.getBytes());
            } catch (IOException e) {
                throw new IllegalArgumentException("Erro ao processar a foto do usuario");
            }
        }

        return usuarioRepository.save(_usuario);
    }

    /* ================= ALTERAR SENHA ================= */
    public Usuario alterarSenha(Long id, String novaSenha) {
        Usuario _usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));

        _usuario.setPassword(passwordEncoder.encode(novaSenha));
        _usuario.setStatusUsuario("ATIVO");
        _usuario.setDataAtualizacao(LocalDateTime.now());

        return usuarioRepository.save(_usuario);
    }

    /* ================= INATIVAR ================= */
    public Usuario inativar(Long id) {
        Usuario _usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));

        _usuario.setStatusUsuario("INATIVO");
        _usuario.setDataAtualizacao(LocalDateTime.now());
        return usuarioRepository.save(_usuario);
    }

    /* ================= ATIVAR ================= */
    public Usuario ativar(Long id) {
        Usuario _usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));

        _usuario.setStatusUsuario("ATIVO");
        _usuario.setDataAtualizacao(LocalDateTime.now());
        return usuarioRepository.save(_usuario);
    }

    public UsuarioDTO findByUsername(Authentication authentication) {
        Usuario usuario = usuarioRepository
                .findByUsername(authentication.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));

        return toDTO(usuario);
    }

    public List<UsuarioDTO> findAll() {
        return usuarioRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public UsuarioDTO findById(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));

        return toDTO(usuario);
    }

    /* ================= ATUALIZAR PROPRIO PERFIL ================= */
    public UsuarioDTO atualizarMe(Authentication authentication, java.util.Map<String, String> campos) {
        Usuario usuario = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));
        String nome = campos.get("nome");
        String telefone = campos.get("telefone");
        if (nome != null && !nome.isBlank()) usuario.setNome(nome.trim());
        if (telefone != null) usuario.setTelefone(telefone.isBlank() ? null : telefone.trim());
        usuario.setDataAtualizacao(LocalDateTime.now());
        return toDTO(usuarioRepository.save(usuario));
    }

    /* ================= ALTERAR PROPRIA SENHA ================= */
    public void alterarSenhaMe(Authentication authentication, String senhaAtual, String novaSenha) {
        Usuario usuario = usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RecursoNaoEncontradoException("Usuario nao encontrado"));
        if (senhaAtual == null || !passwordEncoder.matches(senhaAtual, usuario.getPassword())) {
            throw new IllegalArgumentException("Senha atual incorreta.");
        }
        if (novaSenha == null || novaSenha.length() < 8) {
            throw new IllegalArgumentException("A nova senha deve ter no mínimo 8 caracteres.");
        }
        usuario.setPassword(passwordEncoder.encode(novaSenha));
        usuario.setDataAtualizacao(LocalDateTime.now());
        usuarioRepository.save(usuario);
    }

    private UsuarioDTO toDTO(Usuario usuario) {
        return new UsuarioDTO(
                usuario.getId(),
                usuario.getNome(),
                usuario.getUsername(),
                usuario.getNivelAcesso(),
                usuario.getDataCadastro(),
                usuario.getStatusUsuario(),
                usuario.getTelefone()
        );
    }
}
