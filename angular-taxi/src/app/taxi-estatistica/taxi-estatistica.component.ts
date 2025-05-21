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
  estatisticas: any;
  erro: string | null = null;

  // Subtotais
  subtotais: any[] = [];
  mostrarSubtotais = false;
  subtotaisViagens: any[] = [];
  mostrarSubtotaisViagens = false;
  subtotaisKm: any[] = [];
  mostrarSubtotaisKm = false;

  // Detalhes
  detalhes: any[] = [];
  mostrarDetalhes = false;
  tituloDetalhes = '';

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
    this.erro = null;
    this.relatorioService.getEstatisticaInicialTaxi(
      this.taxiId,
      this.dataInicio,
      this.dataFim
    ).subscribe({
      next: (res) => {
        this.estatisticas = res.totais ? res.totais : res;
      },
      error: (err) => this.erro = 'Erro ao buscar estatísticas: ' + err.message
    });
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

  // Detalhes de horas por motorista
  mostrarDetalhesHorasMotorista(subtotal: any) {
    this.tituloDetalhes = `Horas em viagens de ${subtotal.nome}`;
    this.mostrarDetalhes = true;
    this.relatorioService.getDetalhesViagensPorMotoristaNoTaxi(
      this.taxiId,
      subtotal.motoristaId,
      this.dataInicio,
      this.dataFim
    ).subscribe({
      next: (res) => {
        // Ordenar por horas decrescente
        this.detalhes = res.sort((a: any, b: any) => Number(b.horas) - Number(a.horas));
      },
      error: (err) => this.erro = 'Erro ao buscar detalhes: ' + err.message
    });
  }

  // Detalhes de viagens por motorista
  mostrarDetalhesViagensMotorista(subtotal: any) {
    this.tituloDetalhes = `Viagens de ${subtotal.nome}`;
    this.mostrarDetalhes = true;
    this.relatorioService.getDetalhesViagensPorMotoristaNoTaxi(
      this.taxiId,
      subtotal.motoristaId,
      this.dataInicio,
      this.dataFim
    ).subscribe({
      next: (res) => {
        // Ordenar por data de fim decrescente
        this.detalhes = res.sort((a: any, b: any) => new Date(b.fim).getTime() - new Date(a.fim).getTime());
      },
      error: (err) => this.erro = 'Erro ao buscar detalhes: ' + err.message
    });
    console.log(this.detalhes);
  }

  // Detalhes de km por motorista
  mostrarDetalhesKmMotorista(subtotal: any) {
    this.tituloDetalhes = `Quilómetros em viagens de ${subtotal.nome}`;
    this.mostrarDetalhes = true;
    this.relatorioService.getDetalhesViagensPorMotoristaNoTaxi(
      this.taxiId,
      subtotal.motoristaId,
      this.dataInicio,
      this.dataFim
    ).subscribe({
      next: (res) => {
        // Ordenar por km decrescente
        this.detalhes = res.sort((a: any, b: any) => Number(b.quilometros) - Number(a.quilometros));
      },
      error: (err) => this.erro = 'Erro ao buscar detalhes: ' + err.message
    });
  }

  fecharDetalhes() {
    this.mostrarDetalhes = false;
    this.detalhes = [];
    this.tituloDetalhes = '';
  }
}