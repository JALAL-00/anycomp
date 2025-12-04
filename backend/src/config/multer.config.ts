import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = path.join(__dirname, '../../public/uploads');

// Create upload directory with error handling
try {
    if (!fs.existsSync(uploadDir)) {
        console.log(`📁 Creating upload directory: ${uploadDir}`);
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log('✅ Upload directory created successfully');
    } else {
        console.log(`✅ Upload directory exists: ${uploadDir}`);
    }

    // Check if directory is writable
    fs.accessSync(uploadDir, fs.constants.W_OK);
    console.log('✅ Upload directory is writable');
} catch (error) {
    console.error('❌ Error setting up upload directory:', error);
    console.error('Upload directory path:', uploadDir);
    console.error('This may cause file upload failures!');
}

const storage = multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
        // Double-check directory exists before each upload
        if (!fs.existsSync(uploadDir)) {
            try {
                fs.mkdirSync(uploadDir, { recursive: true });
            } catch (err) {
                console.error('Failed to create upload directory:', err);
                return cb(err);
            }
        }
        cb(null, uploadDir);
    },
    filename: (req: any, file: any, cb: any) => {
        try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const extension = path.extname(file.originalname);
            const filename = file.fieldname + '-' + uniqueSuffix + extension;
            console.log(`📸 Saving file: ${filename}`);
            cb(null, filename);
        } catch (err) {
            console.error('Error generating filename:', err);
            cb(err);
        }
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload only images.'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});