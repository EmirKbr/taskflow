<script setup>
import { ref } from 'vue'

const props = defineProps({
  task: { type: Object, required: true },
  status: { type: String, required: true }
})

const emit = defineEmits(['delete'])

const isDragging = ref(false)

const dragStart = (e) => {
  isDragging.value = true
  e.dataTransfer.effectAllowed = 'move'
  e.dataTransfer.setData('taskId', props.task.id)
  e.dataTransfer.setData('fromStatus', props.status)
}

const dragEnd = () => {
  isDragging.value = false
  window.dispatchEvent(new CustomEvent('task-drag-end'))
}

const deleteTask = () => {
  if (confirm('Are you sure you want to delete this task?')) {
    emit('delete', props.task.id)
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<template>
  <div
    draggable="true"
    @dragstart="dragStart"
    @dragend="dragEnd"
    :class="[
      'card bg-base-100 shadow-md cursor-move transition-all hover:shadow-lg',
      { 'opacity-50': isDragging }
    ]"
  >
    <div class="card-body p-4">
      <div class="flex justify-between items-start gap-2">
        <h3 class="card-title text-base flex-1 break-words">{{ task.title }}</h3>
        <button 
          @click="deleteTask"
          class="btn btn-ghost btn-xs btn-circle text-error flex-shrink-0"
          title="Delete Task"
        >
          ✕
        </button>
      </div>
      
      <p v-if="task.description" class="text-sm text-gray-600 mt-2 line-clamp-3 break-words">
        {{ task.description }}
      </p>
      
      <div class="text-xs text-gray-400 mt-2">
        {{ formatDate(task.createdAt) }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>