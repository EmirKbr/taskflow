<script setup>
import { onMounted, ref } from 'vue'
import { useModal } from '@/composables/useModal'

const { modalId, activeComponent, componentProps, setBaseModelRef } = useModal()
const dialogRef = ref(null)

onMounted(() => {
  setBaseModelRef(dialogRef.value)
})
</script>

<template>
  <dialog :id="modalId" ref="dialogRef" class="modal w-*">
    <div class="modal-box">
      <component :is="activeComponent" v-bind="componentProps" />
    </div>
  </dialog>
</template>
