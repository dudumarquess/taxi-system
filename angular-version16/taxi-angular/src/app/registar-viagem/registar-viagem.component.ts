import { Component, OnInit } from '@angular/core';
import { ViagemService } from '../viagem.service';
import { MotoristaService } from '../motorista.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registar-viagem',
  templateUrl: './registar-viagem.component.html',
  styleUrls: ['./registar-viagem.component.css'],
  standalone: false
})
export class RegistarViagemComponent implements OnInit {
  viagemAtual: any = null;
  pedidoAtual: any = null;
  erro: string | null = null;
  mensagem: string | null = null;
  turnoAtual: any = null;

  constructor(
    private viagemService: ViagemService,
    private motoristaService: MotoristaService,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Componente RegistarViagemComponent inicializado.');
    this.carregarPedidoAtual();
  }

  iniciarViagem() {
    console.log('Tentando iniciar viagem...');
    if (!this.pedidoAtual) {
        this.erro = 'Nenhum pedido ativo encontrado';
        console.warn(this.erro);
        return;
    }

    const motoristaLogado = this.getMotoristaLogado();
    if (!motoristaLogado) {
        this.erro = 'Motorista não está logado';
        console.warn(this.erro);
        return;
    }

    const dados = {
        pedidoId: this.pedidoAtual._id,
        turnoId: this.obterTurnoAtual(),
        motoristaId: motoristaLogado._id, // Adiciona o motoristaId
    };

    console.log('Dados para iniciar viagem:', dados);

    this.viagemService.iniciarViagem(dados).subscribe({
        next: (viagem) => {
            console.log('Viagem iniciada com sucesso:', viagem);
            this.viagemAtual = viagem.viagem;
            console.log('Viagem atual atribuída:', this.viagemAtual);
            this.erro = null;
            this.mensagem = 'Viagem iniciada com sucesso!';
        },
        error: (err) => {
            this.erro = 'Erro ao iniciar viagem: ' + err.message;
            console.error(this.erro);
            this.mensagem = null;
        }
    });
  }

  finalizarViagem() {
  console.log('Tentando finalizar viagem...');
  if (!this.viagemAtual) {
    this.erro = 'Nenhuma viagem em andamento';
    console.warn(this.erro);
    return;
  }

  // Usa diretamente a morada de destino do pedido
  const dados = {
    morada: {
      rua: this.pedidoAtual.destino.rua,
      cidade: this.pedidoAtual.destino.cidade,
      lat: this.pedidoAtual.destino.lat,
      lng: this.pedidoAtual.destino.lng
    }
  };

  console.log('Dados para finalizar viagem:', dados);
  console.log('ID da viagem:', this.viagemAtual._id);

  this.viagemService.finalizarViagem(this.viagemAtual._id, dados).subscribe({
    next: (viagem) => {
      console.log('Viagem finalizada com sucesso:', viagem);
      this.mensagem = `Viagem finalizada! Valor total: ${viagem.viagem.valorTotal}€`;
      this.viagemAtual = null;
      this.pedidoAtual = null;
      this.erro = null;
    },
    error: (err) => {
      this.erro = 'Erro ao finalizar viagem: ' + err.message;
      console.error(this.erro);
      this.mensagem = null;
    }
  });
}

  private carregarPedidoAtual() {
    console.log('Carregando pedido atual...');
    const motoristaLogado = this.getMotoristaLogado();
    if (!motoristaLogado) {
        this.erro = 'Motorista não está logado';
        console.warn(this.erro);
        return;
    }

    this.motoristaService.getPedidoAtual(motoristaLogado._id).subscribe({
        next: (pedido) => {
            if (pedido && (pedido.status === 'aceito_pelo_cliente' || pedido.status === 'em_viagem')) {
                console.log('Pedido ativo encontrado:', pedido);
                this.pedidoAtual = pedido;
                this.erro = null;

                // Se o pedido estiver em "em_viagem", buscar a viagem atual
                if (pedido.status === 'em_viagem' && pedido._id) {
                  this.carregarViagemAtual(pedido._id);
                } else {
                    this.carregarTurnoAtual();
                }
            } else {
                this.pedidoAtual = null;
                this.erro = 'Não há pedidos ativos no momento.';
                console.warn(this.erro);
            }
        },
        error: (err) => {
            this.erro = 'Erro ao carregar pedido: ' + err.message;
            console.error(this.erro);
        }
    });
  }

  private carregarViagemAtual(pedidoId: string) {
    console.log(`Carregando viagem atual para o pedidoId: ${pedidoId}...`);
    this.viagemService.getViagemPorPedido(pedidoId).subscribe({
        next: (viagem) => {
            console.log('Viagem atual encontrada:', viagem);
            this.viagemAtual = viagem;
            this.erro = null;
        },
        error: (err) => {
            this.erro = 'Erro ao carregar viagem atual: ' + err.message;
            console.error(this.erro);
        }
    });
}

  private carregarTurnoAtual() {
    console.log('Carregando turno atual...');
    const motoristaLogado = this.getMotoristaLogado();
    if (!motoristaLogado) return;

    this.motoristaService.getTurnoAtual(motoristaLogado._id).subscribe({
      next: (turno) => {
        console.log('Turno atual carregado:', turno);
        this.turnoAtual = turno;
        this.erro = null;
      },
      error: (err) => {
        this.erro = 'Erro ao carregar turno: ' + err.message;
        console.error(this.erro);
      }
    });
  }

  private obterTurnoAtual(): string {
    console.log('Obtendo turno atual...');
    return this.turnoAtual?._id || '';
  }

  private getMotoristaLogado(): any {
    console.log('Obtendo motorista logado...');
    const motoristaStr = localStorage.getItem('motoristaLogado');
    const motorista = motoristaStr ? JSON.parse(motoristaStr) : null;
    console.log('Motorista logado:', motorista);
    return motorista;
  }
}