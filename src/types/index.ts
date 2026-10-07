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
  preco?: number;
  ativo: boolean;
}

export interface TimeSlot {
  id: string;
  serviceId: string;
  data: string;
  hora: string;
  disponivel: boolean;
}

export interface SlotAdmin extends TimeSlot {
  status: 'DISPONIVEL' | 'RESERVADO';
  agendamentoId?: string | null;
}

export type AppointmentStatus = 'PROCESSANDO' | 'CONFIRMADO' | 'REJEITADO' | 'CANCELADO';
export interface Appointment {
  id: string;
  clienteId: string;
  serviceId: string;
  serviceName: string;
  profissional: string;
  local: string;
  data: string;
  hora: string;
  valor?: number;
  status: AppointmentStatus;
  motivo?: string | null;
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
  preco: number;
  ativo: boolean;
}

export interface MonthlyReport {
  mes: string;
  quantidadeTotal: number;
  valorTotal: number;
  porServico: { servicoId: string; servicoNome: string; quantidade: number; valorTotal: number }[];
}
