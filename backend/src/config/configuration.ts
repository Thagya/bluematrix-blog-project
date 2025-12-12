export default () => ({
    port: parseInt(process.env.PORT || '', 10) || 5000,
    database: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/blog-cms',
    },
    jwt: {
        secret: process.env.JWT_SECRET || '18bec4262b599acc73ac145fc65ab65f97e83b2033b329fc612d01c9e4c0f4f4135def0e550f18b79657be64b7998941cec9e5044c614673389e0fb0',
        expiresIn: process.env.JWT_EXPIRATION || '7d',
    },
    upload: {
        maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '', 10) || 5242880, // 5MB
        destination: process.env.UPLOAD_DESTINATION || './uploads/images',
    },
});