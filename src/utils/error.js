// import { useAppStore } from '@/stores/app'

// Handle different types of errors
const handleErrors = (error) => {
  // const appStore = useAppStore()

  // Check if error is from axios
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const status = error.response.status

    switch (status) {
      case 401:
        // appStore.setError('Unauthorized')
        // Redirect to login page or show login modal
        break
      case 404:
        // appStore.setError('Not Found')
        // Redirect to error page or show error message
        break
      default:
        // appStore.setError('An error occurred')
        // Show generic error message
        break
    }
  } else if (error.request) {
    // The request was made but no response was received
    // appStore.setError('No response from server')
    // Handle network errors
  } else {
    // Something happened in setting up the request that triggered an error
    // appStore.setError('Request failed')
    // Handle request setup errors
  }
}

export default handleErrors
