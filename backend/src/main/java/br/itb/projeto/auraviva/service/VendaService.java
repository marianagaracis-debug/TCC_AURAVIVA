package br.itb.projeto.auraviva.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.itb.projeto.auraviva.dto.PedidoDTO;
import br.itb.projeto.auraviva.model.entity.Item_Venda;
import br.itb.projeto.auraviva.model.entity.Produto;
import br.itb.projeto.auraviva.model.entity.Usuario;
import br.itb.projeto.auraviva.model.entity.Venda;
import br.itb.projeto.auraviva.model.repository.Item_VendaRepository;
import br.itb.projeto.auraviva.model.repository.ProdutoRepository;
import br.itb.projeto.auraviva.model.repository.UsuarioRepository;
import br.itb.projeto.auraviva.model.repository.VendaRepository;
import br.itb.projeto.auraviva.service.exception.RecursoNaoEncontradoException;

@Service
public class VendaService {

    private static final List<String> STATUS_VALIDOS =
            List.of("PENDENTE", "PAGO", "ENVIADO", "CONCLUIDO", "CANCELADO");

    private final VendaRepository vendaRepository;
    private final Item_VendaRepository itemVendaRepository;
    private final ProdutoRepository produtoRepository;
    private final UsuarioRepository usuarioRepository;

    public VendaService(VendaRepository vendaRepository,
            Item_VendaRepository itemVendaRepository,
            ProdutoRepository produtoRepository,
            UsuarioRepository usuarioRepository) {
        this.vendaRepository = vendaRepository;
        this.itemVendaRepository = itemVendaRepository;
        this.produtoRepository = produtoRepository;
        this.usuarioRepository = usuarioRepository;
    }

    /* ================= CRIAR VENDA ================= */
    // O preco vem SEMPRE do banco (nunca do navegador) e o estoque e baixado aqui.
    @Transactional
    public Venda create(Venda venda, List<Item_Venda> itens) {

        if (itens == null || itens.isEmpty()) {
            throw new IllegalArgumentException("O pedido precisa ter pelo menos um item.");
        }

        // Junta itens repetidos do mesmo produto (a tabela tem chave unica venda+produto)
        Map<Long, Integer> quantidades = new LinkedHashMap<>();
        for (Item_Venda item : itens) {
            if (item.getIdProduto() == null || item.getQuantidade() <= 0) {
                throw new IllegalArgumentException("Item invalido no pedido.");
            }
            quantidades.merge(item.getIdProduto(), item.getQuantidade(), Integer::sum);
        }

        BigDecimal totalItens = BigDecimal.ZERO;
        List<Item_Venda> itensFinais = new ArrayList<>();

        for (Map.Entry<Long, Integer> entrada : quantidades.entrySet()) {
            Produto produto = produtoRepository.findById(entrada.getKey())
                    .orElseThrow(() -> new RecursoNaoEncontradoException("Produto nao encontrado"));

            if (!"ATIVO".equals(produto.getStatusProduto())) {
                throw new IllegalArgumentException("O produto \"" + produto.getNome() + "\" esta indisponivel.");
            }
            if (produto.getQuantidadeEstoque() < entrada.getValue()) {
                throw new IllegalArgumentException("Estoque insuficiente para \"" + produto.getNome() + "\".");
            }

            produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() - entrada.getValue());
            produto.setDataAtualizacao(LocalDateTime.now());
            produtoRepository.save(produto);

            Item_Venda item = new Item_Venda();
            item.setIdProduto(produto.getId());
            item.setQuantidade(entrada.getValue());
            item.setPrecoUnitario(produto.getPreco());
            itensFinais.add(item);

            totalItens = totalItens.add(produto.getPreco().multiply(BigDecimal.valueOf(entrada.getValue())));
        }

        venda.setDataVenda(LocalDateTime.now());
        venda.setStatusVenda("PENDENTE");
        venda.setFrete(BigDecimal.ZERO); // entrega gratis (igual ao carrinho do site)
        venda.setValorTotal(totalItens);

        Venda _venda = vendaRepository.save(venda);

