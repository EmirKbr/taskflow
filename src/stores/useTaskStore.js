import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref([])

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem('kanban-tasks')
    if (saved) {
      tasks.value = JSON.parse(saved)
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('kanban-tasks', JSON.stringify(tasks.value))
  }

  loadFromLocalStorage()

  watch(tasks, saveToLocalStorage, { deep: true })

  const addTask = (taskData) => {
    const newTask = {
      id: Date.now().toString(),
      title: taskData.title,
      description: taskData.description || '',
      status: 'todo',
      order: tasks.value.filter(t => t.status === 'todo').length,
      createdAt: new Date().toISOString()
    }
    tasks.value.push(newTask)
  }

  const deleteTask = (taskId) => {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      tasks.value.splice(index, 1)
    }
  }

  const updateTaskStatus = (taskId, newStatus, newOrder = null) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return

    const oldStatus = task.status
    task.status = newStatus

    if (oldStatus !== newStatus) {
      reorderTasksInColumn(oldStatus)
    }

    const targetTasks = tasks.value
      .filter(t => t.status === newStatus && t.id !== taskId)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    const insertIndex = newOrder !== null ? newOrder : targetTasks.length
    targetTasks.splice(insertIndex, 0, task)

    targetTasks.forEach((t, index) => {
      t.order = index
    })
  }

  const reorderTasksInColumn = (status) => {
    const columnTasks = tasks.value
      .filter(t => t.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    columnTasks.forEach((task, index) => {
      task.order = index
    })
  }

  const updateTask = (taskId, updates) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (task) {
      Object.assign(task, updates)
    }
  }

  const getTasksByStatus = (status) => {
    return tasks.value
      .filter(t => t.status === status)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  const moveTaskInColumn = (taskId, newOrder, status) => {
    const task = tasks.value.find(t => t.id === taskId)
    if (!task) return

    const columnTasks = tasks.value
      .filter(t => t.status === status && t.id !== taskId)
      .sort((a, b) => (a.order || 0) - (b.order || 0))

    columnTasks.splice(newOrder, 0, task)

    columnTasks.forEach((t, index) => {
      t.order = index
    })
  }

  return {
    tasks,
    addTask,
    deleteTask,
    updateTaskStatus,
    updateTask,
    getTasksByStatus,
    moveTaskInColumn
  }
})