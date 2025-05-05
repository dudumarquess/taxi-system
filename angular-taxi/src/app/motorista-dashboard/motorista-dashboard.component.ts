import { Component } from '@angular/core';

@Component({
  selector: 'app-motorista-dashboard',
  templateUrl: './motorista-dashboard.component.html',
  styleUrl: './motorista-dashboard.component.css',
  standalone: false
})
export class MotoristaDashboardComponent {

  isMenuOpen = false;

  toggleMenu() {
    if(this.isMenuOpen) {
      this.isMenuOpen = false;
    }
    else {
      this.isMenuOpen = true;
    }
  }

}
