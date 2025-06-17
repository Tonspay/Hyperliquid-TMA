import {config} from "./config";

async function requester(url: string, requestOptions: any) {
    try {
      return (await fetch(url, requestOptions)).json();
    } catch (e) {
      console.log("🐞 req error", e);
    }
  
    return false;
  }
  
  function request_method_get(headers: any) {
    var requestOptions = {
      method: "GET",
      headers: headers,
      redirect: "follow",
    };
    return requestOptions;
  }
  
  function request_method_post(bodys: any, headers: any) {
    var requestOptions = {
      method: "POST",
      headers: headers,
      body: bodys,
      redirect: "follow",
    };
  
    return requestOptions;
  }
  
  function request_get_unauth() {
    return request_method_get({});
  }
  
  function request_post_unauth(data: any) {
    var h = new Headers();
  
    h.append("Content-Type", "application/json");
  
    return request_method_post(JSON.stringify(data), h);
  }

  async function api_deposite(data:any) {
    try {
      return await requester(
        `${config.api.baseUrl+config.api.router.deposite}`,
        request_post_unauth(
          data
        ),
      );
    } catch (e) {
      console.error(e);
      return 0;
    }
  }

  async function api_deposite_check(id:string) {
    try {
      return await requester(
        `${config.api.baseUrl+config.api.router.deposite_check}/${id}`,
        request_get_unauth(),
      );
    } catch (e) {
      console.error(e);
  
      return 0;
    }
  }

  async function api_hyper_liquid_info(type:string) {
    try {
      return await requester(
        `${config.api.hyperLiquidUrl+config.api.hyperLiquidRouter.info}`,
        request_post_unauth(
          {
            type
          }
        ),
      );
    } catch (e) {
      console.error(e);
  
      return 0;
    }
  }
  export {
    api_deposite,
    api_deposite_check,
    api_hyper_liquid_info
  }