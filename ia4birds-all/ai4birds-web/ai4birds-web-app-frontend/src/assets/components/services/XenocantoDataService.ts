import api from "./main";

class XenocantoDataService {
    
    async getXenocanto() {
         const response = await api.get("/data/xenocanto", {
            headers: {
        //         "x-access-token": getToken(),
              },
        })
        return response;
    }
}

export default new XenocantoDataService();