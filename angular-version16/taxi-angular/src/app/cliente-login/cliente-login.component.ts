import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'app-cliente-login',
  templateUrl: './cliente-login.component.html',
  styleUrls: ['./cliente-login.component.css'],
  standalone: false
})
export class ClienteLoginComponent {
  constructor(private clienteService: ClienteService, private router: Router) {}

  clientes: any[] = [];
  nifError: string | null = null;
  selecionadoError: string | null = null;
  generalError: string | null = null;
  nomeError: string | null = null;
  generoError: string | null = null;


  onLogin(e: Event): void {
  e.preventDefault();

  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const nome = formData.get('nome')?.toString().trim();
  const nifStr = formData.get('nif')?.toString().trim();
  const genero = formData.get('genero')?.toString().trim();

  this.nomeError = null;
  this.nifError = null;
  this.generoError = null;
  this.generalError = null;

  if (!nome) {
    this.nomeError = 'O campo "Nome" é obrigatório.';
    return;
  }

  if (!nifStr || !/^[0-9]{9}$/.test(nifStr)) {
    this.nifError = 'O campo "NIF" deve conter exatamente 9 dígitos.';
    return;
  }

  if (!genero || (genero !== 'Masculino' && genero !== 'Feminino')) {
      this.generoError = 'O campo "Género" é obrigatório e deve ser "Masculino" ou "Feminino".';
      this.generalError = 'O campo "Género" é obrigatório e deve ser "Masculino" ou "Feminino".';
      return;
    }

  const nif = parseInt(nifStr, 10);

  // Verificar se o cliente já existe ou criar um novo
  this.clienteService.buscarOuCriarCliente({ nome, nif, genero }).subscribe({
    next: (cliente) => {
      console.log('Cliente logado/criado com sucesso:', cliente);
      localStorage.setItem('clienteLogado', JSON.stringify(cliente));
      localStorage.setItem('nifCliente', nif.toString());
      this.router.navigate(['/cliente/pedir-taxi']);
    },
    error: (err) => {
      console.error('Erro ao logar/criar cliente:', err);
      this.generalError = 'Erro ao realizar login. Tente novamente.';
    }
  });
}
}