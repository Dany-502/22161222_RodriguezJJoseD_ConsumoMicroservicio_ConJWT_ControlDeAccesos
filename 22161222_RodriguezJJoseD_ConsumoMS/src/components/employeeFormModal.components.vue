<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleCloseModal">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">
          {{ isEditing ? 'Editar Empleado' : 'Nuevo Empleado' }}
        </h3>
        <button class="btn-close" @click="handleCloseModal">✕</button>
      </div>

      <form @submit.prevent="handleSubmitForm" class="modal-body">
        <div v-if="errorMessage" class="alert-error">
          {{ errorMessage }}
        </div>

        <!-- user_id (obligatorio) -->
        <div class="form-group">
          <label for="user_id">ID de Usuario Vinculado *</label>
          <input
            id="user_id"
            v-model.number="formData.user_id"
            type="number"
            min="1"
            placeholder="ej. 1"
            required
            class="form-control"
          />
          <small class="field-hint">Un usuario solo puede tener un empleado asociado.</small>
        </div>

        <!-- first_name y last_name (obligatorios) -->
        <div class="form-row">
          <div class="form-group">
            <label for="first_name">Nombre(s) *</label>
            <input
              id="first_name"
              v-model.trim="formData.first_name"
              type="text"
              maxlength="100"
              placeholder="ej. Ana"
              required
              class="form-control"
            />
          </div>

          <div class="form-group">
            <label for="last_name">Apellido(s) *</label>
            <input
              id="last_name"
              v-model.trim="formData.last_name"
              type="text"
              maxlength="100"
              placeholder="ej. González"
              required
              class="form-control"
            />
          </div>
        </div>

        <!-- phone (opcional, nullable) -->
        <div class="form-group">
          <label for="phone">Teléfono</label>
          <input
            id="phone"
            v-model.trim="formData.phone"
            type="text"
            maxlength="20"
            placeholder="ej. 5551234567"
            class="form-control"
          />
        </div>

        <!-- job_title (opcional, nullable) -->
        <div class="form-group">
          <label for="job_title">Puesto / Cargo</label>
          <input
            id="job_title"
            v-model.trim="formData.job_title"
            type="text"
            maxlength="60"
            placeholder="ej. Gerente"
            class="form-control"
          />
        </div>

        <!-- address (opcional, nullable) -->
        <div class="form-group">
          <label for="address">Dirección</label>
          <textarea
            id="address"
            v-model.trim="formData.address"
            rows="2"
            placeholder="ej. Calle Principal 123, Colonia Centro"
            class="form-control"
          ></textarea>
        </div>

        <!-- hired_at (opcional, usa fecha actual por defecto en BD) -->
        <div class="form-group">
          <label for="hired_at">Fecha de Contratación</label>
          <input
            id="hired_at"
            v-model="formData.hired_at"
            type="date"
            class="form-control"
          />
          <small class="field-hint">Si se omite, la base de datos usa la fecha actual.</small>
        </div>

        <!-- is_active combobox (solo edición) -->
        <div v-if="isEditing" class="form-group">
          <label for="is_active">Estado del Empleado</label>
          <select
            id="is_active"
            v-model="formData.is_active"
            class="form-control"
          >
            <option :value="true">Activo</option>
            <option :value="false">Inactivo</option>
          </select>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleCloseModal">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Empleado') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  employeeToEdit: {
    type: Object,
    default: null
  },
  errorMessage: {
    type: String,
    default: ''
  },
  isSubmitting: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['closeModal', 'submitEmployee'])

const isEditing = computed(() => !!props.employeeToEdit)

const formData = reactive({
  user_id: '',
  first_name: '',
  last_name: '',
  phone: '',
  job_title: '',
  address: '',
  hired_at: new Date().toISOString().split('T')[0],
  is_active: true
})

function populateForm() {
  if (props.employeeToEdit) {
    formData.user_id = props.employeeToEdit.user_id || ''
    formData.first_name = props.employeeToEdit.first_name || ''
    formData.last_name = props.employeeToEdit.last_name || ''
    formData.phone = props.employeeToEdit.phone || ''
    formData.job_title = props.employeeToEdit.job_title || ''
    formData.address = props.employeeToEdit.address || ''
    formData.hired_at = props.employeeToEdit.hired_at
      ? props.employeeToEdit.hired_at.split('T')[0]
      : new Date().toISOString().split('T')[0]
    formData.is_active = props.employeeToEdit.is_active ?? true
  } else {
    resetForm()
  }
}

function resetForm() {
  formData.user_id = ''
  formData.first_name = ''
  formData.last_name = ''
  formData.phone = ''
  formData.job_title = ''
  formData.address = ''
  formData.hired_at = new Date().toISOString().split('T')[0]
  formData.is_active = true
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      populateForm()
    }
  }
)

function handleCloseModal() {
  emit('closeModal')
}

function handleSubmitForm() {
  const payload = {
    user_id: Number(formData.user_id),
    first_name: formData.first_name,
    last_name: formData.last_name,
    phone: formData.phone || null,
    job_title: formData.job_title || null,
    address: formData.address || null,
    hired_at: formData.hired_at || undefined
  }

  if (isEditing.value) {
    payload.is_active = Boolean(formData.is_active)
  }

  emit('submitEmployee', payload)
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-dialog {
  background-color: #ffffff;
  border-radius: 12px;
  width: 100%;
  max-width: 540px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from { opacity: 0; transform: scale(0.96); }
  to   { opacity: 1; transform: scale(1); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #0f172a;
}

.btn-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}

.modal-body {
  padding: 1.5rem;
}

.alert-error {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.35rem;
}

.field-hint {
  display: block;
  font-size: 0.775rem;
  color: #94a3b8;
  margin-top: 0.25rem;
}

.form-control {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease;
  font-family: inherit;
  resize: vertical;
  background-color: #ffffff;
}

.form-control:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.25rem;
  border-top: 1px solid #e2e8f0;
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

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) {
  background-color: #1d4ed8;
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