        for (Item_Venda item : itensFinais) {
            item.setIdVenda(_venda.getId());
            itemVendaRepository.save(item);
        }

        return _venda;
    }

    /* ================= ATUALIZAR STATUS (equipe) ================= */
    @Transactional
    public Venda atualizarStatus(Long id, String statusVenda) {
        Venda _venda = vendaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Venda nao encontrada"));

        if (statusVenda == null || !STATUS_VALIDOS.contains(statusVenda)) {
            throw new IllegalArgumentException("Status invalido. Use: " + STATUS_VALIDOS);
        }

        // Pedido cancelado devolve os itens ao estoque
        if ("CANCELADO".equals(statusVenda) && !"CANCELADO".equals(_venda.getStatusVenda())) {
            for (Item_Venda item : itemVendaRepository.findByIdVenda(id)) {
                produtoRepository.findById(item.getIdProduto()).ifPresent(produto -> {
                    produto.setQuantidadeEstoque(produto.getQuantidadeEstoque() + item.getQuantidade());
                    produto.setDataAtualizacao(LocalDateTime.now());
                    produtoRepository.save(produto);
                });
            }
        }

        _venda.setStatusVenda(statusVenda);
        _venda.setDataAtualizacao(LocalDateTime.now());

        return vendaRepository.save(_venda);
    }

    /* ================= CONSULTAS ================= */
    public List<Venda> findAll() {
        return vendaRepository.findAll();
    }

    // Historico de pedidos do cliente logado (PERFIL)
    public List<Venda> findByIdUsuario(Long idUsuario) {
        return vendaRepository.findByIdUsuario(idUsuario);
    }

    // Pedidos completos (cliente + itens com nome do produto), mais recentes primeiro
    public List<PedidoDTO> detalhar(List<Venda> vendas) {
        List<PedidoDTO> pedidos = new ArrayList<>();

        for (Venda venda : vendas) {
            Usuario usuario = usuarioRepository.findById(venda.getIdUsuario()).orElse(null);

            List<PedidoDTO.ItemResumo> itens = new ArrayList<>();
            for (Item_Venda item : itemVendaRepository.findByIdVenda(venda.getId())) {
                Produto produto = produtoRepository.findById(item.getIdProduto()).orElse(null);
                itens.add(new PedidoDTO.ItemResumo(
                        item.getIdProduto(),
                        produto != null ? produto.getNome() : "Produto removido",
                        produto != null ? produto.getImagemUrl() : null,
                        item.getQuantidade(),
                        item.getPrecoUnitario()));
            }

            PedidoDTO.ClienteResumo cliente = usuario != null
                    ? new PedidoDTO.ClienteResumo(usuario.getId(), usuario.getNome(), usuario.getUsername())
                    : null;

            pedidos.add(new PedidoDTO(venda.getId(), venda.getDataVenda(), venda.getStatusVenda(),
                    venda.getFrete(), venda.getValorTotal(),
                    venda.getCodigoRastreio(), venda.getPrevisaoEntrega(), venda.getEnderecoEntrega(),
                    cliente, itens));
        }

        pedidos.sort((a, b) -> b.dataVenda().compareTo(a.dataVenda()));
        return pedidos;
    }

    public Venda findById(Long id) {
        return vendaRepository.findById(id)
                .orElseThrow(() -> new RecursoNaoEncontradoException("Venda nao encontrada"));
    }

    public List<Item_Venda> findItens(Long idVenda) {
        return itemVendaRepository.findByIdVenda(idVenda);
    }

    public Venda atualizarRastreio(Long id, String codigoRastreio,
            String previsaoEntrega, String enderecoEntrega) {
        Venda venda = findById(id);
        if (codigoRastreio  != null) venda.setCodigoRastreio(codigoRastreio);
        if (previsaoEntrega != null) venda.setPrevisaoEntrega(previsaoEntrega);
        if (enderecoEntrega != null) venda.setEnderecoEntrega(enderecoEntrega);
        venda.setDataAtualizacao(java.time.LocalDateTime.now());
        return vendaRepository.save(venda);
    }
}
