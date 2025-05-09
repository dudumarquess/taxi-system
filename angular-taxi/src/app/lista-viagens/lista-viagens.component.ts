import { Component, OnInit } from '@angular/core';
import { ViagemService } from '../viagem.service';

@Component({
  selector: 'app-lista-viagens',
  templateUrl: './lista-viagens.component.html',
  styleUrls: ['./lista-viagens.component.css'],
  standalone: false
})
export class ListaViagensComponent implements OnInit {
  viagens: any[] = [];
  erro: string | null = null;

  constructor(private viagemService: ViagemService) {}

  ngOnInit() {
    this.carregarViagens();
  }

  carregarViagens() {
    const motoristaId = this.obterMotoristaId();
    if (!motoristaId) return;

    this.viagemService.listarViagens(motoristaId).subscribe({
      next: (viagens) => {
        // Ordena as viagens pela data de início (mais recente primeiro)
        this.viagens = viagens.sort((a, b) => {
          const dataA = new Date(a.inicio.data).getTime();
          const dataB = new Date(b.inicio.data).getTime();
          return dataB - dataA;
        });
        this.erro = null;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar viagens: ' + err.message;
      }
    });
  }

  private obterMotoristaId(): string {
    const motoristaLogado = localStorage.getItem('motoristaLogado');
    if (!motoristaLogado) {
      this.erro = 'Motorista não está logado';
      return '';
    }
    return JSON.parse(motoristaLogado)._id;
  }
}
