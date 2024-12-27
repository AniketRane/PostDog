import { defineStore } from 'pinia'

export const useTabsStore = defineStore('tabs', {
    state: () => ({
        tabs: [],
        active_tab: null
    }),
    actions: {
        addTab(tab) {
            let index = this.tabs.findIndex(x => x.id == tab.id);
            if(index < 0) {
                this.tabs.push(tab);
            }
            this.active_tab = tab.id;
        },
        makeTabActive(index) {
            this.active_tab = this.tabs[index].id;
        },
        removeTab(index) {
            this.tabs.splice(index, 1);
            if(this.tabs.length == 0){
                this.active_tab = null;
            }
        }
    }
})