import { body } from 'express-validator';
import pool from '../db.config.js';

import { safeParse } from '../Utils/SafeParser.js';
import { logActivity } from '../Utils/activityLogger.js';
import { deleteFromLocal, uploadToLocal } from '../Utils/uploadToLocal.js';

export const AddAboutValidator = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),

  body('shortRole').trim().notEmpty().withMessage('Role is required'),

  body('shortDesc').trim().notEmpty().withMessage('Short description is required'),

  body('longDesc').trim().notEmpty().withMessage('Long description is required'),
];

export const AddAbout = async (req, res) => {
  let newFileKey = '';
  let newPoseFileKey = '';

  try {
    let {
      fullName,
      shortRole,
      successNote,
      experience,
      shortDesc,
      longDesc,
      isUpdate,
      aboutImageOBJ,
      poseImageOBJ,
      isAboutImageRemoved,
      isPoseImageRemoved,
    } = req.body;

    console.log(req.files);

    // Type conversions
    isUpdate = isUpdate === 'true' || isUpdate === true;
    if (typeof aboutImageOBJ === 'string') aboutImageOBJ = safeParse(aboutImageOBJ);
    if (typeof isAboutImageRemoved === 'string')
      isAboutImageRemoved = safeParse(isAboutImageRemoved);
    if (typeof poseImageOBJ === 'string') poseImageOBJ = safeParse(poseImageOBJ);
    if (typeof isPoseImageRemoved === 'string') isPoseImageRemoved = safeParse(isPoseImageRemoved);

    // ✅ 1. Upload new About image if provided
    let uploadResult = null;
    if (req.files?.aboutImage) {
      // Assuming multer fields: { aboutImage: 'single', poseImage: 'single' }
      uploadResult = await uploadToLocal(req.files.aboutImage[0], 'about');
      newFileKey = uploadResult?.key;
    }

    // ✅ 2. Upload new Pose image if provided
    let uploadPoseImageResult = null;
    if (req.files?.poseImage) {
      uploadPoseImageResult = await uploadToLocal(req.files.poseImage[0], 'about');
      newPoseFileKey = uploadPoseImageResult?.key;
    }

    // ✅ 3. Determine final image objects
    const finalImageOBJ = {
      key: uploadResult?.key || (isAboutImageRemoved ? null : aboutImageOBJ?.key) || null,
      url: uploadResult?.url || (isAboutImageRemoved ? null : aboutImageOBJ?.url) || null,
    };

    const finalPoseImageOBJ = {
      key: uploadPoseImageResult?.key || (isPoseImageRemoved ? null : poseImageOBJ?.key) || null,
      url: uploadPoseImageResult?.url || (isPoseImageRemoved ? null : poseImageOBJ?.url) || null,
    };

    if (isUpdate) {
      // 🔹 Fetch existing record
      const [existing] = await pool.query('SELECT id, aboutImage, poseImage FROM about LIMIT 1');

      if (!existing.length) {
        // Rollback uploads if no record found
        if (newFileKey) await deleteFromLocal(newFileKey).catch(console.error);
        if (newPoseFileKey) await deleteFromLocal(newPoseFileKey).catch(console.error);
        return res.status(404).json({ success: false, message: 'No record found to update.' });
      }

      const aboutId = existing[0].id;

      // ✅ Safe JSON parsing with error handling
      let oldImageOBJ = null;
      let oldPoseImageOBJ = null;

      if (existing[0].aboutImage) {
        try {
          oldImageOBJ = safeParse(existing[0].aboutImage);
        } catch (e) {
          console.error('Parse aboutImage error:', e);
        }
      }
      if (existing[0].poseImage) {
        try {
          oldPoseImageOBJ = safeParse(existing[0].poseImage);
        } catch (e) {
          console.error('Parse poseImage error:', e);
        }
      }

      // 🔹 Delete old About image if needed
      if (uploadResult && oldImageOBJ?.key && oldImageOBJ.key !== uploadResult.key) {
        await deleteFromLocal(oldImageOBJ.key).catch(console.error);
      } else if (isAboutImageRemoved && oldImageOBJ?.key) {
        await deleteFromLocal(oldImageOBJ.key).catch(console.error);
      }

      // 🔹 Delete old Pose image if needed
      if (
        uploadPoseImageResult &&
        oldPoseImageOBJ?.key &&
        oldPoseImageOBJ.key !== uploadPoseImageResult.key
      ) {
        await deleteFromLocal(oldPoseImageOBJ.key).catch(console.error);
      } else if (isPoseImageRemoved && oldPoseImageOBJ?.key) {
        await deleteFromLocal(oldPoseImageOBJ.key).catch(console.error);
      }

      // 🔹 Update DB - ✅ FIXED: poseImage added to SET clause
      const [updateResult] = await pool.query(
        `UPDATE about SET 
          fullName=?, shortRole=?, successNote=?, experience=?, shortDesc=?, longDesc=?, 
          aboutImage=?, poseImage=? 
         WHERE id=?`,
        [
          fullName,
          shortRole,
          successNote,
          experience,
          shortDesc,
          longDesc,
          finalImageOBJ.key ? JSON.stringify(finalImageOBJ) : null,
          finalPoseImageOBJ.key ? JSON.stringify(finalPoseImageOBJ) : null, // ✅ finalPoseImageOBJ used
          aboutId,
        ]
      );

      if (updateResult.affectedRows > 0) {
        await logActivity({
          type: 'ABOUT_UPDATE',
          title: 'About info updated',
          description: "You've just updated the About section.",
          ip: req.ip,
          device: req.headers['user-agent'],
        });
        return res.status(200).json({
          success: true,
          message: 'About section updated successfully.',
        });
      }
    } else {
      // 🔹 Insert new record - ✅ FIXED: Correct syntax & all columns included
      const [results] = await pool.query(
        `INSERT INTO about 
          (fullName, shortRole, successNote, experience, shortDesc, longDesc, aboutImage, poseImage) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fullName,
          shortRole,
          successNote,
          experience,
          shortDesc,
          longDesc,
          finalImageOBJ.key ? JSON.stringify(finalImageOBJ) : null,
          finalPoseImageOBJ.key ? JSON.stringify(finalPoseImageOBJ) : null, // ✅ poseImage included
        ]
      );

      if (results.affectedRows > 0) {
        await logActivity({
          type: 'ABOUT_ADD',
          title: 'About info added',
          description: 'Your About section is now live.',
          ip: req.ip,
          device: req.headers['user-agent'],
        });
        return res.status(201).json({ success: true, message: 'About successfully created.' });
      }
    }

    return res.status(400).json({ success: false, message: 'No changes made.' });
  } catch (error) {
    console.error('ADD_ABOUT_ERROR:', error);
    // Rollback uploads on error
    if (newFileKey) await deleteFromLocal(newFileKey).catch(console.error);
    if (newPoseFileKey) await deleteFromLocal(newPoseFileKey).catch(console.error);
    return res.status(500).json({ success: false, message: 'Internal Server Error!' });
  }
};

export const getAbout = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM about LIMIT 1');
    const about = rows[0] || null;

    console.log(about);

    return res.status(200).json({
      success: true,
      successCode: 'GET_ABOUT',
      message: 'About fetched successfully.',
      about: {
        ...about,
        aboutImage: JSON.parse(about.aboutImage),
        poseImage: JSON.parse(about.poseImage),
      },
    });
  } catch (error) {
    console.error('GET_ABOUT_ERROR:', error);

    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Internal Server Error!',
    });
  }
};
