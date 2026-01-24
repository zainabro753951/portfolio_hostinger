import { body, validationResult } from 'express-validator'
import pool from '../db.config.js'

export const AddSkillsValidation = [
  body('skillName').notEmpty().withMessage('Skill is required!'),
  body('proficiency').notEmpty().withMessage('proficiency is required!'),
]

export const addSkills = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      errors: errors.array(),
    })
  }

  try {
    const { skillName, proficiency, isUpdate, skillId } = req.body

    if (isUpdate && skillId) {
      // 🧠 1. Check if skill exists by ID
      const [existingSkill] = await pool.query('SELECT * FROM skills WHERE id = ?', [skillId])

      if (existingSkill.length === 0) {
        return res.status(404).json({
          success: false,
          errorCode: 'NOT_FOUND',
          message: 'Skill not found!',
        })
      }

      // 🧠 2. Check for duplicate skillName (excluding current skill)
      const [duplicate] = await pool.query('SELECT * FROM skills WHERE skillName = ? AND id != ?', [
        skillName,
        skillId,
      ])

      if (duplicate.length > 0) {
        return res.status(400).json({
          success: false,
          errorCode: 'ENTRY_EXISTS',
          message: 'Another skill with this name already exists!',
        })
      }

      // 🧠 3. Update the skill
      const [updateResult] = await pool.query(
        'UPDATE skills SET skillName = ?, proficiency = ? WHERE id = ?',
        [skillName, proficiency, skillId]
      )

      if (updateResult.affectedRows > 0) {
        return res.status(200).json({
          success: true,
          successCode: 'SKILL_UPDATED',
          message: 'Skill updated successfully.',
        })
      } else {
        return res.status(400).json({
          success: false,
          errorCode: 'UPDATE_FAILED',
          message: 'Failed to update skill!',
        })
      }
    } else {
      // 🧠 Add new skill
      const [existing] = await pool.query('SELECT * FROM skills WHERE skillName = ?', [skillName])

      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          errorCode: 'ENTRY_EXISTS',
          message: 'Skill already added!',
        })
      }

      const [results] = await pool.query(
        'INSERT INTO skills (skillName, proficiency) VALUES (?, ?)',
        [skillName, proficiency]
      )

      if (results.affectedRows) {
        return res.status(201).json({
          success: true,
          successCode: 'SKILL_CREATED',
          message: 'Skill added successfully.',
        })
      }
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}

export const getSkills = async (req, res) => {
  try {
    const [skills] = await pool.query('SELECT * FROM skills')

    return res.status(200).json({
      success: true,
      successCode: 'GET_SKILLS',
      message: 'Skills fetched successfully.',
      skills,
    })
  } catch (error) {
    console.error('GET_SKILLS_ERROR:', error)

    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}

export const deleteSkill = async (req, res) => {
  const { id } = req.params
  try {
    const [existingSkill] = await pool.query('SELECT * FROM skills WHERE id = ?', [id])
    if (existingSkill.length === 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'NOT_FOUND',
        message: 'Skill not found!',
      })
    }

    await pool.query('DELETE FROM skills WHERE id = ?', [id])

    return res.status(200).json({
      success: true,
      message: 'Skill deleted successfully!',
    })
  } catch (error) {
    console.error('DELETE_SKILLS_ERROR:', error)

    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}
