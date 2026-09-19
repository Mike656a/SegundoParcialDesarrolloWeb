import type { Training } from '../types';

interface CapacitacionCardProps {
  training: Training;
  onEdit: (training: Training) => void;
  onDelete: (id: number) => void;
}

const statusStyles: Record<Training['estado'], string> = {
  'PROGRAMADA': 'bg-blue-100 text-blue-700',
  'EN CURSO': 'bg-amber-100 text-amber-700',
  'FINALIZADA': 'bg-green-100 text-green-700',
  'CANCELADA': 'bg-red-100 text-red-700',
};

function CapacitacionCard({ training, onEdit, onDelete }: CapacitacionCardProps) {
  return (
    <article className="relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="absolute right-4 top-4 flex gap-1">
        <button
          onClick={() => onEdit(training)}
          aria-label={`Editar ${training.nombre}`}
          title="Editar capacitación"
          className="h-7 w-7 rounded-full bg-brand-600 text-white shadow hover:bg-brand-700"
        >
          ✎
        </button>
        <button
          onClick={() => onDelete(training.id)}
          aria-label={`Eliminar ${training.nombre}`}
          title="Eliminar capacitación"
          className="h-7 w-7 rounded-full bg-red-500 text-white shadow hover:bg-red-600"
        >
          ×
        </button>
      </div>

      <div className="pr-16">
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[training.estado]}`}>
          {training.estado}
        </span>
        <h3 className="mt-3 text-lg font-semibold text-slate-900">{training.nombre}</h3>
        <p className="mt-1 text-sm text-slate-500">{training.categoria}</p>
      </div>

      <dl className="mt-5 space-y-2 text-sm">
        <div className="flex justify-between gap-3"><dt className="text-slate-500">Instructor</dt><dd className="text-right font-medium text-slate-700">{training.instructor.name}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-slate-500">Fechas</dt><dd className="text-right font-medium text-slate-700">{training.fechaInicio} al {training.fechaFin}</dd></div>
        <div className="flex justify-between gap-3"><dt className="text-slate-500">Inscritos</dt><dd className="font-medium text-slate-700">{training.inscritos} / {training.cupoMaximo}</dd></div>
      </dl>
    </article>
  );
}

export default CapacitacionCard;