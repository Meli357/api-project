import multer from "multer";

//create storage instance
const storage = multer.diskStorage({
    destination: "uploads/",
});

export const multerOptions = {};

export const initMulterMiddleware = () => {
    // return multer(multerOptions);
    return multer({ storage, ...multerOptions });
};
