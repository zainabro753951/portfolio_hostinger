import { FaCode, FaDatabase, FaUserLock } from 'react-icons/fa6'
import { FiCpu } from 'react-icons/fi'
import { MdOutlineDesignServices } from 'react-icons/md'
import { RiSeoLine, RiShoppingCart2Line } from 'react-icons/ri'

// ✅ Function to select icon based on title
export const useGetServiceIcon = (title = '') => {
  const text = title.toLowerCase()
  if (text.includes('web')) return <FaCode />
  if (text.includes('backend')) return <FaDatabase />
  if (text.includes('auth') || text.includes('security')) return <FaUserLock />
  if (text.includes('performance')) return <FiCpu />
  if (text.includes('design')) return <MdOutlineDesignServices />
  if (text.includes('seo')) return <RiSeoLine />
  if (text.includes('ecommerce')) return <RiShoppingCart2Line />

  // default fallback icon
  return <FaCode />
}
