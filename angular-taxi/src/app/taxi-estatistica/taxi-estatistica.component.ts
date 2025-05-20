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

  buscarEstatisticas() {
    console.log('Buscando estatísticas para o taxiId:', this.taxiId);
    this.erro = null;
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
}