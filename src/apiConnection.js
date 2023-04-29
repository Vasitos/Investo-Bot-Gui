import axios from "axios";
 
const baseUrl = "/api/v1/"
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json",
  }
});


export default axiosInstance