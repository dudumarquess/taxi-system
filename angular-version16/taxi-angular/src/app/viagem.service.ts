import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  private apiUrl = 'http://appserver.alunos.di.fc.ul.pt:3074/viagens';

  constructor(private http: HttpClient) { }

  iniciarViagem(dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/iniciar`, dados);
  }

  finalizarViagem(id: string, dados: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/finalizar/${id}`, dados);
  }

  listarViagens(motoristaId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/motorista/${motoristaId}`);
  }

  getViagemPorPedido(pedidoId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/pedido/${pedidoId}`);
}
}