import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RelatorioService } from '../relatorio.service';
import { MotoristaService } from '../motorista.service'  


@Component({
  selector: 'app-motorista-estatisticas',
  templateUrl: './motorista-estatistica.component.html',
  styleUrls: ['./motorista-estatistica.component.css'],
  standalone: false
})
export class MotoristaEstatisticaComponent implements OnInit {
  motoristaId!: string;
  estatisticas: any;
  inicio!: string; 
  fim!: string;
  erro: string | null = null; // <-- Adicione esta linha
  subtotaisHoras: any[] = [];
  mostrarSubtotaisHoras = false;
  subtotaisViagens: any[] = [];
  mostrarSubtotaisViagens = false;
  subtotaisKm: any[] = [];
  mostrarSubtotaisKm = false;

  detalhesViagens: any[] = [];
  mostrarDetalhesViagens = false;
  taxiSelecionado: any = null;

  motorista: any = {};

  constructor(
    private route: ActivatedRoute,
    private relatorioService: RelatorioService,
    private motoristaService: MotoristaService
  ) {}

  ngOnInit() {
    this.motoristaId = this.route.snapshot.paramMap.get('id')!;
    this.setPeriodoHoje();
    this.carregarEstatisticas();
    this.carregarMotorista();

  }

  setPeriodoHoje() {
    const hoje = new Date().toISOString().slice(0, 10);
    this.inicio = hoje;
    this.fim = hoje;
  }

  carregarMotorista() {
    this.motoristaService.getMotoristaById(this.motoristaId)
      .subscribe(m => this.motorista = m);
  }

  carregarEstatisticas() {
    this.erro = null; // Limpa erro anterior

    const hoje = new Date().toISOString().slice(0, 10);

    if (this.inicio > hoje || this.fim > hoje) {
      this.erro = 'A data de início e de fim devem ser iguais ou anteriores ao dia de hoje.';
      return;
    }
    if (this.fim < this.inicio) {
      this.erro = 'A data de fim não pode ser menor que a data de início.';
      return;
    }

    this.relatorioService.getEstatisticaInicialMotorista(this.motoristaId, this.inicio, this.fim)
      .subscribe((est: any) => this.estatisticas = est);
  }

  onMostrarSubtotaisHoras() {
  this.relatorioService.getSubtotaisHorasPorTaxiDoMotorista(this.motoristaId, this.inicio, this.fim)
    .subscribe(res => {
      this.subtotaisHoras = res;
      this.mostrarSubtotaisHoras = true;
    });
  }

  onMostrarSubtotaisViagens() {
  this.relatorioService.getSubtotaisViagensPorTaxiDoMotorista(this.motoristaId, this.inicio, this.fim)
    .subscribe(res => {
      this.subtotaisViagens = res;
      this.mostrarSubtotaisViagens = true;
    });
  }

  onMostrarSubtotaisKm() {
    this.relatorioService.getSubtotaisKmPorTaxiDoMotorista(this.motoristaId, this.inicio, this.fim)
      .subscribe(res => {
        this.subtotaisKm = res;
        this.mostrarSubtotaisKm = true;
      });
  }

  mostrarDetalhesViagensTaxi(subtotal: any) {
    this.taxiSelecionado = subtotal;
    this.relatorioService.getDetalhesViagensPorTaxiDoMotorista(
      this.motoristaId,
      subtotal.taxiId,
      this.inicio,
      this.fim
    ).subscribe(res => {
      this.detalhesViagens = res;
      this.mostrarDetalhesViagens = true;
    });
  }
}

