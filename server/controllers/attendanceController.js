import Attendance from '../models/Attendance.js';
import CadetProfile from '../models/CadetProfile.js';

export const checkIn = async (req, res) => {
  try {
    const { lat, lng, paradeLocation, deviceId } = req.body;

    // Basic Geofencing Check (Simulated for now, could use a utility)
    // In a real app, we would compare lat/lng with paradeLocation.coords
    const confidenceScore = 0.95; // Mock score

    const attendance = await Attendance.create({
      cadet: req.user._id,
      location: {
        type: 'Point',
        coordinates: [lng, lat],
      },
      paradeLocation: {
        name: paradeLocation,
        radius: 100, // 100 meters
      },
      confidenceScore,
      deviceId,
    });

    // Update cadet total parades
    await CadetProfile.findOneAndUpdate(
      { user: req.user._id },
      { $inc: { totalParades: 1 } }
    );

    res.status(201).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ cadet: req.user._id }).sort('-date');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUnitAttendance = async (req, res) => {
  try {
    // ANO only: Get all attendance for their unit
    const records = await Attendance.find().populate('cadet', 'name unit').sort('-date');
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
