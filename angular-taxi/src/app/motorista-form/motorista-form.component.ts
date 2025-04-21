import { Component } from '@angular/core';
import { MotoristaService } from '../motorista.service';
import { Router } from '@angular/router';
import { Motorista } from '../motorista';
import { Morada } from '../morada';

@Component({
  selector: 'app-motorista-form',
  templateUrl: './motorista-form.component.html',
  styleUrls: ['./motorista-form.component.css'],
  standalone: false,
})
export class MotoristaFormComponent {
  generos = ['masculino', 'feminino'];

  // Error properties
  nomeError: string | null = null;
  generoError: string | null = null;
  nifError: string | null = null;
  anoNascimentoError: string | null = null;
  numeroCartaConducaoError: string | null = null;
  ruaError: string | null = null;
  numeroPortaError: string | null = null;
  codigoPostalError: string | null = null;
  localidadeError: string | null = null;

  constructor(
    private motoristaService: MotoristaService,
    private router: Router
  ) {}

  onSubmit(e: Event): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const nome = formData.get('nome');
    const genero = formData.get('genero');
    const nif = formData.get('nif');
    const anoNascimento = formData.get('anoNascimento');
    const numeroCartaConducao = formData.get('numeroCartaConducao');
    const rua = formData.get('rua');
    const numeroPorta = formData.get('numeroPorta');
    const codigoPostal = formData.get('codigoPostal');
    const localidade = formData.get('localidade');

    // Reset error messages
    this.nomeError = null;
    this.generoError = null;
    this.nifError = null;
    this.anoNascimentoError = null;
    this.numeroCartaConducaoError = null;
    this.ruaError = null;
    this.numeroPortaError = null;
    this.codigoPostalError = null;
    this.localidadeError = null;

    // Validation checks
    if (!nome) {
      this.nomeError = 'O campo "Nome" é obrigatório.';
      return;
    }

    if (!genero || !this.generos.includes(genero.toString())) {
      this.generoError = 'O campo "Género" é obrigatório e deve ser "masculino" ou "feminino".';
      return;
    }

    if (!nif || !/^[0-9]{9}$/.test(nif.toString())) {
      this.nifError = 'O campo "NIF" é obrigatório e deve conter exatamente 9 dígitos.';
      return;
    }

    const currentYear = new Date().getFullYear();
    if (!anoNascimento || isNaN(Number(anoNascimento)) || Number(anoNascimento) > currentYear - 18) {
      this.anoNascimentoError = `O campo "Ano de Nascimento" é obrigatório e o motorista deve ter pelo menos 18 anos.`;
      return;
    }

    if (!numeroCartaConducao) {
      this.numeroCartaConducaoError = 'O campo "Número Carta de Condução" é obrigatório.';
      return;
    }

    if (!rua) {
      this.ruaError = 'O campo "Rua" é obrigatório.';
      return;
    }

    if (!numeroPorta || isNaN(Number(numeroPorta))) {
      this.numeroPortaError = 'O campo "Número da Porta" é obrigatório e deve ser um número.';
      return;
    }

    if (!codigoPostal || !/^\d{4}-\d{3}$/.test(codigoPostal.toString())) {
      this.codigoPostalError = 'O campo "Código Postal" é obrigatório e deve estar no formato "1234-567".';
      return;
    }

    if (!localidade) {
      this.localidadeError = 'O campo "Localidade" é obrigatório.';
      return;
    }


    const morada: Morada = {
      _id: '', // Default value for _id
      rua: rua.toString(),
      numeroPorta: parseInt(numeroPorta.toString(), 10),
      codigoPostal: codigoPostal.toString(),
      localidade: localidade.toString(),
    };

    const motorista: Motorista = {
      nome: nome.toString(),
      genero: genero.toString(),
      nif: parseInt(nif.toString(), 10),
      anoNascimento: parseInt(anoNascimento.toString(), 10),
      numeroCartaConducao: parseInt(numeroCartaConducao.toString(), 10),
      morada: morada,
    };

    this.motoristaService.createMotorista(motorista).subscribe(() => {
      this.router.navigate(['/motoristas']);
    });
  }
}