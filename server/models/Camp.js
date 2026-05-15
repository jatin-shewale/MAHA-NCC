import mongoose from 'mongoose';

const campSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['CATC', 'RDC', 'TSC', 'NIC', 'ATC', 'VSC', 'NSC'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  location: { type: String, required: true },
  description: String,
  capacity: Number,
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed'], default: 'upcoming' },
}, { timestamps: true });

export default mongoose.model('Camp', campSchema);
