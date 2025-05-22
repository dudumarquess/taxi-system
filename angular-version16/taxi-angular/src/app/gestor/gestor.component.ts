import { Component } from '@angular/core';

@Component({
  selector: 'app-gestor',
  templateUrl: './gestor.component.html',
  styleUrls: ['./gestor.component.css'],
  standalone: false,
})
export class GestorComponent {
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
