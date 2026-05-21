import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ApiService } from '../../services/api.service';

interface ParcheForm {
  name: string;
  description: string;
  coverImageUrl: string;
}

interface CoverSuggestion {
  url: string;
  label: string;
}

@Component({
  selector: 'app-create-parche',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-parche.component.html',
  styleUrls: ['./create-parche.component.css'],
})
export class CreateParcheComponent {
  parche: ParcheForm = { name: '', description: '', coverImageUrl: '' };

  focused: Record<string, boolean> = {};
  isLoading = false;
  errorMessage = '';
  coverPreviewUrl = '';

  suggestedCovers: CoverSuggestion[] = [
    { url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&q=60', label: 'Amigos' },
    { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&q=60', label: 'Montaña' },
    { url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=300&q=60', label: 'Ciudad' },
    { url: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=300&q=60', label: 'Comida' },
    { url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&q=60', label: 'Música' },
  ];

  constructor(private router: Router, private apiService: ApiService) {}

  selectCover(url: string): void {
    this.parche.coverImageUrl = url;
    this.coverPreviewUrl = url;
  }

  onCoverBlur(): void {
    this.focused['coverUrl'] = false;
    if (this.parche.coverImageUrl.startsWith('http')) {
      this.coverPreviewUrl = this.parche.coverImageUrl;
    } else {
      this.coverPreviewUrl = '';
    }
  }

  async onCreate(): Promise<void> {
    if (!this.parche.name.trim()) {
      this.errorMessage = 'El nombre del parche es obligatorio.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const created = await firstValueFrom(this.apiService.createParche(this.parche));
      this.router.navigate(['/parche', created.id]);
    } catch (error: any) {
      this.errorMessage = error?.message ?? 'Error al crear el parche. Intenta de nuevo.';
    } finally {
      this.isLoading = false;
    }
  }
}
