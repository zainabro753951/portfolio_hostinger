import pool from '../db.config.js'

export const logActivity = async ({
  type,
  title,
  description,
  ip,
  device,
}) => {
  try {
    const query = `
      INSERT INTO recent_activities
      (activity_type, activity_title, activity_description, ip_address, device_info)
      VALUES (?, ?, ?, ?, ?)
    `

    await pool.query(query, [
      type,
      title,
      description,
      ip || null,
      device || null,
    ])
  } catch (err) {
    console.error('⚠️ Activity log failed:', err.message)
  }
}
