const Plot = require('../models/PlotModel');
const Enquiry = require('../models/Enquiry');

const getDashboardStats = async (
  req,
  res,
) => {
  try {
    const [
      totalPlots,
      availablePlots,
      bookedPlots,
      soldPlots,
      totalEnquiries,
      newEnquiries,
    ] = await Promise.all([
      Plot.countDocuments(),
      Plot.countDocuments({status: 'Available'}),
      Plot.countDocuments({status: 'Booked'}),
      Plot.countDocuments({status: 'Sold'}),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({status: 'New'}),
    ]);

    res.json({
      success: true,
      totalPlots,
      availablePlots,
      bookedPlots,
      soldPlots,
      totalEnquiries,
      newEnquiries,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        'Failed to fetch dashboard stats',
    });
  }
};

module.exports = {
  getDashboardStats,
};
