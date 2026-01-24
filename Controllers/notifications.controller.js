import pool from '../db.config.js'

export const getNotifications = async (req, res) => {
  try {
    // 🔹 Fetch all notifications (latest first)
    const [notifications] = await pool.query(`
      SELECT id, type, title, message, reference_id, is_read, created_at
      FROM notifications
      ORDER BY created_at DESC
    `)

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    })
  } catch (error) {
    console.error('GET_NOTIFICATIONS_ERROR:', error)
    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}
