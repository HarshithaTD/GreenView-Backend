const express = require('express');

const router = express.Router();

const {
  createEnquiry,
  getAllEnquiries,
  getRecentEnquiries,
  getSingleEnquiry,
  updateEnquiryStatus,
  searchEnquiries,
  deleteEnquiry,
} = require(
  '../controllers/enquiryController',
);

// ================= CREATE ENQUIRY =================

router.post(
  '/create',
  createEnquiry,
);

// ================= GET ALL ENQUIRIES =================

router.get(
  '/all',
  getAllEnquiries,
);

// ================= GET RECENT ENQUIRIES =================

router.get(
  '/recent',
  getRecentEnquiries,
);

// ================= GET SINGLE ENQUIRY =================

router.get(
  '/:id',
  getSingleEnquiry,
);

// ================= SEARCH ENQUIRIES =================

router.get(
  '/search/:keyword',
  searchEnquiries,
);

// ================= UPDATE ENQUIRY STATUS =================

router.patch(
  '/:id/status',
  updateEnquiryStatus,
);

router.put(
  '/update-status/:id',
  updateEnquiryStatus,
);

// ================= DELETE ENQUIRY =================

router.delete(
  '/:id',
  deleteEnquiry,
);

module.exports = router;
