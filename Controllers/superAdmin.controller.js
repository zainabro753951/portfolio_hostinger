import { body, validationResult } from 'express-validator'
import pool from '../db.config.js'
import bcrypt from 'bcrypt'
import generateTokenAndSaveCookie from '../middlewares/generateTokenAndSaveCookie.js'

// Registration Code
export const RegValidation = [
  body('adminName')
    .notEmpty()
    .withMessage('Admin name is required!')
    .isLength({ min: 5 })
    .withMessage('Admin name must be at least 5 characters'),

  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address!')
    .notEmpty()
    .withMessage('Email is required!'),

  body('password')
    .notEmpty()
    .withMessage('Password is required!')
    .isStrongPassword()
    .withMessage(
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol'
    ),
]

export const superAdminReg = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      errors: errors.array(),
    })
  }

  try {
    const { adminName, email, password } = req.body

    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email])
    if (rows.length > 0) {
      return res.status(400).json({
        success: false,
        errorCode: 'ADMIN_EXISTS',
        message: 'This admin already registered',
      })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const [results] = await pool.query(
      `INSERT INTO admins (admin_name, email, password)
  VALUES (?, ?, ?)`,
      [adminName, email, hashPassword]
    )

    if (results.affectedRows) {
      return res.status(201).json({
        success: true,
        successCode: 'ADMIN_INSERTED',
        message: 'Super Admin Created Successfully',
        adminId: results.insertId,
      })
    }
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}

// Super Admin login validation
export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address!')
    .notEmpty()
    .withMessage('Email is required!'),

  body('password')
    .notEmpty()
    .withMessage('Password is required!')
    .isStrongPassword()
    .withMessage(
      'Password must be at least 8 characters long and include uppercase, lowercase, number, and symbol'
    ),
]

export const superAdminLogin = async (req, res) => {
  const errors = validationResult(req)

  // 1️⃣ Validation Errors Check
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      errors: errors.array(),
    })
  }

  try {
    const { email, password, rememberMe } = req.body

    console.log(rememberMe)

    // 2️⃣ Email Check (await required here)
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email])

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'NOT_FOUND',
        message: 'Admin not found!',
      })
    }

    const admin = rows[0]

    // 3️⃣ Password Compare (correct order: plain password, hashed password)
    const isPasswordMatch = await bcrypt.compare(password, admin.password)

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        errorCode: 'INVALID_CREDENTIALS',
        message: 'Incorrect password!',
      })
    }

    const token = await generateTokenAndSaveCookie(
      { id: admin.id, email: admin.email },
      rememberMe,
      res
    )

    // 4️⃣ If matched → Login success
    return res.status(200).json({
      success: true,
      successCode: 'LOGIN_SUCCESS',
      message: 'Super Admin logged in successfully!',
      authToken: token,
      admin: {
        id: admin.id,
        name: admin.admin_name,
        email: admin.email,
      },
    })
  } catch (error) {
    console.log(error)

    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}

export const adminAuth = async (req, res) => {
  const admin = req.admin
  try {
    res.status(200).json({
      success: true,
      successCode: 'ADMIN_AUTH',
      message: 'Successfully Authenticated',
      admin,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}
