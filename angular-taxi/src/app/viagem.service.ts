import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ViagemService {
  private apiUrl = 'http://localhost:3000/viagens';

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
}