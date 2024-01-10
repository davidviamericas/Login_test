import axios from "axios";
import { interceptorProps } from "../../common/types";
import useAxiosInterceptor from "../../common/stores/axios_interceptor";
import { v4 as uuidv4 } from 'uuid';

const axiosInstance = axios.create();

interface AxiosMonitorProps {
  urlApi: string;
  method: string;
  headers: any;
  bodyRequest: any | null;
}

const makeRequest = async ({ urlApi, method, headers, bodyRequest }: AxiosMonitorProps) => {
  try {
    const response = await axiosInstance({
      method: method,
      url: urlApi,
      headers: headers,
      data: JSON.stringify(bodyRequest)
    });

    return response;
  } catch (error) {
    // Puedes manejar el error aquí según tus necesidades
    console.error('Error en la solicitud:', error);
    //alert('Error en la solicitud, revisa la consola');
    throw error;
  }
};

const AxiosMonitor = async (props: AxiosMonitorProps, setInterceptor: any, updateInterceptor: any, getOpenInterceptor: any, setOpenInterceptor: any) => {

  let interceptor: interceptorProps;

  const catchResponse = (response: any) => {
    if (getOpenInterceptor()) {
      interceptor.bodyResponse = response.data || response;
      interceptor.code = response.status || response.code;
      updateInterceptor(interceptor);
    }
  }

  const requestInterceptor = axiosInstance.interceptors.request.use((config) => {
    if (getOpenInterceptor()) {
      interceptor = {
        key: uuidv4(),
        URL: config.url || '',
        method: config.method || '',
        headers: config.headers || '',
        bodyRequest: typeof config.data === 'string' ? JSON.parse(config.data) : config.data,
        bodyResponse: null,
        code: null
      }
      setInterceptor(interceptor);
    }
    axiosInstance.interceptors.request.eject(requestInterceptor);
    return config;
  });

  const responseInterceptor = axiosInstance.interceptors.response.use((response) => {
    catchResponse(response);
    axiosInstance.interceptors.response.eject(responseInterceptor);
    return response;
  }, (error) => {
    console.error('Error de respuesta:', error);
    catchResponse(error.response || error);
    axiosInstance.interceptors.response.eject(responseInterceptor);
    return Promise.reject(error);
  });

  const response = await makeRequest(props)

  return response;
}

export default AxiosMonitor;