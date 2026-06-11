// controllers/enquiryController.ts
import { Response } from 'express';
import { AuthRequest } from '../types/auth';
import Enquiry from '../models/Enquiry';
import Plot from '../models/PlotModel'; // 👈 Import Plot model to get images
import mongoose from 'mongoose';

const getIO = (req: AuthRequest) => req.app.get('io');

// ================= CREATE ENQUIRY =================
export const createEnquiry = async (
  req: AuthRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    const {
      plotId,        // 👈 Now required
      name,
      mobile,
      email,
      message,
      plotTitle,
      plotLocation,
      plotPrice,
      avatar,
      source, 
    } = req.body;

    // Validate required fields (plotId is now required)
    if (!name || !mobile || !plotId) {
      return res.status(400).json({
        success: false,
        message: 'Name, mobile and plot ID are required',
      });
    }

    // Verify plot exists
   const plot: any = await Plot.findById(plotId).lean();
    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found',
      });
    }

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const enquiry = await Enquiry.create({
      userId: req.user?.id,

      plotId,
      name,
      mobile,
      email,
      message,

      plotTitle:
        plotTitle || plot.title,

      plotLocation:
        plotLocation || plot.location,

      plotPrice:
        plotPrice || plot.price,

      avatar,
      source,
      status: 'New',
    });

    // Populate plot data before emitting
    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate('plotId', 'images') // Get plot images
      .lean();

    getIO(req)?.emit('new_enquiry', populatedEnquiry);
    getIO(req)?.emit('alert:new', populatedEnquiry);
    getIO(req)?.emit('dashboard:changed');

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: populatedEnquiry,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit enquiry',
    });
  }
};

// ================= GET ALL ENQUIRIES WITH PLOT IMAGES =================
export const getAllEnquiries = async (
  req: AuthRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    const {
      search,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const query: any = {};

    if (
      req.user?.role !== 'admin'
    ) {
      query.userId =
        req.user?.id;
    }

    if (search) {
      const regex = new RegExp(search as string, 'i');
      query.$or = [
        { name: regex },
        { mobile: regex },
        { plotTitle: regex },
      ];
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const currentPage = Number(page);
    const pageLimit = Number(limit);

    // 👇 Populate plotId to get plot images
    const enquiries = await Enquiry.find(query)
      .populate('plotId', 'images title location price') // Get images array
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean();

    // 👇 Transform to include image URLs
    const enrichedEnquiries = enquiries.map((enquiry: any) => ({
      ...enquiry,
      plotImage: enquiry.plotId?.images?.[0] || null,  // First image as cover
      plotImages: enquiry.plotId?.images || [],        // All images
    }));

    const total = await Enquiry.countDocuments(query);

    return res.status(200).json({
      success: true,
      total,
      currentPage,
      totalPages: Math.ceil(total / pageLimit),
      data: enrichedEnquiries,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch enquiries',
    });
  }
};
//===========================================================
export const getMyEnquiries = async (
  req: AuthRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    console.log(
      'GET MY ENQUIRIES HIT',
    );

    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    console.log(
      'USER ID:',
      req.user.id,
    );

    const enquiries =
      await Enquiry.find({
        userId: req.user.id,
      })
        .populate(
          'plotId',
          'images title location price',
        )
        .sort({
          createdAt: -1,
        })
        .lean();

    console.log(
      'ENQUIRIES FOUND:',
      enquiries.length,
    );

    const enrichedEnquiries =
      enquiries.map(
        (enquiry: any) => ({
          ...enquiry,

          plotImage:
            enquiry.plotId?.images?.[0] ||
            null,

          plotImages:
            enquiry.plotId?.images || [],
        }),
      );

    return res.status(200).json({
      success: true,
      count:
        enrichedEnquiries.length,
      data: enrichedEnquiries,
    });
  } catch (error: any) {
    console.log(
      'GET MY ENQUIRIES ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch my enquiries',
      error: error.message,
    });
  }
};



