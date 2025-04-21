import { Component , OnInit} from '@angular/core';
import { Motorista } from '../motorista'; 
import { MotoristaService } from '../motorista.service'; 


@Component({
    selector: 'app-motorista-list',
    templateUrl: './motorista-list.component.html',
    styleUrls: ['./motorista-list.component.css'],
    standalone: false
})
export class MotoristaListComponent implements OnInit { 
  motoristas: Motorista[] = [];

  constructor(private motoristaService: MotoristaService) {}

  ngOnInit() {
    this.motoristaService.getMotoristas().subscribe(motoristas => { 
      this.motoristas = motoristas.sort((a, b) =>
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
    });
  }
}
