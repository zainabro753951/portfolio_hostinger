import jwt from 'jsonwebtoken'

const generateTokenAndSaveCookie = async (data, isRememberMe = false, res) => {
  const jwtSecret = process.env.SECRET

  const token = jwt.sign(data, jwtSecret, {
    expiresIn: isRememberMe ? '30d' : '1h',
  })

  res.cookie('token', token, {
    httpOnly: true, // Prevent JS access
    secure: process.env.NODE_ENV === 'production', // Required on Render
    maxAge: isRememberMe ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 30d or 1h
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'strict', // ✅ cross-domain cookies require None
  })

  return token
}

export default generateTokenAndSaveCookie
