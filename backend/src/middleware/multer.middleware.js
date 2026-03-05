import multer from "multer";
import path from "path";

// const storage = multer.diskStorage({
//   //whenever you get a file, an unique filename would be generated. arguments are request
//   //file and callback (cb). call the cb with the argument error = NULL and the next is the file name that would be given
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = [".jpeg", ".jpg", ".png", ".webp"].includes(ext) ? ext : "";
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${safeExt}`);
  },
});

const filterFile = (req, file, cb) => {
  const allowedTypes = /jpg | jpeg |webp | png/;
  const extName = allowedTypes.test(
    path.extname(file.originalname).toLocaleLowerCase()
  );
  const mimeType = allowedTypes.test(file.mimeType);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "can not upload this type of file - only jpeg, jpg, webp and png are allowed"
      )
    );
  }
};

export const upload = multer({
  storage: storage,
  filterFile: filterFile,
  limits: { filesize: 5 * 1024 * 1024 }, //file with size upto 5MB are allowed
});
