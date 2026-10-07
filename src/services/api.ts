import { readJson, removeItem, STORAGE_KEYS } from '@/src/lib/storage';
import type { Appointment, AuthResponse, CreateAppointmentPayload, CreateServicePayload, MonthlyReport, Service, SlotAdmin, TimeSlot } from '@/src/types';

const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080/api').replace(/\/$/, '');
export const MOCK_MODE = process.env.EXPO_PUBLIC_MOCK_MODE === 'true';

const mockServices: Service[] = [
  { id: 's1', nome: 'Corte Masculino', descricao: 'Corte personalizado com acabamento e finalização.', duracaoMinutos: 45, categoria: 'Beleza', profissional: 'Rafael Mendes', local: 'Unidade Centro', ativo: true },
  { id: 's2', nome: 'Consulta de Nutrição', descricao: 'Avaliação inicial e plano alimentar personalizado.', duracaoMinutos: 60, categoria: 'Saúde', profissional: 'Dra. Camila Souza', local: 'Clínica Vida', ativo: true },
  { id: 's3', nome: 'Manutenção de Notebook', descricao: 'Diagnóstico, limpeza interna e otimização do sistema.', duracaoMinutos: 90, categoria: 'Tecnologia', profissional: 'Lucas Ferreira', local: 'Tech Center', ativo: true },
  { id: 's4', nome: 'Aula Particular de Matemática', descricao: 'Aula individual focada em exercícios e revisão.', duracaoMinutos: 60, categoria: 'Educação', profissional: 'Ana Lima', local: 'Sala 08 / Online', ativo: true },
  { id: 's5', nome: 'Massagem Relaxante', descricao: 'Sessão de relaxamento para reduzir tensão muscular.', duracaoMinutos: 60, categoria: 'Bem-estar', profissional: 'Marina Costa', local: 'Espaço Zen', ativo: true },
];
const mockAppointments: Record<string, Appointment> = {};
const reservedSlots = new Set<string>();

let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) { onUnauthorized = handler; }

type RequestOptions = { method?: string; body?: string; headers?: Record<string, string> };
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const token = await readJson<string>(STORAGE_KEYS.token);
  const headers: Record<string, string> = { 'Content-Type': 'application/json', Accept: 'application/json', ...(options.headers ?? {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, { method: options.method, body: options.body, headers, credentials: 'include' });
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Confira se o Gateway está no ar (porta 8080) e o EXPO_PUBLIC_API_URL.');
  }
  if (response.status === 401 && !path.startsWith('/auth/')) {
    await removeItem(STORAGE_KEYS.token); await removeItem(STORAGE_KEYS.user);
    onUnauthorized?.();
  }
  const text = await response.text(); let body: unknown = null; try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!response.ok) {
    const message = typeof body === 'object' && body && 'message' in body ? String((body as { message?: string }).message) : typeof body === 'object' && body && 'erro' in body ? String((body as { erro?: string }).erro) : response.status === 401 ? 'Sessão expirada. Entre novamente.' : response.status === 403 ? 'Você não tem permissão para esta ação.' : `Erro HTTP ${response.status}`;
    throw new Error(message);
  }
  return body as T;
}

