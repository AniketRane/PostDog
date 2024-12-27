<template>
    
    <div class="collapsible collapsed" v-if="item" :data-path="item.path">
        <div class="collapsible-header" @click="toggleCollapsible" @dblclick="openRequestInEditor">
            <div class="mr-1">
                <unicon v-if="item.type == 'folder'" class="drop-icon" name="angle-right-b" fill="royalblue" height="16px" width="16px"/>
            </div>
            <div v-if="item.type == 'folder'" class="mr-2">
                <unicon name="folder" fill="royalblue" height="16px" width="16px"/>
            </div>
            <div class="flex-grow-1 flex items-center">
                <div v-if="item.type == 'request'" :style="{ fontSize: '11px', marginRight: '10px', textTransform: 'uppercase' }">{{ item.meta.request_type }}</div>
                <div v-if="item.type == 'folder'">{{ item.name }}</div>
                <div v-else>{{ item.request_name }}</div>
            </div>
            <div class="hidden-icons">

                <a-popover v-model:open="popover" title="Create New" trigger="click">
                    <template #content>
                        <a-button class="mb-2 flex items-center" size="small" type="text" block @click="addResource">
                            <template #icon>
                                <unicon class="mr-2" name="folder" fill="royalblue" height="16px" width="16px"/>
                            </template>
                            Folder
                        </a-button>
                        <a-button class="mb-2 flex items-center" size="small" type="text" block @click="addResource(false)">
                            <template #icon>
                                <unicon class="mr-2" name="postcard" fill="royalblue" height="16px" width="16px"/>
                            </template>
                            Request
                        </a-button>
                    </template>
                    <a-button v-if="item.children" size="small" class="px-1 flex items-center" type="text" @click.stop="popover = true">
                        <unicon name="plus" fill="royalblue" height="16px" width="16px"/>
                    </a-button>
                </a-popover>

                
            </div>
        </div>
        <div class="collapsible-content">
            <div class="ml-4" v-for="(item, i) in item.children" :key="i">
                <TreeView :item="item"></TreeView>
            </div>
        </div>
    </div>

</template>
<script>
export default {
    name: 'TreeView',
    props: [
        'item'
    ],
    data()  {
        return {
            popover: false,
        }
    },
    components:{
        TreeView: () => import("./../components/TreeView.vue")
    },
    methods: {
        parentNode() {
            return this.$parent;
        },
        handleClick() {

            console.log(this)

            let path = [];
            let comp = this;
            while(comp.item && comp.item.name) {
                path.unshift(comp.item.name);
                if (typeof comp.parentNode === "function") comp = comp.parentNode(); else break;
            }

            console.log(path);

        },
        toggleCollapsible(event) {
            if(this.item.type == "folder") {
                let parentNode = event.currentTarget.parentNode;
                parentNode.classList.toggle("collapsed");
            }
        },
        openRequestInEditor() {
            if(this.item.type == "request") {
                this.$emitter.emit('open-request-in-editor', this.item.request_id);
            }
        },
        addResource(is_folder = true) {

            this.popover = false;
            
            let path = [];

            var node = this.$parent

            path.push(this.label);
            
            do {
                if(node.label != undefined) {
                    path.push(node.label);
                }
                node = node.$parent
            }while(node.label !== undefined)

            path = path.reverse();
            path.shift();

            this.$emitter.emit('add-resource', is_folder, path, this.item.path);

        }
    },
    mounted() {
        
    },
    computed:{
        label() {
            return this.item.name;
        }
    }
}
</script>
<style lang="scss">
.collapsible {
    .collapsible-content {
        height: auto;
        position: relative;
        &::before{        
            content: "";
            height: 100%;
            width: .1px;
            background-color: #494949;
            left: 12px;
            position: absolute;
        }
    }
    .collapsible-header {
        display: flex;
        align-items: center;
        padding: 4px 6px;
        margin-bottom: 4px;
        .drop-icon {
            transform: rotate(90deg);
        }
        &:hover {
            background-color: rgb(44, 44, 44);
            .hidden-icons {
                opacity: 1;
            }
        }
        .hidden-icons {
            opacity: 0;
        }
    }
    &.collapsed {
        &> .collapsible-content {
            height: 0px;
            overflow: hidden;
        }
        &> .collapsible-header .drop-icon {
            transform: rotate(0deg);
        }
    }
}
</style>