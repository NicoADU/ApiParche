import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-create-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './create-plan.component.html',
  styleUrls: ['./create-plan.component.css'],
})
export class CreatePlanComponent {
  parcheId = '';
  focused: Record<string, boolean> = {};
  isLoading = false;
  errorMsg = '';

  plan = {
    title: '', description: '', startDate: '', endDate: '',
    options: [
      { place: '', datetime: '' },
      { place: '', datetime: '' },
      { place: '', datetime: '' },
    ],
  };

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {
    this.parcheId = this.route.snapshot.paramMap.get('parcheId') ?? this.route.snapshot.paramMap.get('id') ?? '';
  }

  addOption() { this.plan.options.push({ place: '', datetime: '' }); }
  removeOption(i: number) { this.plan.options.splice(i, 1); }

  async onCreate() {
    if (!this.plan.title) { this.errorMsg = 'El título es obligatorio.'; return; }
    this.isLoading = true; this.errorMsg = '';
    try {
      await firstValueFrom(this.apiService.createPlan(this.parcheId, this.plan));
      this.router.navigate(['/parche', this.parcheId]);
    } catch (e: any) {
      this.errorMsg = e?.message ?? 'Error al crear el plan.';
    } finally { this.isLoading = false; }
  }
}
