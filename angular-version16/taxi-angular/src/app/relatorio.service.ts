import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private motoristaUrl = 'http://appserver.alunos.di.fc.ul.pt:3074/motoristas';
  private taxiUrl = 'http://appserver.alunos.di.fc.ul.pt:3074/taxis';


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

  getSubtotaisHorasPorMotoristaNoTaxi(taxiId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.taxiUrl}/${taxiId}/subtotais-horas-motorista`, { params });
  }

  getSubtotaisHorasPorTaxiDoMotorista(motoristaId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.motoristaUrl}/${motoristaId}/subtotais-horas-taxi`, { params });
  }

  getSubtotaisViagensPorTaxiDoMotorista(motoristaId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.motoristaUrl}/${motoristaId}/subtotais-viagens-taxi`, { params });
  }

  getSubtotaisKmPorTaxiDoMotorista(motoristaId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.motoristaUrl}/${motoristaId}/subtotais-km-taxi`, { params });
  }


  getSubtotaisViagensPorMotoristaNoTaxi(taxiId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.taxiUrl}/${taxiId}/subtotais-viagens-motorista`, { params });
  }

  getSubtotaisKmPorMotoristaNoTaxi(taxiId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = {};
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.taxiUrl}/${taxiId}/subtotais-km-motorista`, { params });
  }

  getDetalhesViagensPorMotoristaNoTaxi(taxiId: string, motoristaId: string, inicio?: string, fim?: string): Observable<any> {
    let params: any = { taxiId, motoristaId };
    if (inicio) params.inicio = inicio;
    if (fim) params.fim = fim;
    return this.http.get(`${this.taxiUrl}/${taxiId}/detalhes-viagens-motorista/${motoristaId}`, { params });
  }

  getDetalhesViagensPorTaxiDoMotorista(motoristaId: string, taxiId: string, inicio: string, fim: string) {
  let params: any = {};
  if (inicio) params.inicio = inicio;
  if (fim) params.fim = fim;
  return this.http.get<any[]>(`${this.motoristaUrl}/${motoristaId}/detalhes-viagens-taxi/${taxiId}`, { params });
}
}