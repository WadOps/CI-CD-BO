import axios from 'axios';
import store  from '../store/index'

export default {

    customApi(method, url) {
        return axios.create({
            // baseURL: `http://localhost:1337`,
            baseURL: `http://app-sails:1337`, // for docker env
            baseURL: `http://app-sails`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + store.getters.token ? store.getters.token : ''
            }
        })[method](url)
    },

    customApiParam(method, url, obj) {
        return axios.create({
            // baseURL: `http://localhost:1337`,
            baseURL: `http://app-sails:1337`, // for docker env
            baseURL: `http://app-sails`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + store.getters.token ? store.getters.token : ''
            }
        })[method](url, obj).catch((err) => {
            console.log("error",err)
        })
    }
}