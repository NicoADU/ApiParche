import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';

interface User {
  id: string;
  name: string;
  email: string;
  program: string;
  avatarUrl: string;
  role: 'Owner' | 'Moderator' | 'Member';
}

interface PlanSummary {
  id: string;
  title: string;
  state: 'Draft' | 'VotingOpen' | 'VotingClosed' | 'Scheduled';
  stateLabel: string;
  stateClass: string;
  dateRange: string;
}

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

interface PlanDetail extends PlanSummary {
  description: string;
  options: PlanOption[];
  attendance: AttendanceRecord[];
  checkinWindow: string;
  ownerMode: boolean;
  winnerNote: string;
}

interface Parche {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  memberCount: number;
  activePlans: number;
  role: 'Owner' | 'Moderator' | 'Member';
  inviteCode: string;
  members: User[];
  plans: PlanSummary[];
}

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:5204/api';
  private readonly tokenKey = 'apiParcheToken';
  private token: string | null = null;
  private currentUser: User | null = null;

  private planDetails: Record<string, PlanDetail> = {
    p1: {
      id: 'p1',
      title: 'Cine del viernes',
      description: 'Escoge la mejor opción de hora y lugar para ir al cine después de clases.',
      state: 'VotingOpen',
      stateLabel: 'Votación abierta',
      stateClass: 'voting',
      dateRange: '23 - 25 May',
      options: [
        { id: 'o1', place: 'Parque Lleras', datetime: '2026-05-23 18:30', votes: 9 },
        { id: 'o2', place: 'Museo del Oro', datetime: '2026-05-24 16:00', votes: 7 },
        { id: 'o3', place: 'Cafetería Central', datetime: '2026-05-25 19:00', votes: 4 },
      ],
      attendance: [
        { name: 'Juan Restrepo', status: 'Yes' },
        { name: 'Valeria Torres', status: 'Maybe' },
        { name: 'Camilo García', status: 'No' },
      ],
      checkinWindow: '23 May · 18:15 - 18:45',
      ownerMode: true,
      winnerNote: 'La opción con más votos lidera y se tomará como favorita. Si hay empate, gana la más temprana.',
    },
    p2: {
      id: 'p2',
      title: 'Asado fin de semestre',
      description: 'Propón y vota el mejor día para celebrar el cierre del semestre.',
      state: 'Draft',
      stateLabel: 'Borrador',
      stateClass: 'draft',
      dateRange: '1 - 5 Jun',
      options: [
        { id: 'o4', place: 'Casa de Juan', datetime: '2026-06-01 20:00', votes: 0 },
        { id: 'o5', place: 'Parqueadero U', datetime: '2026-06-03 19:30', votes: 0 },
        { id: 'o6', place: 'Canchas del campus', datetime: '2026-06-05 18:00', votes: 0 },
      ],
      attendance: [],
      checkinWindow: '01 Jun · 19:45 - 20:15',
      ownerMode: true,
      winnerNote: 'La opción con más votos lidera y se tomará como favorita. Si hay empate, gana la más temprana.',
    },
    p3: {
      id: 'p3',
      title: 'Tour por la ciudad',
      description: 'Decidamos juntos el mejor recorrido para el tour cultural.',
      state: 'VotingClosed',
      stateLabel: 'Votación cerrada',
      stateClass: 'voting',
      dateRange: '28 May',
      options: [
        { id: 'o7', place: 'Plaza Mayor', datetime: '2026-05-28 10:00', votes: 12 },
        { id: 'o8', place: 'Museo Antropológico', datetime: '2026-05-28 12:00', votes: 8 },
        { id: 'o9', place: 'Café Central', datetime: '2026-05-28 15:00', votes: 5 },
      ],
      attendance: [
        { name: 'Camilo García', status: 'Yes' },
      ],
      checkinWindow: '28 May · 09:45 - 10:15',
      ownerMode: false,
      winnerNote: 'La opción con más votos lidera y se tomará como favorita. Si hay empate, gana la más temprana.',
    },
    p4: {
      id: 'p4',
      title: 'Paseo al lago',
      description: 'Un viaje tranquilo al lago para terminar la semana con buena energía.',
      state: 'VotingClosed',
      stateLabel: 'Votación cerrada',
      stateClass: 'voting',
      dateRange: '30 May',
      options: [
        { id: 'o10', place: 'Lago Verde', datetime: '2026-05-30 09:00', votes: 10 },
        { id: 'o11', place: 'Lago Azul', datetime: '2026-05-30 11:00', votes: 6 },
        { id: 'o12', place: 'Lago del Bosque', datetime: '2026-05-30 13:00', votes: 4 },
      ],
      attendance: [
        { name: 'Juan Restrepo', status: 'Yes' },
        { name: 'Sofía Mejía', status: 'Maybe' },
      ],
      checkinWindow: '30 May · 08:30 - 09:00',
      ownerMode: true,
      winnerNote: 'La opción con más votos lidera y se tomará como favorita. Si hay empate, gana la más temprana.',
    },
    p5: {
      id: 'p5',
      title: 'Maratón de series',
      description: 'Juntémonos para ver nuestras series favoritas y votar por el próximo maratón.',
      state: 'Scheduled',
      stateLabel: 'Agendado',
      stateClass: 'scheduled',
      dateRange: '26 May',
      options: [
        { id: 'o13', place: 'Casa de Juan', datetime: '2026-05-26 18:00', votes: 18 },
      ],
      attendance: [
        { name: 'Valeria Torres', status: 'Yes' },
        { name: 'Ana Mosquera', status: 'Yes' },
      ],
      checkinWindow: '26 May · 17:45 - 18:15',
      ownerMode: true,
      winnerNote: 'Opción confirmada y lista para el plan.',
    },
    p6: {
      id: 'p6',
      title: 'Quedada en la biblioteca',
      description: 'Una sesión de estudio colectivo con snacks y tiempos de repaso.',
      state: 'Scheduled',
      stateLabel: 'Agendado',
      stateClass: 'scheduled',
      dateRange: '24 May',
      options: [
        { id: 'o14', place: 'Biblioteca Central', datetime: '2026-05-24 16:00', votes: 14 },
      ],
      attendance: [
        { name: 'Nicolás Rojas', status: 'Yes' },
        { name: 'Sofía Mejía', status: 'Yes' },
      ],
      checkinWindow: '24 May · 15:30 - 16:00',
      ownerMode: true,
      winnerNote: 'Sesión confirmada para repasar juntos.',
    },
    p7: {
      id: 'p7',
      title: 'Desayuno universitario',
      description: 'Un desayuno para arrancar el día con energía antes de clases.',
      state: 'Scheduled',
      stateLabel: 'Agendado',
      stateClass: 'scheduled',
      dateRange: '27 May',
      options: [
        { id: 'o15', place: 'Cafetería El Faro', datetime: '2026-05-27 08:00', votes: 15 },
      ],
      attendance: [
        { name: 'Laura Mejía', status: 'Yes' },
        { name: 'Diego Arango', status: 'Yes' },
      ],
      checkinWindow: '27 May · 07:30 - 08:00',
      ownerMode: false,
      winnerNote: 'Desayuno confirmado para el grupo.',
    },
    p8: {
      id: 'p8',
      title: 'Estudio en grupo',
      description: 'Organiza una sesión para preparar los parciales juntos.',
      state: 'VotingOpen',
      stateLabel: 'Votación abierta',
      stateClass: 'voting',
      dateRange: '25 - 26 May',
      options: [
        { id: 'o16', place: 'Salón de estudio A', datetime: '2026-05-25 17:00', votes: 9 },
        { id: 'o17', place: 'Sala de estudio B', datetime: '2026-05-26 16:00', votes: 7 },
      ],
      attendance: [],
      checkinWindow: '25 May · 16:30 - 17:00',
      ownerMode: false,
      winnerNote: 'Vota la mejor hora para estudiar en grupo.',
    },
    p9: {
      id: 'p9',
      title: 'Noche de trivia',
      description: 'Prepara tu equipo para la noche de preguntas y premios.',
      state: 'Draft',
      stateLabel: 'Borrador',
      stateClass: 'draft',
      dateRange: '3 Jun',
      options: [
        { id: 'o18', place: 'Salón Cultural', datetime: '2026-06-03 19:00', votes: 0 },
        { id: 'o19', place: 'Cafetería Campus', datetime: '2026-06-03 20:00', votes: 0 },
      ],
      attendance: [],
      checkinWindow: '03 Jun · 18:30 - 19:00',
      ownerMode: false,
      winnerNote: 'Define la mejor ubicación para la trivia.',
    },
    p10: {
      id: 'p10',
      title: 'Tour de cafecitos',
      description: 'Una ruta de cafés del campus para probar nuevas opciones.',
      state: 'Scheduled',
      stateLabel: 'Agendado',
      stateClass: 'scheduled',
      dateRange: '29 May',
      options: [
        { id: 'o20', place: 'Café Verde', datetime: '2026-05-29 10:30', votes: 11 },
      ],
      attendance: [
        { name: 'Catalina Pérez', status: 'Yes' },
      ],
      checkinWindow: '29 May · 10:00 - 10:30',
      ownerMode: false,
      winnerNote: 'Ruta confirmada para disfrutar el café.',
    },
    p11: {
      id: 'p11',
      title: 'Partido de fútbol',
      description: 'Organiza el equipo y la cancha para el próximo partido amistoso.',
      state: 'VotingClosed',
      stateLabel: 'Votación cerrada',
      stateClass: 'voting',
      dateRange: '26 May',
      options: [
        { id: 'o21', place: 'Cancha A', datetime: '2026-05-26 17:00', votes: 13 },
        { id: 'o22', place: 'Cancha B', datetime: '2026-05-26 18:30', votes: 9 },
      ],
      attendance: [
        { name: 'Diego Arango', status: 'Maybe' },
      ],
      checkinWindow: '26 May · 16:30 - 17:00',
      ownerMode: true,
      winnerNote: 'Partido listo para agendarse tras votación.',
    },
    p12: {
      id: 'p12',
      title: 'Caminata matutina',
      description: 'Una caminata ligera para activar el cuerpo antes del día.',
      state: 'VotingOpen',
      stateLabel: 'Votación abierta',
      stateClass: 'voting',
      dateRange: '24 May',
      options: [
        { id: 'o23', place: 'Parque del Río', datetime: '2026-05-24 07:00', votes: 8 },
        { id: 'o24', place: 'Sendero Verde', datetime: '2026-05-24 08:00', votes: 5 },
      ],
      attendance: [],
      checkinWindow: '24 May · 06:30 - 07:00',
      ownerMode: true,
      winnerNote: 'Vota el mejor punto de partida para la caminata.',
    },
    p13: {
      id: 'p13',
      title: 'Yoga en el parque',
      description: 'Una sesión de yoga para relajar cuerpo y mente al aire libre.',
      state: 'Draft',
      stateLabel: 'Borrador',
      stateClass: 'draft',
      dateRange: '31 May',
      options: [
        { id: 'o25', place: 'Parque Central', datetime: '2026-05-31 08:00', votes: 0 },
        { id: 'o26', place: 'Jardines del campus', datetime: '2026-05-31 09:30', votes: 0 },
      ],
      attendance: [],
      checkinWindow: '31 May · 07:30 - 08:00',
      ownerMode: true,
      winnerNote: 'Prepara la sesión de yoga en el mejor sitio.',
    },
    p14: {
      id: 'p14',
      title: 'Duelo de baloncesto',
      description: 'Organiza equipos y cancha para un duelo amistoso.',
      state: 'Scheduled',
      stateLabel: 'Agendado',
      stateClass: 'scheduled',
      dateRange: '30 May',
      options: [
        { id: 'o27', place: 'Cancha de Baloncesto', datetime: '2026-05-30 19:00', votes: 16 },
      ],
      attendance: [
        { name: 'Nicolás Rojas', status: 'Yes' },
        { name: 'Diego Arango', status: 'Yes' },
      ],
      checkinWindow: '30 May · 18:30 - 19:00',
      ownerMode: true,
      winnerNote: 'Partido agendado y listo para jugar.',
    },
  };

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem(this.tokenKey);
    if (this.token) {
      this.fetchCurrentUser().subscribe({
        next: (user) => (this.currentUser = user),
        error: () => this.clearSession(),
      });
    }
  }

  private authOptions() {
    const headers = this.token ? new HttpHeaders({ Authorization: `Bearer ${this.token}` }) : new HttpHeaders();
    return { headers };
  }

  private handleError(error: any) {
    const serverMessage = error?.error?.error || error?.message || 'Error inesperado';
    return throwError(() => new Error(serverMessage));
  }

  private mapUser(payload: any): User {
    return {
      id: payload.id,
      name: payload.nombre || payload.name || '',
      email: payload.email || '',
      program: payload.programa || payload.program || '',
      avatarUrl: payload.urlAvatar || payload.avatarUrl || '',
      role: payload.role || 'Member',
    };
  }

  private mapParche(payload: any): Parche {
    const currentUserId = this.currentUser?.id;
    const ownerId = payload.ownerId?.toString?.() ?? payload.OwnerId?.toString?.() ?? '';
    return {
      id: payload.id,
      name: payload.nombre || payload.name || 'Parche',
      description: payload.descripcion || payload.description || '',
      coverUrl: payload.imagenPortada || payload.coverUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70',
      memberCount: (payload.members?.length ?? 0) as number,
      activePlans: 0,
      role: currentUserId === ownerId ? 'Owner' : 'Member',
      inviteCode: payload.codigoInvitacion || payload.inviteCode || '',
      members: [],
      plans: [],
    };
  }

  private normalizeRole(value: string | undefined): User['role'] {
    if (value === 'Owner') {
      return 'Owner';
    }
    if (value === 'Moderator') {
      return 'Moderator';
    }
    return 'Member';
  }

  private storeToken(token: string) {
    this.token = token;
    localStorage.setItem(this.tokenKey, token);
  }

  private clearSession() {
    this.token = null;
    this.currentUser = null;
    localStorage.removeItem(this.tokenKey);
  }

  private fetchCurrentUser(): Observable<User> {
    return this.http.get<any>(`${this.apiUrl}/auth/me`, this.authOptions()).pipe(
      map((payload) => {
        const user = this.mapUser(payload);
        this.currentUser = user;
        return user;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response) => this.storeToken(response.token)),
      switchMap(() => this.fetchCurrentUser()),
      catchError((err) => this.handleError(err))
    );
  }

  register(data: { name: string; email: string; program: string; password: string; avatarUrl: string }): Observable<User> {
    const payload = {
      nombre: data.name,
      email: data.email,
      programa: data.program,
      password: data.password,
      urlAvatar: data.avatarUrl || null,
    };

    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/register`, payload).pipe(
      tap((response) => this.storeToken(response.token)),
      switchMap(() => this.fetchCurrentUser()),
      catchError((err) => this.handleError(err))
    );
  }

  logout(): Observable<boolean> {
    this.clearSession();
    return of(true);
  }

  getCurrentUser(): Observable<User> {
    if (this.currentUser) {
      return of(this.currentUser);
    }
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }
    return this.fetchCurrentUser();
  }

  updateProfile(profile: Partial<User>): Observable<User> {
    this.currentUser = { ...this.currentUser, ...profile } as User;
    return of(this.currentUser);
  }

  getDashboardParches(): Observable<Parche[]> {
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.get<any[]>(`${this.apiUrl}/parche/mine`, this.authOptions()).pipe(
      map((payload) => payload.map((item) => this.mapParche(item))),
      catchError((err) => this.handleError(err))
    );
  }

  createParche(data: { name: string; description: string; coverImageUrl: string }): Observable<Parche> {
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const payload = {
      nombre: data.name,
      descripcion: data.description,
    };

    return this.http.post<any>(`${this.apiUrl}/parche`, payload, this.authOptions()).pipe(
      map((result) => this.mapParche(result)),
      catchError((err) => this.handleError(err))
    );
  }

  joinParche(code: string): Observable<Parche> {
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const payload = {
      codigoInvitacion: code.replace(/\s+/g, '').toUpperCase(),
    };

    return this.http.post<{ message: string }>(`${this.apiUrl}/parche/join`, payload, this.authOptions()).pipe(
      switchMap(() => this.http.get<any[]>(`${this.apiUrl}/parche/mine`, this.authOptions())),
      map((parches) => {
        const joined = parches.map((item) => this.mapParche(item)).find((item) => item.inviteCode === payload.codigoInvitacion);
        if (!joined) {
          throw new Error('No se pudo encontrar el parche después de unirse');
        }
        return joined;
      }),
      catchError((err) => this.handleError(err))
    );
  }

  getParcheDetail(parcheId: string): Observable<Parche | null> {
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.get<any>(`${this.apiUrl}/parche/${parcheId}`, this.authOptions()).pipe(
      map((item) => this.mapParche(item)),
      catchError((err) => this.handleError(err))
    );
  }

  getMembers(parcheId: string): Observable<User[]> {
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.get<any[]>(`${this.apiUrl}/parche/${parcheId}/members`, this.authOptions()).pipe(
      map((members) =>
        members.map((member) => ({
          id: member.id,
          name: member.nombre,
          email: member.email,
          program: member.programa,
          avatarUrl: member.urlAvatar || '',
          role: this.normalizeRole(member.role),
        }))
      ),
      catchError((err) => this.handleError(err))
    );
  }

  updateMemberRole(parcheId: string, memberId: string, role: 'Owner' | 'Moderator' | 'Member'): Observable<User[]> {
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.put<any[]>(`${this.apiUrl}/parche/${parcheId}/members/${memberId}`, { role }, this.authOptions()).pipe(
      map((members) =>
        members.map((member) => ({
          id: member.id,
          name: member.nombre,
          email: member.email,
          program: member.programa,
          avatarUrl: member.urlAvatar || '',
          role: this.normalizeRole(member.role),
        }))
      ),
      catchError((err) => this.handleError(err))
    );
  }

  removeMember(parcheId: string, memberId: string): Observable<User[]> {
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    return this.http.delete<any[]>(`${this.apiUrl}/parche/${parcheId}/members/${memberId}`, this.authOptions()).pipe(
      map((members) =>
        members.map((member) => ({
          id: member.id,
          name: member.nombre,
          email: member.email,
          program: member.programa,
          avatarUrl: member.urlAvatar || '',
          role: this.normalizeRole(member.role),
        }))
      ),
      catchError((err) => this.handleError(err))
    );
  }

  createPlan(parcheId: string, plan: { title: string; description: string; startDate: string; endDate: string; options: { place: string; datetime: string }[] }): Observable<PlanSummary> {
    if (!this.token) {
      return throwError(() => new Error('Usuario no autenticado'));
    }

    const payload = {
      titulo: plan.title,
      descripcion: plan.description,
      parcheId: parcheId,
    };

    return this.http.post<any>(`${this.apiUrl}/plan`, payload, this.authOptions()).pipe(
      map((result) => ({
        id: result.id,
        title: result.titulo || plan.title,
        state: 'Draft' as const,
        stateLabel: 'Borrador',
        stateClass: 'draft',
        dateRange: `${plan.startDate} - ${plan.endDate}`,
      })),
      catchError((err) => this.handleError(err))
    );
  }

  getPlanDetail(parcheId: string, planId: string): Observable<PlanDetail | null> {
    const plan = this.planDetails[planId];
    if (!plan) {
      return of(null);
    }
    return of({ ...plan, ownerMode: plan.ownerMode });
  }

  votePlanOption(parcheId: string, planId: string, optionId: string): Observable<PlanDetail | null> {
    const plan = this.planDetails[planId];
    if (!plan) {
      return of(null);
    }
    plan.options = plan.options.map((option) => ({ ...option, votes: option.id === optionId ? option.votes + 1 : option.votes }));
    return of(plan);
  }

  advancePlanState(parcheId: string, planId: string): Observable<PlanDetail | null> {
    const plan = this.planDetails[planId];
    if (!plan) {
      return of(null);
    }
    if (plan.state === 'VotingOpen') {
      plan.state = 'VotingClosed';
      plan.stateLabel = 'Votación cerrada';
      plan.stateClass = 'voting';
    } else if (plan.state === 'VotingClosed') {
      plan.state = 'Scheduled';
      plan.stateLabel = 'Agendado';
      plan.stateClass = 'scheduled';
    }
    return of(plan);
  }

  updateAttendance(parcheId: string, planId: string, name: string, status: 'Yes' | 'No' | 'Maybe'): Observable<PlanDetail | null> {
    const plan = this.planDetails[planId];
    if (!plan) {
      return of(null);
    }
    const existing = plan.attendance.find((item) => item.name === name);
    if (existing) {
      existing.status = status;
    } else {
      plan.attendance.unshift({ name, status });
    }
    return of(plan);
  }

  checkinPlan(parcheId: string, planId: string): Observable<PlanDetail | null> {
    const plan = this.planDetails[planId];
    return of(plan ?? null);
  }

  getRanking(parcheId: string): Observable<{ ranking: { name: string; organizer: number; ghost: number; score: number }[]; stats: { organizerScore: number; ghostScore: number; plansScheduled: number; attendanceRate: string } }> {
    const mock = {
      ranking: [
        { name: 'Valeria Torres', organizer: 12, ghost: 2, score: 78 },
        { name: 'Juan Restrepo', organizer: 9, ghost: 1, score: 72 },
        { name: 'Camilo García', organizer: 6, ghost: 4, score: 58 },
        { name: 'Sofía Mejía', organizer: 3, ghost: 6, score: 44 },
      ],
      stats: {
        organizerScore: 21,
        ghostScore: 7,
        plansScheduled: 13,
        attendanceRate: '84%',
      },
    };
    return of(mock);
  }
}
