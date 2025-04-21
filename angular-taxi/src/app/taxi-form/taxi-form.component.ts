import { Component } from '@angular/core';
import { TaxiService } from '../taxi.service';
import { Router } from '@angular/router';
import { Taxi } from '../taxi';

@Component({
  selector: 'app-taxi-form',
  templateUrl: './taxi-form.component.html',
  styleUrls: ['./taxi-form.component.css'],
  standalone: false
})
export class TaxiFormComponent {
  marcas = ['Toyota', 'Peugeot', 'Renault', 'Dacia', 'Mercedes', 'BMW', 'Volkswagen'];
  modelos: string[] = ['Corolla', 'Yaris', 'Prius', '208', '2008', '308', 'Clio', 'Megane', 'Captur', 'Logan', 'Lodgy', 'Sandero', 'A250', 'C300', 'G63', '320i', '530e', 'Golf', 'Polo', 'Passat'];

  matriculaError: string | null = null;
  marcaError: string | null = null;
  modeloError: string | null = null;
  anoCompraError: string | null = null;
  nivelConfortoError: string | null = null;

  constructor(private taxiService: TaxiService, private router: Router) {}

  onSubmit(e: Event): void {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    let matricula = formData.get('matricula')?.toString().toUpperCase();
    const marca = formData.get('marca');
    const modelo = formData.get('modelo');
    const ano_compra = formData.get('ano_compra');
    const nivel_conforto = formData.get('nivel_conforto');

    // Reset error messages
    this.matriculaError = null;
    this.marcaError = null;
    this.modeloError = null;
    this.anoCompraError = null;
    this.nivelConfortoError = null;

    // Validation checks
    if (!matricula) {
      this.matriculaError = 'Matrícula é obrigatória.';
      return;
    }

    if (!matricula.includes('-')) {
      matricula = matricula.replace(/(.{2})/g, '$1-').slice(0, -1);
    }

    const matriculaPattern = /^([A-Z]{2}|[0-9]{2})-([A-Z]{2}|[0-9]{2})-([A-Z]{2}|[0-9]{2})$/;
    if (!matriculaPattern.test(matricula)) {
      this.matriculaError = 'Matrícula inválida. Deve estar no formato xx-yy-zz, onde cada grupo contém apenas letras ou números.';
      return;
    }

    const containsLetters = /[A-Z]/.test(matricula);
    const containsNumbers = /[0-9]/.test(matricula);
    if (!containsLetters || !containsNumbers) {
      this.matriculaError = 'Matrícula inválida. Deve conter pelo menos uma letra e um número.';
      return;
    }

    if (!marca) {
      this.marcaError = 'Marca é obrigatória.';
      return;
    }

    if (!modelo) {
      this.modeloError = 'Modelo é obrigatório.';
      return;
    }

    const currentYear = new Date().getFullYear();
    if (!ano_compra || isNaN(Number(ano_compra)) || Number(ano_compra) > currentYear) {
      this.anoCompraError = `Ano de compra é obrigatório e deve ser menor ou igual a ${currentYear}.`;
      return;
    }

    if (!nivel_conforto || (nivel_conforto !== 'básico' && nivel_conforto !== 'luxuoso')) {
      this.nivelConfortoError = 'Nível de conforto é obrigatório e deve ser "básico" ou "luxuoso".';
      return;
    }

    // Create the Taxi object
    const taxi: Taxi = {
      matricula: matricula.toString(),
      marca: marca.toString(),
      modelo: modelo.toString(),
      ano_compra: parseInt(ano_compra.toString(), 10),
      nivel_conforto: nivel_conforto.toString() as 'básico' | 'luxuoso',
    };

    // Submit the Taxi object
    this.taxiService.createTaxi(taxi).subscribe(() => {
      this.router.navigate(['/taxis']);
    });
  }
}