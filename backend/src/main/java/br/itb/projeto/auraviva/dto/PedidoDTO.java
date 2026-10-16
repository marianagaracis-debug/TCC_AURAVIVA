package br.itb.projeto.auraviva.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

// Pedido completo (venda + cliente + itens com nome do produto)
// usado pelas telas "Meus pedidos" (cliente) e "Pedidos" (equipe).
public record PedidoDTO(
        Long id,
        LocalDateTime dataVenda,
        String statusVenda,
        BigDecimal frete,
        BigDecimal valorTotal,
        String codigoRastreio,
        String previsaoEntrega,
        String enderecoEntrega,
        ClienteResumo cliente,
        List<ItemResumo> itens) {

    public record ClienteResumo(Long id, String nome, String email) {
    }

    public record ItemResumo(Long idProduto, String nome, String imagemUrl,
            int quantidade, BigDecimal precoUnitario) {
    }
}
