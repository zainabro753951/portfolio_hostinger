import pool from "../db.config.js";
import { UAParser } from "ua-parser-js";
import axios from "axios";

// Parse user agent
const parseUserAgent = (userAgent) => {
  const parser = new UAParser(userAgent);
  return {
    browser: parser.getBrowser().name || "Unknown",
    os: parser.getOS().name || "Unknown",
    deviceType: parser.getDevice().type || "desktop",
  };
};

// Get country & city from IP (optional: use geoip-lite for local testing)
const getGeoInfo = async (ip) => {
  try {
    const res = await axios.get(`https://ipapi.co/${ip}/json/`);
    return {
      country: res.data.country_name || "Unknown",
      city: res.data.city || "Unknown",
    };
  } catch {
    return { country: "Unknown", city: "Unknown" };
  }
};

export const addVisitors = async (req, res) => {
  try {
    // Get visitor info
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress ||
      "Unknown";
    const userAgent = req.headers["user-agent"] || "Unknown";
    const page = req.body.page || req.originalUrl;
    const referrer = req.headers.referer || null;

    // Parse UA
    const { browser, os, deviceType } = parseUserAgent(userAgent);

    // Geo info
    const { country, city } = await getGeoInfo(ipAddress);

    // Check if visitor already exists
    const [existingRows] = await pool.query(
      `SELECT id FROM visitors WHERE ip_address = ? AND user_agent = ? LIMIT 1`,
      [ipAddress, userAgent],
    );

    if (existingRows.length > 0) {
      const visitorId = existingRows[0].id;
      // Append page visit to JSON array
      await pool.query(
        `UPDATE visitors
         SET pages_visited = JSON_ARRAY_APPEND(
               IFNULL(pages_visited, JSON_ARRAY()),
               '$',
               JSON_OBJECT('page', ?, 'visited_at', NOW())
         ),
         last_visit_at = NOW(),
         browser = ?,
         os = ?,
         device_type = ?,
         referrer = ?,
         country = ?,
         city = ?
         WHERE id = ?`,
        [page, browser, os, deviceType, referrer, country, city, visitorId],
      );
    } else {
      // Insert new visitor (first time)
      await pool.query(
        `INSERT INTO visitors (
          ip_address, user_agent, browser, os, device_type,
          referrer, country, city,
          pages_visited, first_visit_at, last_visit_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?,
          JSON_ARRAY(JSON_OBJECT('page', ?, 'visited_at', NOW())), NOW(), NOW()
        )`,
        [
          ipAddress,
          userAgent,
          browser,
          os,
          deviceType,
          referrer,
          country,
          city,
          page,
        ],
      );
    }

    res.status(200).json({
      success: true,
      message: "Visitor tracked successfully",
    });
  } catch (error) {
    console.error("Visitor Tracking Error:", error);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};

export const getVisitorsCount = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT COUNT(*) AS total_count FROM visitors;",
    );

    const totalCount = rows[0].total_count;
    console.log(totalCount);

    res.status(200).json({
      success: true,
      visitorsCount: totalCount,
      message: "Internal Server Error!",
    });
  } catch (error) {
    console.log(`Visitors Count Error: ${error}`);
    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};
