import { Component } from '@angular/core';
import { MotoristaService } from '../motorista.service';
import { PedidoCliente} from "../cliente.service";


@Component({
  selector: 'app-pedidos-pendentes',
  templateUrl: './pedidos-pendentes.component.html',
  styleUrl: './pedidos-pendentes.component.css',
  standalone: false,
})

export class PedidosPendentesComponent {
  pedidos: PedidoCliente[] = [];
  motoristaId: string = ''; // Defina como recuperar o ID do motorista logado
  lat: number = 38.756734;
  lng: number = -9.155412;

  constructor(private motoristaService: MotoristaService) {}
  ngOnInit() {
    // Pegue o ID do motorista logado (exemplo: do localStorage)
    const motorista = localStorage.getItem('motoristaLogado');
    if (motorista) {
      this.motoristaId = JSON.parse(motorista)._id;
    }
    // Tenta pegar localização real
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          this.lat = pos.coords.latitude;
          this.lng = pos.coords.longitude;
          this.carregarPedidos();
        },
        err => this.carregarPedidos()
      );
    } else {
      this.carregarPedidos();
    }
  }

  carregarPedidos() {
    this.motoristaService.listarPedidosPendentes(this.lat, this.lng)
      .subscribe(pedidos =>  this.pedidos = pedidos);
  }


  aceitarPedido(pedidoId: string) {
    this.motoristaService.aceitarPedidoPendente(pedidoId, this.motoristaId)
      .subscribe(() => this.carregarPedidos());
  }

}
