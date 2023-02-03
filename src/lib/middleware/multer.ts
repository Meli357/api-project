import mime from "mime";
import multer from "multer";

import { randomUUID } from "node:crypto";

//function to generate a photoFilename
export const generatePhotoFilename = (mimeType: string) => {
    const randomFilename = `${randomUUID()}-${Date.now()};`;
    const fileExtension = mime.getExtension(mimeType);
    const filename = `${randomFilename}.${fileExtension}`;

    return filename;
};
//this function can be tested with an unit test

//create storage instance
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (request, file, callback) => {
        return callback(null, generatePhotoFilename(file.mimetype));
    },
});

export const multerOptions = {};

export const initMulterMiddleware = () => {
    // return multer(multerOptions);
    return multer({ storage, ...multerOptions });
};
