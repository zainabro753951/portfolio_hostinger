import { body, validationResult } from 'express-validator'
import pool from '../db.config.js'

export const faqsValidation = [
  body('question').notEmpty().withMessage('Question is required!'),
  body('answer').notEmpty().withMessage('Answer is required!'),
]

export const addFAQs = async (req, res) => {
  console.log(req.body)

  // 🧩 Step 1: Validate required fields
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      errors: errors.array(),
    })
  }

  const { question, answer, status, isUpdate, faqId } = req.body

  try {
    // ✅ UPDATE MODE
    if (isUpdate && faqId) {
      // 🔍 Step 2A: Check if the FAQ exists
      const [faqExists] = await pool.query('SELECT * FROM faqs WHERE id = ?', [faqId])
      if (faqExists.length === 0) {
        return res.status(404).json({
          success: false,
          errorCode: 'NOT_FOUND',
          message: 'The FAQ you are trying to update does not exist.',
        })
      }

      // 🧠 Step 3A: Update the FAQ
      const [updateResult] = await pool.query(
        'UPDATE faqs SET question = ?, answer = ?, status = ? WHERE id = ?',
        [question, answer, status || 'Published', faqId]
      )

      if (updateResult.affectedRows === 0) {
        return res.status(500).json({
          success: false,
          errorCode: 'UPDATE_FAILED',
          message: 'Something went wrong while updating the FAQ. Please try again.',
        })
      }

      // ✅ Success response
      return res.status(200).json({
        success: true,
        message: `FAQ (ID: ${faqId}) has been successfully updated.`,
      })
    }

    // ✅ ADD MODE (default)
    // 🔍 Step 2B: Check if FAQ already exists
    const [existingFAQ] = await pool.query('SELECT 1 FROM faqs WHERE question = ?', [question])
    if (existingFAQ.length > 0) {
      return res.status(409).json({
        success: false,
        errorCode: 'ENTRY_EXISTS',
        message:
          'This question already exists in your FAQs. Try rephrasing it or check your existing list.',
      })
    }

    // 🧱 Step 3B: Insert new FAQ
    const [insertResult] = await pool.query(
      'INSERT INTO faqs (question, answer, status) VALUES (?, ?, ?)',
      [question, answer, status || 'Published']
    )

    if (insertResult.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        errorCode: 'INSERT_ERROR',
        message: 'Something went wrong while saving your FAQ. Please try again or contact support.',
      })
    }

    // ✅ Step 4B: Respond success
    res.status(201).json({
      success: true,
      message: 'Your FAQ has been successfully added and will appear shortly.',
    })
  } catch (error) {
    console.error('Error in addFAQs controller:', error)
    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message:
        'We encountered an unexpected error while processing your request. Please try again later.',
    })
  }
}

export const getFAQs = async (req, res) => {
  try {
    // 🧩 Fetch all FAQs (latest first)
    const [faqs] = await pool.query('SELECT * FROM faqs ORDER BY createdAt DESC')

    // 🧠 If no FAQs found
    if (faqs.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No FAQs have been added yet. Start by creating your first one!',
        data: [],
      })
    }

    // ✅ Success — return all FAQs
    res.status(200).json({
      success: true,
      message: 'FAQs fetched successfully.',
      totalFAQs: faqs.length,
      faqs: faqs,
    })
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'We encountered an issue while retrieving FAQs. Please refresh or try again later.',
    })
  }
}

export const deleteFAQ = async (req, res) => {
  const { id } = req.params

  try {
    // 🧩 Step 1: Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_ID',
        message: 'Invalid FAQ ID provided. Please refresh and try again.',
      })
    }

    // 🧩 Step 2: Check if FAQ exists
    const [existingFAQ] = await pool.query('SELECT * FROM faqs WHERE id = ?', [id])
    if (existingFAQ.length === 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'NOT_FOUND',
        message:
          'The FAQ you are trying to delete does not exist or may have already been removed.',
      })
    }

    // 🧩 Step 3: Delete the FAQ
    const [result] = await pool.query('DELETE FROM faqs WHERE id = ?', [id])

    if (result.affectedRows === 0) {
      return res.status(500).json({
        success: false,
        errorCode: 'DELETE_ERROR',
        message: 'Something went wrong while deleting the FAQ.',
      })
    }

    // ✅ Step 4: Success response
    res.status(200).json({
      success: true,
      message: `FAQ has been successfully deleted.`,
    })
  } catch (error) {
    console.error('Error deleting FAQ:', error)
    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'We encountered an unexpected error while deleting the FAQ. Please try again later.',
    })
  }
}
