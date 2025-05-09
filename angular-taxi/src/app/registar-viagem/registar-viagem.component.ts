import { Component, OnInit } from '@angular/core';
import { ViagemService } from '../services/viagem.service';
import { MotoristaService } from '../services/motorista.service';

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
  turnoAtual: any = null;

  constructor(
    private viagemService: ViagemService,
    private motoristaService: MotoristaService
  ) {}

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
    const motoristaLogado = this.getMotoristaLogado();
    if (!motoristaLogado) {
      this.erro = 'Motorista não está logado';
      return;
    }

    this.motoristaService.getPedidoAtual(motoristaLogado._id).subscribe({
      next: (pedido) => {
        if (pedido && pedido.status === 'aceito_pelo_cliente') {
          this.pedidoAtual = pedido;
          this.carregarTurnoAtual();
          this.erro = null;
        } else {
          this.erro = 'Nenhum pedido ativo encontrado';
        }
      },
      error: (err) => {
        this.erro = 'Erro ao carregar pedido: ' + err.message;
      }
    });
  }

  private carregarTurnoAtual() {
    const motoristaLogado = this.getMotoristaLogado();
    if (!motoristaLogado) return;

    this.motoristaService.getTurnoAtual(motoristaLogado._id).subscribe({
      next: (turno) => {
        this.turnoAtual = turno;
        this.erro = null;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar turno: ' + err.message;
      }
    });
  }

  private obterTurnoAtual(): string {
    return this.turnoAtual?._id || '';
  }

  private getMotoristaLogado(): any {
    const motoristaStr = localStorage.getItem('motoristaLogado');
    return motoristaStr ? JSON.parse(motoristaStr) : null;
  }
}