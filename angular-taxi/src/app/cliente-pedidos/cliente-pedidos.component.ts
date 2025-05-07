import { Component, OnInit } from '@angular/core';
import {ClienteService, PedidoCliente} from '../cliente.service';

@Component({
  selector: 'app-cliente-pedidos',
  templateUrl: './cliente-pedidos.component.html',
  styleUrls: ['./cliente-pedidos.component.css'],
  standalone: false
})
export class ClientePedidosComponent implements OnInit {

  pedidos: PedidoCliente[] = [];
  nifCliente: string | null = localStorage.getItem('nifCliente'); // Recupera o NIF armazenado no localStorage

  constructor(private clienteService: ClienteService) {}

  ngOnInit(): void {
    if (this.nifCliente) {
      this.clienteService.buscarPedidosPorNif(this.nifCliente).subscribe({
        next: (pedidos) => {
          this.pedidos = pedidos;
        },
        error: (error) => {
          console.error('Erro ao buscar pedidos:', error);
          alert('Erro ao buscar pedidos. Tente novamente.');
        }
      });
    }
  }
}
