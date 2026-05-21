import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

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
  isOwner = false;
  isMod = false;
  codeCopied = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  async ngOnInit() {
    this.parcheId = this.route.snapshot.paramMap.get('id') ?? '';
    this.parche = await firstValueFrom(this.apiService.getParcheDetail(this.parcheId));
    if (this.parche) {
      this.isOwner = this.parche.role === 'Owner';
      this.isMod = this.parche.role === 'Moderator';
    }
  }

  copyCode() {
    if (!this.parche?.inviteCode) {
      return;
    }
    navigator.clipboard.writeText(this.parche.inviteCode);
    this.codeCopied = true;
    setTimeout(() => (this.codeCopied = false), 2500);
  }
}
