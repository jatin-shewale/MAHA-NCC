import mongoose from 'mongoose';

const campApplicationSchema = new mongoose.Schema({
  camp: { type: mongoose.Schema.Types.ObjectId, ref: 'Camp', required: true },
  cadet: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  remarks: String,
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('CampApplication', campApplicationSchema);
