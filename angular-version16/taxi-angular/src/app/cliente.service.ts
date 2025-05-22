import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Motorista } from './motorista';
import {Taxi} from "./taxi";

export interface PedidoCliente {
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
  status?: 'pendente_motorista' | 'cancelado' | 'pendente_cliente' | 'rejeitado_pelo_cliente' | 'aceito_pelo_cliente' | 'em_viagem' | 'concluído';
  dataPedido?: Date;
  motorista?: Motorista;
  distancia?: number;
  request?: {
    preco?: number;
    taxi?: Taxi;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private pedidosUrl = 'http://localhost:3000/api/pedidoCliente';
  private clientesUrl = 'http://localhost:3000/clientes';

  constructor(private http: HttpClient) {}

  criarPedido(pedido: PedidoCliente): Observable<PedidoCliente> {
    return this.http.post<PedidoCliente>(this.pedidosUrl, pedido);
  }

  enviarCoordenadas(latitude: number, longitude: number): Observable<any> {
    const url = `${this.pedidosUrl}/geocode`;
    return this.http.post(url, { latitude, longitude });
  }

  listarPedidos(): Observable<PedidoCliente[]> {
    return this.http.get<PedidoCliente[]>(this.pedidosUrl);
  }

  buscarPedidoPorNif(nif: string): Observable<PedidoCliente> {
    return this.http.get<PedidoCliente>(`${this.pedidosUrl}/buscar?nif=${nif}`);
  }

  aceitarPedido(pedidoId: string): Observable<any> {
    return this.http.post(`${this.pedidosUrl}/aceitar`, { pedidoId });
  }

  recusarPedido(pedidoId: string): Observable<any> {
    return this.http.post(`${this.pedidosUrl}/recusar`, { pedidoId });
  }


  cancelarPedido(pedidoId: string): Observable<any> {
    return this.http.post(`${this.pedidosUrl}/cancelar`, { pedidoId });
  }

  buscarOuCriarCliente(dados: { nome: string; nif: number, genero: string }): Observable<any> {
    return this.http.post(`${this.clientesUrl}/login`, dados);
  }
}
