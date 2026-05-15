import mongoose from 'mongoose';

const cadetProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  enrollmentNo: {
    type: String,
    required: true,
    unique: true,
  },
  rank: {
    type: String,
    enum: ['Cadet', 'Lance Corporal', 'Corporal', 'Sergeant', 'Company Quarter Master Sergeant', 'Under Officer', 'Senior Under Officer'],
    default: 'Cadet',
  },
  wing: {
    type: String,
    enum: ['Army', 'Navy', 'Air'],
    required: true,
  },
  bloodGroup: String,
  dob: Date,
  fatherName: String,
  institution: String,
  yearOfEnrollment: Number,
  certificates: [{
    type: String,
    enum: ['A', 'B', 'C'],
  }],
  totalParades: {
    type: Number,
    default: 0,
  },
  attendancePercentage: {
    type: Number,
    default: 0,
  },
  digitalIdQr: String,
  achievements: [{
    title: String,
    date: Date,
    category: String,
  }],
}, { timestamps: true });

export default mongoose.model('CadetProfile', cadetProfileSchema);
