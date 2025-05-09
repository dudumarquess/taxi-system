import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Motorista } from './motorista';
import { PedidoTaxi } from './pedido-taxi';


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

  //PEDIDOS PENDENTES

  listarPedidosPendentes(lat: number, lng: number): Observable<PedidoTaxi[]> {
    return this.http.get<PedidoTaxi[]>(`${this.pedidosUrl}`, {
      params: {
        lat: lat.toString(),
        lng: lng.toString()
      }
    });
  }

  aceitarPedidoPendente(pedidoId: string, motoristaId: string): Observable<{success: boolean}> {
    return this.http.post<{success: boolean}>(
      `${this.pedidosUrl}/aceitar`, 
      { pedidoId, motoristaId }
    );
  }

}
