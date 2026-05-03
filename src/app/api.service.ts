import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
}

interface CreateParcheRequest {
  Nombre: string;
  Descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly baseUrl = 'http://localhost:5204/api';
  private readonly tokenKey = 'auth_token';

  constructor(private http: HttpClient) {}

  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, dto);
  }

  createParche(dto: CreateParcheRequest): Observable<unknown> {
    return this.http.post(`${this.baseUrl}/parche`, dto, this.getAuthOptions());
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  private getAuthOptions() {
    const token = this.getToken();
    return {
      headers: new HttpHeaders({
        Authorization: token ? `Bearer ${token}` : ''
      })
    };
  }
}
