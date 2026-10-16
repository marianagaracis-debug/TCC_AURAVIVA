package br.itb.projeto.auraviva.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import br.itb.projeto.auraviva.model.entity.Produto;
import br.itb.projeto.auraviva.model.repository.ProdutoRepository;
import br.itb.projeto.auraviva.service.exception.RecursoNaoEncontradoException;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    /* ================= CREATE (area ADMIN) ================= */
    public Produto create(MultipartFile file, Produto produto) {

        produto.setStatusProduto("ATIVO");
        produto.setDataCadastro(LocalDateTime.now());

        if (file != null && file.getSize() > 0) {
            try {
                produto.setFoto(file.getBytes());
            } catch (IOException e) {
                throw new IllegalArgumentException("Erro ao processar a imagem do produto");
            }
        }

        return produtoRepository.save(produto);
    }

    /* ================= EDITAR (area ADMIN) ================= */
    public Produto editar(MultipartFile file, Long id, Produto produto) {

        Produto _produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto nao encontrado"));

        _produto.setNome(produto.getNome());
        _produto.setDescricao(produto.getDescricao());
        _produto.setTipoSemente(produto.getTipoSemente());
        _produto.setEspecie(produto.getEspecie());
        _produto.setVariedade(produto.getVariedade());
        _produto.setEstacao(produto.getEstacao());
        _produto.setTransgenico(produto.isTransgenico());
        _produto.setPreco(produto.getPreco());
        _produto.setQuantidadeEstoque(produto.getQuantidadeEstoque());
        _produto.setDestaque(produto.isDestaque());
        _produto.setImagemUrl(produto.getImagemUrl());
        _produto.setDataAtualizacao(LocalDateTime.now());

        if (file != null && file.getSize() > 0) {
            try {
                _produto.setFoto(file.getBytes());
            } catch (IOException e) {
                throw new IllegalArgumentException("Erro ao processar a imagem do produto");
            }
        }

        return produtoRepository.save(_produto);
    }

    /* ================= INATIVAR ================= */
    public Produto inativar(Long id) {
        Produto _produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto nao encontrado"));

        _produto.setStatusProduto("INATIVO");
        _produto.setDataAtualizacao(LocalDateTime.now());
        return produtoRepository.save(_produto);
    }

    /* ================= ATIVAR ================= */
    public Produto ativar(Long id) {
        Produto _produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto nao encontrado"));

        _produto.setStatusProduto("ATIVO");
        _produto.setDataAtualizacao(LocalDateTime.now());
        return produtoRepository.save(_produto);
    }

    /* ================= CONSULTAS PUBLICAS ================= */

    // Pagina de PRODUTOS (todos ativos)
    public List<Produto> findAllAtivos() {
        return produtoRepository.findByStatusProduto("ATIVO");
    }

    // Pagina de SEMENTES DE VERAO ou de INVERNO
    public List<Produto> findByEstacao(String estacao) {
        if (!"VERAO".equalsIgnoreCase(estacao) && !"INVERNO".equalsIgnoreCase(estacao)) {
            throw new IllegalArgumentException("Estacao invalida. Use VERAO ou INVERNO.");
        }
        return produtoRepository.findByEstacaoAndStatusProduto(estacao.toUpperCase(), "ATIVO");
    }

    // Destaques da HOME
    public List<Produto> findDestaques() {
        return produtoRepository.findByDestaqueTrueAndStatusProduto("ATIVO");
    }

    // Lista completa para a area ADMIN
    public List<Produto> findAll() {
        return produtoRepository.findAll();
    }

    public Produto findById(Long id) {
        return produtoRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Produto nao encontrado"));
    }
}
