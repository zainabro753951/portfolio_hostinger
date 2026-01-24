import pool from '../db.config.js'
import { body, validationResult } from 'express-validator'
import { safeParse } from '../Utils/SafeParser.js'

export const AddPlanValidation = [
  body('planName').notEmpty().withMessage('Plan name is required!'),

  body('billingCycle').notEmpty().withMessage('Billing cycle is required!'),

  body('price').notEmpty().withMessage('Price is required!'),

  body('currency').notEmpty().withMessage('Currency is required!'),

  body('featurePoints').isArray({ min: 1 }).withMessage('At least one feature point is required!'),

  body('shortDesc').notEmpty().withMessage('Short description is required!'),
]

export const addPricePlan = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errorCode: 'VALIDATION_ERROR',
      errors: errors.array(),
    })
  }

  let { planName, billingCycle, price, currency, featurePoints, shortDesc, isUpdate, planId } =
    req.body

  try {
    if (typeof featurePoints === 'string') featurePoints = safeParse(featurePoints)

    // ✅ If it's UPDATE mode
    if (isUpdate && planId) {
      // check if plan exists
      const [existing] = await pool.query('SELECT * FROM plans WHERE id = ?', [planId])
      if (!existing.length) {
        return res.status(404).json({
          success: false,
          errorCode: 'NOT_FOUND',
          message: 'Plan not found for update.',
        })
      }

      // check duplicate planName (ignore current plan)
      const [duplicate] = await pool.query('SELECT 1 FROM plans WHERE planName = ? AND id != ?', [
        planName,
        planId,
      ])
      if (duplicate.length > 0) {
        return res.status(400).json({
          success: false,
          errorCode: 'ENTRY_EXISTS',
          message: 'Another plan with the same name already exists!',
        })
      }

      const updateQuery = `
        UPDATE plans
        SET planName = ?, billingCycle = ?, price = ?, currency = ?, featurePoints = ?, shortDesc = ?
        WHERE id = ?
      `
      const [updateResult] = await pool.query(updateQuery, [
        planName,
        billingCycle,
        price,
        currency,
        JSON.stringify(featurePoints),
        shortDesc,
        planId,
      ])

      if (!updateResult.affectedRows) {
        return res.status(500).json({
          success: false,
          errorCode: 'UPDATE_FAILED',
          message: 'Failed to update price plan.',
        })
      }

      return res.status(200).json({
        success: true,
        successCode: 'ENTRY_UPDATED',
        message: 'Plan successfully updated.',
      })
    }

    // ✅ Else — INSERT mode (Add new plan)
    const [exists] = await pool.query('SELECT 1 FROM plans WHERE planName = ?', [planName])
    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        errorCode: 'ENTRY_EXISTS',
        message: 'Plan is already registered!',
      })
    }

    const insertQuery = `
      INSERT INTO plans
      (planName, billingCycle, price, currency, featurePoints, shortDesc)
      VALUES (?, ?, ?, ?, ?, ?)
    `
    const [insertResult] = await pool.query(insertQuery, [
      planName,
      billingCycle,
      price,
      currency,
      JSON.stringify(featurePoints),
      shortDesc,
    ])

    if (!insertResult.affectedRows) {
      return res.status(500).json({
        success: false,
        errorCode: 'INSERT_FAILED',
        message: 'Failed to register price plan.',
      })
    }

    res.status(201).json({
      success: true,
      successCode: 'ENTRY_REGISTERED',
      message: 'Plan successfully registered.',
    })
  } catch (error) {
    console.error('ADD_PRICE_PLAN_ERROR:', error)
    res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}

export const getPricePlan = async (req, res) => {
  try {
    const [plans] = await pool.query('SELECT * FROM plans')

    return res.status(200).json({
      success: true,
      successCode: 'GET_PLAN',
      message: 'Plan fetched successfully.',
      plans,
    })
  } catch (error) {
    console.error('GET_PLAN_ERROR:', error)

    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}

export const deletePlan = async (req, res) => {
  const { id } = req.params
  try {
    // ✅ Check if project exists
    const [existingPlan] = await pool.query('SELECT * FROM plans WHERE id = ?', [id])

    if (existingPlan.length === 0) {
      return res.status(404).json({
        success: false,
        errorCode: 'NOT_FOUND',
        message: 'Plan not found!',
      })
    }

    // ✅ Delete plan
    await pool.query('DELETE FROM plans WHERE id = ?', [id])

    return res.status(200).json({
      success: true,
      message: 'Plan deleted successfully!',
    })
  } catch (error) {
    console.error('DELETE_PLAN_ERROR:', error)

    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    })
  }
}
