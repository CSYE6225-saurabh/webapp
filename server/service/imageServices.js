const imageUtils = require("../utils/imageUtil")
const Image = require("../model/image")

const uploadService =async (uploadData)=>{
    const imgFile = new Image(uploadData);
    const prom = await imgFile.save();
    return prom;
}
const getImage =async (UserId) => { 
    const user =await  Image.findOne({where: {UserId: UserId}});
    return user;
}
const deleteImage =async (id) => {
    const prom = await Image.destroy({where: {id: id}});
    return prom
}
module.exports = {
    uploadService,
    getImage,
    deleteImage
}