import { Component , OnInit} from '@angular/core';
import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';
import { Router } from '@angular/router'


@Component({
    selector: 'app-taxi-list',
    templateUrl: './taxi-list.component.html',
    styleUrls: ['./taxi-list.component.css'],
    standalone: false
})
export class TaxiListComponent implements OnInit {
  taxis: Taxi[] = [];

  constructor(private taxiService: TaxiService, private router: Router) {}

  ngOnInit() {
    this.taxiService.getTaxis().subscribe(taxis => {
      this.taxis = taxis || [];
    });
  }

  onEdit(taxi: Taxi) {
    this.router.navigate(['/gestor/taxis/editar', taxi._id])
  }

  onEstatisticas(taxi: Taxi) {
    this.router.navigate(['/gestor/taxis/estatisticas', taxi._id]);
  }

  onRemove(taxi: Taxi) {
    if (confirm('Tem a certeza que pretende remover este taxi?')) {
      this.taxiService.deleteTaxi(taxi._id!).subscribe({
        next: () => this.ngOnInit(),
        error: (err) => {
          alert('Não é possível remover este táxi porque já foi requisitado para um turno.');
        }
      });
    }
  }
}
