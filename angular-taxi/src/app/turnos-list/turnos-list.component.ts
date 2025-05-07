import { Component, OnInit } from '@angular/core';
import { Turno } from '../turno';
import { Motorista } from '../motorista';
import { TurnoService } from '../turno.service';

@Component({
  selector: 'app-turnos-list',
  templateUrl: './turnos-list.component.html',
  styleUrl: './turnos-list.component.css',
  standalone: false
})
export class TurnosListComponent implements OnInit {
  motoristaLogado: Motorista | null = null;
  generalError: string | null = null;
  turnos: Turno[] = [];
  turnosComEstado: { turno: Turno; estado: string }[] = []; 

  constructor(private turnoService: TurnoService) {}

  ngOnInit() {
    this.carregarMotoristaLogado();
    this.listarTurnos();
  }

  carregarMotoristaLogado() {
    const motoristaData = localStorage.getItem('motoristaLogado');
    if (motoristaData) {
      this.motoristaLogado = JSON.parse(motoristaData) as Motorista;
    }
  }

  listarTurnos() {
    if(!this.motoristaLogado || !this.motoristaLogado._id) {
      this.generalError = 'Motorista não autenticado.';
      return;
    }
    this.turnoService.getTurnos(this.motoristaLogado._id).subscribe({
      next: (turnos: Turno[]) => {
        this.turnos = turnos;
        this.processarTurnos(); 
      },
      error: () => {
        this.generalError = 'Erro ao listar os turnos.';
      },
    });
  }

  processarTurnos() {
    const now = new Date(); // Data e hora atual
    this.turnosComEstado = this.turnos.map(turno => {
      var estado = '';
      if (new Date(turno.fim) < now) {
        estado = 'Concluido';
      } else if (new Date(turno.inicio) > now) {
        estado = 'Por Iniciar';
      } else {
        estado = 'Em Andamento';
      }
      return { turno, estado };
    });
  }
}
