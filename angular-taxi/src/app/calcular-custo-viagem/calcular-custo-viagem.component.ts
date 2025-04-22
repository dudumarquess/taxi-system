import { Component } from '@angular/core';
import { PrecoService } from '../preco.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-calcular-custo-viagem',
  templateUrl: './calcular-custo-viagem.component.html',
  styleUrls: ['./calcular-custo-viagem.component.css'],
  standalone: false
})
export class CalcularCustoViagemComponent {

  nivelConforto = '';
  inicio = '';
  fim = '';
  niveisConforto = ['básico', 'luxuoso'];
  custoTotal: string | null = null;
  erro: string | null = null;

  constructor(private precoService: PrecoService, private router: Router) {}

  onSubmit(e: Event) {
    e.preventDefault();
    this.custoTotal = null;
    this.erro = null;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const nivelConforto = formData.get('nivelConforto')?.toString() || '';
    const dataInicio = formData.get('inicioData')?.toString();
    const horaInicio = formData.get('inicioHora')?.toString();
    const inicio = `${dataInicio}T${horaInicio}`;

    const dataFim = formData.get('fimData')?.toString();
    const horaFim = formData.get('fimHora')?.toString();
    const fim = `${dataFim}T${horaFim}`;


    if (!nivelConforto || !inicio || !fim) {
      this.erro = 'Todos os campos são obrigatórios.';
      return;
    }

    this.precoService.calcularCustoViagem({ nivelConforto, inicio, fim }).subscribe({
      next: (res) => {
        this.custoTotal = `${res.custoTotal} €`;
      },
      error: (err) => {
        if (err.status === 404) {
          this.erro = 'Não há preço definido para o nível de conforto selecionado.';
        } else if (err.status === 400) {
          this.erro = 'O horário de início deve ser anterior ao de fim.';
        } else {
          this.erro = 'Erro ao calcular o custo. Tente novamente.';
        }
      }
    });
  }
}
