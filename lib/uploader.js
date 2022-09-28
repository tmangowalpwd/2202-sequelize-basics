const multer = require("multer")

const upload = ({
  filePrefix = "FILE",
  fileName = Date.now(),
  acceptedFileTypes = [],
}) => {
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public")
    },
    filename: (req, file, cb) => {
      console.log(file)
      cb(null, `${filePrefix}-${fileName}.${file.mimetype.split("/")[1]}`)
    },
  })

  const fileFilter = (req, file, cb) => {
    const extension = file.mimetype.split("/")[1]

    if (acceptedFileTypes.includes(extension)) {
      cb(null, true)
    } else {
      cb(new Error("Invalid file type"))
    }
  }

  return multer({
    storage: diskStorage,
    fileFilter,
  })
}

module.exports = {
  upload,
}
