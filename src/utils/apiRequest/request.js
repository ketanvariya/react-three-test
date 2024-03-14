import { environmentVariable } from "../../variables";

const apiRequestHandler = function (baseUrl) {
  return {
    get: async function (path, params, headers) {
      if (params === undefined) params = [];
      if (headers === undefined) {
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
      }

      try {
        if (typeof path !== "string") {
          throw Object.assign(
            new Error(
              "api address { first parameter } must be in string formate."
            ),
            { code: 402 }
          );
        } else if (!Array.isArray(params)) {
          throw Object.assign(
            new Error("{ second parameter } must be type of array."),
            { code: 402 }
          );
        } else if (typeof headers !== "object") {
          throw Object.assign(
            new Error("{ third parameter } must be type of object."),
            { code: 402 }
          );
        } else {
        }
      } catch (err) {
        console.log(err);
        return undefined;
      }

      var queryParams = "";
      params.forEach((item, index) => {
        queryParams += `${Object.keys(item)[0].toString()}=${item[Object.keys(item)[0].toString()]
          }&&`;
      });
      queryParams = queryParams.substring(0, queryParams.length - 2);
      
      return await fetch(
        `${baseUrl}${path}?${queryParams}`,
        {
          method: "GET",
          headers: headers,
        }
      )
      .then((response) =>{
        status = response.status
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }else{
          return response.json()
        }

      } )
        .then((responseData) => {
          return responseData;
        })
        .catch((error) => {
          console.log(status,error)
          return {status,error};
        })    
      },
    post: async function (path, params, headers, abortController) {
      if (params === undefined) params = {};
      if (headers === undefined) {
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",

        };
      }

      try {
        if (typeof path !== "string") {
          throw Object.assign(
            new Error(
              "api address { first parameter } must be in string formate."
            ),
            { code: 402 }
          );
        } else if (typeof params !== "object") {
          throw Object.assign(
            new Error("{ second parameter } must be type of object."),
            { code: 402 }
          );
        } else if (typeof headers !== "object") {
          throw Object.assign(
            new Error("{ third parameter } must be type of object."),
            { code: 402 }
          );
        } else {
        }
      } catch (err) {
        console.log(`%c Http.post -${err}`, "color:blue;");
        return undefined;
      }
      let Data = {
        method: "POST",
        headers: headers,
        body: JSON.stringify(params),
      };
      if (abortController !== undefined) {
        Data = {
          signal: abortController.signal,
          method: "POST",
          headers: headers,
          body: JSON.stringify(params),
        };
      }
      if (params === undefined) params = {};
      let status
      return await fetch(
        baseUrl + path,
        Data
      )
      .then((response) =>{
        status = response.status
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }else{
          return response.json()
        }

      } )
      .then((responseData) => {
          return responseData;
        })
      .catch((error) =>{
        console.log(status,error)
        return {status,error}      
      });
    },
    put: async function (path, params, headers, abortController) {
      if (params === undefined) params = {};
      if (headers === undefined) {
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",

        };
      }

      try {
        if (typeof path !== "string") {
          throw Object.assign(
            new Error(
              "api address { first parameter } must be in string formate."
            ),
            { code: 402 }
          );
        } else if (typeof params !== "object") {
          throw Object.assign(
            new Error("{ second parameter } must be type of object."),
            { code: 402 }
          );
        } else if (typeof headers !== "object") {
          throw Object.assign(
            new Error("{ third parameter } must be type of object."),
            { code: 402 }
          );
        } else {
        }
      } catch (err) {
        console.log(`%c Http.post -${err}`, "color:blue;");
        return undefined;
      }
      let Data = {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(params),
      };
      if (abortController !== undefined) {
        Data = {
          signal: abortController.signal,
          method: "POST",
          headers: headers,
          body: JSON.stringify(params),
        };
      }
      if (params === undefined) params = {};
      let status
      return await fetch(
        baseUrl + path,
        Data
      )
      .then((response) =>{
        status = response.status
        if (!response.ok) {
          throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
        }else{
          return response.json()
        }

      } )
      .then((responseData) => {
          return responseData;
        })
        .catch((error) => {
          console.log(status,error)
          return {status,error};
        })    
      },
    delete: async function (path, params, headers, abortController) {
      if (params === undefined) params = {};
      if (headers === undefined) {
        headers = {
          Accept: "application/json",
          "Content-Type": "application/json",
        };
      }

      try {
        if (typeof path !== "string") {
          throw Object.assign(
            new Error(
              "api address { first parameter } must be in string formate."
            ),
            { code: 402 }
          );
        } else if (typeof params !== "object") {
          throw Object.assign(
            new Error("{ second parameter } must be type of object."),
            { code: 402 }
          );
        } else if (typeof headers !== "object") {
          throw Object.assign(
            new Error("{ third parameter } must be type of object."),
            { code: 402 }
          );
        } else {
        }
      } catch (err) {
        console.log(`%c Http.post -${err}`, "color:blue;");
        return undefined;
      }
      let Data = {
        method: "DELETE",
        headers: headers,
        body: JSON.stringify(params),
      };
      if (abortController !== undefined) {
        Data = {
          signal: abortController.signal,
          method: "DELETE",
          headers: headers,
        };
      }
      if (params === undefined) params = {};
      let status
      return await fetch(
        baseUrl + path,
        Data
      )
        .then((response) =>{
          status = response.status
          if (!response.ok && status!=204) {
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
          }else{
            return response.json()
          }

        } )
        .then((responseData) => {
          return {status,responseData};
        })
        .catch((error) => {
          console.log(status,error)
          return {status,error};
        })
    },
  };
};

export const odooApi = (function () {
  let baseUrl = "https://odooapi.azurewebsites.net/"
  return apiRequestHandler(baseUrl)
})()
export const nodeApi = (function () {
  let baseUrl = environmentVariable.REACT_APP_DatabaseServer
  return apiRequestHandler(baseUrl)
})()
export default apiRequestHandler;