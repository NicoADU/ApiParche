import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userName = 'Usuario';
  avatarUrl = '';
  isLoading = true;
  parches: any[] = [];

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    this.isLoading = true;
    const [user, parches] = await Promise.all([
      firstValueFrom(this.apiService.getCurrentUser()),
      firstValueFrom(this.apiService.getDashboardParches()),
    ]);

    this.userName = user.name || 'Usuario';
    this.avatarUrl = user.avatarUrl || '';
    this.parches = parches;
    this.isLoading = false;
  }
}
