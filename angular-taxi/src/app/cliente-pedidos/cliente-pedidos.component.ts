import { Component, OnInit } from '@angular/core';
import {ClienteService, PedidoCliente} from '../cliente.service';

@Component({
  selector: 'app-cliente-pedidos',
  templateUrl: './cliente-pedidos.component.html',
  styleUrls: ['./cliente-pedidos.component.css'],
  standalone: false
})
export class ClientePedidosComponent implements OnInit {
  pedido?: PedidoCliente;
  carregou: boolean = false;

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    const nif = localStorage.getItem('nifCliente');
    if (nif) {
      this.clienteService.buscarPedidoPorNif(nif).subscribe({
        next: (pedido) => {  // TypeScript infere o tipo automaticamente agora
          this.pedido = pedido;
          this.carregou = true;
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
}
