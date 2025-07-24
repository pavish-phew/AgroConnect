import axios from "axios";

const ProductAPI = axios.create({
  baseURL: "http://localhost:8080",
  // baseURL: "http://192.168.77.227:8080",
  // baseURL: "http://172.16.2.211:8080",
});
delete ProductAPI.defaults.headers.common["Authorization"];
export default ProductAPI;