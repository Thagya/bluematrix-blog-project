import { diskStorage } from 'multer';
import { extname } from 'path';
import configuration from '../config/configuration';

const config = configuration();

export const multerOptions = {
    storage: diskStorage({
        destination: config.upload.destination,
        filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
        },
    }),
    limits: {
        fileSize: config.upload.maxFileSize,
    },
};
