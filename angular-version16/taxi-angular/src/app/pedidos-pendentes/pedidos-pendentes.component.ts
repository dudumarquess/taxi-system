import { Component } from '@angular/core';
import { MotoristaService } from '../motorista.service';
import { PedidoCliente} from "../cliente.service";
import {Turno} from "../turno";
import {Observable} from "rxjs";


@Component({
  selector: 'app-pedidos-pendentes',
  templateUrl: './pedidos-pendentes.component.html',
  styleUrls: ['./pedidos-pendentes.component.css'],
  standalone: false,
})

export class PedidosPendentesComponent {
  pedidos: PedidoCliente[] = [];
  motoristaId: string = '';
  turno: Turno | undefined;
  lat: number = 38.756734;
  lng: number = -9.155412;

  constructor(private motoristaService: MotoristaService) {
  }
  ngOnInit() {
    const motorista = localStorage.getItem('motoristaLogado');
    if (motorista) {
      this.motoristaId = JSON.parse(motorista)._id;
    }
    this.motoristaService.getTurnoAtual(this.motoristaId).subscribe({
      next: (turno) => {
        this.turno = turno;
        console.log(turno);
      }
    });
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

    console.log(this.pedidos);
  }


  carregarPedidos() {
    this.motoristaService.listarPedidosPendentes(this.lat, this.lng, this.motoristaId)
      .subscribe(pedidos =>  this.pedidos = pedidos);
  }


  aceitarPedido(pedidoId: string) {
    this.motoristaService.aceitarPedidoPendente(pedidoId, this.motoristaId)
      .subscribe(() => this.carregarPedidos());
  }


}
