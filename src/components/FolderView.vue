<template>
    <div>

        <a-modal v-model:open="add_request_modal" title="Folder name" @ok="ok">
            <a-form layout="vertical">
                <a-form-item>
                    <a-input v-model:value="folder_name"></a-input>
                </a-form-item>
            </a-form>
        </a-modal>

        <TreeView :item="folders"></TreeView>
    
    </div>

</template>
<script>
import TreeView from "../components/TreeView.vue";

import { useFolderStore } from "./../stores/folders";
import { useTabsStore } from "./../stores/tabs";
import { useRequestsStore } from "./../stores/requests";
import { useEditorStore } from "./../stores/editor";

import { mapState, mapActions } from 'pinia'

export default {
    components: {
        TreeView
    },
    data() {
        return {
            add_request_modal: false,
            folder_name: '',
            path: null,
        }
    },
    methods:{
        ...mapActions(useFolderStore, ['addResource']),
        ...mapActions(useEditorStore, ['openRequestInEditor']),
        ok() {
            this.addResource(this.path, true, this.folder_name);
            this.add_request_modal = false;
        }
    },
    mounted() {

        let self = this;

        this.$emitter.on('add-resource', function (is_folder, path, full_path) {
            if(is_folder) {
                self.path = path;
                self.add_request_modal = true;
            } else {
                self.addResource(path, false);
            }
            let elem = document.querySelector(`[data-path="${ full_path }"]`);
            if(elem) {
                elem.classList.remove("collapsed");
            }
        });

        this.$emitter.on('open-request-in-editor', function (request_id) {
            let request = self.requests.find(x => x.id == request_id);
            if(request) {
                self.openRequestInEditor(request.id);
            }
        });

    },
    computed: {
        ...mapState(useFolderStore, ['folders']),
        ...mapState(useFolderStore, ['folders']),
        ...mapState(useRequestsStore, ['requests']),
    },
    watch:{
        add_request_modal() {
            if(!this.add_request_modal){
                this.folder_name = "";
                this.path = null;
            }
        }
    }
}
</script>