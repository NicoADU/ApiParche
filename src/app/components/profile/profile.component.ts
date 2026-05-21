import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent {
  profile = { name: 'Juan Restrepo', program: 'Ingeniería de Sistemas', avatarUrl: '' };
  stats = { parches: 4, planes: 12, checkins: 9 };
  focused: Record<string, boolean> = {};
  isLoading = false;
  saved = false;

  constructor(private router: Router) {}

  async onSave() {
    this.isLoading = true;

    await new Promise(r => setTimeout(r, 1000));
    this.isLoading = false;
    this.saved = true;
    setTimeout(() => this.saved = false, 3000);
  }

  onLogout() {

    this.router.navigate(['/login']);
  }
}
