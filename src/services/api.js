import axios from 'axios';
import store  from '../store/index'

let baseURL

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  baseURL = 'http://app-sails:1337'
} else {
  baseURL = 'http://backend.tech.sdrm.me:7331'
}

export default {

    customApi(method, url) {
        return axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + store.getters.token ? store.getters.token : ''
            }
        })[method](url)
    },

    customApiParam(method, url, obj) {
        return axios.create({
            baseURL: baseURL,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + store.getters.token ? store.getters.token : ''
            }
        })[method](url, obj).catch((err) => {
            console.log("error",err)
        })
    }
}