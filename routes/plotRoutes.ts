import express, {
  Request,
  Response,
  Router,
} from 'express';

import {
  addPlot,
  getPlots,
  getSinglePlot,
  updatePlot,
  updatePlotStatus,
  deletePlot,
} from '../controllers/plotController';

import upload from '../middleware/uploadMiddleware';

const router: Router = express.Router();

/* =========================
   ADD PLOT
========================= */
router.post(
  '/add-plot',
  upload.single('image'),
  addPlot,
);

/* =========================
   GET ALL PLOTS
========================= */
router.get('/all-plots', getPlots);

/* =========================
   GET SINGLE PLOT
========================= */
router.get('/:id', getSinglePlot);

/* =========================
   UPDATE PLOT
========================= */
router.put(
  '/:id',
  upload.single('image'),
  updatePlot,
);

/* =========================
   UPDATE STATUS
========================= */
router.patch('/:id/status', updatePlotStatus);

/* =========================
   DELETE PLOT
========================= */
router.delete('/:id', deletePlot);

export default router;