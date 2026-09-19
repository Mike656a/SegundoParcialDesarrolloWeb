// src/types/index.ts

// --- Tipos base del dominio ---

export type Department =
  | "Tecnología"
  | "Recursos Humanos"
  | "Finanzas"
  | "Operaciones"
  | "Ventas";

export type EmployeeRole = "admin" | "hr" | "employee";
export type TrainingStatus = "PROGRAMADA" | "EN CURSO" | "FINALIZADA" | "CANCELADA";


export type EmployeeStatus = "active" | "inactive" | "on_leave";

// --- Entidad principal ---

export interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: Department;
  salary: number;
  hireDate: string; // ISO 8601: "2024-01-15"
  status: EmployeeStatus;
  role: EmployeeRole;
  avatarUrl?: string;
  phone?: string;
}
export interface Training {
  id: number;
  nombre: string;
  categoria: string;
  instructor: Employee;
  fechaInicio: string;
  fechaFin: string;
  cupoMaximo: number;
  inscritos: number;
  estado: TrainingStatus;
}

export type Capacitation = Training;
export type CreateTrainingDto = Omit<Training, "id">;
export type UpdateTrainingDto = Partial<CreateTrainingDto>;

// --- Tipos para creación y actualización ---

export type CreateEmployeeDto = Omit<Employee, "id">;
export type UpdateEmployeeDto = Partial<CreateEmployeeDto>;

// --- Tipos de autenticación ---

export interface User {
  id: number;
  name: string;
  email: string;
  role: EmployeeRole;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// --- Tipos de respuesta de la API ---

export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// --- Tipos de navegación ---

export interface NavItem {
  label: string;
  path: string;
  icon: string;
  allowedRoles: EmployeeRole[];
}
