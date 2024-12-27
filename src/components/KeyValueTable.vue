<template>
    <div class="flex items-center mb-2" v-for="(param, i) in data" :key="i">
        <div class="mr-2">
            <a-checkbox v-model:checked="param.checked"></a-checkbox>
        </div>
        <a-row class="flex-grow-1" :gutter="10">
            <a-col :span="10">
                <a-input type="text" v-model:value="param.key" placeholder="key" @change="onChange(i)"></a-input>
            </a-col>
            <a-col :span="14">
                <a-input type="text" v-model:value="param.value" placeholder="value" @change="onChange(i)"></a-input>
            </a-col>
        </a-row>
        <a-button class="ml-2" @click="deleteElement(i)" size="small" ghost :style="{ opacity: i < data.length - 1 ? '1' : '0' }">
            <template #icon>
                <unicon name="trash-alt" fill="royalblue"/>
            </template>
        </a-button>
    </div>
</template>
<script>
export default {
    props: [
        'data'
    ],
    methods:{
        onChange(i) {
            if(this.data[i].key != "" || this.data[i].value != "") {
                this.data[i].checked = true;
            }
            if(this.data[i].key == "" && this.data[i].value == "") {
                this.data.splice(i, 1);
            }
            if(i == this.data.length - 1) {
                this.data.push({
                    checked: false,
                    key: '',
                    value: ''
                });
            }
        },
        deleteElement(i) {
            this.data.splice(i, 1);
        }
    },
    mounted(){
        // if(!this.data || (this.data && !this.data.length)) {
        //     this.data = [{
        //         checked: false,
        //         key: '',
        //         value: ''
        //     }];
        // }
    }
}
</script>
