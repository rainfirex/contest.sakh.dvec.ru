import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuelidate from 'vuelidate';
import App from "./app/App";
import router from "./app/router";
import store from "./app/store";
import 'bootstrap/dist/css/bootstrap.css';

require('./bootstrap');

Vue.use(VueRouter);
Vue.use(Vuelidate);

const app = new Vue({
    el: '#app',
    store,
    router,
    render : h => h(App)
});
