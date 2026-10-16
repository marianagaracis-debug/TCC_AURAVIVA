package br.itb.projeto.auraviva.dto;

import java.time.LocalDateTime;

public class UsuarioDTO {

    private Long id;
    private String nome;
    private String username;
    private String nivelAcesso;
    private String statusUsuario;
    private String telefone;
    private LocalDateTime dataCadastro;

    public UsuarioDTO(Long id, String nome, String username, String nivelAcesso,
            LocalDateTime dataCadastro, String statusUsuario, String telefone) {
        this.id = id;
        this.nome = nome;
        this.username = username;
        this.nivelAcesso = nivelAcesso;
        this.dataCadastro = dataCadastro;
        this.statusUsuario = statusUsuario;
        this.telefone = telefone;
    }

    // compat sem telefone
    public UsuarioDTO(Long id, String nome, String username, String nivelAcesso,
            LocalDateTime dataCadastro, String statusUsuario) {
        this(id, nome, username, nivelAcesso, dataCadastro, statusUsuario, null);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getNivelAcesso() { return nivelAcesso; }
    public void setNivelAcesso(String nivelAcesso) { this.nivelAcesso = nivelAcesso; }
    public String getStatusUsuario() { return statusUsuario; }
    public void setStatusUsuario(String statusUsuario) { this.statusUsuario = statusUsuario; }
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    public LocalDateTime getDataCadastro() { return dataCadastro; }
    public void setDataCadastro(LocalDateTime dataCadastro) { this.dataCadastro = dataCadastro; }
}
