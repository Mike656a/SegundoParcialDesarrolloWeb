import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { capacitationSchema, type CapacitationFormInput } from '../schemas/capacitacionSchema';
import type { Employee, Training } from '../types';
import FormField from './FormField';

interface CapacitacionFormProps {
  training?: Training;
  employees: Employee[];
  onSubmit: (data: Omit<Training, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  error?: string | null;
}

const inputClass = 'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500';

export function CapacitacionForm({ training, employees, onSubmit, onCancel, isLoading = false, error }: CapacitacionFormProps) {
  const [values, setValues] = useState<CapacitationFormInput>({
    nombre: training?.nombre ?? '',
    categoria: (training?.categoria as CapacitationFormInput['categoria']) ?? 'Curso',
    instructor: training?.instructor ?? employees[0],
    fechaInicio: training?.fechaInicio ?? '',
    fechaFin: training?.fechaFin ?? '',
    cupoMaximo: training?.cupoMaximo ?? 1,
    inscritos: training?.inscritos ?? 0,
    estado: training?.estado ?? 'PROGRAMADA',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    setValues({
      nombre: training?.nombre ?? '',
      categoria: (training?.categoria as CapacitationFormInput['categoria']) ?? 'Curso',
      instructor: training?.instructor ?? employees[0],
      fechaInicio: training?.fechaInicio ?? '',
      fechaFin: training?.fechaFin ?? '',
      cupoMaximo: training?.cupoMaximo ?? 1,
      inscritos: training?.inscritos ?? 0,
      estado: training?.estado ?? 'PROGRAMADA',
    });
  }, [training, employees]);

  const updateValue = (field: keyof CapacitationFormInput, value: string | number | Employee) => {
    setValues(current => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError(null);
    const result = capacitationSchema.safeParse(values);
    if (!result.success) {
      setValidationError(result.error.issues[0]?.message ?? 'Revisa los datos del formulario.');
      return;
    }
    await onSubmit(result.data);
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormField label="Nombre" className="sm:col-span-2">
        <input className={inputClass} value={values.nombre} onChange={event => updateValue('nombre', event.target.value)} required />
      </FormField>
      <FormField label="Categoría">
        <select className={inputClass} value={values.categoria} onChange={event => updateValue('categoria', event.target.value)}>
          {['Diplomado', 'Taller', 'Curso', 'Maquinaria'].map(option => <option key={option}>{option}</option>)}
        </select>
      </FormField>
      <FormField label="Instructor">
        <select
          className={inputClass}
          value={values.instructor?.id ?? ''}
          onChange={event => updateValue('instructor', employees.find(employee => employee.id === Number(event.target.value)) ?? employees[0])}
          required
        >
          {employees.map(employee => <option key={employee.id} value={employee.id}>{employee.name}</option>)}
        </select>
      </FormField>
      <FormField label="Fecha de inicio">
        <input type="date" className={inputClass} value={values.fechaInicio} onChange={event => updateValue('fechaInicio', event.target.value)} required />
      </FormField>
      <FormField label="Fecha de fin">
        <input type="date" className={inputClass} value={values.fechaFin} onChange={event => updateValue('fechaFin', event.target.value)} required />
      </FormField>
      <FormField label="Cupo máximo">
        <input type="number" min="1" className={inputClass} value={Number(values.cupoMaximo)} onChange={event => updateValue('cupoMaximo', Number(event.target.value))} required />
      </FormField>
      <FormField label="Inscritos">
        <input type="number" min="0" className={inputClass} value={Number(values.inscritos)} onChange={event => updateValue('inscritos', Number(event.target.value))} required />
      </FormField>
      <FormField label="Estado">
        <select className={inputClass} value={values.estado} onChange={event => updateValue('estado', event.target.value)}>
          {['PROGRAMADA', 'EN CURSO', 'FINALIZADA', 'CANCELADA'].map(option => <option key={option}>{option}</option>)}
        </select>
      </FormField>
      {(validationError || error) && <p className="text-sm text-red-600 sm:col-span-2">{validationError || error}</p>}
      <div className="flex justify-end gap-3 sm:col-span-2">
        <button type="button" onClick={onCancel} className="rounded-lg border border-slate-300 px-4 py-2 text-sm text-slate-700">Cancelar</button>
        <button type="submit" disabled={isLoading || employees.length === 0} className="rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50">
          {isLoading ? 'Guardando...' : 'Guardar capacitación'}
        </button>
      </div>
    </form>
  );
}

