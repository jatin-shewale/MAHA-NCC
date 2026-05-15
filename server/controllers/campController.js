import Camp from '../models/Camp.js';
import CampApplication from '../models/CampApplication.js';

export const createCamp = async (req, res) => {
  try {
    const camp = await Camp.create(req.body);
    res.status(201).json(camp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCamps = async (req, res) => {
  try {
    const camps = await Camp.find({ status: 'upcoming' });
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const applyToCamp = async (req, res) => {
  try {
    const { campId, remarks } = req.body;
    
    // Check if already applied
    const existing = await CampApplication.findOne({ camp: campId, cadet: req.user._id });
    if (existing) return res.status(400).json({ message: 'Application already exists' });

    const application = await CampApplication.create({
      camp: campId,
      cadet: req.user._id,
      remarks
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    // ANO: Get all applications for review
    const apps = await CampApplication.find()
      .populate('camp')
      .populate('cadet', 'name rank unit')
      .sort('-createdAt');
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
