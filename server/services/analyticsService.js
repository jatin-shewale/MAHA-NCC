import dayjs from "dayjs";
import { Attendance } from "../models/Attendance.js";
import { Achievement } from "../models/Achievement.js";
import { Camp } from "../models/Camp.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { ACHIEVEMENT_STATUS, ATTENDANCE_STATUS, REGISTRATION_STATUS, ROLES } from "../utils/constants.js";

export const getAdminDashboardMetrics = async () => {
  const [totalCadets, pendingApprovals, attendanceRecords, camps, achievements, notifications] = await Promise.all([
    User.countDocuments({ role: ROLES.CADET, registrationStatus: REGISTRATION_STATUS.APPROVED }),
    User.countDocuments({ role: ROLES.CADET, registrationStatus: REGISTRATION_STATUS.PENDING }),
    Attendance.find().lean(),
    Camp.find().lean(),
    Achievement.find().lean(),
    Notification.countDocuments()
  ]);

  const presentCount = attendanceRecords.filter((item) => item.status === ATTENDANCE_STATUS.PRESENT).length;
  const attendanceRate = attendanceRecords.length ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;
  const approvedAchievements = achievements.filter((item) => item.approvalStatus === ACHIEVEMENT_STATUS.APPROVED).length;

  const participationSeries = camps.map((camp) => ({
    name: camp.title,
    applicants: camp.applicants?.length || 0,
    approved: camp.applicants?.filter((item) => item.status === "Approved").length || 0
  }));

  const attendanceSeries = Array.from({ length: 6 }).map((_, index) => {
    const current = dayjs().subtract(5 - index, "month");
    const records = attendanceRecords.filter((record) => dayjs(record.date).isSame(current, "month"));
    const present = records.filter((record) => record.status === ATTENDANCE_STATUS.PRESENT).length;
    const rate = records.length ? Math.round((present / records.length) * 100) : 0;
    return {
      name: current.format("MMM"),
      attendance: rate
    };
  });

  return {
    stats: {
      totalCadets,
      pendingApprovals,
      attendanceRate,
      activeCamps: camps.filter((camp) => camp.status === "Active" || camp.status === "Upcoming").length,
      approvedAchievements,
      totalNotifications: notifications
    },
    charts: {
      attendanceSeries,
      participationSeries
    }
  };
};

export const getCadetDashboardMetrics = async (cadetId) => {
  const [attendanceRecords, achievements, camps, notifications, leaderboard] = await Promise.all([
    Attendance.find({ cadet: cadetId }).sort({ date: -1 }).lean(),
    Achievement.find({ cadet: cadetId }).sort({ createdAt: -1 }).lean(),
    Camp.find({ "applicants.cadet": cadetId }).lean(),
    Notification.find({
      $or: [{ recipients: cadetId }, { isBroadcast: true }]
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean(),
    User.find({ role: ROLES.CADET, registrationStatus: REGISTRATION_STATUS.APPROVED })
      .sort({ badgeScore: -1 })
      .select("name cadetId badgeScore badgeLevel profileImage")
      .limit(10)
      .lean()
  ]);

  const presentCount = attendanceRecords.filter((item) => item.status === ATTENDANCE_STATUS.PRESENT).length;
  const attendanceRate = attendanceRecords.length ? Math.round((presentCount / attendanceRecords.length) * 100) : 0;
  const approvedAchievements = achievements.filter((item) => item.approvalStatus === ACHIEVEMENT_STATUS.APPROVED).length;

  return {
    attendanceRate,
    approvedAchievements,
    campApplications: camps.length,
    notifications,
    leaderboard,
    recentAttendance: attendanceRecords.slice(0, 8),
    recentAchievements: achievements.slice(0, 6)
  };
};
