import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.css'],
})
export class MembersComponent implements OnInit {
  parcheId = '';
  members: any[] = [];
  showConfirm = false;
  confirmTarget: any = null;

  constructor(private route: ActivatedRoute) {}

  async ngOnInit() {
    this.parcheId = this.route.snapshot.paramMap.get('id') ?? '';
    this.members = [
      { id: '1', name: 'Juan Restrepo', program: 'Ing. Sistemas', role: 'Owner', avatarUrl: '', menuOpen: false },
      { id: '2', name: 'Valeria Torres', program: 'Diseño Gráfico', role: 'Moderator', avatarUrl: '', menuOpen: false },
      { id: '3', name: 'Camilo García', program: 'Administración', role: 'Member', avatarUrl: '', menuOpen: false },
      { id: '4', name: 'Sofía Mejía', program: 'Psicología', role: 'Member', avatarUrl: '', menuOpen: false },
    ];
  }

  toggleMenu(member: any) {
    this.members.forEach(m => { if (m !== member) m.menuOpen = false; });
    member.menuOpen = !member.menuOpen;
  }

  promoteToggle(member: any) {
    member.role = member.role === 'Member' ? 'Moderator' : 'Member';
    member.menuOpen = false;
  }

  confirmRemove(member: any) {
    this.confirmTarget = member;
    this.showConfirm = true;
    member.menuOpen = false;
  }

  removeMember() {
    this.members = this.members.filter(m => m !== this.confirmTarget);
    this.showConfirm = false;
    this.confirmTarget = null;
  }
}
