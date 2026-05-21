import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css'],
})
export class RankingComponent implements OnInit {
  parcheId = '';
  ranking = [
    { name: 'Valeria Torres', organizer: 12, ghost: 2, score: 78 },
    { name: 'Juan Restrepo', organizer: 9, ghost: 1, score: 72 },
    { name: 'Camilo García', organizer: 6, ghost: 4, score: 58 },
    { name: 'Sofía Mejía', organizer: 3, ghost: 6, score: 44 },
  ];
  stats = {
    organizerScore: 21,
    ghostScore: 7,
    plansScheduled: 13,
    attendanceRate: '84%',
  };

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  async ngOnInit() {
    this.parcheId = this.route.snapshot.paramMap.get('parcheId') ?? '';
    const result = await firstValueFrom(this.apiService.getRanking(this.parcheId));
    this.ranking = result.ranking;
    this.stats = result.stats;
  }
}
