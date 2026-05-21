const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const dbPath = path.join(__dirname, 'db.json');
const port = 3000;

app.use(cors());
app.use(express.json());

function readDb() {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], parches: [], planDetails: {} }, null, 2));
  }
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function saveDb(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}

function generateId(prefix = 'id') {
  return `${prefix}${Math.floor(Math.random() * 1000000)}`;
}

function generateInviteCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const part = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  return `${part()}-${part()}`;
}

function removePassword(user) {
  const { password, ...rest } = user;
  return rest;
}

function getCurrentUser(req, db) {
  const userId = req.headers['x-user-id'] || req.body.userId;
  if (!userId) {
    return null;
  }
  return db.users.find((user) => user.id === userId);
}

function currentRole(parche, userId) {
  const member = parche.members.find((member) => member.id === userId);
  return member ? member.role : 'Member';
}

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  const db = readDb();
  let user = db.users.find((item) => item.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    user = {
      id: generateId('u'),
      name: email.split('@')[0],
      email,
      program: 'Sin programa',
      avatarUrl: '',
      role: 'Member',
      password,
    };
    db.users.push(user);
    saveDb(db);
  }

  return res.json(removePassword(user));
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, program, password, avatarUrl } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Completa los campos obligatorios' });
  }

  const db = readDb();
  if (db.users.some((item) => item.email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ error: 'El correo ya está registrado' });
  }

  const newUser = {
    id: generateId('u'),
    name,
    email,
    program: program || 'Sin programa',
    avatarUrl: avatarUrl || '',
    role: 'Member',
    password,
  };

  db.users.push(newUser);
  saveDb(db);

  return res.json(removePassword(newUser));
});

app.post('/api/auth/logout', (req, res) => {
  return res.json({ success: true });
});

app.get('/api/auth/me', (req, res) => {
  const db = readDb();
  const user = getCurrentUser(req, db);
  if (!user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  return res.json(removePassword(user));
});

app.get('/api/parches', (req, res) => {
  const db = readDb();
  const userId = req.headers['x-user-id'] || req.query.userId;
  let parches = db.parches.map((parche) => ({ ...parche }));
  if (userId) {
    parches = parches
      .filter((parche) => parche.members.some((member) => member.id === userId))
      .map((parche) => ({ ...parche, role: currentRole(parche, userId) }));
  }
  return res.json(parches);
});

app.get('/api/parches/:id', (req, res) => {
  const db = readDb();
  const parche = db.parches.find((item) => item.id === req.params.id);
  if (!parche) {
    return res.status(404).json({ error: 'Parche no encontrado' });
  }
  const userId = req.headers['x-user-id'];
  return res.json({ ...parche, role: currentRole(parche, userId) });
});

app.post('/api/parches', (req, res) => {
  const db = readDb();
  const user = getCurrentUser(req, db);
  if (!user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  const { name, description, coverImageUrl } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'El nombre del parche es obligatorio' });
  }

  const newParche = {
    id: generateId('g'),
    name: name.trim(),
    description: description?.trim() || 'Un nuevo parche para estar en contacto.',
    coverUrl: coverImageUrl || 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=70',
    memberCount: 1,
    activePlans: 0,
    inviteCode: generateInviteCode(),
    members: [removePassword({ ...user, role: 'Owner' })],
    plans: [],
  };

  db.parches.unshift(newParche);
  saveDb(db);
  return res.json({ ...newParche, role: 'Owner' });
});

