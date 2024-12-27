import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import 'ant-design-vue/dist/reset.css';
import 'antd-css-utilities/utility.min.css'

import Unicon from 'vue-unicons'

import axios from 'axios';
// import * as prettier from "prettier";

import Emitter from "tiny-emitter";

import SvgIcon from '@jamescoyle/vue-icon'

import { Modal } from 'ant-design-vue';

import { 
    uniAngleRightB,
    uniDirection,
    uniTrashAlt,
    uniPlus,
    uniFolder,
    uniPostcard,
    uniTimes
 } from 'vue-unicons/dist/icons'

Unicon.add([ uniDirection, uniTrashAlt, uniAngleRightB, uniPlus, uniFolder, uniPostcard, uniTimes ]);

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Unicon)

app.config.globalProperties.$axios = axios;
app.config.globalProperties.$modal = Modal;

app.config.globalProperties.$emitter = new Emitter();

app.component("svg-icon", SvgIcon);

app.mount('#app')
