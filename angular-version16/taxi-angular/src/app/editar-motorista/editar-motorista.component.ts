import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MotoristaService } from '../motorista.service';
import { Motorista } from '../motorista';
import { Morada } from '../morada';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-editar-motorista',
  templateUrl: './editar-motorista.component.html',
  styleUrls: ['./editar-motorista.component.css'],
  standalone: false,
})
export class EditarMotoristaComponent {
  motoristaId: string = '';
  motorista: Motorista = {
    nome: '',
    genero: '',
    nif: 0,
    anoNascimento: 0,
    numeroCartaConducao: '',
    morada: {
      _id: '',
      rua: '',
      numeroPorta: 0,
      codigoPostal: '',
      localidade: '',
    }
  };

  generos = ['Masculino', 'Feminino'];

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
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.motoristaId = this.route.snapshot.paramMap.get('id')!;
    this.motoristaService.getMotoristaById(this.motoristaId).subscribe((data) =>{
      this.motorista = data;
      this.localidade = data.morada.localidade;
    });
  }

  buscarLocalidade(codigoPostal: string) {
    this.codigoPostalError = null;
    this.generalError = null;
    this.localidadeError = null;

    if(!codigoPostal || !/^\d{4}-\d{3}$/.test(codigoPostal)) {
      this.localidadeError = 'O campo "Código Postal" é obrigatório e deve estar no formato "1234-567"';
      return;
    }
    this.http.get<{localidade: string}>(`http://appserver.alunos.di.fc.ul.pt:3074/localidade/${codigoPostal}`).subscribe((resultado) => {
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
      _id: this.motorista.morada._id || '',
      rua: rua.toString(),
      numeroPorta: parseInt(numeroPorta.toString(), 10),
      codigoPostal: codigoPostal.toString(),
      localidade: this.localidade || '',
    };

    const motorista: Motorista = {
      nome: nome.toString(),
      genero: genero.toString(),
      nif: parseInt(nif.toString(), 10),
      anoNascimento: parseInt(anoNascimento.toString(), 10),
      numeroCartaConducao: numeroCartaConducao.toString(),
      morada: morada,
    };

    this.motoristaService.editMotorista(this.motoristaId, motorista).subscribe(
      () => {
        this.router.navigate(['/gestor/motoristas']);
      },
      (error) => {
        if (error.status === 400 && error.error.erro === 'Código postal inválido') {
          this.codigoPostalError = 'Código postal não existente na base de dados. Tente outro.';
          this.generalError = 'Código postal não existente na base de dados. Tente outro.';
        } else if (error.status === 400 && error.error.erro === 'Nif já existe') {
          this.nifError = 'O motorista com este NIF já existe.';
          this.generalError = 'O motorista com este NIF já existe.';
        } else if (error.status === 400 && error.error.erro === 'Carta de condução já existe') {
          this.numeroCartaConducaoError = 'O motorista com este número de carta de condução já existe.';
          this.generalError = 'O motorista com este número de carta de condução já existe.';
        } else {
          this.generalError = 'Ocorreu um erro ao editar o motorista. Tente novamente.';
        }
        console.error('Erro ao editar motorista:', error);
      }
    );
  }
}
