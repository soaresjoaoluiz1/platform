import multer from 'multer';
import { Request } from 'express';

// Configuração do Multer para upload em memória
const storage = multer.memoryStorage();

// Filtro para aceitar apenas imagens e vídeos
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Tipos de arquivo aceitos
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
  
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de arquivo não suportado. Use apenas imagens (JPEG, PNG, GIF, WebP) ou vídeos (MP4, MPEG, MOV, AVI, WebM).'));
  }
};

// Configuração do Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB máximo por arquivo
  },
});

// Middleware para upload de arquivos de disparo
export const uploadDisparoFiles = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

export default upload;