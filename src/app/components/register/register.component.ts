import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  form = { name: '', email: '', program: '', password: '', avatarUrl: '' };
  focused: Record<string, boolean> = {};
  showPwd = false;
  isLoading = false;
  errorMsg = '';

  constructor(private router: Router) {}

  async onRegister() {
    if (!this.form.name || !this.form.email || !this.form.password) {
      this.errorMsg = 'Completa los campos obligatorios.'; return;
    }
    this.isLoading = true; this.errorMsg = '';
    try {
      await new Promise(r => setTimeout(r, 1400));
      this.router.navigate(['/home']);
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'Error al registrarse.';
    } finally { this.isLoading = false; }
  }
}
