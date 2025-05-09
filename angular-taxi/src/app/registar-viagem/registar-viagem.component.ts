import { Component, OnInit } from '@angular/core';
import { ViagemService } from '../services/viagem.service';

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.component.html',
  styleUrls: ['./registar-viagem.component.css']
})
export class RegistarViagemComponent implements OnInit {
  viagemAtual: any = null;
  pedidoAtual: any = null;
  erro: string | null = null;
  mensagem: string | null = null;

  constructor(private viagemService: ViagemService) {}

  ngOnInit() {
    this.carregarPedidoAtual();
  }

  iniciarViagem() {
    if (!this.pedidoAtual) {
      this.erro = 'Nenhum pedido ativo encontrado';
      return;
    }

    const dados = {
      pedidoId: this.pedidoAtual._id,
      turnoId: this.obterTurnoAtual(),
      numeroPessoas: this.pedidoAtual.numeroPessoas
    };

    this.viagemService.iniciarViagem(dados).subscribe({
      next: (viagem) => {
        this.viagemAtual = viagem;
        this.erro = null;
        this.mensagem = 'Viagem iniciada com sucesso!';
      },
      error: (err) => {
        this.erro = 'Erro ao iniciar viagem: ' + err.message;
        this.mensagem = null;
      }
    });
  }

  finalizarViagem() {
    if (!this.viagemAtual) {
      this.erro = 'Nenhuma viagem em andamento';
      return;
    }

    // Usar geolocalização para obter coordenadas atuais
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const dados = {
          morada: {
            rua: this.pedidoAtual.destino.rua,
            cidade: this.pedidoAtual.destino.cidade,
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        };

        this.viagemService.finalizarViagem(this.viagemAtual._id, dados).subscribe({
          next: (viagem) => {
            this.mensagem = `Viagem finalizada! Valor total: ${viagem.valorTotal}€`;
            this.viagemAtual = null;
            this.pedidoAtual = null;
            this.erro = null;
          },
          error: (err) => {
            this.erro = 'Erro ao finalizar viagem: ' + err.message;
            this.mensagem = null;
          }
        });
      },
      (err) => {
        this.erro = 'Erro ao obter localização: ' + err.message;
      }
    );
  }

  private carregarPedidoAtual() {
    // Implementar lógica para carregar pedido atual do motorista
  }

  private obterTurnoAtual(): string {
    // Implementar lógica para obter ID do turno atual
    return '';
  }
}