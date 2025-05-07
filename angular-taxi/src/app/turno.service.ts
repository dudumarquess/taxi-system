import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from './turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  private turnosUrl = 'http://localhost:3000/turnos';

  constructor(private http: HttpClient) {}


  verificarIntersecoes(inicio: Date, fim: Date, motoristaId: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.turnosUrl}/verificar-intersecoes`, {
      inicio,
      fim,
      motoristaId,
    });

  }

  requisitarTurno(turno: Turno): Observable<void> {
    return this.http.post<void>(`${this.turnosUrl}/requisitar`, turno);
  }

  getTurnos(): Observable<Turno[]> {
    return this.http.get<Turno[]>(this.turnosUrl);
  }
}
