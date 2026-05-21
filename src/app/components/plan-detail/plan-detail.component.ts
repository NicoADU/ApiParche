import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { ApiService } from '../../services/api.service';

interface PlanOption {
  id: string;
  place: string;
  datetime: string;
  votes: number;
}

interface AttendanceRecord {
  name: string;
  status: 'Yes' | 'No' | 'Maybe';
}

@Component({
  selector: 'app-plan-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NavbarComponent],
  templateUrl: './plan-detail.component.html',
  styleUrls: ['./plan-detail.component.css'],
})
export class PlanDetailComponent implements OnInit {
  parcheId = '';
  planId = '';
  plan: any = null;
  selectedOptionId = '';
  attendanceChoice: 'Yes' | 'No' | 'Maybe' | '' = '';
  checkedIn = false;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {}

  async ngOnInit() {
    this.parcheId = this.route.snapshot.paramMap.get('parcheId') ?? '';
    this.planId = this.route.snapshot.paramMap.get('planId') ?? '';

    this.plan = await firstValueFrom(this.apiService.getPlanDetail(this.parcheId, this.planId));
  }

  get totalVotes() {
    return this.plan?.options?.reduce((sum: number, option: PlanOption) => sum + option.votes, 0) ?? 0;
  }

  vote(option: PlanOption) {
    this.selectedOptionId = option.id;
  }

  async submitVote() {
    if (!this.selectedOptionId) {
      return;
    }
    const updated = await firstValueFrom(this.apiService.votePlanOption(this.parcheId, this.planId, this.selectedOptionId));
    if (updated) {
      this.plan = updated;
    }
  }

  async changePlanState() {
    const updated = await firstValueFrom(this.apiService.advancePlanState(this.parcheId, this.planId));
    if (updated) {
      this.plan = updated;
    }
  }

  updateAttendance(choice: 'Yes' | 'No' | 'Maybe') {
    this.attendanceChoice = choice;
  }

  async confirmAttendance() {
    if (!this.attendanceChoice) {
      return;
    }
    const updated = await firstValueFrom(this.apiService.updateAttendance(this.parcheId, this.planId, 'Tú', this.attendanceChoice));
    if (updated) {
      this.plan = updated;
      this.attendanceChoice = '';
    }
  }

  async doCheckin() {
    const updated = await firstValueFrom(this.apiService.checkinPlan(this.parcheId, this.planId));
    if (updated) {
      this.checkedIn = true;
    }
  }
}
