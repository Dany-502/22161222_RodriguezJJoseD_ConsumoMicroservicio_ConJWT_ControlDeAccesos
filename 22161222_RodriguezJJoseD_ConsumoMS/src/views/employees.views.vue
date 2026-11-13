<template>
  <div class="view-container">
    <!-- Encabezado de la Vista -->
    <header class="view-header">
      <div>
        <h1 class="view-title">Gestión de Empleados</h1>
        <p class="view-subtitle">Vista del personal vinculado al sistema</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <span>+</span> Nuevo Empleado
      </button>
    </header>

    <!-- Notificación Toast / Alerta -->
    <div v-if="feedbackMessage" :class="['alert-banner', feedbackType === 'success' ? 'alert-success' : 'alert-error']">
      <span>{{ feedbackMessage }}</span>
      <button class="alert-close" @click="feedbackMessage = ''">✕</button>
    </div>

    <!-- Barra de Búsqueda -->
    <section class="filters-bar">
      <div class="search-box">
        <input
          v-model.trim="searchQuery"
          type="text"
          placeholder="Buscar por nombre, apellido o puesto..."
          class="search-input"
        />
      </div>
      <button class="btn btn-secondary btn-reload" @click="loadEmployees" :disabled="isLoading">
        Refrescar
      </button>
    </section>

    <!-- Tabla de Empleados (columnas de la tabla employees en BD) -->
    <section class="table-container">
      <div v-if="isLoading" class="loading-state">
        <p>Cargando lista de empleados...</p>
      </div>

      <div v-else-if="filteredEmployees.length === 0" class="empty-state">
        <p>No se encontraron empleados que coincidan con la búsqueda.</p>
      </div>

      <table v-else class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre Completo</th>
            <th>Usuario Vinculado</th>
            <th>Puesto / Cargo</th>
            <th>Teléfono</th>
            <th>Fecha Contratación</th>
            <th>Estado</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in filteredEmployees" :key="emp.id">
            <td class="font-bold">#{{ emp.id }}</td>
            <td>
              <div class="employee-cell">
                <span>{{ emp.first_name }} {{ emp.last_name }}</span>
              </div>
            </td>
            <td>
              <span class="badge badge-user">Usuario #{{ emp.user_id }}</span>
            </td>
            <td>{{ emp.job_title || 'Sin asignar' }}</td>
            <td>{{ emp.phone || 'S/N' }}</td>
            <td>{{ formatDate(emp.hired_at) }}</td>
            <td>
              <span :class="['badge', emp.is_active ? 'badge-active' : 'badge-inactive']">
                {{ emp.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="text-right actions-cell">
              <button
                class="btn-action btn-edit"
                title="Editar Empleado"
                @click="openEditModal(emp)"
              >
                Editar
              </button>
              <button
                class="btn-action btn-delete"
                title="Eliminar Empleado"
                @click="handleDeleteEmployee(emp.id, emp.first_name, emp.last_name)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Modal para Crear / Editar Empleado -->
    <EmployeeFormModal
      :is-open="isFormModalOpen"
      :employee-to-edit="selectedEmployeeToEdit"
      :error-message="formErrorMessage"
      :is-submitting="isLoading"
      @close-modal="closeModals"
      @submit-employee="handleSaveEmployee"
    />
  </div>
</template>

<script setup>
defineOptions({ name: 'EmployeesView' })

import { ref, computed } from 'vue'
import { useCrud } from '@/composables/useCrud.composables.js'
import EmployeeFormModal from '@/components/employeeFormModal.components.vue'

// Consumo modular a través del composable useCrud
const {
  items: employeesList,
  isLoading,
  showModal: isFormModalOpen,
  isEditing,
  currentId,
  selectedItem: selectedEmployeeToEdit,
  errorMessage: formErrorMessage,
  feedbackMessage,
  feedbackType,
  loadItems: loadEmployees,
  createItem,
  updateItem,
  deleteItem,
  openCreateModal,
  openEditModal,
  closeModal: closeModals
} = useCrud('/v2/employees')

// Estados locales
const searchQuery = ref('')

// Filtro en tiempo real por nombre, apellido o puesto
const filteredEmployees = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return employeesList.value
  return employeesList.value.filter((emp) => {
    return (
      emp.first_name.toLowerCase().includes(query) ||
      emp.last_name.toLowerCase().includes(query) ||
      (emp.job_title && emp.job_title.toLowerCase().includes(query))
    )
  })
})

function formatDate(dateString) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(date)
}

async function handleSaveEmployee(payload) {
  if (isEditing.value) {
    await updateItem(currentId.value, payload)
  } else {
    await createItem(payload)
  }
}

async function handleDeleteEmployee(id, firstName, lastName) {
  await deleteItem(id, `al empleado "${firstName} ${lastName}" (#${id})`)
}
</script>

<style scoped>
.view-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.view-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.view-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin-top: 0.25rem;
}

.alert-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.alert-success {
  background-color: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background-color: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.alert-close {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  color: inherit;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 260px;
  display: flex;
  align-items: center;
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 0 0.75rem;
}

.search-input {
  width: 100%;
  border: none;
  outline: none;
  padding: 0.65rem 0;
  font-size: 0.95rem;
}

.btn-reload { margin-left: auto; }

.table-container {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.data-table th {
  background-color: #f8fafc;
  padding: 0.85rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #64748b;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 0.9rem 1rem;
  font-size: 0.9rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.data-table tr:hover { background-color: #f8fafc; }

.employee-cell {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-weight: 500;
  color: #0f172a;
}

.mini-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #d1fae5;
  color: #047857;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  flex-shrink: 0;
}

.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
}

.badge-user {
  background-color: #f1f5f9;
  color: #334155;
  border: 1px solid #cbd5e1;
}

.badge-active {
  background-color: #ecfdf5;
  color: #047857;
  border: 1px solid #a7f3d0;
}

.badge-inactive {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
}

.actions-cell {
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
}

.btn-action {
  background-color: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.btn-action:hover { background-color: #e2e8f0; }

.btn-delete:hover {
  background-color: #fee2e2;
  border-color: #fca5a5;
  color: #dc2626;
}

.btn {
  padding: 0.65rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.15s ease;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-primary:hover { background-color: #1d4ed8; }

.btn-secondary {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #334155;
}

.btn-secondary:hover:not(:disabled) { background-color: #f8fafc; }

.loading-state, .empty-state {
  padding: 3rem;
  text-align: center;
  color: #64748b;
}

.text-right { text-align: right; }
.font-bold { font-weight: 600; }
</style>
