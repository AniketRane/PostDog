<template>
    <a-tabs class="editor-tabs" type="editable-card" hide-add  v-model:activeKey="activeTabCopy" @edit="edit">
        <a-tab-pane v-for="tab in tabs" closable :key="tab.id">
            <template #tab>
                <span :style="{ color: 'white' }">
                    <span class="text-uppercase mr-1" :style="{ fontSize: '10px' }">{{ tab.request_type }}</span>
                    <span>{{ tab.title }}</span>
                </span>
            </template>
            <template #closeIcon>
                <span class="unsaved-request-icon" :class="{ 'is-unsaved': tab.unsaved }">
                    <svg-icon  type="mdi" :path="mdiClose" :size="18"></svg-icon>
                </span>                
            </template>
        </a-tab-pane>
    </a-tabs>
</template>
<script>

import { mapState, mapActions } from 'pinia'
import { useTabsStore } from "./../stores/tabs";
import { useEditorStore } from "../stores/editor";

import { mdiClose } from "@mdi/js";

export default {
    data(){
        return {
            mdiClose
        }
    },
    computed: {
        ...mapState(useTabsStore, ['tabs']),
        ...mapState(useTabsStore, ['active_tab']),
        activeTabCopy: {
            get() {
                return this.active_tab;
            },
            set(value) {
                this.openRequestInEditor(value);
            }
        }
    },
    methods: {
        ...mapActions(useEditorStore, ['openRequestInEditor', 'closeRequestFromEditor']),
        edit(a) {
            // this.closeRequestFromEditor(a);

            this.$modal.confirm({
                title: "Attention",
                content: "Do you want to save",
                okText: "Yes",
                cancelText: "No",
                onCancel: () => {
                    console.log("onCancel")
                },
                onOk: () => {
                    console.log("onOk")
                }
            });

        }
    }
}
</script>
<style lang="scss">
.editor-tabs {
    .ant-tabs-nav::before {
        display: none;
    }
    .ant-tabs-nav-list {
        .ant-tabs-tab {
            background-color: #1d1c1c;
            border-color: transparent;
            border-radius: 8px !important;
            margin-right: 10px;
            // border-color: transparent;
            // border-radius: 8px !important;
            // margin-right: 10px;
            &:not(.ant-tabs-tab-active) {
                opacity: .3;
            }
        }
    }
}

.unsaved-request-icon {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    &.is-unsaved {
        &::before {
            content: "";
            position: absolute;
            height: 8px;
            width: 8px;
            background-color: #d3d3d3;
            border-radius: 50%;
        }
        svg {
            opacity: 0;
        }
        &:hover {
            &::before {
                opacity: 0;
            }
            svg {
                opacity: 1;
            }
        }
    }
    svg {
        opacity: 1;
    }
}

// .ant-tabs-tab-remove .unsaved-request {
//     position: relative;
//     &> .path {
//         opacity: 0;
//     }
//     &::before{
        // content: "";
        // position: absolute;
        // height: 10px;
        // width: 10px;
        // background-color: #d3d3d3;
//     }
// }

</style>