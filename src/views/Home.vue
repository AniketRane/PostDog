<template>
    
    <a-layout :style="{ minHeight: '100%' }">
        <a-layout-sider theme="light" width="16%" :style="{ color: 'white' }">
            
            <div class="ma-3">
                <FolderView/>
            </div>
            

        </a-layout-sider>
        <a-layout :style="{ padding: '20px' }">

            <TabsView/>

            <div v-if="editableRequest" :style="{ height: '100%' }">

                <a-card :style="{ height: '100%' }" :bodyStyle="{ padding: '0px', height: '100%' }">
                    <a-row :style="{ height: '100%' }">
                        <a-col :md="10" :style="{ borderRight: '1px solid #313131', padding: '0px' }">

                            <a-card class="mb-4" :style="{ margin: '18px' }" :bodyStyle="{ padding: '0px' }">
                                <a-input-group compact class="request-url-input">
                                    <a-input :bordered="false" placeholder="example.com/io" v-model:value="editableRequest.url">
                                        <template #prefix>
                                            <a-select class="request-type-select text-uppercase" 
                                                v-model:value="editableRequest.request_type" 
                                                :bordered="false" 
                                                :dropdownMatchSelectWidth="100"
                                                :dropdownStyle="{ textTransform: 'uppercase' }">
                                                <template #suffixIcon>
                                                    <unicon class="pl-1" name="direction" fill="#00b96b"/>
                                                </template>
                                                <a-select-option v-for="(x, k) in request_type_options" :key="k" :value="x">{{ x }}</a-select-option>
                                            </a-select>
                                        </template>
                                    </a-input>
                                    <a-button type="primary" :style="{ height: 'auto' }" :loading="loading" @click="sendRequest">Send</a-button>
                                </a-input-group>
                            </a-card>

                            <a-tabs class="request-data-tabs">
                                <template #leftExtra>
                                    <div class="pr-4"></div>
                                </template>
                                <a-tab-pane key="1" class="px-3">
                                    <template #tab>
                                        Params<a-badge class="ml-2" :count="paramsCount"/>
                                    </template>
                                    <KeyValueTable :data="params"/>
                                </a-tab-pane>
                                <a-tab-pane key="2" tab="Headers" class="px-3">
                                    <KeyValueTable :data="headers"/>
                                </a-tab-pane>
                                <a-tab-pane key="3" tab="Auth" class="px-3">
                                    Auth
                                </a-tab-pane>
                                <a-tab-pane key="4" tab="Body">
                                    
                                    <div class="flex items-center" :style="{ padding: '0px 10px 10px 10px', borderBottom: '1px solid #313131' }">
                                        
                                        <a-select 
                                            v-model:value="body_type"
                                            :bordered="false"
                                            :dropdownMatchSelectWidth="100"
                                            :style="{ backgroundColor: '#1c1a1a', borderRadius: '6px' }">
                                            <template #suffixIcon>
                                                <span :style="{ width: '16px' }">
                                                    <unicon name="direction" fill="#00b96b"/>
                                                </span>
                                            </template>
                                            <a-select-option v-for="(x, k) in body_type_options" :key="k" :value="x">{{ x }}</a-select-option>
                                        </a-select>

                                        <a-select v-if="body_type == 'Text'"
                                            class="ml-2"
                                            v-model:value="text_type"
                                            :bordered="false"
                                            :dropdownMatchSelectWidth="100"
                                            :style="{ backgroundColor: '#1c1a1a', borderRadius: '6px' }">
                                            <template #suffixIcon>
                                                <span :style="{ width: '16px' }">
                                                    <unicon name="direction" fill="#00b96b"/>
                                                </span>
                                            </template>
                                            <a-select-option v-for="(x, k) in text_type_options" :key="k" :value="x">{{ x }}</a-select-option>
                                        </a-select>

                                        <div v-if="body_type == 'Form'" class="ml-2 flex items-center">
                                            <a-switch class="mr-2" v-model:checked="form_multipart" size="small"></a-switch>
                                            <span @click="form_multipart = !form_multipart">Multipart</span>
                                        </div>

                                    </div>

                                    <Codemirror
                                        v-if="body_type == 'Text'"
                                        v-model="temp_code"
                                        class="body-cm"
                                        :autofocus="true"
                                        :indent-with-tab="true"
                                        :tab-size="2"
                                        :extensions="extensions"/>

                                </a-tab-pane>
                            </a-tabs>

                        </a-col>
                        <a-col :md="14">

                            <div v-if="response !== null" class="response-preview">
                                
                                <div class="pa-2 flex">
                                    
                                    <a-select
                                        class="mr-2"
                                        v-model:value="response_type"
                                        :bordered="false"
                                        :dropdownMatchSelectWidth="100"
                                        :style="{ backgroundColor: '#1c1a1a', borderRadius: '6px' }">
                                        <template #suffixIcon>
                                            <span :style="{ width: '16px' }">
                                                <unicon name="direction" fill="#00b96b"/>
                                            </span>
                                        </template>
                                        <a-select-option v-for="(x, k) in response_type_options" :key="k" :value="x">{{ x }}</a-select-option>
                                    </a-select>

                                    <div v-if="response_type == 'HTML'" class="ml-2 flex items-center">
                                        <a-switch class="mr-2" v-model:checked="response_preview" size="small"></a-switch>
                                        <span @click="response_preview = !response_preview">Preview</span>
                                    </div>

                                </div>
                                
                                <iframe v-if="response_type == 'HTML' && response_preview == true" :srcdoc="response" sandbox="allow-scripts"/>
                                
                                <Codemirror
                                    v-else
                                    v-model="response"
                                    class="body-cm"
                                    :autofocus="true"
                                    :indent-with-tab="true"
                                    :tab-size="2"
                                    :extensions="responseCMExtensions"/>

                            </div>
                            
                            


                        </a-col>
                    </a-row>
                </a-card>

            </div>

        </a-layout>
    </a-layout>
