import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios"

// Base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://api.aizen.com"
// const API_BASE_URL="http://13.203.197.24:8000"


// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds
})

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token")
    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle specific error cases
    if (error.response) {
      // Server responded with an error status
      if (error.response.status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem("auth_token")
        window.location.href = "/"
      }
    } else if (error.request) {
      // Request made but no response received
      console.error("Network error. Please check your connection.")
    } else {
      // Error in setting up the request
      console.error("Error:", error.message)
    }
    return Promise.reject(error)
  },
)

// Generic GET request
export const getRequest = async (
  endpoint: string,
  params?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return apiClient.get(endpoint, { params, ...config })
}

// Generic POST request
export const postRequest = async (
  endpoint: string,
  data?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse> => {
  return apiClient.post(endpoint, data, config)
}

// Generic PUT request
export const putRequest = async (endpoint: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  return apiClient.put(endpoint, data, config)
}

// Generic DELETE request
export const deleteRequest = async (endpoint: string, config?: AxiosRequestConfig): Promise<AxiosResponse> => {
  return apiClient.delete(endpoint, config)
}

// Upload file request
export const uploadFileRequest = async (
  endpoint: string,
  file: File,
  onUploadProgress?: (progressEvent: any) => void,
): Promise<AxiosResponse> => {
  const formData = new FormData()
  formData.append("file", file)

  return apiClient.post(endpoint, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  })
}

