import multer from 'multer';
import fs from 'fs';
import path from 'path';

export const tmpDir = path.join(process.cwd(), 'tmp');

// ensure tmp exists
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, tmpDir);
  },
  filename(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage });


export function cleanupTmpDir() {
  const ONE_HOUR = 60 * 60 * 1000;

  fs.readdirSync(tmpDir).forEach(file => {
    const filePath = path.join(tmpDir, file);

    const stats = fs.statSync(filePath);
    if (Date.now() - stats.mtimeMs > ONE_HOUR) {
      fs.unlinkSync(filePath);
    }
  });
}