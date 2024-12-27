import { defineStore } from 'pinia'

import { useTabsStore } from "./tabs";
import { useRequestsStore } from "./requests";

export const useEditorStore = defineStore('editor', {
    state: () => ({
        request: null,
    }),
    actions: {
        openRequestInEditor(id) {
            const requestsStore = useRequestsStore();
            let request = requestsStore.requests.find(x => x.id == id);
            if(request) {

                this.request = request;

                const tabsStore = useTabsStore();
                
                tabsStore.addTab({
                    id: request.id,
                    title: request.name,
                    request_type: request.request_type,
                    unsaved: false,
                });

            }
        },
        closeRequestFromEditor(id) {

            const tabsStore = useTabsStore();
            
            let index = tabsStore.tabs.findIndex(x => x.id == id);

            if(index > -1) {
                tabsStore.removeTab(index);
                if(tabsStore.tabs.length == 0) {
                    this.request = null;
                } else {
                    const requestsStore = useRequestsStore();
                    let newActiveTabIndex = tabsStore.tabs[index] ? index : (tabsStore.tabs.length - 1);
                    let request = requestsStore.requests.find(x => x.id == tabsStore.tabs[newActiveTabIndex].id);
                    if(request) {
                        this.request = request;
                        tabsStore.makeTabActive(newActiveTabIndex);
                    }
                }
            }

            
        }
    }
})