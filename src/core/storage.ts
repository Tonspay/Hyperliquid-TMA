
import {config} from "./config"


const setKey = (key:string) =>
{
    try{
    localStorage.setItem(config.storage.baseTag+config.storage.router.key,key)
    return true;
}catch(e){
    return ""
}
}

const getKey = () =>
{
    try{
    return localStorage.getItem(config.storage.baseTag+config.storage.router.key)
}catch(e){
    return ""
}
}
export{
    setKey,
    getKey
}