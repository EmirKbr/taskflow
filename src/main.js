import './assets/main.css';
import 'vue3-toastify/dist/index.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import Vue3Toasity from 'vue3-toastify';

import App from './App.vue';

const app = createApp(App);

app.use(Vue3Toasity, {
  autoClose: 1500,
  dangerouslyHTMLString: true,
  closeButton: false,
  newestOnTop: true,
  position: 'top-right'
});

app.use(createPinia());

app.mount('#app');
