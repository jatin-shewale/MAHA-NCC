import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  cadet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    }
  },
  paradeLocation: {
    name: String,
    radius: Number, // in meters
  },
  status: {
    type: String,
    enum: ['present', 'absent', 'late'],
    default: 'present',
  },
  confidenceScore: Number, // based on geo-validation
  deviceId: String,
}, { timestamps: true });

attendanceSchema.index({ location: '2dsphere' });

export default mongoose.model('Attendance', attendanceSchema);
