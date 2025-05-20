import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RelatorioService } from '../relatorio.service';

@Component({
  selector: 'app-motorista-estatisticas',
  templateUrl: './motorista-estatisticas.component.html',
  styleUrls: ['./motorista-estatisticas.component.css'],
  standalone: false
})
export class MotoristaEstatisticasComponent implements OnInit {
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
    this.inicio = `${hoje}T00:00:00`;
    this.fim = `${hoje}T23:59:59`;
  }

  carregarEstatisticas() {
    this.relatorioService.getEstatisticasMotorista(this.motoristaId, this.inicio, this.fim)
      .subscribe(est => this.estatisticas = est);
  }
}