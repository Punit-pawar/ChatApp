dotenv.config();

import {v2 as cloudinary} from 'cloudinary';

cloudinary.config({
    CLOUD_NAME:process.env.CLOUDINARY_CLOUD_NAME,

});


console.log("Cloudinary Configuration Done");

export default cloudinary;