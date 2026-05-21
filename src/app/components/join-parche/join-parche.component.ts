import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-join-parche',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './join-parche.component.html',
  styleUrls: ['./join-parche.component.css'],
})
export class JoinParcheComponent {
  code = '';
  isFocused = false;
  isLoading = false;
  errorMsg = '';
  joined = false;
  joinedParcheName = '';

  onInput() {
    this.errorMsg = '';

    let val = this.code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    if (val.length > 4) val = val.slice(0, 4) + '-' + val.slice(4, 8);
    this.code = val;
  }

  async onJoin() {
    this.isLoading = true; this.errorMsg = '';
    try {

      await new Promise(r => setTimeout(r, 1400));
      this.joinedParcheName = 'Los del Bloque 5';
      this.joined = true;
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'Código inválido o expirado.';
    } finally { this.isLoading = false; }
  }
}
