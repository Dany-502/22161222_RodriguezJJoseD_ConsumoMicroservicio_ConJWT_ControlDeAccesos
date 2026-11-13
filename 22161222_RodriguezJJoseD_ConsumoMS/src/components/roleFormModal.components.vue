<template>
  <div v-if="isOpen" class="modal-backdrop" @click.self="handleCloseModal">
    <div class="modal-dialog">
      <div class="modal-header">
        <h3 class="modal-title">
          {{ isEditing ? 'Editar Rol' : 'Nuevo Rol' }}
        </h3>
        <button class="btn-close" @click="handleCloseModal">✕</button>
      </div>

      <form @submit.prevent="handleSubmitForm" class="modal-body">
        <div v-if="errorMessage" class="alert-error">
          {{ errorMessage }}
        </div>

        <!-- name (obligatorio) -->
        <div class="form-group">
          <label for="name">Nombre del Rol *</label>
          <input
            id="name"
            v-model.trim="formData.name"
            type="text"
            maxlength="30"
            placeholder="ej. supervisor"
            required
            class="form-control"
          />
          <small class="field-hint">Máximo 30 caracteres. Debe ser único en el sistema.</small>
        </div>

        <!-- description (opcional, nullable) -->
        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea
            id="description"
            v-model.trim="formData.description"
            rows="3"
            placeholder="ej. Supervisa el área de ventas y operaciones"
            class="form-control"
          ></textarea>
          <small class="field-hint">Opcional. Describe los permisos y alcance del rol.</small>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="handleCloseModal">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar Rol' : 'Crear Rol') }}
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
  roleToEdit: {
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

const emit = defineEmits(['closeModal', 'submitRole'])

const isEditing = computed(() => !!props.roleToEdit)

const formData = reactive({
  name: '',
  description: ''
})

function populateForm() {
  if (props.roleToEdit) {
    formData.name = props.roleToEdit.name || ''
    formData.description = props.roleToEdit.description || ''
  } else {
    resetForm()
  }
}

function resetForm() {
  formData.name = ''
  formData.description = ''
}

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) populateForm()
  }
)

function handleCloseModal() {
  emit('closeModal')
}

function handleSubmitForm() {
  const payload = {
    name: formData.name
  }

  // description solo se envía si tiene valor, o null si se borra al editar
  if (formData.description) {
    payload.description = formData.description
  } else if (isEditing.value) {
    payload.description = null
  }

  emit('submitRole', payload)
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
  max-width: 460px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
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
  margin-bottom: 1.1rem;
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

.btn-secondary:hover { background-color: #e2e8f0; }

.btn-primary {
  background-color: #2563eb;
  color: #ffffff;
}

.btn-primary:hover:not(:disabled) { background-color: #1d4ed8; }

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>

