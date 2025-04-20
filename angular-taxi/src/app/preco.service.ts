import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Preco {
  nivelConforto: string;
  precoPorMinuto: number;
  acrescimoNoturno: number;
}

@Injectable({
  providedIn: 'root'
})

export class PrecoService {
  private precosUrl = 'http://localhost:3000/precos';

  constructor(private http: HttpClient) { }

  definirPreco(preco: Preco): Observable<Preco> {
    return this.http.post<Preco>(`${this.precosUrl}/definir`, preco);
  }

  listarPrecos(): Observable<Preco[]> {
    return this.http.get<Preco[]>(this.precosUrl);
  }
}
