import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Preco } from './preco'

@Injectable({
  providedIn: 'root'
})

export class PrecoService {
  private precosUrl = 'http://appserver.alunos.di.fc.ul.pt:3074/precos';

  constructor(private http: HttpClient) { }

  definirPreco(preco: Preco): Observable<Preco> {
    return this.http.post<Preco>(`${this.precosUrl}/definir`, preco);
  }

  listarPrecos(): Observable<Preco[]> {
    return this.http.get<Preco[]>(this.precosUrl);
  }

  calcularCustoViagem(dados: { nivelConforto: string; inicio: string; fim: string }): Observable<any> {
    return this.http.post<any>(`${this.precosUrl}/calcular_custo`, dados);
  }
}
