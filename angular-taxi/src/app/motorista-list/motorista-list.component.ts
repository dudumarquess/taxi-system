import { Component , OnInit} from '@angular/core';
import { Motorista } from '../motorista'; 
import { MotoristaService } from '../motorista.service'; 
import { Router } from '@angular/router';


@Component({
    selector: 'app-motorista-list',
    templateUrl: './motorista-list.component.html',
    styleUrls: ['./motorista-list.component.css'],
    standalone: false
})
export class MotoristaListComponent implements OnInit { 
  motoristas: Motorista[] = [];

  constructor(private motoristaService: MotoristaService, private router: Router) {}

  ngOnInit() {
  this.motoristaService.getMotoristas().subscribe(motoristas => { 
    this.motoristas = motoristas || [];
  });
}

  onEdit(motorista: Motorista) {
      this.router.navigate(['/gestor/motoristas/editar', motorista._id])
  }

  onRemove(motorista: Motorista) {
    if (confirm('Tem a certeza que pretende remover este motorista?')) {
      this.motoristaService.deleteMotorista(motorista._id!).subscribe({
        next: () => this.ngOnInit(),
        error: (err) => {
          alert('Não é possível remover este motorista porque já requisitou um turno.');
        }
      });
    }
  }
}