// ================= RECENT ENQUIRIES =================
export const getRecentEnquiries = async (
   req: AuthRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    const query: any = {};

if (
  req.user?.role !== 'admin'
) {
  query.userId =
    req.user?.id;
}

const enquiries =
  await Enquiry.find(query)
    .populate(
      'plotId',
      'images',
    )
    .sort({
      createdAt: -1,
    })
    .limit(10)
    .lean();

    const enrichedEnquiries = enquiries.map((enquiry: any) => ({
      ...enquiry,
      plotImage: enquiry.plotId?.images?.[0] || null,
      plotImages: enquiry.plotId?.images || [],
    }));

    return res.status(200).json({
      success: true,
      data: enrichedEnquiries,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch recent enquiries',
    });
  }
};

// ================= SINGLE ENQUIRY =================
export const getSingleEnquiry = async (
  req: AuthRequest,
  res: Response,
): Promise<Response | void> => {
  try {

    console.log(
      'GET SINGLE ENQUIRY HIT:',
      req.params.id,
    );

    const enquiry: any =
      await Enquiry.findById(
        req.params.id,
      )
        .populate(
          'plotId',
          'images title location price description amenities facing size',
        )
        .lean();

  } catch (error: any) {

    console.log(
      'GET SINGLE ENQUIRY ERROR:',
      error,
    );

    return res.status(500).json({
      success: false,
      message:
        'Failed to fetch enquiry',
    });
  }
};

// ================= SEARCH ENQUIRIES =================
export const searchEnquiries = async (
  req: AuthRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    const keyword = Array.isArray(req.params.keyword)
      ? req.params.keyword[0]
      : req.params.keyword;

    const regex = new RegExp(keyword, 'i');

    const query: any = {
  $or: [
    { name: regex },
    { mobile: regex },
    { plotTitle: regex },
  ],
};

if (
  req.user?.role !== 'admin'
) {
  query.userId =
    req.user?.id;
}

const enquiries =
  await Enquiry.find(query)
    .populate(
      'plotId',
      'images',
    )
    .sort({
      createdAt: -1,
    })
    .lean();

    const enrichedEnquiries = enquiries.map((enquiry: any) => ({
      ...enquiry,
      plotImage: enquiry.plotId?.images?.[0] || null,
      plotImages: enquiry.plotId?.images || [],
    }));

    return res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enrichedEnquiries,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to search enquiries',
    });
  }
};

// ================= UPDATE STATUS =================
export const updateEnquiryStatus = async (
  req: AuthRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    const { status } = req.body;

    const enquiry: any =
      await Enquiry.findById(
        req.params.id,
      );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: 'Enquiry not found',
      });
    }

    if (
      req.user?.role !==
        'admin' &&
      enquiry.userId?.toString() !==
        req.user?.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Access denied',
      });
    }

    enquiry.status = status;
    await enquiry.save();

    getIO(req)?.emit(
      'enquiry_updated',
      enquiry,
    );

    getIO(req)?.emit(
      'dashboard:changed',
    );

    return res.status(200).json({
      success: true,
      message:
        'Status updated successfully',
      data: enquiry,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        'Failed to update enquiry status',
    });
  }
};

// ================= DELETE ENQUIRY =================
export const deleteEnquiry = async (
  req: AuthRequest,
  res: Response,
): Promise<Response | void> => {
  try {
    const enquiry: any =
      await Enquiry.findById(
        req.params.id,
      );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message:
          'Enquiry not found',
      });
    }

    if (
      req.user?.role !==
        'admin' &&
      enquiry.userId?.toString() !==
        req.user?.id
    ) {
      return res.status(403).json({
        success: false,
        message:
          'Access denied',
      });
    }

    await enquiry.deleteOne();

    getIO(req)?.emit(
      'enquiry_deleted',
      enquiry._id,
    );

    getIO(req)?.emit(
      'dashboard:changed',
    );

    return res.status(200).json({
      success: true,
      message:
        'Enquiry deleted successfully',
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message:
        'Failed to delete enquiry',
    });
  }
};