import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PrecoService, Preco } from '../preco.service';

@Component({
    selector: 'app-preco-form',
    templateUrl: './preco-form.component.html',
    styleUrls: ['./preco-form.component.css'],
    standalone: false
})
export class PrecoFormComponent {
  precoForm: FormGroup;
  niveisConforto = ['básico', 'luxuoso'];

  constructor(private fb: FormBuilder, private precoService: PrecoService) {
    this.precoForm = this.fb.group({
      nivelConforto: ['', Validators.required],
      precoPorMinuto: [0, [Validators.required, Validators.min(0.01)]],
      acrescimoNoturno: [0, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit() {
    if (this.precoForm.valid) {
      const preco: Preco = this.precoForm.value;
      this.precoService.definirPreco(preco).subscribe(() => {
        alert('Preço definido com sucesso!');
      });
    }
  }
}
