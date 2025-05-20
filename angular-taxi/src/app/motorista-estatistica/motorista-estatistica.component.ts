import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RelatorioService } from '../relatorio.service';

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

  constructor(
    private route: ActivatedRoute,
    private relatorioService: RelatorioService
  ) {}

  ngOnInit() {
    this.motoristaId = this.route.snapshot.paramMap.get('id')!;
    this.setPeriodoHoje();
    this.carregarEstatisticas();
  }

  setPeriodoHoje() {
    const hoje = new Date().toISOString().slice(0, 10);
    this.inicio = hoje;
    this.fim = hoje;
  }

  carregarEstatisticas() {
    this.relatorioService.getEstatisticaInicialMotorista(this.motoristaId, this.inicio, this.fim)
      .subscribe((est: any) => this.estatisticas = est);
  }
}