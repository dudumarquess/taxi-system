export type StatusPedidoTaxi =
  | 'pendente_motorista'
  | 'cancelado'
  | 'pendente_cliente'
  | 'rejeitado_pelo_cliente'
  | 'aceito_pelo_cliente'
  | 'em andamento'
  | 'concluído'


export interface PedidoTaxi {
  _id?: string;
  cliente: {
    nome: string;
    nif: string;
    genero: string;
  };
  origem: {
    rua: string;
    cidade: string;
  };
  destino: {
    rua: string;
    cidade: string;
  };
  nivelConforto: 'básico' | 'luxuoso';
  numeroPessoas: number;
  status?: StatusPedidoTaxi;
  motorista?: string;
  distancia?: number;
  dataPedido?: Date;

}


  