import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrecoService } from '../preco.service';

@Component({
  selector: 'app-calcular-custo-viagem',
  templateUrl: './calcular-custo-viagem.component.html',
  styleUrls: ['./calcular-custo-viagem.component.css'],
  standalone: false
})
export class CalcularCustoViagemComponent {
  custoForm: FormGroup;
  niveisConforto = ['básico', 'luxuoso'];
  custoTotal: string | null = null;

  constructor(private fb: FormBuilder, private precoService: PrecoService) {
    this.custoForm = this.fb.group({
      nivelConforto: ['', Validators.required],
      inicio: ['', Validators.required],
      fim: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.custoForm.valid) {
      this.precoService.calcularCustoViagem(this.custoForm.value).subscribe((response: any) => {
        this.custoTotal = `O custo total da viagem é: €${response.custoTotal}`;
      });
    }
  }
}