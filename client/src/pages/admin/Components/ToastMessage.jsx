import { toast } from 'react-toastify'

export const glassToast = (message, type = 'default') => {
  // 🔹 Background & Shadow logic based on toast type
  let background, boxShadow

  switch (type) {
    case 'error':
      background = 'linear-gradient(to bottom right, rgba(80, 0, 0, 0.6), rgba(100, 0, 0, 0.3))'
      boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)' // reddish glow
      break

    case 'warning':
    case 'warn':
      background = 'linear-gradient(to bottom right, rgba(80, 60, 0, 0.6), rgba(100, 80, 0, 0.3))'
      boxShadow = '0 0 20px rgba(250, 204, 21, 0.4)' // yellowish glow
      break

    default:
      background = 'linear-gradient(to bottom right, rgba(10, 10, 42, 0.6), rgba(16, 16, 64, 0.3))'
      boxShadow = '0 0 20px rgba(34, 211, 238, 0.2)' // cyan glow
  }

  toast[type](message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
    style: {
      padding: '24px',
      borderRadius: '16px',
      background,
      border: '1px solid rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(40px)',
      boxShadow,
      color: '#fff',
    },
  })
}
