import { Component} from '@angular/core';
import { MotoristaService } from '../motorista.service';
import { Router } from '@angular/router';
import { Motorista } from '../motorista';
import { Morada } from '../morada';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-motorista-form',
  templateUrl: './motorista-form.component.html',
  styleUrls: ['./motorista-form.component.css'],
  standalone: false,
})
export class MotoristaFormComponent {
  generos = ['Masculino', 'Feminino'];

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
  localidade: string | null = null;
  generalError: string | null = null;

  constructor(
    private motoristaService: MotoristaService,
    private router: Router,
    private http: HttpClient
  ) {}

  buscarLocalidade(codigoPostal: string) {
    this.codigoPostalError = null;
    this.generalError = null;
    this.localidadeError = null;

    if(!codigoPostal || !/^\d{4}-\d{3}$/.test(codigoPostal)) {
      this.localidadeError = 'O campo "Código Postal" é obrigatório e deve estar no formato "1234-567"';
      return;
    }
    this.http.get<{localidade: string}>(`http://localhost:3000/localidade/${codigoPostal}`).subscribe((resultado) => {
      this.localidade = resultado.localidade;
    }, (err) => {
      this.localidadeError = 'Não encontrada';
    });
  }

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
  
    

    // Reset error messages
    this.nomeError = null;
    this.generoError = null;
    this.nifError = null;
    this.anoNascimentoError = null;
    this.numeroCartaConducaoError = null;
    this.ruaError = null;
    this.numeroPortaError = null;
    this.codigoPostalError = null;
    this.generalError = null;
  

    // Validation checks
    if (!nome) {
      this.nomeError = 'O campo "Nome" é obrigatório.';
      this.generalError = 'O campo "Nome" é obrigatório.';
  
      return;
    }

    if (!genero || !this.generos.includes(genero.toString())) {
      this.generoError = 'O campo "Género" é obrigatório e deve ser "Masculino" ou "Feminino".';
      this.generalError = 'O campo "Género" é obrigatório e deve ser "Masculino" ou "Feminino".';
      
      return;
    }

    if (!nif || !/^[0-9]{9}$/.test(nif.toString())) {
      this.nifError = 'O campo "NIF" é obrigatório e deve conter exatamente 9 dígitos.';
      this.generalError = 'O campo "NIF" é obrigatório e deve conter exatamente 9 dígitos.';
      return;
    }

    const currentYear = new Date().getFullYear();
    if (!anoNascimento || isNaN(Number(anoNascimento)) || Number(anoNascimento) > currentYear - 18) {
      this.anoNascimentoError = `O campo "Ano de Nascimento" é obrigatório e o motorista deve ter pelo menos 18 anos.`;
      this.generalError = `O campo "Ano de Nascimento" é obrigatório e o motorista deve ter pelo menos 18 anos.`;
      return;
    }

    if (!numeroCartaConducao) {
      this.numeroCartaConducaoError = 'O campo "Número Carta de Condução" é obrigatório.';
      this.generalError = 'O campo "Número Carta de Condução" é obrigatório.';
      return;
    }

    if (!rua) {
      this.ruaError = 'O campo "Rua" é obrigatório.';
      this.generalError = 'O campo "Rua" é obrigatório.';
      return;
    }

    if (!numeroPorta || isNaN(Number(numeroPorta))) {
      this.numeroPortaError = 'O campo "Número da Porta" é obrigatório e deve ser um número.';
      this.generalError = 'O campo "Número da Porta" é obrigatório e deve ser um número.';
      return;
    }

    if (!codigoPostal || !/^\d{4}-\d{3}$/.test(codigoPostal.toString())) {
      this.codigoPostalError = 'O campo "Código Postal" é obrigatório e deve estar no formato "1234-567".';
      this.generalError = 'O campo "Código Postal" é obrigatório e deve estar no formato "1234-567".';
      return;
    }

    const morada: Morada = {
      _id: '', // Default value for _id
      rua: rua.toString(),
      numeroPorta: parseInt(numeroPorta.toString(), 10),
      codigoPostal: codigoPostal.toString(),
      localidade: '', 
    };

    const motorista: Motorista = {
      nome: nome.toString(),
      genero: genero.toString(),
      nif: parseInt(nif.toString(), 10),
      anoNascimento: parseInt(anoNascimento.toString(), 10),
      numeroCartaConducao: numeroCartaConducao.toString(),
      morada: morada,
    };


    this.motoristaService.createMotorista(motorista).subscribe(
      () => {
        // Redireciona para a lista de motoristas em caso de sucesso
        this.router.navigate(['/gestor/motoristas']);
      },
      (error) => {
        // Verifica se o erro é relacionado ao código postal
        if (error.status === 400 && error.error.erro === 'Código postal inválido') {
          this.codigoPostalError = 'Código postal não existente na base de dados. Tente outro.';
          this.generalError = 'Código postal não existente na base de dados. Tente outro.';
        } else if (error.status === 400 && error.error.erro === 'Nif já existe') {
          this.nifError = 'O motorista com este NIF já existe.';
          this.generalError = 'O motorista com este NIF já existe.';
        }  else if (error.status === 400 && error.error.erro === 'carta de condução já existe') {
          this.numeroCartaConducaoError = 'O motorista com este número de carta de condução já existe.';
          this.generalError = 'O motorista com este número de carta de condução já existe.';
        } else {
          // Mensagem genérica para outros erros
          this.generalError = 'Ocorreu um erro ao criar o motorista. Tente novamente.';
        }
        console.error('Erro ao criar motorista:', error);
      }
    );
  }
}