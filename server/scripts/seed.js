import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { Attendance } from "../models/Attendance.js";
import { Camp } from "../models/Camp.js";
import { Notification } from "../models/Notification.js";
import { User } from "../models/User.js";
import { ROLES, REGISTRATION_STATUS } from "../utils/constants.js";

const seed = async () => {
  await connectDB();
  await Promise.all([Attendance.deleteMany({}), Camp.deleteMany({}), Notification.deleteMany({}), User.deleteMany({})]);

  const admin = await User.create({
    name: "Admin Officer",
    email: "admin@nccpro.com",
    password: "Admin@123",
    role: ROLES.ADMIN,
    registrationStatus: REGISTRATION_STATUS.APPROVED,
    rank: "Colonel",
    wing: "Senior Division"
  });

  const cadet = await User.create({
    name: "Arjun Mehta",
    email: "cadet@nccpro.com",
    password: "Cadet@123",
    role: ROLES.CADET,
    registrationStatus: REGISTRATION_STATUS.APPROVED,
    rank: "Cadet Sergeant",
    wing: "Army Wing",
    badgeScore: 90,
    badgeLevel: "Advanced",
    achievementStreak: 3
  });

  await Camp.create({
    title: "National Leadership Camp",
    description: "Intensive field leadership and tactical coordination training.",
    location: "Pune",
    startDate: new Date(),
    endDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
    capacity: 50,
    status: "Upcoming",
    applicants: [{ cadet: cadet._id, status: "Approved" }]
  });

  await Notification.create({
    title: "Welcome to NCC Pro",
    message: "Your command center is ready for operations.",
    type: "Announcement",
    isBroadcast: true
  });

  console.log(`Seed complete for ${env.mongoUri}`);
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
