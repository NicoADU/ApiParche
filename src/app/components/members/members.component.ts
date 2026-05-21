import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

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

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  async ngOnInit() {
    this.parcheId = this.route.snapshot.paramMap.get('id') ?? '';
    this.members = await firstValueFrom(this.apiService.getMembers(this.parcheId));
  }

  toggleMenu(member: any) {
    this.members.forEach(m => { if (m !== member) m.menuOpen = false; });
    member.menuOpen = !member.menuOpen;
  }

  async promoteToggle(member: any) {
    const nextRole = member.role === 'Member' ? 'Moderator' : 'Member';
    this.members = await firstValueFrom(this.apiService.updateMemberRole(this.parcheId, member.id, nextRole));
  }

  confirmRemove(member: any) {
    this.confirmTarget = member;
    this.showConfirm = true;
    member.menuOpen = false;
  }

  async removeMember() {
    if (!this.confirmTarget) {
      return;
    }
    this.members = await firstValueFrom(this.apiService.removeMember(this.parcheId, this.confirmTarget.id));
    this.showConfirm = false;
    this.confirmTarget = null;
  }
}
