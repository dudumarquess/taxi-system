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
  latitude: number = 0;
  longitude: number = 0;
  origemRua: string = '';
  origemCidade: string = '';
  origemCodigoPostal: string = '';
  localizacaoError: string | null = null;

  // Propriedades para mensagens de erro
  origemError: string | null = null;
  destinoError: string | null = null;
  generalError: string | null = null;

  constructor(
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.obterLocalizacaoAtual();
  }

  obterLocalizacaoAtual(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Coordenadas obtidas:', { latitude, longitude });

          this.enviarCoordenadasParaBackend(latitude, longitude);
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          this.localizacaoError = 'Não foi possível obter sua localização automaticamente.';
        }
      );
    } else {
      this.localizacaoError = 'Geolocalização não é suportada pelo seu navegador.';
    }
  }

  enviarCoordenadasParaBackend(latitude: number, longitude: number): void {
    this.clienteService.enviarCoordenadas(latitude, longitude).subscribe({
      next: (response) => {
        console.log('Resposta do backend:', response);
        this.origemRua = response.rua;
        this.origemCidade = response.localidade;
        this.origemCodigoPostal = response.codigo_postal;
      },
      error: (error) => {
        console.error('Erro ao enviar coordenadas para o backend:', error);
        this.localizacaoError = 'Erro ao obter endereço a partir das coordenadas.';
      }
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    // Resetar mensagens de erro
    this.origemError = null;
    this.destinoError = null;
    this.generalError = null;

    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const origemRua = formData.get('origemRua') || this.origemRua;
    const origemCidade = formData.get('origemCidade') || this.origemCidade;
    const destinoRua = formData.get('destinoRua');
    const destinoCidade = formData.get('destinoCidade');
    const nivelConforto = formData.get('nivelConforto');
    const numeroPessoas = formData.get('numeroPessoas');

    // Validações
    if (!origemRua || !origemCidade) {
      this.origemError = 'Os campos "Rua" e "Cidade" de origem são obrigatórios.';
      this.generalError = 'Os campos "Rua" e "Cidade" de origem são obrigatórios.';
      return;
    }

    if (!destinoRua || !destinoCidade) {
      this.destinoError = 'Os campos "Rua" e "Cidade" de destino são obrigatórios.';
      this.generalError = 'Os campos "Rua" e "Cidade" de destino são obrigatórios.';
      return;
    }

    if (!nivelConforto || (nivelConforto !== 'luxuoso' && nivelConforto !== 'básico')) {
      this.generalError = 'O campo "Nível de Conforto" é obrigatório e deve ser "luxuoso" ou "básico".';
      return;
    }

    if (!numeroPessoas || isNaN(Number(numeroPessoas)) || Number(numeroPessoas) <= 0) {
      this.generalError = 'O campo "Número de Pessoas" é obrigatório e deve ser um número maior que 0.';
      return;
    }

    // Recuperar dados do cliente logado
    const clienteLogado = localStorage.getItem('clienteLogado');
    if (!clienteLogado) {
      this.generalError = 'Nenhum cliente logado. Faça login novamente.';
      this.router.navigate(['/cliente/login']);
      return;
    }

    const cliente = JSON.parse(clienteLogado);

    // Dados do cliente
    const clienteData: PedidoCliente = {
      cliente: {
        nome: cliente.nome,
        nif: cliente.nif,
        genero: cliente.genero,
      },
      origem: {
        rua: origemRua.toString(),
        cidade: origemCidade.toString(),
      },
      destino: {
        rua: destinoRua.toString(),
        cidade: destinoCidade.toString(),
      },
      nivelConforto: nivelConforto.toString() as 'básico' | 'luxuoso',
      numeroPessoas: Number(numeroPessoas),
    };

    // Enviar pedido ao backend
    this.clienteService.criarPedido(clienteData).subscribe({
      next: (response) => {
        console.log('Pedido criado com sucesso:', response);
        this.router.navigate(['/cliente/pedido']);
      },
      error: (error) => {
        console.error('Erro ao criar pedido:', error);

        // Tratamento de erros com base no backend
        if (error.error && error.error.error) {
          const backendError = error.error.error;

          if (backendError.includes('Endereço de origem inválido')) {
            this.origemError = 'O endereço de origem é inválido ou não encontrado.';
          }
          if (backendError.includes('Endereço de destino inválido')) {
            this.destinoError = 'O endereço de destino é inválido ou não encontrado.';
          }
          if (backendError.includes('Já existe um pedido ativo')) {
            this.generalError = 'Já existe um pedido ativo para este cliente.';
          }
        } else {
          this.generalError = 'Erro ao criar pedido. Tente novamente.';
        }
      },
    });
  }
}