<script setup>
import { ref } from 'vue'
import TaskCard from './TaskCard.vue'

const props = defineProps({
  title: { type: String, required: true },
  status: { type: String, required: true },
  tasks: { type: Array, required: true },
  color: { type: String, default: 'primary' }
})

const emit = defineEmits(['drop', 'delete-task'])

const dragOverIndex = ref(null)

if (typeof window !== 'undefined') {
  window.addEventListener('task-drag-end', () => {
    dragOverIndex.value = null
  })
}

const dragOverTask = (e, index) => {
  e.preventDefault()
  e.stopPropagation()
  
  const rect = e.currentTarget.getBoundingClientRect()
  const mouseY = e.clientY
  const taskMiddle = rect.top + rect.height / 2
  
  if (mouseY < taskMiddle) {
    dragOverIndex.value = index
  } else {
    dragOverIndex.value = index + 1
  }
}

const dragOverColumn = (e) => {
  e.preventDefault()
  if (props.tasks.length === 0) {
    dragOverIndex.value = 0
  }
}

const dragLeave = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX
  const y = e.clientY
  
  if (x < rect.left || x >= rect.right || y < rect.top || y >= rect.bottom) {
    dragOverIndex.value = null
  }
}

const drop = (e) => {
  e.preventDefault()
  e.stopPropagation()
  
  const taskId = e.dataTransfer.getData('taskId')
  const fromStatus = e.dataTransfer.getData('fromStatus')
  
  if (!taskId) {
    dragOverIndex.value = null
    return
  }
  
  let targetIndex = dragOverIndex.value !== null ? dragOverIndex.value : props.tasks.length

  if (fromStatus === props.status) {
    const draggedTaskIndex = props.tasks.findIndex(t => t.id === taskId)
    if (draggedTaskIndex !== -1 && draggedTaskIndex < targetIndex) {
      targetIndex = targetIndex - 1
    }
  }
  
  dragOverIndex.value = null
  
  emit('drop', { 
    taskId, 
    newStatus: props.status, 
    newOrder: targetIndex,
    fromStatus 
  })
}

const handleDeleteTask = (taskId) => {
  emit('delete-task', taskId)
}

const colorClasses = {
  primary: 'bg-primary/10 border-primary',
  warning: 'bg-warning/10 border-warning',
  success: 'bg-success/10 border-success'
}
</script>

<template>
  <div class="flex-1 min-w-[300px]">
    <div 
      :class="[
        'rounded-lg border-t-4 p-4',
        colorClasses[color]
      ]"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-gray-700">{{ title }}</h2>
        <span class="badge badge-lg font-semibold">{{ tasks.length }}</span>
      </div>

      <div
        class="column-container space-y-3 min-h-[400px] rounded-lg py-2"
        @dragover="dragOverColumn"
        @dragleave="dragLeave"
        @drop="drop"
      >
        <template v-for="(task, index) in tasks" :key="task.id">
          <div 
            v-if="dragOverIndex === index"
            class="bg-primary/30 h-12 rounded-lg border-2 border-dashed border-primary transition-all"
          ></div>
          
          <div
            @dragover="dragOverTask($event, index)"
            @dragleave.stop
          >
            <TaskCard
              :task="task"
              :status="status"
              @delete="handleDeleteTask"
            />
          </div>
        </template>
        
        <div 
          v-if="dragOverIndex === tasks.length && tasks.length > 0"
          class="bg-primary/30 h-12 rounded-lg border-2 border-dashed border-primary transition-all"
        ></div>
        
        <div 
          v-if="tasks.length === 0" 
          class="text-center text-gray-400 py-8 h-full flex items-center justify-center"
        >
          No tasks yet
        </div>
      </div>
    </div>
  </div>
</template>