export async function login(email: string, senha: string): Promise<AuthResponse> {
  if (MOCK_MODE) return { token: 'mock-token', usuario: { id: email.includes('admin') ? 'admin-1' : `u-${email}`, nome: email.includes('admin') ? 'Administrador' : 'João', email, role: email.includes('admin') ? 'ADMIN' : 'COMUM' } };
  return request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify({ email, senha }) });
}
export async function register(nome: string, email: string, senha: string): Promise<AuthResponse> {
  if (MOCK_MODE) return { token: 'mock-token', usuario: { id: `u-${Date.now()}`, nome, email, role: 'COMUM' } };
  return request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify({ nome, email, senha, role: 'COMUM' }) });
}
export async function logout(): Promise<void> {
  if (MOCK_MODE) return;
  try { await request<void>('/auth/logout', { method: 'POST' }); } catch { /* sem rede: a sessão local é encerrada mesmo assim */ }
}
export async function getServices(): Promise<Service[]> { if (MOCK_MODE) return mockServices.filter((s) => s.ativo); return request<Service[]>('/servicos?ativo=true'); }
export async function getService(id: string): Promise<Service> { if (MOCK_MODE) { const s = mockServices.find((x) => x.id === id); if (!s) throw new Error('Serviço não encontrado.'); return s; } return request<Service>(`/servicos/${id}`); }
export async function getAvailableSlots(serviceId: string, date: string): Promise<TimeSlot[]> {
  if (MOCK_MODE) return ['09:00', '10:30', '13:30', '15:00', '17:00'].map((hora, i) => ({ id: `${serviceId}-${date}-${i}`, serviceId, data: date, hora, disponivel: !reservedSlots.has(`${serviceId}-${date}-${hora}`) }));
  return request<TimeSlot[]>(`/servicos/${serviceId}/horarios?data=${encodeURIComponent(date)}`);
}
export async function createAppointment(payload: CreateAppointmentPayload): Promise<Appointment> {
  const idempotencyKey = `af-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  if (MOCK_MODE) {
    const service = mockServices.find((s) => s.id === payload.serviceId); if (!service) throw new Error('Serviço não encontrado.');
    const slotKey = `${payload.serviceId}-${payload.data}-${payload.hora}`;
    if (reservedSlots.has(slotKey)) throw new Error('Este horário acabou de ser reservado por outra solicitação.');
    reservedSlots.add(slotKey);
    const appointment: Appointment = { id: `a-${Date.now()}`, clienteId: payload.clienteId, serviceId: service.id, serviceName: service.nome, profissional: service.profissional, local: service.local, data: payload.data, hora: payload.hora, status: 'PROCESSANDO', criadoEm: new Date().toISOString() };
    mockAppointments[appointment.id] = appointment;
    setTimeout(() => { if (mockAppointments[appointment.id]) mockAppointments[appointment.id].status = 'CONFIRMADO'; }, 3000);
    return appointment;
  }
  return request<Appointment>('/agendamentos', { method: 'POST', headers: { 'Idempotency-Key': idempotencyKey }, body: JSON.stringify(payload) });
}
export async function getAppointment(id: string): Promise<Appointment> { if (MOCK_MODE) { const a = mockAppointments[id]; if (!a) throw new Error('Agendamento não encontrado.'); return { ...a }; } return request<Appointment>(`/agendamentos/${id}`); }
export async function listAppointments(clienteId: string): Promise<Appointment[]> { if (MOCK_MODE) return Object.values(mockAppointments).filter((a) => a.clienteId === clienteId).sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)); const list = await request<Appointment[]>(`/agendamentos?clienteId=${encodeURIComponent(clienteId)}`); return [...list].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm)); }
export async function createService(payload: CreateServicePayload): Promise<Service> { if (MOCK_MODE) { const service: Service = { id: `s-${Date.now()}`, ...payload }; mockServices.push(service); return service; } return request<Service>('/servicos', { method: 'POST', body: JSON.stringify(payload) }); }
export async function cancelAppointment(id: string): Promise<Appointment> {
  if (MOCK_MODE) { const a = mockAppointments[id]; if (!a) throw new Error('Agendamento não encontrado.'); a.status = 'CANCELADO'; return { ...a }; }
  return request<Appointment>(`/agendamentos/${id}/cancelar`, { method: 'POST' });
}

const SO_BACKEND = 'Disponível apenas com o backend real (EXPO_PUBLIC_MOCK_MODE=false).';
export async function openSlots(servicoId: string, data: string, horas: string[]): Promise<SlotAdmin[]> {
  if (MOCK_MODE) throw new Error(SO_BACKEND);
  return request<SlotAdmin[]>('/calendario/horarios', { method: 'POST', body: JSON.stringify({ servicoId, data, horas }) });
}
export async function getMonthSlots(servicoId: string, mes: string): Promise<SlotAdmin[]> {
  if (MOCK_MODE) throw new Error(SO_BACKEND);
  return request<SlotAdmin[]>(`/calendario/horarios?servicoId=${encodeURIComponent(servicoId)}&mes=${encodeURIComponent(mes)}`);
}
export async function removeSlot(id: string): Promise<void> {
  if (MOCK_MODE) throw new Error(SO_BACKEND);
  await request<void>(`/calendario/horarios/${encodeURIComponent(id)}`, { method: 'DELETE' });
}
export async function getMonthlyReport(mes: string): Promise<MonthlyReport> {
  if (MOCK_MODE) throw new Error(SO_BACKEND);
  return request<MonthlyReport>(`/relatorio/mensal?mes=${encodeURIComponent(mes)}`);
}
