import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Motorista } from './motorista';
import {PedidoCliente} from "./cliente.service";
import {Turno} from "./turno";


@Injectable({
  providedIn: 'root'
})
export class MotoristaService {

  private motoristaUrl = 'http://localhost:3000/motoristas'
  private pedidosUrl = 'http://localhost:3000/motorista/pedidos';

  constructor(private http: HttpClient) {}

  getMotoristas(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.motoristaUrl);
  }

  createMotorista(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(this.motoristaUrl, motorista);
  }

  loginMotorista(nif: string): Observable<Motorista> {
    return this.http.post<Motorista>(this.motoristaUrl+"/login", { nif });
  }

  getPedidoAtual(motoristaId: string): Observable<PedidoCliente> {
    return this.http.get<PedidoCliente>(`${this.motoristaUrl}/${motoristaId}/pedido-atual`);
  }

  getTurnoAtual(motoristaId: string): Observable<Turno> {
    return this.http.get<any>(`${this.motoristaUrl}/${motoristaId}/turno-atual`);
  }

  //PEDIDOS PENDENTES

  listarPedidosPendentes(lat: number, lng: number, motoristaId: string): Observable<PedidoCliente[]> {
    return this.http.get<PedidoCliente[]>(`${this.pedidosUrl}`, {
      params: {
        lat: lat.toString(),
        lng: lng.toString(),
        motoristaId,
      }
    });
  }

  aceitarPedidoPendente(pedidoId: string, motoristaId: string): Observable<{success: boolean}> {
    return this.http.post<{success: boolean}>(
      `${this.pedidosUrl}/aceitar`,
      { pedidoId, motoristaId }
    );
  }

  deleteMotorista(id: string): Observable<any> {
    const url = `${this.motoristaUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  getMotoristaById(id: string): Observable<Motorista> {
      return this.http.get<Motorista>(`${this.motoristaUrl}/${encodeURIComponent(id)}`);
  }

  editMotorista(id: string, motorista: Motorista): Observable<Motorista> {
    console.log('Editando motorista. ID:', id);
    console.log('Dados do motorista:', motorista);

    // Verificação de segurança
    if (!id) {
      console.error('Tentativa de editar motorista sem ID definido');
      return new Observable<Motorista>();
    }

    return this.http.put<Motorista>(`${this.motoristaUrl}/${id}`, motorista);
  }

}
