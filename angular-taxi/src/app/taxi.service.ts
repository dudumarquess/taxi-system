import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Taxi } from './taxi';

@Injectable({
  providedIn: 'root'
})
export class TaxiService {

  private taxisUrl = 'http://localhost:3000/taxis' 

  constructor(private http: HttpClient) {}

  getTaxis(): Observable<Taxi[]> {
    return this.http.get<Taxi[]>(this.taxisUrl);
  }

  createTaxi(taxi: Taxi): Observable<Taxi> {
    return this.http.post<Taxi>(this.taxisUrl, taxi);
  }

  getTaxisDisponiveis(inicio: Date, fim: Date): Observable<Taxi[]> {
    const url = `${this.taxisUrl}/disponiveis`;
    return this.http.post<Taxi[]>(url, { inicio, fim });
  }

  deleteTaxi(id: string): Observable<void> {
    const url = `${this.taxisUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
