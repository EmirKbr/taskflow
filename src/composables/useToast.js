import { toast } from 'vue3-toastify';

export function useToast() {
  const showToast = (message, options = {}) => {
    toast(message, options);
  };

  return {
    showToast
  };
}
