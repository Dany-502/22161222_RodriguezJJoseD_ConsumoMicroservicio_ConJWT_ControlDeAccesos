<template>
  <div class="view-container">
    <!-- Encabezado -->
    <header class="view-header">
      <div>
        <h1 class="view-title">Gestión de Roles</h1>
        <p class="view-subtitle">Vista de los roles de acceso del microservicio</p>
      </div>
      <button class="btn btn-primary" @click="openCreateModal">
        <span>+</span> Nuevo Rol
      </button>
    </header>

    <!-- Notificación Toast -->
    <div v-if="feedbackMessage" :class="['alert-banner', feedbackType === 'success' ? 'alert-success' : 'alert-error']">
      <span>{{ feedbackMessage }}</span>
      <button class="alert-close" @click="feedbackMessage = ''">✕</button>
    </div>

    <!-- Buscador y Refrescar -->
    <section class="filters-bar">
      <button class="btn btn-secondary" @click="loadRoles" :disabled="isLoading">
        Refrescar
      </button>
    </section>

    <!-- Estado de carga / vacío -->
    <div v-if="isLoading" class="loading-state">
      <p>Cargando roles...</p>
    </div>

    <div v-else-if="filteredRoles.length === 0" class="empty-state">
      <p>No se encontraron roles que coincidan con la búsqueda.</p>
    </div>

    <!-- Tabla de Roles (columnas: id, name, description) -->
    <section v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre del Rol</th>
            <th>Descripción</th>
            <th class="text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="rol in filteredRoles" :key="rol.id">
            <td class="font-bold">#{{ rol.id }}</td>
            <td>
              <div class="role-cell">
                <span class="badge badge-role">{{ rol.name }}</span>
              </div>
            </td>
            <td class="text-desc">{{ rol.description || 'Sin descripción.' }}</td>
            <td class="text-right actions-cell">
              <button
                class="btn-action btn-edit"
                title="Editar Rol"
                @click="openEditModal(rol)"
              >
                Editar
              </button>
              <button
                class="btn-action btn-delete"
                title="Eliminar Rol"
                @click="handleDeleteRole(rol.id, rol.name)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </section>

    <!-- Modal para Crear / Editar Rol -->
    <RoleFormModal
      :is-open="isFormModalOpen"
      :role-to-edit="selectedRoleToEdit"
      :error-message="formErrorMessage"
      :is-submitting="isLoading"
      @close-modal="closeModals"
      @submit-role="handleSaveRole"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCrud } from '@/composables/useCrud.composables.js'
import RoleFormModal from '@/components/roleFormModal.components.vue'

// Consumo modular a través del composable useCrud
const {
  items: rolesList,
  isLoading,
  showModal: isFormModalOpen,
  isEditing,
  currentId,
  selectedItem: selectedRoleToEdit,
  errorMessage: formErrorMessage,
  feedbackMessage,
  feedbackType,
  loadItems: loadRoles,
  createItem,
  updateItem,
  deleteItem,
  openCreateModal,
  openEditModal,
  closeModal: closeModals
} = useCrud('/v2/roles')

// Estados locales
const searchQuery = ref('')

// Filtro en tiempo real por nombre o descripción
const filteredRoles = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return rolesList.value
  return rolesList.value.filter((rol) => {
    return (
      rol.name.toLowerCase().includes(query) ||
      (rol.description && rol.description.toLowerCase().includes(query))
    )
  })
})

async function handleSaveRole(payload) {
  if (isEditing.value) {
    await updateItem(currentId.value, payload)
  } else {
    await createItem(payload)
  }
}

async function handleDeleteRole(id, name) {
  await deleteItem(id, `el rol "${name}" (#${id})`)
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

.role-cell {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  text-transform: uppercase;
}

.badge-role {
  background-color: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.text-desc {
  color: #64748b;
  font-style: italic;
  max-width: 400px;
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
