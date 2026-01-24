import bcrypt from 'bcrypt'

export const hashIp = async ip => {
  try {
    if (!ip) return null

    // 👇 Mask last segment for privacy (example: 192.168.1.xxx)
    const maskedIp = ip.replace(/\d+$/, 'xxx')

    // 👇 Generate a salt (you can increase rounds if needed, default = 10)
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)

    // 👇 Hash the masked IP
    const hashedIp = await bcrypt.hash(maskedIp, salt)

    return hashedIp
  } catch (error) {
    console.error('Error hashing IP:', error)
    return null
  }
}
