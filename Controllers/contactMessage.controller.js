import { body, validationResult } from 'express-validator'
import pool from '../db.config.js'
import { hashIp } from '../Utils/hashIp.js'
import { getGeoLocation } from '../Utils/geoLookup.js'

export const contactMessageValidation = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 3 })
    .withMessage('Full name must be at least 3 characters long'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Enter a valid email address'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Subject must be between 3 and 200 characters'),

  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10 })
    .withMessage('Message should be at least 10 characters long'),
]

export const sendMessage = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      errors: errors.array(),
    })
  }

  try {
    // Extract request data
    const { fullName, email, subject, message, planId } = req.body

    // Validate planId if provided
    let resolvedPlanId = null
    if (planId) {
      const [rows] = await pool.query(`SELECT id FROM plans WHERE id = ?`, [planId])
      if (rows.length === 0) {
        return res.status(400).json({
          success: false,
          errorCode: 'INVALID_PLAN_ID',
          message: 'The selected plan does not exist.',
        })
      }
      resolvedPlanId = planId
    }

    // Get IP + User Agent
    const rawIp = req.ip || req.headers['x-forwarded-for']?.split(',')[0] || null
    const user_agent = req.headers['user-agent'] || null

    // Hash IP for privacy
    const hashedIp = rawIp ? await hashIp(rawIp) : null

    // Geo lookup (example using some geo service)
    // Assume getGeoLocation returns an object like:
    // { country, region, city, latitude, longitude, isp }
    const geo = rawIp ? getGeoLocation(rawIp) : {}
    const {
      country = null,
      region = null,
      city = null,
      latitude = null,
      longitude = null,
      isp = null,
    } = geo

    console.log(`User raw IP: ${rawIp}, Geo:`, geo)

    // Insert into contact_messages
    const sql = `
      INSERT INTO contact_messages (
        plan_id, full_name, email, subject, message,
        ip_address, user_agent,
        country, region, city, latitude, longitude, isp
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const [result] = await pool.query(sql, [
      resolvedPlanId,
      fullName,
      email,
      subject,
      message,
      hashedIp,
      user_agent,
      country,
      region,
      city,
      latitude,
      longitude,
      isp,
    ])

    const contactMessageId = result.insertId

    // Insert notification
    const sqlNotification = `
      INSERT INTO notifications (type, title, message, reference_id)
      VALUES (?, ?, ?, ?)
    `

    const notificationMsg = resolvedPlanId
      ? `${fullName} selected plan #${resolvedPlanId} and sent a message.`
      : `${fullName} sent you a new contact message.`

    await pool.query(sqlNotification, [
      'contact_message',
      'New Contact Message',
      notificationMsg,
      contactMessageId,
    ])

    // Success response
    return res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      location: { country, region, city, latitude, longitude, isp },
      referenceId: contactMessageId,
      planId: resolvedPlanId,
    })
  } catch (error) {
    console.error('SEND_MESSAGE_ERROR:', error)
    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}

export const getMessage = async (req, res) => {
  try {
    // 📄 Pagination + optional filters
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    const search = req.query.search ? `%${req.query.search}%` : null
    const status = req.query.status || null

    // 🧠 Dynamic filters
    let whereClause = 'WHERE 1=1'
    const params = []

    if (search) {
      whereClause += `
        AND (
          full_name LIKE ? OR
          email LIKE ? OR
          subject LIKE ? OR
          message LIKE ?
        )`
      params.push(search, search, search, search)
    }

    if (status) {
      whereClause += ' AND status = ?'
      params.push(status)
    }

    // 📦 Query to fetch messages with geo info
    const [messages] = await pool.query(
      `
      SELECT
        id,
        plan_id AS planId,
        full_name AS fullName,
        email,
        subject,
        message,
        status,
        ip_address AS ipAddress,
        user_agent AS userAgent,
        country,
        region,
        city,
        latitude,
        longitude,
        isp,
        created_at AS createdAt,
        updated_at AS updatedAt
      FROM contact_messages
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    )

    // 🧮 Count total results (for pagination)
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM contact_messages ${whereClause}`,
      params
    )

    // 🧱 Add "selected" flag for frontend
    const messagesWithSelected = messages.map(msg => ({
      ...msg,
      selected: false,
    }))

    // ✅ Response
    return res.status(200).json({
      success: true,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      count: messages.length,
      filters: { search: req.query.search || null, status },
      data: messagesWithSelected,
    })
  } catch (error) {
    console.error('GET_MESSAGES_ERROR:', error)
    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Failed to fetch contact messages!',
    })
  }
}

