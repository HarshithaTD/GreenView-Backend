const Enquiry = require('../models/Enquiry');

const getIO = req => req.app.get('io');

// ================= CREATE ENQUIRY =================

const createEnquiry = async (
  req,
  res,
) => {
  try {
    const {
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

    // VALIDATION
    if (
      !name ||
      !mobile ||
      !plotTitle
    ) {
      return res.status(400).json({
        success: false,

        message:
          'Name, mobile and plot title are required',
      });
    }

    const enquiry =
      await Enquiry.create({
        name,

        mobile,

        email,

        message,

        plotTitle,

        plotLocation,

        plotPrice,

        avatar,

        source,

        status: 'New',
      });

    getIO(req)?.emit('new_enquiry', enquiry);
    getIO(req)?.emit('alert:new', enquiry);
    getIO(req)?.emit('dashboard:changed');

    res.status(201).json({
      success: true,

      message:
        'Enquiry submitted successfully',

      data: enquiry,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,

      message:
        'Failed to submit enquiry',
    });
  }
};

// ================= GET ALL ENQUIRIES =================

const getAllEnquiries =
  async (req, res) => {
    try {
      const {
        search,
        status,
        page = 1,
        limit = 10,
      } = req.query;

      // FILTER
      let query = {};

      // SEARCH
      if (search) {
        query.$or = [
          {
            name: {
              $regex: search,
              $options: 'i',
            },
          },

          {
            mobile: {
              $regex: search,
              $options: 'i',
            },
          },

          {
            plotTitle: {
              $regex: search,
              $options: 'i',
            },
          },
        ];
      }

      // STATUS FILTER
      if (
        status &&
        status !== 'All'
      ) {
        query.status = status;
      }

      const enquiries =
        await Enquiry.find(query)
          .sort({
            createdAt: -1,
          })
          .skip(
            (page - 1) * limit,
          )
          .limit(Number(limit));

      const total =
        await Enquiry.countDocuments(
          query,
        );

      res.status(200).json({
        success: true,

        total,

        currentPage:
          Number(page),

        totalPages: Math.ceil(
          total / limit,
        ),

        data: enquiries,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to fetch enquiries',
      });
    }
  };

// ================= GET RECENT ENQUIRIES =================

const getRecentEnquiries =
  async (req, res) => {
    try {
      const enquiries =
        await Enquiry.find()
          .sort({
            createdAt: -1,
          })
          .limit(10);

      res.status(200).json({
        success: true,

        data: enquiries,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to fetch recent enquiries',
      });
    }
  };

// ================= GET SINGLE ENQUIRY =================

const getSingleEnquiry =
  async (req, res) => {
    try {
      const enquiry =
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

      res.status(200).json({
        success: true,

        data: enquiry,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to fetch enquiry',
      });
    }
  };

// ================= SEARCH ENQUIRIES =================

const searchEnquiries =
  async (req, res) => {
    try {
      const keyword =
        req.params.keyword;

      const enquiries =
        await Enquiry.find({
          $or: [
            {
              name: {
                $regex: keyword,
                $options: 'i',
              },
            },

            {
              mobile: {
                $regex: keyword,
                $options: 'i',
              },
            },

            {
              plotTitle: {
                $regex: keyword,
                $options: 'i',
              },
            },
          ],
        }).sort({
          createdAt: -1,
        });

      res.status(200).json({
        success: true,

        count:
          enquiries.length,

        data: enquiries,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to search enquiries',
      });
    }
  };

// ================= UPDATE ENQUIRY STATUS =================

const updateEnquiryStatus =
  async (req, res) => {
    try {
      const {status} = req.body;

      const enquiry =
        await Enquiry.findByIdAndUpdate(
          req.params.id,
          {
            status,
          },
          {
            new: true,
          },
        );

      if (!enquiry) {
        return res.status(404).json({
          success: false,

          message:
            'Enquiry not found',
        });
      }

      getIO(req)?.emit('enquiry_updated', enquiry);
      getIO(req)?.emit('dashboard:changed');

      res.status(200).json({
        success: true,

        message:
          'Status updated successfully',

        data: enquiry,
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to update enquiry status',
      });
    }
  };

// ================= DELETE ENQUIRY =================

const deleteEnquiry =
  async (req, res) => {
    try {
      const enquiry =
        await Enquiry.findByIdAndDelete(
          req.params.id,
        );

      if (!enquiry) {
        return res.status(404).json({
          success: false,

          message:
            'Enquiry not found',
        });
      }

      getIO(req)?.emit('enquiry_deleted', enquiry._id);
      getIO(req)?.emit('dashboard:changed');

      res.status(200).json({
        success: true,

        message:
          'Enquiry deleted successfully',
      });
    } catch (error) {
      console.log(error);

      res.status(500).json({
        success: false,

        message:
          'Failed to delete enquiry',
      });
    }
  };

module.exports = {
  createEnquiry,
  getAllEnquiries,
  getRecentEnquiries,
  getSingleEnquiry,
  searchEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};
