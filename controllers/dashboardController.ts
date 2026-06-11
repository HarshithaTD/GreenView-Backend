import { Request, Response } from 'express';
import Plot from '../models/PlotModel';
import Enquiry from '../models/Enquiry';

// ==============================
// GET DASHBOARD STATS
// ==============================

export const getDashboardStats = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
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
      Plot.countDocuments({
        status: 'Available',
      }),
      Plot.countDocuments({
        status: 'Booked',
      }),
      Plot.countDocuments({
        status: 'Sold',
      }),
      Enquiry.countDocuments(),
      Enquiry.countDocuments({
        status: 'New',
      }),
    ]);

    return res.json({
      success: true,
      totalPlots,
      availablePlots,
      bookedPlots,
      soldPlots,
      totalEnquiries,
      newEnquiries,
    });
  } catch (error) {
    console.error(
      'Dashboard Stats Error:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch dashboard stats',
    });
  }
};