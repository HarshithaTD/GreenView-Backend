import multer, {
  FileFilterCallback,
} from 'multer';
import path from 'path';
import {
  Request,
} from 'express';

// ============================
// Storage Configuration
// ============================

const storage =
  multer.diskStorage({
    destination: (
      req: Request,
      file: Express.Multer.File,
      cb,
    ): void => {
      cb(
        null,
        'uploads/',
      );
    },

    filename: (
      req: Request,
      file: Express.Multer.File,
      cb,
    ): void => {
      cb(
        null,
        Date.now() +
          path.extname(
            file.originalname,
          ),
      );
    },
  });

// ============================
// File Filter
// ============================

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
): void => {
  if (
    file.mimetype ===
      'image/jpeg' ||
    file.mimetype ===
      'image/png' ||
    file.mimetype ===
      'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Only JPG, PNG, JPEG files allowed',
      ),
    );
  }
};

// ============================
// Multer Upload
// ============================

const upload = multer({
  storage,
  fileFilter,
});

export default upload;