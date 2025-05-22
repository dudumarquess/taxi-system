import { Component } from '@angular/core';
import { PrecoService } from '../preco.service';
import { Router } from '@angular/router';
import { Preco } from '../preco';

@Component({
  selector: 'app-preco-form',
  templateUrl: './preco-form.component.html',
  styleUrls: ['./preco-form.component.css'],
  standalone: false,
})
export class PrecoFormComponent {
  niveisConforto = ['básico', 'luxuoso'];

  nivelConfortoError: string | null = null;
  precoPorMinutoError: string | null = null;
  acrescimoNoturnoError: string | null = null;

  constructor(private precoService: PrecoService, private router: Router) {}

  onSubmit(e: Event): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const nivelConforto = formData.get('nivel_conforto');
    const precoPorMinutoStr = formData.get('preco_por_minuto');
    const acrescimoNoturnoStr = formData.get('acrescimo_noturno');

    // Reset error messages
    this.nivelConfortoError = null;
    this.precoPorMinutoError = null;
    this.acrescimoNoturnoError = null;

    // Validation checks
    if (!nivelConforto || (nivelConforto !== 'básico' && nivelConforto !== 'luxuoso')) {
      this.nivelConfortoError = 'Nível de conforto é obrigatório e deve ser "básico" ou "luxuoso".';
      return;
    }

    if (!precoPorMinutoStr) {
      this.precoPorMinutoError = 'Preço por minuto é obrigatório.';
      return;
    }

    const precoPorMinuto = parseFloat(precoPorMinutoStr.toString());
    if (isNaN(precoPorMinuto) || precoPorMinuto <= 0) {
      this.precoPorMinutoError = 'Preço por minuto deve ser maior que 0.';
      return;
    }

    if (!acrescimoNoturnoStr) {
      this.acrescimoNoturnoError = 'Acréscimo noturno é obrigatório.';
      return;
    }

    const acrescimoNoturno = parseFloat(acrescimoNoturnoStr.toString());
    if (isNaN(acrescimoNoturno) || acrescimoNoturno < 0) {
      this.acrescimoNoturnoError = 'Acréscimo noturno deve ser maior ou igual a 0.';
      return;
    }

    // Create the Preco object
    const preco: Preco = {
      nivelConforto: nivelConforto.toString() as 'básico' | 'luxuoso',
      precoPorMinuto: precoPorMinuto,
      acrescimoNoturno: acrescimoNoturno
    };

    // Submit the Preco object
    this.precoService.definirPreco(preco).subscribe(() => {
      this.router.navigate(['gestor/precos']);
    });
  }
}

