const express = require('express');

const router = express.Router();

const {
  addPlot,
  getPlots,
  getSinglePlot,
  updatePlot,
  updatePlotStatus,
  deletePlot,
} = require('../controllers/plotController');

const upload = require('../middleware/uploadMiddleware');

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

router.get(
  '/all-plots',
  getPlots,
);

/* =========================
   GET SINGLE PLOT
========================= */

router.get(
  '/:id',
  getSinglePlot,
);

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

router.patch(
  '/:id/status',
  updatePlotStatus,
);

/* =========================
   DELETE PLOT
========================= */

router.delete(
  '/:id',
  deletePlot,
);

module.exports = router;