package br.itb.projeto.auraviva.model.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "Produto")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome do produto e obrigatorio")
    @Size(max = 120, message = "O nome deve ter no maximo 120 caracteres")
    @Column(nullable = false, length = 120)
    private String nome;

    @Size(max = 500, message = "A descricao deve ter no maximo 500 caracteres")
    @Column(length = 500)
    private String descricao;

    @NotBlank(message = "O tipo de semente e obrigatorio")
    @Size(max = 100, message = "O tipo de semente deve ter no maximo 100 caracteres")
    @Column(nullable = false, length = 100)
    private String tipoSemente;

    @Size(max = 80, message = "A especie deve ter no maximo 80 caracteres")
    @Column(length = 80)
    private String especie;

    @Size(max = 100, message = "A variedade deve ter no maximo 100 caracteres")
    @Column(length = 100)
    private String variedade;

    @NotBlank(message = "A estacao e obrigatoria")
    @Pattern(regexp = "VERAO|INVERNO", message = "A estacao deve ser VERAO ou INVERNO")
    @Column(nullable = false, length = 10)
    private String estacao;
    // VERAO ou INVERNO (define a pagina do site)

    @Column(nullable = false)
    private boolean transgenico;
    // true = transgenica, false = convencional

    @NotNull(message = "O preco e obrigatorio")
    @DecimalMin(value = "0.0", inclusive = true, message = "O preco nao pode ser negativo")
    @Column(nullable = false)
    private BigDecimal preco;

    @NotNull(message = "A quantidade em estoque e obrigatoria")
    @Min(value = 0, message = "A quantidade em estoque nao pode ser negativa")
    @Column(nullable = false)
    private int quantidadeEstoque;

    @Column(nullable = false)
    private boolean destaque;
    // true = aparece em destaque na HOME

    @Size(max = 500, message = "A URL da imagem deve ter no maximo 500 caracteres")
    @Column(length = 500)
    private String imagemUrl;
    // URL da imagem (externa) exibida no site

    @Lob
    private byte[] foto;

    @Column(nullable = false)
    private LocalDateTime dataCadastro;

    private LocalDateTime dataAtualizacao;

    @Column(nullable = false)
    private String statusProduto;
    // ATIVO ou INATIVO

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public String getTipoSemente() {
        return tipoSemente;
    }

    public void setTipoSemente(String tipoSemente) {
        this.tipoSemente = tipoSemente;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getVariedade() {
        return variedade;
    }

    public void setVariedade(String variedade) {
        this.variedade = variedade;
    }

    public String getEstacao() {
        return estacao;
    }

    public void setEstacao(String estacao) {
        this.estacao = estacao;
    }

    public boolean isTransgenico() {
        return transgenico;
    }

    public void setTransgenico(boolean transgenico) {
        this.transgenico = transgenico;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public int getQuantidadeEstoque() {
        return quantidadeEstoque;
    }

    public void setQuantidadeEstoque(int quantidadeEstoque) {
        this.quantidadeEstoque = quantidadeEstoque;
    }

    public boolean isDestaque() {
        return destaque;
    }

    public void setDestaque(boolean destaque) {
        this.destaque = destaque;
    }

    public String getImagemUrl() {
        return imagemUrl;
    }

    public void setImagemUrl(String imagemUrl) {
        this.imagemUrl = imagemUrl;
    }

    public byte[] getFoto() {
        return foto;
    }

    public void setFoto(byte[] foto) {
        this.foto = foto;
    }

    public LocalDateTime getDataCadastro() {
        return dataCadastro;
    }

    public void setDataCadastro(LocalDateTime dataCadastro) {
        this.dataCadastro = dataCadastro;
    }

    public LocalDateTime getDataAtualizacao() {
        return dataAtualizacao;
    }

    public void setDataAtualizacao(LocalDateTime dataAtualizacao) {
        this.dataAtualizacao = dataAtualizacao;
    }

    public String getStatusProduto() {
        return statusProduto;
    }

    public void setStatusProduto(String statusProduto) {
        this.statusProduto = statusProduto;
    }
}
