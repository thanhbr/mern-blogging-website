import axios from "axios";
import { lookInSession } from "../common/session";
import { toast } from "react-hot-toast";

export function sendRequest(
  method,
  url,
  data,
) {
  try {
    const handleRequest = (resolve, reject) => {
      const userInSession = lookInSession("user");
      const token = JSON.parse(userInSession)?.access_token || "";
      
      const config = {
        method,
        url,
        withCredentials: true,
        headers: {authorization: `Bearer ${token}`},
      }

      if (data) config.data = data
      axios(config)
        .then(response => {
          if(response.data.auth_status == 403){
            location.replace(`${import.meta.env.VITE_SERVER_DOMAIN}/login`)
          }
          resolve(response)
          if (
            response &&
            response.data &&
            response.data.message === 'Unauthorized!'
          ) {
          }
        })
        .catch(error => {
          if(method == 'post')
            toast.error('Hệ thống đang bận, vui lòng chờ trong giây lát!');
        })
    }

    return new Promise((resolve, reject) => {
      handleRequest(resolve, reject)
    })
    
  } catch (error) {
    
  }
}