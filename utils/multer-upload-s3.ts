import multerS3 from 'multer-s3';
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';
const s3 = new S3Client({
    region: process.env.S3_BUCKET_REGION!,
    credentials: {
        accessKeyId: process.env.S3_BUCKET_IAM_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_BUCKET_IAM_SECRET_KEY_ID!
    }
})
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.S3_BUCKET_NAME!,
        acl: 'public-read', // Set ACL permissions
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '-' + file.originalname);
        }
    })
});
export default upload;  