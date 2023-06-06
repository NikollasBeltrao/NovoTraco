import axios from 'axios';

const api = axios.create({
    //baseURL: 'https://backend-analise.000webhostapp.com/novotraco/',     
    baseURL: 'http://localhost/novotraco/api/',     
});

export default api;