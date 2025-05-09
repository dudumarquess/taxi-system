import { Component, OnInit } from '@angular/core';
import { ViagemService } from '../services/viagem.service';

@Component({
  selector: 'app-lista-viagens',
  templateUrl: './lista-viagens.component.html',
  styleUrls: ['./lista-viagens.component.css']
})
export class ListaViagensComponent implements OnInit {
  viagens: any[] = [];
  erro: string | null = null;

  constructor(private viagemService: ViagemService) {}

  ngOnInit() {
    this.carregarViagens();
  }

  carregarViagens() {
    const motoristaId = this.obterMotoristaId(); // Implementar método para obter ID do motorista logado
    
    this.viagemService.listarViagens(motoristaId).subscribe({
      next: (viagens) => {
        this.viagens = viagens;
        this.erro = null;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar viagens: ' + err.message;
      }
    });
  }

  private obterMotoristaId(): string {
    // Implementar lógica para obter ID do motorista logado
    return '';
  }
}