import { Component } from '@angular/core';

@Component({
  selector: 'app-cliente-dashboard',
  templateUrl: './cliente-dashboard.component.html',
  styleUrl: './cliente-dashboard.component.css',
  standalone: false

})
export class ClienteDashboardComponent {
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
