package br.itb.projeto.auraviva.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.itb.projeto.auraviva.dto.PedidoDTO;
import br.itb.projeto.auraviva.model.entity.Item_Venda;
import br.itb.projeto.auraviva.model.entity.Venda;
import br.itb.projeto.auraviva.service.UsuarioService;
import br.itb.projeto.auraviva.service.exception.RecursoNaoEncontradoException;
import br.itb.projeto.auraviva.service.VendaService;

@RestController
@RequestMapping("/vendas")
public class VendaController {

    private final VendaService vendaService;
    private final UsuarioService usuarioService;

    public VendaController(VendaService vendaService, UsuarioService usuarioService) {
        this.vendaService = vendaService;
        this.usuarioService = usuarioService;
    }

    // Finaliza o carrinho (checkout) -> cria a venda do cliente logado
    @PostMapping
    public ResponseEntity<Venda> create(@RequestBody VendaRequest request,
            Authentication authentication) {

        // Define o cliente a partir do usuario logado
        Long idUsuario = usuarioService.findByUsername(authentication).getId();
        Venda novaVenda = request.getVenda() != null ? request.getVenda() : new Venda();
        novaVenda.setIdUsuario(idUsuario);

        Venda venda = vendaService.create(novaVenda, request.getItens());
        return ResponseEntity.status(HttpStatus.CREATED).body(venda);
    }

    // Historico de pedidos do cliente logado (PERFIL)
    @GetMapping("/minhas")
    public ResponseEntity<List<Venda>> minhasVendas(Authentication authentication) {
        Long idUsuario = usuarioService.findByUsername(authentication).getId();
        return ResponseEntity.ok(vendaService.findByIdUsuario(idUsuario));
    }

    // Pedidos completos do cliente logado (tela "Meus pedidos")
    @GetMapping("/pedidos")
    public ResponseEntity<List<PedidoDTO>> meusPedidos(Authentication authentication) {
        Long idUsuario = usuarioService.findByUsername(authentication).getId();
        return ResponseEntity.ok(vendaService.detalhar(vendaService.findByIdUsuario(idUsuario)));
    }

    // Pedidos completos de todos os clientes (equipe)
    @GetMapping("/pedidos/todos")
    public ResponseEntity<List<PedidoDTO>> todosPedidos() {
        return ResponseEntity.ok(vendaService.detalhar(vendaService.findAll()));
    }

    @GetMapping("/{id}/itens")
    public ResponseEntity<List<Item_Venda>> findItens(@PathVariable Long id,
            Authentication authentication) {
        garantirAcesso(vendaService.findById(id), authentication);
        return ResponseEntity.ok(vendaService.findItens(id));
    }

    /* ========== AREA ADMIN ========== */

    @GetMapping("/all")
    public ResponseEntity<List<Venda>> findAll() {
        return ResponseEntity.ok(vendaService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Venda> findById(@PathVariable Long id,
            Authentication authentication) {
        Venda venda = vendaService.findById(id);
        garantirAcesso(venda, authentication);
        return ResponseEntity.ok(venda);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Venda> atualizarStatus(@PathVariable Long id,
            @RequestParam String statusVenda) {
        return ResponseEntity.ok(vendaService.atualizarStatus(id, statusVenda));
    }

    // Atualiza código de rastreio e previsão de entrega (equipe)
    @PutMapping("/{id}/rastreio")
    public ResponseEntity<Venda> atualizarRastreio(
            @PathVariable Long id,
            @RequestParam(required = false) String codigoRastreio,
            @RequestParam(required = false) String previsaoEntrega,
            @RequestParam(required = false) String enderecoEntrega) {
        return ResponseEntity.ok(
                vendaService.atualizarRastreio(id, codigoRastreio, previsaoEntrega, enderecoEntrega));
    }

    // Cliente so ve os proprios pedidos; equipe (ADMIN/FUNCIONARIO) ve todos
    private void garantirAcesso(Venda venda, Authentication authentication) {
        boolean equipe = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN")
                        || a.getAuthority().equals("ROLE_FUNCIONARIO"));
        if (equipe) {
            return;
        }
        Long idUsuario = usuarioService.findByUsername(authentication).getId();
        if (!venda.getIdUsuario().equals(idUsuario)) {
            // 404 em vez de 403 para nao revelar que o pedido existe
            throw new RecursoNaoEncontradoException("Venda nao encontrada");
        }
    }

    /* ========== DTO DE ENTRADA DO CHECKOUT ========== */

    // Classe auxiliar para receber a venda + a lista de itens no checkout
    public static class VendaRequest {
        private Venda venda;
        private List<Item_Venda> itens;

        public Venda getVenda() {
            return venda;
        }

        public void setVenda(Venda venda) {
            this.venda = venda;
        }

        public List<Item_Venda> getItens() {
            return itens;
        }

        public void setItens(List<Item_Venda> itens) {
            this.itens = itens;
        }
    }
}

