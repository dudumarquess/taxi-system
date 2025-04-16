import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MotoristaService } from '../motorista.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-motorista-form',
  templateUrl: './motorista-form.component.html',
  styleUrls: ['./motorista-form.component.css']
})
export class MotoristaFormComponent {
  motoristaForm: FormGroup;
  generos = ['masculino', 'feminino'];

  constructor(
    private fb: FormBuilder,
    private motoristaService: MotoristaService,
    private router: Router
  ) {
    this.motoristaForm = this.fb.group({
      nome: ['', Validators.required],
      genero: ['', Validators.required],
      nif: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      anoNascimento: ['', [Validators.required, Validators.min(new Date().getFullYear() - 18)]],
      numeroCartaConducao: ['', Validators.required],
      morada: this.fb.group({
        rua: ['', Validators.required],
        numeroPorta: ['', Validators.required],
        codigoPostal: ['', [Validators.required, Validators.pattern(/^\d{4}-\d{3}$/)]]
      })
    });
  }


  onSubmit() {
    if (this.motoristaForm.valid) {
      this.motoristaService.createMotorista(this.motoristaForm.value).subscribe(() => {
        this.router.navigate(['/motoristas']); // Redireciona para a listagem de motoristas
      });
    } else {
      // Lógica para exibir erros de validação, se necessário
      console.log('Formulário de motorista inválido');
    }
  }
}