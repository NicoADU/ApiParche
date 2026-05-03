import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { ApiService } from '../../api.service';

interface LoginData {
  email: string;
  password: string;
  remember: boolean;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData: LoginData = { email: '', password: '', remember: false };

  showPassword = false;
  emailFocused = false;
  passwordFocused = false;
  isLoading = false;
  errorMessage = '';

  constructor(private router: Router, private apiService: ApiService) {}

  async onLogin(): Promise<void> {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const response = await firstValueFrom(this.apiService.login({
        email: this.loginData.email,
        password: this.loginData.password
      }));

      this.apiService.setToken(response.token);
      this.router.navigate(['/create']);
    } catch (error: any) {
      this.errorMessage = error?.error?.error ?? error?.message ?? 'Error al iniciar sesión. Intenta de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}
