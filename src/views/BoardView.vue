<script setup>
import { ref, computed } from 'vue'
import { useTaskStore } from '../stores/useTaskStore'
import TheAddTaskModal from '../modals/TheAddTaskModal.vue'
import TaskColumn from '../components/TaskColumn.vue'

const store = useTaskStore()
const showModal = ref(false)

const columns = [
  { title: 'To Do', status: 'todo', color: 'primary' },
  { title: 'Doing', status: 'doing', color: 'warning' },
  { title: 'Done', status: 'done', color: 'success' }
]

const getTasksForColumn = (status) => {
  return computed(() => store.getTasksByStatus(status))
}

const handleDrop = ({ taskId, newStatus, newOrder, fromStatus }) => {
  if (fromStatus === newStatus) {
    store.moveTaskInColumn(taskId, newOrder, newStatus)
  } else {
    store.updateTaskStatus(taskId, newStatus, newOrder)
  }
}

const handleDeleteTask = (taskId) => {
  store.deleteTask(taskId)
}
</script>

<template>
  <div class="min-h-screen bg-base p-8">
    <div class="flex justify-between items-center mb-8">
      <div class="flex items-center gap-1">
        <img src="/logo.png" alt="TaskFlow Logo" class="h-8 w-8" />
        <h1 class="font-[Audiowide] text-2xl font-bold text-primary">TaskFlow</h1>
      </div>
      <button class="btn btn-primary rounded-lg" @click="showModal = true">
        + Add Task
      </button>
    </div>

    <div class="flex gap-6 overflow-x-auto pb-4">
      <TaskColumn v-for="column in columns" :key="column.status" :title="column.title" :status="column.status"
        :color="column.color" :tasks="getTasksForColumn(column.status).value" @drop="handleDrop"
        @delete-task="handleDeleteTask" />
    </div>

    <TheAddTaskModal v-model="showModal" />
  </div>
</template>