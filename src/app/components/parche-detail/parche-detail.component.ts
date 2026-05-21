import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-parche-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './parche-detail.component.html',
  styleUrls: ['./parche-detail.component.css'],
})
export class ParcheDetailComponent implements OnInit {
  parcheId = '';
  parche: any = null;
  isOwner = true;
  isMod = false;
  codeCopied = false;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.parcheId = this.route.snapshot.paramMap.get('id') ?? '';

    await new Promise(r => setTimeout(r, 800));
    this.parche = {
      name: 'Los del Bloque 5', description: 'El parche de los que siempre quedan para el café post-clase.',
      coverUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70',
      inviteCode: 'BLQ5-2K9X',
      members: [
        { name: 'Juan Restrepo', role: 'Owner', avatarUrl: '' },
        { name: 'Valeria Torres', role: 'Moderator', avatarUrl: '' },
        { name: 'Camilo García', role: 'Member', avatarUrl: '' },
        { name: 'Sofía Mejía', role: 'Member', avatarUrl: '' },
      ],
      plans: [
        { id: 'p1', title: 'Cine del viernes', stateLabel: 'Votando', stateClass: 'voting', dateRange: '23 - 25 May' },
        { id: 'p2', title: 'Asado fin de semestre', stateLabel: 'Borrador', stateClass: 'draft', dateRange: '1 - 5 Jun' },
      ],
    };
  }

  copyCode() {
    navigator.clipboard.writeText(this.parche.inviteCode);
    this.codeCopied = true;
    setTimeout(() => this.codeCopied = false, 2500);
  }
}
