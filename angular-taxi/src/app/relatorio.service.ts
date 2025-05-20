import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private motoristaUrl = 'http://localhost:3000/motoristas';
  private taxiUrl = 'http://localhost:3000/taxis';


  constructor(private http: HttpClient) {}

  getEstatisticaInicialMotorista(motoristaId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.motoristaUrl}/${motoristaId}/estatisticasMotorista`, { params });
  }

  getEstatisticaInicialTaxi(taxiId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.taxiUrl}/${taxiId}/estatisticasTaxi`, { params });
  }
}