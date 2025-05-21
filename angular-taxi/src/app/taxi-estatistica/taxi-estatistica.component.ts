import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RelatorioService } from '../relatorio.service';

@Component({
  selector: 'app-taxi-estatistica',
  templateUrl: './taxi-estatistica.component.html',
  styleUrls: ['./taxi-estatistica.component.css'],
  standalone: false
})
export class TaxiEstatisticaComponent implements OnInit {
  taxiId!: string;
  dataInicio!: string;
  dataFim!: string;
  estatisticas: any = null;
  erro: string | null = null;
  subtotais: any[] = [];
  mostrarSubtotais = false;
  subtotaisViagens: any[] = [];
  subtotaisKm: any[] = [];
  mostrarSubtotaisViagens = false;
  mostrarSubtotaisKm = false;

  constructor(
    private route: ActivatedRoute,
    private relatorioService: RelatorioService
  ) {}

  ngOnInit() {
    this.taxiId = this.route.snapshot.paramMap.get('id')!;
    const hoje = new Date();
    this.dataInicio = hoje.toISOString().substring(0, 10);
    this.dataFim = hoje.toISOString().substring(0, 10);
    this.buscarEstatisticas();
  }

  onMostrarSubtotaisHoras() {
    this.mostrarSubtotais = true;
    this.relatorioService.getSubtotaisHorasPorMotoristaNoTaxi(
      this.taxiId,
      this.dataInicio,
      this.dataFim
    ).subscribe({
      next: (res) => this.subtotais = res,
      error: (err) => this.erro = 'Erro ao buscar subtotais: ' + err.message
    });
  }

  buscarEstatisticas() {
    this.erro = null;
    const hoje = new Date();

    const inicioDate = new Date(this.dataInicio);
    const fimDate = new Date(this.dataFim);

    if (inicioDate > fimDate) {
      this.erro = 'A data inicial deve ser anterior ou igual à data final.';
      this.estatisticas = null;
      return;
    }

    if (inicioDate > hoje || fimDate > hoje) {
      this.erro = 'Nenhuma das datas pode ser maior que hoje.';
      this.estatisticas = null;
      return;
    }

    console.log('Buscando estatísticas para o taxiId:', this.taxiId);
    this.relatorioService.getEstatisticaInicialTaxi(
      this.taxiId,
      this.dataInicio,
      this.dataFim
    ).subscribe({
      next: (res) => this.estatisticas = res.totais || res,
      error: (err) => this.erro = 'Erro ao buscar estatísticas: ' + err.message
    });
    console.log('dataInicio:', this.dataInicio);
    console.log('dataFim:', this.dataFim);
  }

  onMostrarSubtotaisViagens() {
  this.mostrarSubtotaisViagens = true;
  this.relatorioService.getSubtotaisViagensPorMotoristaNoTaxi(
    this.taxiId,
    this.dataInicio,
    this.dataFim
  ).subscribe({
    next: (res) => this.subtotaisViagens = res,
    error: (err) => this.erro = 'Erro ao buscar subtotais: ' + err.message
  });
}

onMostrarSubtotaisKm() {
  this.mostrarSubtotaisKm = true;
  this.relatorioService.getSubtotaisKmPorMotoristaNoTaxi(
    this.taxiId,
    this.dataInicio,
    this.dataFim
  ).subscribe({
    next: (res) => this.subtotaisKm = res,
    error: (err) => this.erro = 'Erro ao buscar subtotais: ' + err.message
  });
}
}