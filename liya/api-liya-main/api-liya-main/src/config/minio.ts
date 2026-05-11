import { Client } from 'minio';

// Configuração do cliente MinIO
const minioClient = new Client({
  endPoint: process.env.MINIO_ENDPOINT || 'localhost',
  // port: parseInt(process.env.MINIO_PORT || '9000'),
  useSSL: process.env.MINIO_USE_SSL === 'true',
  accessKey: process.env.S3_ACCESS_KEY!,
  secretKey: process.env.S3_SECRET_KEY!,
});

export const bucketName = process.env.BUCKET_NAME!;

// Verificar se o bucket existe, se não, criar
export const ensureBucketExists = async () => {
  try {
    console.log(`Tentando conectar no MinIO: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`);
    console.log(`Verificando bucket: ${bucketName}`);
    
    const exists = await minioClient.bucketExists(bucketName);
    if (!exists) {
      console.log(`Bucket ${bucketName} não existe. Criando...`);
      await minioClient.makeBucket(bucketName, 'us-east-1');
      console.log(`Bucket ${bucketName} criado com sucesso`);
    } else {
      console.log(`Bucket ${bucketName} já existe`);
    }
  } catch (error) {
    console.error('Erro ao verificar/criar bucket:', error);
    console.error('Verifique se o MinIO está rodando e as credenciais estão corretas');
    console.error(`Endpoint: ${process.env.MINIO_ENDPOINT}:${process.env.MINIO_PORT}`);
    console.error(`Access Key: ${process.env.S3_ACCESS_KEY}`);
    console.error(`Bucket: ${bucketName}`);
    throw error; // Re-throw para que o erro seja visível
  }
};

export default minioClient;