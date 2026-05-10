import axios from 'axios';
const baseUrl = 'http://localhost:3001/api/products';


export const getAll = async () => {
    const res = await axios.get(baseUrl);
    return res.data;
  };


export const getOne = async (id) => {
    const res = await axios.get(`${baseUrl}/${id}`);
    return res.data;
  };


export const create = async (newProduct) => {
    const res = await axios.post(baseUrl, newProduct);
    return res.data;
  };

export const update = async (id, updatedProduct) => {
    const res = await axios.put(`${baseUrl}/${id}`, updatedProduct);
    return res.data;
  };

export const remove = async (id) => {
    const res = await axios.delete(`${baseUrl}/${id}`);
    return res.data;
  };

export const search = async (query) => {
    const res = await axios.get(`${baseUrl}?search=${query}`);
    return res.data;
  };

export default {
    getAll,
    getOne,
    create,
    update,
    remove,
    search,
  };