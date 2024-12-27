import { defineStore } from 'pinia'
import { v4 as uuidv4 } from 'uuid';

import { useTabsStore } from "./tabs";

export const useRequestsStore = defineStore('requests', {
    state: () => ({
        requests: [],
        draft_requests: []
    }),
    actions: {
        newRequest(parent_path) {

            console.log("pp", parent_path);

            let id = uuidv4(); 
            let request = {
                id: id,
                name: "untitled",
                request_type: "get",
                url: "",
                path: parent_path + id
            }
            this.addRequest(request);
            return request;
        },
        addRequest(request) {
            this.requests.push(request);
        },
        addDraftRequest(request) {
            let index = this.draft_requests.findIndex(x => x.id == request.id);
            if(index > -1) {
                this.draft_requests[index] = request;
            }else{
                this.draft_requests.push(request);
            }

            const tabsStore = useTabsStore();

            let tab = tabsStore.tabs.find(x => x.id == request.id);
            if(tab) {
                tab.unsaved = true;
                console.log(tab)
            }

        },
    }
})