import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Motorista } from '../motorista';
import { MotoristaService } from '../motorista.service';

@Component({
  selector: 'app-motorista-login',
  templateUrl: './motorista-login.component.html',
  styleUrl: './motorista-login.component.css',
  standalone: false
})
export class MotoristaLoginComponent implements OnInit {
  constructor(private motoristaService: MotoristaService, private router: Router) {}

  motoristaSelecionado: Motorista | null = null;

  nifError: string | null = null;
  selecionadoError: string | null = null;
  generalError: string | null = null;

  motoristas: Motorista[] = [];

  ngOnInit() {
    this.motoristaService.getMotoristas().subscribe(motoristas => {
      this.motoristas = motoristas.sort((a, b) =>
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
    });
  }

  onLogin(e: Event): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const nifStr = formData.get('nif')?.toString().trim();
    const motoristaSelecionadoStr = formData.get('motoristaSelecionado')?.toString().trim();

    this.nifError = null;
    this.selecionadoError = null;
    this.generalError = null;

    let nifFinal: number | null = null;

    if (nifStr) {
      if (!/^[0-9]{9}$/.test(nifStr)) {
        this.nifError = 'O campo "NIF" deve conter exatamente 9 dígitos.';
        this.generalError = 'Informe um NIF válido ou selecione um motorista da lista';
        return;
      }
      nifFinal = parseInt(nifStr, 10);
    } else if (motoristaSelecionadoStr) {
      // Encontra o motorista pelo NIF selecionado no dropdown
      const motoristaEncontrado = this.motoristas.find(m => m.nif.toString() === motoristaSelecionadoStr);
      if (motoristaEncontrado) {
        nifFinal = motoristaEncontrado.nif;
      } else {
        this.selecionadoError = 'Motorista selecionado inválido';
        return;
      }
    } else {
      this.generalError = 'Informe o NIF ou selecione um motorista da lista';
      return;
    }

    const motoristaEncontrado = this.motoristas.find(m => m.nif === nifFinal);

    if (!motoristaEncontrado) {
      this.generalError = 'Motorista não encontrado';
      return;
    }

    localStorage.setItem('motoristaLogado', JSON.stringify(motoristaEncontrado));
    this.motoristaService.loginMotorista(nifFinal.toString()).subscribe({
      next: (motoristaEncontrado) => {
        this.router.navigate(['/motorista']);
      },
      error: (error) => {
        this.generalError = 'Erro ao fazer login. Por favor, tente novamente.';
        console.error('Erro ao fazer login:', error);
      }
    });
  }
}
