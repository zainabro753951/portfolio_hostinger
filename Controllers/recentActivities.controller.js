import pool from "../db.config.js";

const getActivities = async (req, res) => {
  try {
    const [activities] = await pool.query(
      "SELECT * FROM recent_activities ORDER BY created_at DESC LIMIT 50",
    );

    if (activities.length === 0) {
      return res.status(404).json({
        success: false,
        errorCode: "NOT_FOUND",
        message: "Recent Activities Not Found!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Activities Found Successfully.",
      activities,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      errorCode: "SERVER_ERROR",
      message: "Internal Server Error!",
    });
  }
};

export default getActivities;