app.post('/api/parches/join', (req, res) => {
  const db = readDb();
  const user = getCurrentUser(req, db);
  const { code } = req.body;
  if (!user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  const parche = db.parches.find((item) => item.inviteCode.toUpperCase() === String(code).toUpperCase());
  if (!parche) {
    return res.status(404).json({ error: 'Código inválido o parche no encontrado' });
  }

  const existing = parche.members.find((member) => member.id === user.id);
  if (!existing) {
    parche.members.push(removePassword({ ...user, role: 'Member' }));
    parche.memberCount = parche.members.length;
  }

  saveDb(db);
  return res.json({ ...parche, role: currentRole(parche, user.id) });
});

app.get('/api/parches/:id/members', (req, res) => {
  const db = readDb();
  const parche = db.parches.find((item) => item.id === req.params.id);
  if (!parche) {
    return res.status(404).json({ error: 'Parche no encontrado' });
  }
  return res.json(parche.members);
});

app.put('/api/parches/:parcheId/members/:memberId', (req, res) => {
  const db = readDb();
  const parche = db.parches.find((item) => item.id === req.params.parcheId);
  if (!parche) {
    return res.status(404).json({ error: 'Parche no encontrado' });
  }
  const member = parche.members.find((item) => item.id === req.params.memberId);
  if (!member) {
    return res.status(404).json({ error: 'Miembro no encontrado' });
  }
  member.role = req.body.role || member.role;
  saveDb(db);
  return res.json(parche.members);
});

app.delete('/api/parches/:parcheId/members/:memberId', (req, res) => {
  const db = readDb();
  const parche = db.parches.find((item) => item.id === req.params.parcheId);
  if (!parche) {
    return res.status(404).json({ error: 'Parche no encontrado' });
  }
  parche.members = parche.members.filter((item) => item.id !== req.params.memberId);
  parche.memberCount = parche.members.length;
  saveDb(db);
  return res.json(parche.members);
});

app.post('/api/parches/:parcheId/plans', (req, res) => {
  const db = readDb();
  const parche = db.parches.find((item) => item.id === req.params.parcheId);
  if (!parche) {
    return res.status(404).json({ error: 'Parche no encontrado' });
  }
  const { title, description, startDate, endDate, options } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'El título es obligatorio' });
  }

  const planId = generateId('p');
  const summary = {
    id: planId,
    title,
    state: 'Draft',
    stateLabel: 'Borrador',
    stateClass: 'draft',
    dateRange: `${startDate || 'Sin fecha'} - ${endDate || 'Sin fecha'}`,
  };

  parche.plans.push(summary);
  parche.activePlans = parche.plans.filter((plan) => plan.state !== 'Scheduled').length;
  db.planDetails[planId] = {
    ...summary,
    description: description || '',
    options: (options || []).map((option, index) => ({ id: `${planId}-o${index + 1}`, place: option.place, datetime: option.datetime, votes: 0 })),
    attendance: [],
    checkinWindow: `${startDate || 'Sin fecha'} · 10:00 - 10:30`,
    winnerNote: 'La opción con más votos lidera y se tomará como favorita. Si hay empate, gana la más temprana.',
  };

  saveDb(db);
  return res.json(summary);
});

app.get('/api/parches/:parcheId/plans/:planId', (req, res) => {
  const db = readDb();
  const plan = db.planDetails[req.params.planId];
  if (!plan) {
    return res.status(404).json({ error: 'Plan no encontrado' });
  }
  const parche = db.parches.find((item) => item.id === req.params.parcheId);
  const userId = req.headers['x-user-id'];
  const role = parche ? currentRole(parche, userId) : 'Member';
  return res.json({ ...plan, ownerMode: role !== 'Member' });
});

app.post('/api/parches/:parcheId/plans/:planId/vote', (req, res) => {
  const db = readDb();
  const plan = db.planDetails[req.params.planId];
  if (!plan) {
    return res.status(404).json({ error: 'Plan no encontrado' });
  }
  const option = plan.options.find((item) => item.id === req.body.optionId);
  if (!option) {
    return res.status(404).json({ error: 'Opción no encontrada' });
  }
  option.votes += 1;
  saveDb(db);
  return res.json(plan);
});

app.post('/api/parches/:parcheId/plans/:planId/advance', (req, res) => {
  const db = readDb();
  const plan = db.planDetails[req.params.planId];
  if (!plan) {
    return res.status(404).json({ error: 'Plan no encontrado' });
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
  saveDb(db);
  return res.json(plan);
});

app.post('/api/parches/:parcheId/plans/:planId/attendance', (req, res) => {
  const db = readDb();
  const plan = db.planDetails[req.params.planId];
  if (!plan) {
    return res.status(404).json({ error: 'Plan no encontrado' });
  }
  const { name, status } = req.body;
  if (!name || !status) {
    return res.status(400).json({ error: 'El nombre y el estado son obligatorios' });
  }
  const record = plan.attendance.find((item) => item.name === name);
  if (record) {
    record.status = status;
  } else {
    plan.attendance.unshift({ name, status });
  }
  saveDb(db);
  return res.json(plan);
});

app.post('/api/parches/:parcheId/plans/:planId/checkin', (req, res) => {
  const db = readDb();
  const plan = db.planDetails[req.params.planId];
  if (!plan) {
    return res.status(404).json({ error: 'Plan no encontrado' });
  }
  return res.json(plan);
});

app.get('/api/parches/:parcheId/ranking', (req, res) => {
  const db = readDb();
  const parche = db.parches.find((item) => item.id === req.params.parcheId);
  if (!parche) {
    return res.status(404).json({ error: 'Parche no encontrado' });
  }

  const ranking = parche.members.map((member, index) => ({
    name: member.name,
    organizer: Math.max(0, 12 - index * 2),
    ghost: Math.min(10, index * 2),
    score: Math.max(30, 80 - index * 6),
  }));

  const stats = {
    organizerScore: ranking.reduce((sum, item) => sum + item.organizer, 0),
    ghostScore: ranking.reduce((sum, item) => sum + item.ghost, 0),
    plansScheduled: parche.plans.filter((plan) => plan.state === 'Scheduled').length,
    attendanceRate: '80%',
  };

  return res.json({ ranking, stats });
});

app.put('/api/auth/me', (req, res) => {
  const db = readDb();
  const user = getCurrentUser(req, db);
  if (!user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  user.name = req.body.name || user.name;
  user.program = req.body.program || user.program;
  user.avatarUrl = req.body.avatarUrl || user.avatarUrl;
  saveDb(db);
  return res.json(removePassword(user));
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
