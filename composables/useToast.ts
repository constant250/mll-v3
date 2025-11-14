export function useToast() {
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    if (process.client) {
      const nuxtApp = useNuxtApp()
      const bootstrap = nuxtApp.$bootstrap
      
      if (!bootstrap || !bootstrap.Toast) {
        console.error('Bootstrap Toast is not available')
        // Fallback to alert if Bootstrap is not available
        alert(message)
        return
      }
      
      // Create toast container if it doesn't exist
      let toastContainer = document.getElementById('toast-container')
      if (!toastContainer) {
        toastContainer = document.createElement('div')
        toastContainer.id = 'toast-container'
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3'
        toastContainer.style.zIndex = '9999'
        document.body.appendChild(toastContainer)
      }

      // Create toast element
      const toastId = `toast-${Date.now()}`
      const bgClass = type === 'success' ? 'bg-success' : type === 'error' ? 'bg-danger' : 'bg-info'
      const textClass = 'text-white'
      
      const toastElement = document.createElement('div')
      toastElement.id = toastId
      toastElement.className = `toast ${bgClass} ${textClass}`
      toastElement.setAttribute('role', 'alert')
      toastElement.setAttribute('aria-live', 'assertive')
      toastElement.setAttribute('aria-atomic', 'true')
      toastElement.innerHTML = `
        <div class="toast-header ${bgClass} ${textClass} border-0">
          <strong class="me-auto">${type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Info'}</strong>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${message}
        </div>
      `

      toastContainer.appendChild(toastElement)

      // Initialize and show toast
      const toast = new bootstrap.Toast(toastElement, {
        autohide: true,
        delay: 5000
      })

      toast.show()

      // Remove toast element after it's hidden
      toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove()
      })
    }
  }

  return {
    showToast,
    success: (message: string) => showToast(message, 'success'),
    error: (message: string) => showToast(message, 'error'),
    info: (message: string) => showToast(message, 'info')
  }
}

