import axios from "axios";
 
const baseUrl = "https://api-investo-bot.vasitos.software/api/v1/"
const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-type": "application/json",
  }
});


export default axiosInstance