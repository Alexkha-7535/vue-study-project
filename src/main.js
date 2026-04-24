import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import components from '@/components/UI';
import router from '@/router/router.js';
import VIntersection from '@/directives/VIntersection.js';
import directives from '@/directives';
import store from '@/store';
const app = createApp(App)

components.forEach(component => {
    app.component(component.name, component)
})

directives.forEach(directive => {
    app.directive(directive.name, directive)
})

app
    .use(router)
    .use(store)
    .use(createPinia())
    .mount('#app');