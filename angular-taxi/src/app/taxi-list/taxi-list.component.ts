import { Component , OnInit} from '@angular/core';
import { Taxi } from '../taxi';
import { TaxiService } from '../taxi.service';


@Component({
    selector: 'app-taxi-list',
    templateUrl: './taxi-list.component.html',
    styleUrls: ['./taxi-list.component.css'],
    standalone: false
})
export class TaxiListComponent implements OnInit {
  taxis: Taxi[] = [];

  constructor(private taxiService: TaxiService) {}

  ngOnInit() {
    this.taxiService.getTaxis().subscribe(taxis => {
      this.taxis = taxis.sort((a, b) =>
        new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()
      );
    });
  }
}
