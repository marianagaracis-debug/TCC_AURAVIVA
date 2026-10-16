import styles from "./Perfil.module.css";

const etapasPedido = [
  { id: "recebido", nome: "Pedido recebido" },
  { id: "preparacao", nome: "Em preparação" },
  { id: "enviado", nome: "Enviado" },
  { id: "entrega", nome: "Saiu para entrega" },
  { id: "entregue", nome: "Entregue" },
  { id: "cancelado", nome: "Cancelado" },
];

const formatarData = (data) => new Date(data).toLocaleDateString("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const converterPreco = (valor) => {
  if (typeof valor === "number") return valor;
  if (typeof valor !== "string") return Number.NaN;

  const precoNormalizado = valor.replace(/[^\d,.-]/g, "");
  return Number(precoNormalizado.includes(",")
    ? precoNormalizado.replace(/\./g, "").replace(",", ".")
    : precoNormalizado);
};

const formatarPreco = (valor) => {
  const preco = converterPreco(valor);
  return Number.isFinite(preco)
    ? preco.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
    : "Valor indisponível";
};

const AcompanhamentoPedidos = ({ pedidos, modoGestao = false, atualizarPedido }) => (
  <div className={styles.orders}>
    {!modoGestao && <p className={styles.localDataNote}>Seus pedidos ficam salvos na sua conta da Auraviva.</p>}
    {pedidos.map((pedido) => {
      const etapaAtual = etapasPedido.findIndex((etapa) => etapa.id === pedido.status);
      const statusAtual = etapasPedido.find((etapa) => etapa.id === pedido.status)?.nome || "Pedido recebido";
      const itens = Array.isArray(pedido.itens) ? pedido.itens : [];
      const historico = Array.isArray(pedido.historico) ? pedido.historico : [];
      const totalPedido = Number.isFinite(pedido.subtotal)
        ? pedido.subtotal
        : itens.reduce((total, item) => total + converterPreco(item.preco) * item.quantidade, 0);

      return (
        <article className={styles.orderCard} key={pedido.id}>
          <header className={styles.orderHeader}>
            <div>
              <span className={styles.orderKicker}>Pedido {pedido.id}</span>
              <h3>{formatarData(pedido.criadoEm)}</h3>
            </div>
            <span className={styles.orderStatus}>{statusAtual}</span>
          </header>

          <ol className={styles.orderTimeline} aria-label={`Etapas do pedido ${pedido.id}`}>
            {etapasPedido.slice(0, 5).map((etapa, indice) => (
              <li className={indice <= etapaAtual && pedido.status !== "cancelado" ? styles.completedStep : ""} key={etapa.id}>
                <span aria-hidden="true" />
                {etapa.nome}
              </li>
            ))}
          </ol>
          {pedido.status === "cancelado" && <p className={styles.cancelledNote}>Este pedido foi cancelado.</p>}

          <div className={styles.orderItems}>
            {itens.map((item) => (
              <div key={item.id}>
                <span>{item.quantidade} × {item.nome}</span>
                <strong>{formatarPreco(converterPreco(item.preco) * item.quantidade)}</strong>
              </div>
            ))}
            <div className={styles.orderTotal}><span>Total</span><strong>{formatarPreco(totalPedido)}</strong></div>
          </div>

          {(pedido.cliente || pedido.enderecoEntrega || pedido.pagamento) && (
            <dl className={styles.deliveryInfo}>
              {pedido.cliente && <>
                <div><dt>Cliente</dt><dd>{pedido.cliente.nome || "Não informado"}</dd></div>
                <div><dt>E-mail</dt><dd>{pedido.cliente.email || "Não informado"}</dd></div>
              </>}
              {pedido.enderecoEntrega && (
                <div><dt>Endereço de entrega</dt><dd>
                  {[pedido.enderecoEntrega.logradouro, pedido.enderecoEntrega.numero, pedido.enderecoEntrega.bairro,
                    pedido.enderecoEntrega.cidade, pedido.enderecoEntrega.estado, pedido.enderecoEntrega.cep]
                    .filter(Boolean).join(", ") || "Endereço não informado"}
                </dd></div>
              )}
              {pedido.pagamento && <div><dt>Pagamento</dt><dd>{pedido.pagamento}</dd></div>}
            </dl>
          )}

          {modoGestao ? (
            <div className={styles.deliveryControls}>
              <label>
                Etapa do pedido
                <select value={pedido.status} onChange={(event) => atualizarPedido(pedido.id, { status: event.target.value }, true)}>
                  {etapasPedido.map((etapa) => <option value={etapa.id} key={etapa.id}>{etapa.nome}</option>)}
                </select>
              </label>
              <label>
                Código de rastreio
                <input
                  value={pedido.codigoRastreio || ""}
                  onChange={(event) => atualizarPedido(pedido.id, { codigoRastreio: event.target.value })}
                  placeholder="Informe ao despachar"
                />
              </label>
              <label>
                Lote / referência
                <input
                  value={pedido.lote || ""}
                  onChange={(event) => atualizarPedido(pedido.id, { lote: event.target.value })}
                  placeholder="Quando aplicável"
                />
              </label>
              <label>
                Previsão de entrega
                <input
                  type="date"
                  value={pedido.previsaoEntrega || ""}
                  onChange={(event) => atualizarPedido(pedido.id, { previsaoEntrega: event.target.value })}
                />
              </label>
            </div>
          ) : (
            <dl className={styles.deliveryInfo}>
              <div><dt>Código de rastreio</dt><dd>{pedido.codigoRastreio || "Ainda não disponível"}</dd></div>
              <div><dt>Previsão de entrega</dt><dd>{pedido.previsaoEntrega ? formatarData(pedido.previsaoEntrega) : "Aguardando atualização"}</dd></div>
            </dl>
          )}

          <div className={styles.orderHistory}>
            <h4>Histórico de atualizações</h4>
            {historico.length > 0 ? (
              <ul>
                {[...historico].reverse().map((evento, indice) => (
                  <li key={`${evento.data}-${indice}`}>
                    <strong>{etapasPedido.find((etapa) => etapa.id === evento.status)?.nome || evento.status}</strong>
                    <time dateTime={evento.data}>{formatarData(evento.data)}</time>
                  </li>
                ))}
              </ul>
            ) : <p className={styles.localDataNote}>Nenhuma atualização registrada.</p>}
          </div>
        </article>
      );
    })}
  </div>
);

export default AcompanhamentoPedidos;