const Plot = require('../models/PlotModel');

const getIO = req => req.app.get('io');

const normalizeStatus = status => {
  if (!status) {
    return 'Available';
  }

  const value = String(status).trim().toLowerCase();

  if (value === 'booked') {
    return 'Booked';
  }

  if (value === 'sold') {
    return 'Sold';
  }

  return 'Available';
};

const normalizeImagePath = file => {
  if (!file) {
    return '';
  }

  return file.path.replace(/\\/g, '/');
};

const serializePlot = plot => {
  if (!plot) {
    return plot;
  }

  const data =
    typeof plot.toObject === 'function' ? plot.toObject() : plot;

  return {
    ...data,
    title:
      data.title ||
      data.plotTitle ||
      '',
    location:
      data.location ||
      data.township ||
      '',
    image: data.image
      ? String(data.image).replace(
          /\\/g,
          '/',
        )
      : '',
    status: normalizeStatus(data.status),
  };
};

/* =========================
   ADD PLOT
========================= */

const addPlot = async (req, res) => {
  try {
    const {
      title,
      plotTitle,
      location,
      township,
      sector,
      size,
      price,
      facing,
      dimension,
      description,
      parkDistance,
      schoolDistance,
      hospitalDistance,
      marketDistance,
      status,
    } = req.body;

    const normalizedTitle = title || plotTitle;
    const normalizedLocation = location || township;

    if (
      !normalizedTitle ||
      !normalizedLocation ||
      !sector ||
      !size ||
      !price
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Title, location, sector, size, and price are required',
      });
    }

    const image = normalizeImagePath(req.file);

    const newPlot = new Plot({
      title: normalizedTitle,
      location: normalizedLocation,
      sector,
      size,
      price,
      facing,
      dimension,
      description,

      amenities: {
        parkDistance,
        schoolDistance,
        hospitalDistance,
        marketDistance,
      },

      status: normalizeStatus(status),

      image,
    });

    await newPlot.save();

    getIO(req)?.emit(
      'plot:created',
      serializePlot(newPlot),
    );
    getIO(req)?.emit('plots:changed');
    getIO(req)?.emit('dashboard:changed');

    res.status(201).json({
      success: true,
      message:
        'Plot added successfully',
      plot: serializePlot(newPlot),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET ALL PLOTS
========================= */

const getPlots = async (req, res) => {
  try {
    const plots =
      await Plot.find().sort({
        createdAt: -1,
      });

      res.status(200).json({
        success: true,
        plots: plots.map(serializePlot),
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================
   GET SINGLE PLOT
========================= */

const getSinglePlot = async (req, res) => {
    try {
      const plot =
        await Plot.findById(
          req.params.id,
        );

      if (!plot) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Plot not found',
          });
      }

      res.status(200).json({
        success: true,
        plot: serializePlot(plot),
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================
   UPDATE PLOT
========================= */

const updatePlot =
  async (req, res) => {
    try {
    const updatedData = {
      ...req.body,
    };

      if (updatedData.plotTitle && !updatedData.title) {
        updatedData.title = updatedData.plotTitle;
        delete updatedData.plotTitle;
      }

      if (updatedData.township && !updatedData.location) {
        updatedData.location = updatedData.township;
        delete updatedData.township;
      }

      if (updatedData.status) {
        updatedData.status = normalizeStatus(
          updatedData.status,
        );
      }

      if (req.file) {
        updatedData.image =
          normalizeImagePath(req.file);
      }

      const updatedPlot =
        await Plot.findByIdAndUpdate(
          req.params.id,
          updatedData,
          {
            new: true,
          },
        );

      if (!updatedPlot) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Plot not found',
          });
      }

      res.status(200).json({
        success: true,
        message:
          'Plot updated successfully',
        plot: serializePlot(updatedPlot),
      });

      getIO(req)?.emit(
        'plot:updated',
        serializePlot(updatedPlot),
      );
      getIO(req)?.emit('plots:changed');
      getIO(req)?.emit('dashboard:changed');
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================
   UPDATE PLOT STATUS
========================= */

const updatePlotStatus =
  async (req, res) => {
    try {
      const { status } = req.body;

      const normalizedStatus =
        normalizeStatus(status);

      const updatedPlot =
        await Plot.findByIdAndUpdate(
          req.params.id,
          { status: normalizedStatus },
          { new: true, runValidators: true },
        );

      if (!updatedPlot) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Plot not found',
          });
      }

      res.status(200).json({
        success: true,
        message:
          'Status updated successfully',
        plot: serializePlot(updatedPlot),
      });

      getIO(req)?.emit(
        'plot:status',
        serializePlot(updatedPlot),
      );
      getIO(req)?.emit(
        'plot:updated',
        serializePlot(updatedPlot),
      );
      getIO(req)?.emit('plots:changed');
      getIO(req)?.emit('dashboard:changed');
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

/* =========================
   DELETE PLOT
========================= */

const deletePlot =
  async (req, res) => {
    try {
      const deletedPlot =
        await Plot.findByIdAndDelete(
          req.params.id,
        );

      if (!deletedPlot) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Plot not found',
          });
      }

      res.status(200).json({
        success: true,
        message:
          'Plot deleted successfully',
      });

      getIO(req)?.emit('plot:deleted', deletedPlot._id);
      getIO(req)?.emit('plots:changed');
      getIO(req)?.emit('dashboard:changed');
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };

module.exports = {
  addPlot,
  getPlots,
  getSinglePlot,
  updatePlot,
  updatePlotStatus,
  deletePlot,
};
