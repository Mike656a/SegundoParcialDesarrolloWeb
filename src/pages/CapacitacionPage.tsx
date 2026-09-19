import { useState } from 'react';
import type { Employee, Training } from '../types';
import { useEmployees } from '../hooks/useEmployees';
import { useCreateTraining, useDeleteTraining, useTrainings, useUpdateTraining } from '../hooks/useTrainings';
import CapacitacionCard from '../components/CapacitacionCard';
import { CapacitacionForm } from '../components/CapacitacionForm';
import StatsBadge from '../components/StatsBadge';
import Modal from '../components/Modal';

function CapacitacionPage() {
	const { data: trainings = [], isLoading, isError } = useTrainings();
	const { data: employeeData } = useEmployees();
	const employees: Employee[] = employeeData?.data ?? [];
	const [search, setSearch] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');
	const [selectedStatus, setSelectedStatus] = useState<Training['estado'] | ''>('');
	const createTraining = useCreateTraining();
	const updateTraining = useUpdateTraining();
	const deleteTraining = useDeleteTraining();
	const [modalOpen, setModalOpen] = useState(false);
	const [editingTraining, setEditingTraining] = useState<Training | undefined>();
	const [submitError, setSubmitError] = useState<string | null>(null);

	const openCreate = () => { setEditingTraining(undefined); setSubmitError(null); setModalOpen(true); };
	const openEdit = (training: Training) => { setEditingTraining(training); setSubmitError(null); setModalOpen(true); };
	const handleDelete = (id: number) => {
		if (confirm('¿Estás seguro de eliminar esta capacitación?')) deleteTraining.mutate(id);
	};
	const handleSubmit = async (data: Omit<Training, 'id'>) => {
		setSubmitError(null);
		try {
			if (editingTraining) await updateTraining.mutateAsync({ id: editingTraining.id, data });
			else await createTraining.mutateAsync(data);
			setModalOpen(false);
		} catch {
			setSubmitError('No se pudo guardar la capacitación. Intenta de nuevo.');
		}
	};
	const filteredTrainings = trainings.filter(training => {
		const normalizedSearch = search.trim().toLowerCase();
		const matchesSearch = !normalizedSearch || training.nombre.toLowerCase().includes(normalizedSearch);
		const matchesCategory = !selectedCategory || training.categoria === selectedCategory;
		const matchesStatus = !selectedStatus || training.estado === selectedStatus;
		return matchesSearch && matchesCategory && matchesStatus;
	});
	const categories = [...new Set(trainings.map(training => training.categoria))];

	return (
		<div className="p-6">
			<div className="mb-6 flex items-start justify-between">
				<div><h2 className="text-2xl font-bold text-slate-900">Capacitaciones</h2><p className="mt-1 text-slate-500">Gestiona el plan de formación de los empleados.</p></div>
				<button onClick={openCreate} className="rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700">+ Nueva capacitación</button>
			</div>
			<div className="mb-6 flex flex-wrap gap-4">
				<StatsBadge label="Total de capacitaciones" value={trainings.length} variant="blue" />
                <StatsBadge label="Programadas" value={trainings.filter(training => training.estado === 'PROGRAMADA').length} variant="blue" />
				<StatsBadge label="En curso" value={trainings.filter(training => training.estado === 'EN CURSO').length} variant="yellow" />
				<StatsBadge label="Finalizadas" value={trainings.filter(training => training.estado === 'FINALIZADA').length} variant="green" />
                <StatsBadge label="Canceladas" value={trainings.filter(training => training.estado === 'CANCELADA').length} variant="red" />    
			</div>
			<div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl border border-slate-200 bg-white p-4">
				<label className="flex min-w-55 flex-1 flex-col gap-1">
					<span className="text-xs font-semibold text-slate-600">Buscar capacitación</span>
					<input
						type="search"
						placeholder="Buscar por nombre..."
						value={search}
						onChange={event => setSearch(event.target.value)}
						className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</label>
				<label className="flex min-w-45 flex-col gap-1">
					<span className="text-xs font-semibold text-slate-600">Categoría</span>
					<select value={selectedCategory} onChange={event => setSelectedCategory(event.target.value)} className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option value="">Todas las categorías</option>
						{categories.map(category => <option key={category} value={category}>{category}</option>)}
					</select>
				</label>
				<label className="flex min-w-45 flex-col gap-1">
					<span className="text-xs font-semibold text-slate-600">Estado</span>
					<select value={selectedStatus} onChange={event => setSelectedStatus(event.target.value as Training['estado'] | '')} className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500">
						<option value="">Todos los estados</option>
						{(['PROGRAMADA', 'EN CURSO', 'FINALIZADA', 'CANCELADA'] as Training['estado'][]).map(status => <option key={status} value={status}>{status}</option>)}
					</select>
				</label>
				{(search || selectedCategory || selectedStatus) && <button onClick={() => { setSearch(''); setSelectedCategory(''); setSelectedStatus(''); }} className="rounded-lg bg-red-100 px-3 py-2 text-sm text-red-600 hover:bg-red-200">Limpiar filtros</button>}
			</div>
			{isLoading && <p className="py-12 text-center text-slate-500">Cargando capacitaciones...</p>}
			{isError && <p className="rounded-xl bg-red-50 p-6 text-center text-red-700">No se pudieron cargar las capacitaciones.</p>}
			{!isLoading && !isError && trainings.length === 0 && <p className="py-12 text-center text-slate-500">No hay capacitaciones registradas.</p>}
			{!isLoading && !isError && trainings.length > 0 && filteredTrainings.length === 0 && <p className="py-12 text-center text-slate-500">No se encontraron capacitaciones con los filtros aplicados.</p>}
			{!isLoading && !isError && filteredTrainings.length > 0 && <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{filteredTrainings.map(training => <CapacitacionCard key={training.id} training={training} onEdit={openEdit} onDelete={handleDelete} />)}</div>}
			<Modal isOpen={modalOpen} title={editingTraining ? `Editar: ${editingTraining.nombre}` : 'Nueva capacitación'} onClose={() => setModalOpen(false)}>
				<CapacitacionForm training={editingTraining} employees={employees} onSubmit={handleSubmit} onCancel={() => setModalOpen(false)} isLoading={createTraining.isPending || updateTraining.isPending} error={submitError} />
			</Modal>
		</div>
	);
}

export default CapacitacionPage;
