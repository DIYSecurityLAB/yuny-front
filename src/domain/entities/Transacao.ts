export type TipoTransacao = 'compra' | 'venda' | 'p2p_envio' | 'p2p_recebimento' | 'marketplace';
export type StatusTransacao = 'pendente' | 'concluida' | 'cancelada';

export interface Transacao {
  id: string;
  user_id: string;
  tipo: TipoTransacao;
  valor: number;
  pontos: number;
  cotacao: number;
  status: StatusTransacao;
  destinatario_id?: string;
  produto_id?: string;
  created_at: string;
}
