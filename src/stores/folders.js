import { defineStore } from 'pinia'

import { useRequestsStore } from "./requests";

import { getPath } from "./../utlis/path-utlis";

export const useFolderStore = defineStore('folders', {
    state: () => ({
        folders: {
            name: "Collection",
            type: "folder",
            path: "/",
            children: []
        },
    }),
    actions: {
        addResource(path, is_folder, folder_name = null) {

            let k = Object.values(path);

            let e = this.folders.children;

            path.forEach((a, o) => {
                let g = e.find(c => c.name == a);
                e = g.children;
            });

            if(is_folder) {

                k.push(folder_name);

                let full_path = getPath(k);

                e.push({
                    name: folder_name,
                    type: 'folder',
                    path: full_path,
                    children: []
                })
                
            } else {

                const requests = useRequestsStore();

                let parent_path = getPath(k, true);

                let { name, id, request_type, path } = requests.newRequest(parent_path);

                e.push({
                    request_name: name,
                    request_id: id,
                    type: "request",
                    meta: {
                        request_type
                    },
                    path: path
                });
            }

        }
    }
})