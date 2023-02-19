const { StatusCodes } = require("http-status-codes");
const ImageModel = require("../models/image");

const getImage = async (req, res, next) => {
    try{
        const image = await ImageModel.findOne({_id: req.params.id});
        // const img = base64ArrayBuffer(image.image.data)
        const img = image.image;
        res.status(200).send(img);
    }catch(err){
       next(err);
    }
}

const uploadImage = async (req, res, next) => {
    var image = {};
    image['data'] = req.files[0].buffer;
    image['contentType'] = req.files[0].mimetype;
    const filename = Date.now() + req.files[0].originalname;
    const newImage = new ImageModel({
        image: image,
        name: filename
    });
    newImage.save((err, image) => {
        if(err){
          next(err);
        }else{
            return res.status(StatusCodes.CREATED).json({imageId: image._id});
        }
    });
}

module.exports = {getImage, uploadImage};