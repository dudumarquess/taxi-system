import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClienteService, PedidoCliente } from '../cliente.service';

@Component({
  selector: 'app-cliente-pedidos',
  templateUrl: './cliente-pedidos.component.html',
  styleUrls: ['./cliente-pedidos.component.css'],
  standalone: false
})
export class ClientePedidosComponent implements OnInit, OnDestroy {
  pedido?: PedidoCliente;
  carregou: boolean = false;
  intervalId: any;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    this.buscarPedido();

    // Configurar polling para verificar o status do pedido a cada 5 segundos
    this.intervalId = setInterval(() => {
      this.buscarPedido();
    }, 5000);
  }

  ngOnDestroy(): void {
    // Limpar o intervalo ao destruir o componente
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  buscarPedido(): void {
    const nif = localStorage.getItem('nifCliente');
    if (nif) {
      this.clienteService.buscarPedidoPorNif(nif).subscribe({
        next: (pedido) => {
          this.pedido = pedido;
          this.carregou = true;
          console.log('Pedido recebido do backend:', pedido); 
        },
        error: (error) => {
          console.error('Erro ao buscar pedido:', error);
          this.carregou = true;
        }
      });
    } else {
      console.warn('NIF não encontrado no localStorage');
      this.carregou = true;
    }
  }

  aceitarPedido(): void {
    if (this.pedido && this.pedido._id) {
      this.clienteService.aceitarPedido(this.pedido._id).subscribe({
        next: () => {
          console.log('Pedido aceito pelo cliente.');
          this.buscarPedido(); // Atualizar o pedido após aceitar
        },
        error: (error) => {
          console.error('Erro ao aceitar pedido:', error);
        }
      });
    }
  }

  recusarPedido(): void {
    if (this.pedido && this.pedido._id) {
      this.clienteService.recusarPedido(this.pedido._id).subscribe({
        next: () => {
          console.log('Pedido recusado pelo cliente.');
          this.buscarPedido(); // Atualizar o pedido após recusar
        },
        error: (error) => {
          console.error('Erro ao recusar pedido:', error);
        }
      });
    }
  }

  cancelarPedido(): void {
    if (this.pedido && this.pedido._id) {
      this.clienteService.cancelarPedido(this.pedido._id).subscribe({
        next: () => {
          console.log('Pedido cancelado com sucesso.');
          this.pedido = undefined; // Remover o pedido da interface
          this.carregou = true;
        },
        error: (error) => {
          console.error('Erro ao cancelar pedido:', error);
        }
      });
    } else {
      console.warn('Pedido ou ID do pedido não encontrado.');
    }
  }
}