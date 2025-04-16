import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { Motorista } from './motorista';

@Injectable({
  providedIn: 'root'
})
export class MotoristaService {

  private motoristaUrl = 'http://localhost:3000/motoristas' 
  private motoristaNovoUrl = 'http://localhost:3000/motoristas/novo' 

  constructor(private http: HttpClient) {}

  getMotoristas(): Observable<Motorista[]> {
    return this.http.get<Motorista[]>(this.motoristaUrl);
  }

  createMotorista(motorista: Motorista): Observable<Motorista> {
    return this.http.post<Motorista>(this.motoristaNovoUrl, motorista);
  }
}
