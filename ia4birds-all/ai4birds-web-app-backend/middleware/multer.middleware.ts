// multer.middleware.ts
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Directorio donde se guardarán los archivos subidos
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Mantenemos el nombre original del archivo
    }
});

// Configuración de Multer
// const uploadCV = multer({
//     storage: storage,
//     limits: {
//         fileSize: 1024 * 1024 * 5 // Limitar el tamaño del archivo a 5 MB
//     },
//     fileFilter: function (req, file, cb) {
//         const filetypes = /pdf|doc|docx/; // Extensiones permitidas
//         const mimetype = filetypes.test(file.mimetype);
//         const extname = filetypes.test(file.originalname.toLowerCase());

//         if (mimetype && extname) {
//             return cb(null, true);
//         }
//         cb(new Error('Solo se permiten archivos PDF, DOC y DOCX.'));
//     }
// });

// export { uploadCV };