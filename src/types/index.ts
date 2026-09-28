export type Role = 'ADMIN' | 'COMUM';
export interface User { id: string; nome: string; email: string; role: Role; }
export interface AuthResponse { token: string; usuario: User; }

export interface Service {
  id: string;
  nome: string;
  descricao: string;
  duracaoMinutos: number;
  categoria: string;
  profissional: string;
  local: string;
  ativo: boolean;
}

export interface TimeSlot {
  id: string;
  serviceId: string;
  data: string;
  hora: string;
  disponivel: boolean;
}

export type AppointmentStatus = 'PROCESSANDO' | 'CONFIRMADO' | 'CANCELADO';
export interface Appointment {
  id: string;
  clienteId: string;
  serviceId: string;
  serviceName: string;
  profissional: string;
  local: string;
  data: string;
  hora: string;
  status: AppointmentStatus;
  criadoEm: string;
}

export interface CreateAppointmentPayload {
  clienteId: string;
  serviceId: string;
  slotId: string;
  data: string;
  hora: string;
}

export interface CreateServicePayload {
  nome: string;
  descricao: string;
  duracaoMinutos: number;
  categoria: string;
  profissional: string;
  local: string;
  ativo: boolean;
}
