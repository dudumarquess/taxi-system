import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaxiService } from '../taxi.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-taxi-form',
  templateUrl: './taxi-form.component.html',
  styleUrls: ['./taxi-form.component.css']
})
export class TaxiFormComponent {
  taxiForm: FormGroup;
  marcas = ['Toyota', 'Peugeot', 'Renault', 'Dacia', 'Mercedes', 'BMW', 'Volkwswagen']
  modelosPorMarca: { [marca: string]: string[] } = {
    'Toyota': ['Corolla', 'Yaris', 'Prius'],
    'Peugeot': ['208', '2008', '308'],
    'Renault': ['Clio', 'Megane', 'Captur'],
    'Dacia': ['Logan', 'Lodgy', 'Sandero'],
    'Mercedes': ['A250', 'C300', 'G63'],
    'BMW': ['320i', '530e'],
    'Volkswagen': ['Golf', 'Polo', 'Passat']
  };
  
  modelos: string[] = []; // modelos disponíveis no momento

  constructor(
    private fb: FormBuilder,
    private taxiService: TaxiService,
    private router: Router
  ){
    this.taxiForm = this.fb.group({
      matricula: ['', [Validators.required, Validators.pattern("/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/")]],
      marca: ['', Validators.required],
      modelo: ['', Validators.required],
      anoCompra: [new Date().getFullYear(), [Validators.required, Validators.max(new Date().getFullYear())]],
      conforto: ['', Validators.required]
    });
  }
  
  onSubmit() {
    if(this.taxiForm.valid) {
      this.taxiService.createTaxi(this.taxiForm.value).subscribe(() => {
        this.router.navigate(['/taxis'])
      })
    }
  }


  onMarcaChange(): void {
    const marcaSelecionada = this.taxiForm.get('marca')?.value;
    this.modelos = this.modelosPorMarca[marcaSelecionada] || [];
    this.taxiForm.get('modelo')?.setValue(''); // reseta o modelo atual
  }
}
