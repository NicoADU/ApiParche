import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profile = { name: '', program: '', avatarUrl: '' };
  stats = { parches: 4, planes: 12, checkins: 9 };
  focused: Record<string, boolean> = {};
  isLoading = false;
  saved = false;

  constructor(private router: Router, private apiService: ApiService) {}

  async ngOnInit() {
    this.isLoading = true;
    const user = await firstValueFrom(this.apiService.getCurrentUser());
    this.profile = { name: user.name, program: user.program, avatarUrl: user.avatarUrl };
    this.isLoading = false;
  }

  async onSave() {
    this.isLoading = true;
    this.profile = await firstValueFrom(this.apiService.updateProfile(this.profile));
    this.isLoading = false;
    this.saved = true;
    setTimeout(() => (this.saved = false), 3000);
  }

  async onLogout() {
    this.isLoading = true;
    await firstValueFrom(this.apiService.logout());
    this.isLoading = false;
    this.router.navigate(['/login']);
  }
}
