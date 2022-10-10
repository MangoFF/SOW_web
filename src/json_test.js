import axios from "axios";
export function JsonTest(data){
    return axios.request({
        url:'http://localhost:8080/JsonTest',
        dataType:'json',
        method:'post',
        data
    })
}