<script setup>
import { ref } from 'vue'
import { useTaskStore } from '../stores/useTaskStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])

const store = useTaskStore()

const closeModal = () => emit('update:modelValue', false)

const task = ref({
  title: '',
  description: ''
})

const saveTask = () => {
  if (task.value.title.trim()) {
    store.addTask({ ...task.value })
    task.value = { title: '', description: '' }
    closeModal()
  }
}
</script>

<template>
  <dialog :open="props.modelValue" class="modal">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Add New Task</h3>

      <form @submit.prevent="saveTask" class="space-y-3 mt-4">
        <input
          v-model="task.title"
          type="text"
          class="input input-bordered w-full"
          placeholder="Task title"
          required
        />
        <textarea
          v-model="task.description"
          class="textarea textarea-bordered w-full"
          placeholder="Description"
        ></textarea>

        <div class="modal-action">
          <button type="button" class="btn rounded-md" @click="closeModal">Cancel</button>
          <button type="submit" class="btn btn-primary rounded-md">Add</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button @click="closeModal">close</button>
    </form>
  </dialog>
</template>
