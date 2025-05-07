import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TaxiService } from '../taxi.service';
import { TurnoService } from '../turno.service';
import { Turno } from '../turno';
import { Motorista } from '../motorista';
import { Taxi } from '../taxi';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-requisitar-taxi',
  templateUrl: './requisitar-taxi.component.html',
  styleUrls: ['./requisitar-taxi.component.css'],
  standalone: false,
})
export class RequisitarTaxiComponent {
  inicioData: string = ''; // Data de início
  inicioHora: string = ''; // Hora de início
  fimData: string = ''; // Data de fim
  fimHora: string = ''; // Hora de fim
  taxis: Taxi[] = [];
  motoristaLogado: Motorista | null = null;
  inicioError: string | null = null;
  fimError: string | null = null;
  taxiSelecionadoError: string | null = null;
  disponiveisError: string | null = null;
  generalError: string | null = null;
  successMessage: string | null = null;

  constructor(
    private taxiService: TaxiService,
    private turnoService: TurnoService,
    private router: Router,
    private http: HttpClient) {}

  ngOnInit() {
    this.carregarMotoristaLogado();
  }

  carregarMotoristaLogado() {
    const motoristaData = localStorage.getItem('motoristaLogado');
    if (motoristaData) {
      this.motoristaLogado = JSON.parse(motoristaData) as Motorista;
    }
  }

  verificarDisponiveis() {
    this.inicioError = null;
    this.fimError = null;
    this.disponiveisError = null;

    // Combinar os campos de data e hora para criar objetos Date
    const inicio = `${this.inicioData}T${this.inicioHora}`;
    const fim = `${this.fimData}T${this.fimHora}`;
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
    const now = new Date();

    // Validações
    if (!this.inicioData || !this.inicioHora || !this.fimData || !this.fimHora) {
      this.disponiveisError = 'Os campos de início e fim são obrigatórios.';
      return;
    }
    if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime())) {
      this.disponiveisError = 'Data ou hora inválida.';
      return;
    }
    if (inicioDate >= fimDate) {
      this.disponiveisError = 'O horário de início deve ser anterior ao de fim.';
      return;
    }
    if ((fimDate.getTime() - inicioDate.getTime()) / (1000 * 60 * 60) > 8) {
      this.disponiveisError = 'A duração do turno não pode ser superior a 8 horas.';
      return;
    }
    if (inicioDate <= now) {
      this.disponiveisError = 'O turno deve começar após a hora atual.';
      return;
    }

    if (!this.motoristaLogado || !this.motoristaLogado._id) {
      this.disponiveisError = 'Motorista não autenticado.';
      return;
    }

    // Verificar interseção de turnos
    this.turnoService.verificarIntersecoes(inicioDate, fimDate, this.motoristaLogado._id).subscribe({
      next: (intersecta) => {
        if (intersecta) {
          this.disponiveisError = 'O turno interseta outro turno existente.';
        } else {
          // Buscar táxis disponíveis
          this.taxiService.getTaxisDisponiveis(inicioDate, fimDate).subscribe({
            next: (taxis) => {
              this.taxis = taxis;
              if (this.taxis.length === 0) {
                this.disponiveisError = 'Nenhum táxi disponível para o período selecionado.';
              }
            },
            error: () => {
              this.disponiveisError = 'Erro ao buscar táxis disponíveis.';
            },
          });
        }
      },
      error: () => {
        this.disponiveisError = 'Erro ao verificar interseções de turnos.';
      },
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const matricula = formData.get('matricula');
    this.generalError = null;
    this.successMessage = null;


    const inicio = `${this.inicioData}T${this.inicioHora}`;
    const fim = `${this.fimData}T${this.fimHora}`;
    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);

    

    if (!this.inicioData || !this.inicioHora || !this.fimData || !this.fimHora) {
      this.generalError = 'Todos os campos de data e hora são obrigatórios.';
      return;
    }

    if (isNaN(inicioDate.getTime()) || isNaN(fimDate.getTime())) {
      this.generalError = 'Data ou hora inválida.';
      return;
    }

    if (inicioDate >= fimDate) {
      this.generalError = 'O horário de início deve ser anterior ao de fim.';
      return;
    }

    if (!matricula) {
      this.taxiSelecionadoError = 'Selecione um táxi.';
      this.generalError = 'Selecione um táxi.';
      return;
    }

    const taxi = this.taxis.find(t => t.matricula === matricula);

    if (!taxi) {
      this.generalError = 'Táxi selecionado não encontrado.';
      return;
    }

    if (!this.motoristaLogado) {
      this.generalError = 'Motorista não autenticado.';
      return;
    }

    const turno = {
      motoristaId: this.motoristaLogado._id,
      inicio: inicioDate,
      fim: fimDate,
      taxiId: taxi._id,
    };

    console.log('Turno a ser enviado:', turno);

    this.turnoService.requisitarTurno(turno).subscribe({
      next: () => {
        this.successMessage = 'Turno requisitado com sucesso!';
        this.router.navigate(['/motorista/turnos']);
      },
      error: () => {
        this.generalError = 'Erro ao requisitar o turno. Tente novamente.';
      },
    });
  }
}
