import { z } from 'zod';

export const capacitationSchema = z.object({
  nombre: z
    .string({ error: 'El nombre es requerido' })
    .min(2, 'Mínimo 2 caracteres')
    .max(100, 'Máximo 100 caracteres'),

  categoria: z.enum(
    ['Diplomado', 'Taller', 'Curso', 'Maquinaria'],
    { error: 'Seleccione una categoría' }
  ),

  instructor: z.object({
    id: z.number().int().positive('El instructor es requerido'),
    name: z.string().min(1, 'El instructor es requerido'),
    email: z.string().email('Correo del instructor inválido'),
    position: z.string().min(1, 'El cargo del instructor es requerido'),
    department: z.enum(
      ['Tecnología', 'Recursos Humanos', 'Finanzas', 'Operaciones', 'Ventas'],
      { error: 'El departamento del instructor es inválido' }
    ),
    salary: z.number().nonnegative(),
    hireDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),
    status: z.enum(['active', 'inactive', 'on_leave']),
    role: z.enum(['admin', 'hr', 'employee']),
    avatarUrl: z.string().url('URL del avatar inválida').optional(),
    phone: z.string().optional(),
  }),

  fechaInicio: z
    .string({ error: 'La fecha de ingreso es requerida' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),

  fechaFin: z
    .string({ error: 'La fecha de fin es requerida' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato inválido (YYYY-MM-DD)'),

  cupoMaximo: z.coerce
    .number({ error: 'El cupo máximo es requerido' })
    .int('El cupo máximo debe ser entero')
    .min(1, 'El cupo máximo debe ser mayor a 0'),

  inscritos: z.coerce
    .number({ error: 'La cantidad de inscritos es requerida' })
    .int('La cantidad de inscritos debe ser entero')
    .min(0, 'La cantidad de inscritos no puede ser negativa'),

  estado: z.enum(
    ['PROGRAMADA', 'EN CURSO', 'FINALIZADA', 'CANCELADA'],
    { error: 'Seleccione un estado válido' }
  ),
}).refine(
  ({ fechaInicio, fechaFin }) => fechaFin >= fechaInicio,
  { message: 'La fecha de fin debe ser posterior o igual a la fecha de inicio', path: ['fechaFin'] }
);

export type CapacitationFormData = z.infer<typeof capacitationSchema>;
export type CapacitationFormInput = z.input<typeof capacitationSchema>;