</template>
<script>

import KeyValueTable from "./../components/KeyValueTable.vue"
import { Codemirror } from 'vue-codemirror'
import { json } from '@codemirror/lang-json'
import { xml } from '@codemirror/lang-xml'
import { html } from '@codemirror/lang-html'
import { StreamLanguage } from '@codemirror/language'
import { yaml } from '@codemirror/legacy-modes/mode/yaml'
import { oneDark } from '@codemirror/theme-one-dark'
import  prettier from "prettier/standalone";
import * as htmlParser from "prettier/plugins/html";
import FolderView from "../components/FolderView.vue";
import { mapState, mapActions } from 'pinia'

import { useEditorStore } from "./../stores/editor";
import { useRequestsStore } from "./../stores/requests";

import TabsView from "./../components/TabsView.vue"

export default {
    name: 'Home',
    components: {
        KeyValueTable,
        Codemirror,
        FolderView,
        TabsView
    },
    data() {
        return {
            
            loading: false,

            params: [{
                checked: false,
                key: '',
                value: ''
            }],
            headers: [{
                checked: false,
                key: '',
                value: ''
            }],
            
            body_type: 'Text',
            body_type_options: [
                'Text', 'Form', 'File'
            ],

            request_type_options: [
                'get', 'post', 'patch', 'put', 'delete'
            ],

            text_type: 'Raw',
            text_type_options: [
                'Raw', 'JSON', 'YAML', 'XML'
            ],

            form_multipart: false,

            response: null,

            response_type: 'HTML',
            response_type_options: [
                'Raw', 'HTML', 'JSON', 'YAML', 'XML'
            ],

            response_preview: true,

            temp_code: '',

        }
    },
    methods: {
        ...mapActions(useRequestsStore, ['addDraftRequest']),
        sendRequest() {

            this.loading = true;

            this.$axios({
                method: this.editableRequest.request_type,
                url: this.editableRequest.url
            }).then(response => {
                this.loading = false;
                console.log(response.data);
                this.response = response.data;
            }).catch(error => {
                this.loading = false;
                console.log(error);
            });
        },
        onKeyDown(e) {
            if (e.ctrlKey && e.key === 's') {
                console.log("onKeyDown")
                e.preventDefault();
            }
        }
    },
    mounted() {

        document.addEventListener('keydown', this.onKeyDown);

        prettier.format("{ 'hey': 'Hi' }", {
            parser: "html",
            plugins: [
                htmlParser
            ]
        }).then(a => {
            this.temp_code = a;
        })

    },
    computed: {

        ...mapState(useEditorStore, ['request']),

        editableRequest: {
            get() {
                return this.request;
            },
            set(val) {
                console.log("request chnages")
            }
        },

        paramsCount() {
            return this.params.filter(x => x.checked == true).length;
        },

        extensions() {

            switch(this.text_type) {
                case "Raw":
                    return [
                        oneDark
                    ];
                case "JSON":
                    return [
                        json(), oneDark
                    ];
                case "YAML":
                    return [
                        StreamLanguage.define(yaml), oneDark
                    ];
                case "XML":
                    return [
                        xml(), oneDark
                    ];
            }
        },
        responseCMExtensions() {
            switch(this.response_type) {
                case "Raw":
                    return [
                        oneDark
                    ];
                case "HTML":
                    return [
                    html(), oneDark
                    ];
                case "JSON":
                    return [
                        json(), oneDark
                    ];
                case "YAML":
                    return [
                        StreamLanguage.define(yaml), oneDark
                    ];
                case "XML":
                    return [
                        xml(), oneDark
                    ];
            }
        }
    },
    watch:{
        editableRequest: {
            handler(newVal, oldVal) {
                if(newVal!== null && oldVal !== null && newVal.id == oldVal.id) {
                    this.addDraftRequest(newVal);
                }
            },
            deep: true
        }
    }
}
</script>
<style lang="scss">
.body-cm {
    .cm-editor,
    .cm-gutters {
        background-color: transparent;
    }
    .cm-activeLineGutter, 
    .cm-activeLine {
        background-color: #25272a;
    }
}
.request-data-tabs {
    .ant-tabs-nav {
        margin-bottom: 10px;
    }
}
.request-url-input {
    display: flex !important;
    .request-type-select {
        .ant-select-selector {
             padding-left: 4px;
        }
    }
}
.response-preview {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    > iframe { 
        flex-grow: 1;
    }
}

</style>