export const deleteContactMessages = async (req, res) => {
  try {
    const { ids } = req.body

    // ✅ 1. Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_INPUT',
        message: 'Please provide at least one valid message ID to delete.',
      })
    }

    // ✅ 2. Validate IDs are numbers
    const invalidIds = ids.filter(id => isNaN(Number(id)))
    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_ID_TYPE',
        message: 'All IDs must be numeric values.',
      })
    }

    // ✅ 3. Check if messages exist
    const [existingMessages] = await pool.query(
      `SELECT id, full_name, email FROM contact_messages WHERE id IN (${ids
        .map(() => '?')
        .join(',')})`,
      ids
    )

    if (existingMessages.length === 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'NOT_FOUND',
        message: 'No matching contact messages found to delete.',
      })
    }

    // ✅ 4. Delete messages safely
    const [deleteResult] = await pool.query(
      `DELETE FROM contact_messages WHERE id IN (${ids.map(() => '?').join(',')})`,
      ids
    )

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'DELETE_FAILED',
        message: 'Failed to delete contact messages (may already be removed).',
      })
    }

    // ✅ 5. Optional — Log notification for admin dashboard
    await pool.query(
      `INSERT INTO notifications (title, message, type, created_at)
       VALUES (?, ?, ?, NOW())`,
      [
        'Contact Messages Deleted',
        `${existingMessages.length} contact message${
          existingMessages.length > 1 ? 's' : ''
        } deleted successfully.`,
        'info',
      ]
    )

    // ✅ 6. Success Response
    return res.status(200).json({
      success: true,
      message: `${existingMessages.length} contact message${
        existingMessages.length > 1 ? 's' : ''
      } deleted successfully.`,
      deletedIds: ids,
    })
  } catch (error) {
    console.error('❌ DELETE_CONTACT_MESSAGES_ERROR:', error)

    if (error?.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(409).json({
        success: false,
        errorCode: 'SQL_FOREIGN_KEY_CONSTRAINT',
        message:
          'Cannot delete because of a foreign key constraint. Try removing related records first.',
      })
    }

    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error — please try again later.',
    })
  }
}

export const toggleReadStatus = async (req, res) => {
  try {
    const { ids } = req.body

    // ✅ Validate input
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        errorCode: 'INVALID_INPUT',
        message: 'At least one message ID is required!',
      })
    }

    let query = ''
    let params = []

    if (ids.length === 1) {
      // 🎯 Single message → toggle between read/unread
      query = `
        UPDATE contact_messages
        SET status = CASE
          WHEN status = 'read' THEN 'unread'
          WHEN status = 'unread' THEN 'read'
          ELSE status
        END
        WHERE id = ?
      `
      params = [ids[0]]
    } else {
      // 📩 Multiple messages → mark all as read
      query = `
        UPDATE contact_messages
        SET status = 'read'
        WHERE id IN (?)
      `
      params = [ids]
    }

    const [result] = await pool.query(query, params)

    // ✅ Handle no updates
    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'NOT_FOUND',
        message: 'No matching messages found for the provided IDs!',
      })
    }

    // ✅ Success Response
    const mode = ids.length === 1 ? 'toggled' : 'marked as read'
    res.status(200).json({
      success: true,
      message: `${result.affectedRows} message(s) ${mode} successfully.`,
    })
  } catch (error) {
    console.error('TOGGLE_READ_STATUS_ERROR:', error)
    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}
