import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService, PedidoCliente } from '../cliente.service';

@Component({
  selector: 'app-cliente-pedir-taxi',
  templateUrl: './cliente-pedir-taxi.component.html',
  styleUrls: ['./cliente-pedir-taxi.component.css'],
  standalone: false
})
export class ClientePedirTaxiComponent {

  constructor(
    private router: Router,
    private clienteService: ClienteService
  ) {}

  onSubmit(event: Event): void {
    event.preventDefault();

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const clienteData: PedidoCliente = {
      cliente: {
        nome: formData.get('nome')?.toString() || '',
        nif: formData.get('nif')?.toString() || '',
        genero: formData.get('genero')?.toString() || '',
      },
      origem: {
        rua: formData.get('origemRua')?.toString() || '',
        cidade: formData.get('origemCidade')?.toString() || ''
      },
      destino: {
        rua: formData.get('destinoRua')?.toString() || '',
        cidade: formData.get('destinoCidade')?.toString() || ''
      },
      nivelConforto: formData.get('nivelConforto')?.toString() === 'luxuoso' ? 'luxuoso' : 'básico',
      numeroPessoas: Number(formData.get('numeroPessoas'))
    };

    console.groupCollapsed('🚖 Pedido de Táxi - Dados Enviados');
    console.table(clienteData);
    console.groupEnd();

    this.clienteService.criarPedido(clienteData).subscribe({
      next: (response) => {
        console.groupCollapsed('✅ Pedido Criado com Sucesso');
        console.log('📦 Resposta do servidor:', response);
        console.groupEnd();

        localStorage.setItem('nifCliente', clienteData.cliente.nif);
        this.router.navigate(['/cliente/pedidos']);
      },
      error: (error) => {
        console.group('❌ Erro ao Criar Pedido');
        console.error('Detalhes do erro:', error);
        console.groupEnd();

        alert('Erro ao criar pedido. Tente novamente.');
      }
    });
  }
}
