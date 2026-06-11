import express, {
  Router,
} from 'express';

import {
  createEnquiry,
  getAllEnquiries,
  getRecentEnquiries,
  getSingleEnquiry,
  updateEnquiryStatus,
  searchEnquiries,
  deleteEnquiry,
  getMyEnquiries,
} from '../controllers/enquiryController';

import { authUser } from '../middleware/authMiddleware'; // adjust path if needed

const router: Router =
  express.Router();

// ================= CREATE ENQUIRY =================
router.post(
  '/create',
  authUser,
  createEnquiry,
);

// ================= MY ENQUIRIES =================
router.get(
  '/my-enquiries',
  authUser,
  getMyEnquiries,
);



// ================= GET ALL ENQUIRIES =================
router.get(
  '/all',
 authUser,
  getAllEnquiries,
);

// ================= GET RECENT ENQUIRIES =================
router.get(
  '/recent',
 authUser,
  getRecentEnquiries,
);

// ================= SEARCH ENQUIRIES =================
router.get(
  '/search/:keyword',
 authUser,
  searchEnquiries,
);


// ================= UPDATE ENQUIRY STATUS =================
router.patch(
  '/:id/status',
 authUser,
  updateEnquiryStatus,
);

router.put(
  '/update-status/:id',
  authUser,
  updateEnquiryStatus,
);

// ================= DELETE ENQUIRY =================
router.delete(
  '/:id',
  authUser,
  deleteEnquiry,
);

// ================= GET SINGLE ENQUIRY =================
router.get(
  '/:id',
 authUser,
  getSingleEnquiry,
);

export default router;