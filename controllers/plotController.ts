import { Request, Response } from 'express';
import { IPlot } from '../models/PlotModel';
import Plot from '../models/PlotModel';

// =========================
// Custom Request for Multer
// =========================



// =========================
// Socket.IO Helper
// =========================

const getIO = (req: Request) => req.app.get('io');

// =========================
// Helpers
// =========================

const normalizeStatus = (
  status?: string,
): 'Available' | 'Booked' | 'Sold' => {
  if (!status) {
    return 'Available';
  }

  const value = status
    .trim()
    .toLowerCase();

  if (value === 'booked') {
    return 'Booked';
  }

  if (value === 'sold') {
    return 'Sold';
  }

  return 'Available';
};

const normalizeImagePath = (
  file?: Express.Multer.File,
): string => {
  if (!file) {
    return '';
  }

  return file.path.replace(
    /\\/g,
    '/',
  );
};

const isBlank = (
  value: unknown,
): boolean =>
  !String(value || '').trim();

const serializePlot = (
  plot: IPlot | any,
) => {
  if (!plot) {
    return plot;
  }

  const data =
    typeof plot.toObject ===
    'function'
      ? plot.toObject()
      : plot;

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
      ? String(
          data.image,
        ).replace(/\\/g, '/')
      : '',

    status: normalizeStatus(
      data.status,
    ),

    amenities: {
      parkDistance:
        data?.amenities
          ?.parkDistance || '',

      schoolDistance:
        data?.amenities
          ?.schoolDistance || '',

      hospitalDistance:
        data?.amenities
          ?.hospitalDistance || '',

      marketDistance:
        data?.amenities
          ?.marketDistance || '',
    },
  };
};

// =========================
// ADD PLOT
// =========================

export const addPlot = async (
  req: Request,
  res: Response,
): Promise<Response | void> => {
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

    const normalizedTitle =
      title || plotTitle;

    const normalizedLocation =
      location || township;

    if (
      isBlank(normalizedTitle) ||
      isBlank(
        normalizedLocation,
      ) ||
      isBlank(sector) ||
      isBlank(size) ||
      isBlank(price) ||
      isBlank(facing) ||
      isBlank(dimension) ||
      isBlank(description) ||
      isBlank(status) ||
      isBlank(
        parkDistance,
      ) ||
      isBlank(
        schoolDistance,
      ) ||
      isBlank(
        hospitalDistance,
      ) ||
      isBlank(
        marketDistance,
      )
    ) {
      return res
        .status(400)
        .json({
          success: false,
          message:
            'All plot fields except image are required',
        });
    }

    const image =
      normalizeImagePath(
        req.file,
      );

    const newPlot =
      await Plot.create({
        title:
          normalizedTitle,
        location:
          normalizedLocation,
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

        status:
          normalizeStatus(
            status,
          ),

        image,
      });

    getIO(req)?.emit(
      'plot:created',
      serializePlot(
        newPlot,
      ),
    );

    getIO(req)?.emit(
      'plots:changed',
    );

    getIO(req)?.emit(
      'dashboard:changed',
    );

    return res.status(201).json({
      success: true,
      message:
        'Plot added successfully',
      plot: serializePlot(
        newPlot,
      ),
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// =========================
// GET ALL PLOTS
// =========================

export const getPlots =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
    try {
      const plots =
        await Plot.find().sort({
          createdAt: -1,
        });

      return res
        .status(200)
        .json({
          success: true,
          plots:
            plots.map(
              serializePlot,
            ),
        });
    } catch (
      error: any
    ) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

// =========================
// GET SINGLE PLOT
// =========================

export const getSinglePlot =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
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

      return res
        .status(200)
        .json({
          success: true,
          plot:
            serializePlot(
              plot,
            ),
        });
    } catch (
      error: any
    ) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

// =========================
// UPDATE PLOT
// =========================

export const updatePlot =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
    try {
      const existingPlot =
        await Plot.findById(
          req.params.id,
        );

      if (!existingPlot) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Plot not found',
          });
      }

      const updateFields: any =
        {
          title:
            req.body.title ??
            existingPlot.title,

          location:
            req.body
              .location ??
            existingPlot.location,

          sector:
            req.body.sector ??
            existingPlot.sector,

          size:
            req.body.size ??
            existingPlot.size,

          price:
            req.body.price ??
            existingPlot.price,

          facing:
            req.body
              .facing ??
            existingPlot.facing,

          dimension:
            req.body
              .dimension ??
            existingPlot.dimension,

          description:
            req.body
              .description ??
            existingPlot.description,

          status:
            req.body.status
              ? normalizeStatus(
                  req.body
                    .status,
                )
              : existingPlot.status,

          amenities: {
            parkDistance:
              req.body
                .parkDistance ??
              existingPlot
                .amenities
                ?.parkDistance,

            schoolDistance:
              req.body
                .schoolDistance ??
              existingPlot
                .amenities
                ?.schoolDistance,

            hospitalDistance:
              req.body
                .hospitalDistance ??
              existingPlot
                .amenities
                ?.hospitalDistance,

            marketDistance:
              req.body
                .marketDistance ??
              existingPlot
                .amenities
                ?.marketDistance,
          },
        };

      if (req.file) {
        updateFields.image =
          normalizeImagePath(
            req.file,
          );
      } else if (
        req.body
          .removeImage ===
          'true' ||
        req.body
          .removeImage ===
          true
      ) {
        updateFields.image =
          '';
      }

      const updatedPlot =
        await Plot.findByIdAndUpdate(
          req.params.id,
          {
            $set:
              updateFields,
          },
          {
            new: true,
            runValidators:
              true,
          },
        );

      getIO(req)?.emit(
        'plot:updated',
        serializePlot(
          updatedPlot,
        ),
      );

      getIO(req)?.emit(
        'plots:changed',
      );

      getIO(req)?.emit(
        'dashboard:changed',
      );

      return res
        .status(200)
        .json({
          success: true,
          message:
            'Plot updated successfully',
          plot:
            serializePlot(
              updatedPlot,
            ),
        });
    } catch (
      error: any
    ) {
      console.log(error);

      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

// =========================
// UPDATE PLOT STATUS
// =========================

export const updatePlotStatus =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
    try {
      const { status } =
        req.body;

      const updatedPlot =
        await Plot.findByIdAndUpdate(
          req.params.id,
          {
            status:
              normalizeStatus(
                status,
              ),
          },
          {
            new: true,
            runValidators:
              true,
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

      getIO(req)?.emit(
        'plot:status',
        serializePlot(
          updatedPlot,
        ),
      );

      getIO(req)?.emit(
        'plot:updated',
        serializePlot(
          updatedPlot,
        ),
      );

      getIO(req)?.emit(
        'plots:changed',
      );

      getIO(req)?.emit(
        'dashboard:changed',
      );

      return res
        .status(200)
        .json({
          success: true,
          message:
            'Status updated successfully',
          plot:
            serializePlot(
              updatedPlot,
            ),
        });
    } catch (
      error: any
    ) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };

// =========================
// DELETE PLOT
// =========================

export const deletePlot =
  async (
    req: Request,
    res: Response,
  ): Promise<
    Response | void
  > => {
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

      getIO(req)?.emit(
        'plot:deleted',
        deletedPlot._id,
      );

      getIO(req)?.emit(
        'plots:changed',
      );

      getIO(req)?.emit(
        'dashboard:changed',
      );

      return res
        .status(200)
        .json({
          success: true,
          message:
            'Plot deleted successfully',
        });
    } catch (
      error: any
    ) {
      return res
        .status(500)
        .json({
          success: false,
          message:
            error.message,
        });
    }
  };