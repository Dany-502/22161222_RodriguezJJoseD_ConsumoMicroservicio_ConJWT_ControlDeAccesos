<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleCloseModal">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">
          {{ isEditing ? 'Editar Usuario' : 'Nuevo Usuario' }}
        </h3>
        <button class="btn-close" @click="handleCloseModal">✕</button>
      </div>

      <form @submit.prevent="handleSubmitForm" class="modal-body">
        <div v-if="errorMessage" class="alert-error">
          {{ errorMessage }}
        </div>

        <div class="form-group">
          <label for="username">Nombre de Usuario *</label>
          <input
            id="username"
            v-model.trim="formData.username"
            type="text"
            maxlength="30"
            placeholder="ej. carlos24"
            required
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico *</label>
          <input
            id="email"
            v-model.trim="formData.email"
            type="email"
            placeholder="ej. carlos@ejemplo.com"
            required
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="password">
            Contraseña
            <span v-if="!isEditing">* (mínimo 8 caracteres)</span>
            <span v-else class="text-hint">(dejar vacío si no deseas cambiarla)</span>
          </label>
          <input
            id="password"
            v-model="formData.password"
            type="password"
            placeholder="••••••••"
            :required="!isEditing"
            class="form-control"
          />
        </div>

        <div class="form-group">
          <label for="role_id">Rol Asignado *</label>
          <select
            id="role_id"
            v-model.number="formData.role_id"
            required
            class="form-control"
          >
            <option value="" disabled>Selecciona un rol...</option>
            <option v-for="rol in rolesList" :key="rol.id" :value="rol.id">
              {{ rol.name }} (ID: {{ rol.id }})
            </option>
          </select>
        </div>

        <!-- Combobox para Estado del Usuario (solo en edición) -->
        <div v-if="isEditing" class="form-group">
          <label for="is_active">Estado del Usuario</label>
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
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario') }}
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
  userToEdit: {
    type: Object,
    default: null
  },
  rolesList: {
    type: Array,
    default: () => []
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

const emit = defineEmits(['closeModal', 'submitUser'])

const formData = reactive({
  username: '',
  email: '',
  password: '',
  role_id: '',
  is_active: true
})

const isEditing = computed(() => !!props.userToEdit)

function populateForm() {
  if (props.userToEdit) {
    formData.username = props.userToEdit.username || ''
    formData.email = props.userToEdit.email || ''
    formData.password = ''
    formData.role_id = props.userToEdit.role_id || ''
    formData.is_active = props.userToEdit.is_active ?? true
  } else {
    resetForm()
  }
}

function resetForm() {
  formData.username = ''
  formData.email = ''
  formData.password = ''
  formData.role_id = props.rolesList.length > 0 ? props.rolesList[0].id : ''
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
    username: formData.username,
    email: formData.email,
    role_id: Number(formData.role_id)
  }

  if (formData.password) {
    payload.password = formData.password
  }

  if (isEditing.value) {
    payload.is_active = Boolean(formData.is_active)
  }

  emit('submitUser', payload)
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
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  animation: modalFadeIn 0.2s ease-out;
}

@keyframes modalFadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
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

.btn-close:hover {
  color: #0f172a;
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

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #334155;
  margin-bottom: 0.35rem;
}

.text-hint {
  font-weight: normal;
  color: #94a3b8;
  font-size: 0.8rem;
}

.form-control {
  width: 100%;
  padding: 0.65rem 0.85rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.15s ease;
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
