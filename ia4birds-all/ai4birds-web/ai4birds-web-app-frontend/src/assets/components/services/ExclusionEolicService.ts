import api from "./main";
//import { getToken } from "@/utils/utils";

class ExclusionEolicService {
    
    // async loginGoogle(token: string) {
    //     const response = await api.post("/auth/google", {
    //         token: token,
    //     });
    //     return response;
    // }


    // async loginGithub(token: string) {
    //     const response = await api.post("/auth/github", {
    //         token: token,
    //     });
    //     return response;
    // }

    async getExclusionMap() {
         const response = await api.get("/data/exclusionmap/zip", {
            headers: {
        //         "x-access-token": getToken(),
              },
        })
        return response;
    }  
    
    async getExclusionResourcesMap(body) {
         const response = await api.post("/data/windmap", body
         //{
    //        headers: {
    //    //         "x-access-token": getToken(),
    //          },
       //}
       )
       return response;
   } 

}

export default new ExclusionEolicService();
