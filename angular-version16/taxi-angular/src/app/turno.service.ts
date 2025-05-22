import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Turno } from './turno';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  private turnosUrl = 'http://appserver.alunos.di.fc.ul.pt:3074/turnos';

  constructor(private http: HttpClient) {}


  verificarIntersecoes(inicio: Date, fim: Date, motoristaId: string): Observable<boolean> {
    return this.http.post<boolean>(`${this.turnosUrl}/verificar-intersecoes`, {
      inicio,
      fim,
      motoristaId,
    });

  }

  requisitarTurno(turno: any): Observable<void> {
    return this.http.post<void>(`${this.turnosUrl}/requisitar-turno`, turno);
  }

  getTurnos(motoristaId: string): Observable<Turno[]> {
    const url = `${this.turnosUrl}?motoristaId=${motoristaId}`;
    return this.http.get<Turno[]>(url);
  }
}
