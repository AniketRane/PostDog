export function getPath(path, add_slash = false) {
    let full_path = "/" + path.join("/");
    if(add_slash && full_path[full_path.length - 1] !== "/" ) {
        return full_path + "/";
    }
    return full_path;
}
