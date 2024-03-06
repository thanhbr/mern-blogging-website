import { sendRequest } from '../utils/api';

const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = { } }) => {
  let obj;

  try {
    if(state !== null && !create_new_arr) {
      obj = {
        ...state,
        results: [
          ...state.results,
          ...data
        ],
        page: page
      } 
    } else {
      const response = await sendRequest("post", `${import.meta.env.VITE_SERVER_DOMAIN}${countRoute}`, data_to_send );
  
      obj = {
        results: data,
        page: 1,
        totalDocs: response?.data?.data?.totalDocs
      }
    }
    return obj;
    
  } catch (error) {
    console.error(error);
  }
}

export default filterPaginationData;