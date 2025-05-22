import { Component, OnInit } from '@angular/core';
import { Preco } from '../preco';
import { PrecoService } from '../preco.service';

@Component({
  selector: 'app-precos-list',
  templateUrl: './precos-list.component.html',
  styleUrls: ['./precos-list.component.css'],
  standalone: false,
})
export class PrecosListComponent implements OnInit {
  precos: Preco[] = [];

  constructor(private precoService: PrecoService) {}

  ngOnInit() {
    this.precoService.listarPrecos().subscribe(response => {
      // Verificando se a resposta é um array
      if (Array.isArray(response)) {
        this.precos = response;
      } else {
        // Se a resposta não for um array, tenta convertê-la para um array com um único item
        this.precos = [response as Preco];
        console.log('Resposta não é um array, convertendo:', this.precos);
      }
    }, error => {
      console.error('Erro ao carregar preços:', error);
    });
  }
}
