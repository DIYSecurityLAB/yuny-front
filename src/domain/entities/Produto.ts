export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco_pontos: number;
  preco_cripto?: number;
  imagem_url?: string;
  categoria?: string;
  estoque: number;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}
