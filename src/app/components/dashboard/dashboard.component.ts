import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  userName = 'Juan';
  avatarUrl = '';
  isLoading = true;
  parches: any[] = [];

  async ngOnInit() {

    await new Promise(r => setTimeout(r, 1000));
    this.parches = [
      { id: '1', name: 'Los del Bloque 5', memberCount: 8, activePlans: 2, role: 'Owner', coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=200&q=60' },
      { id: '2', name: 'Café Estudiantil', memberCount: 14, activePlans: 1, role: 'Member', coverUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=200&q=60' },
      { id: '3', name: 'Deportes EAFIT', memberCount: 22, activePlans: 0, role: 'Moderator', coverUrl: '' },
    ];
    this.isLoading = false;
  }
}
