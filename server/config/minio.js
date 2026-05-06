import { Client } from 'minio';

let minioClient;

export const getMinioClient = () => {
  if (!minioClient) {
    minioClient = new Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT || 9000),
      useSSL: process.env.MINIO_USE_SSL === 'true',
      accessKey: process.env.MINIO_ACCESS_KEY || 'minioadmin',
      secretKey: process.env.MINIO_SECRET_KEY || 'minioadmin',
    });
  }

  return minioClient;
};

export const ensureBucketExists = async () => {
  const client = getMinioClient();
  const bucketName = process.env.MINIO_BUCKET || 'notes-files';

  try {
    const exists = await client.bucketExists(bucketName);
    if (!exists) {
      await client.makeBucket(bucketName, 'us-east-1');
      console.log(`✅ MinIO bucket '${bucketName}' created`);

      // Set bucket policy to public
      const policy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: `arn:aws:s3:::${bucketName}/*`,
          },
        ],
      };

      await client.setBucketPolicy(bucketName, JSON.stringify(policy));
      console.log(`✅ MinIO bucket '${bucketName}' set to public`);
    } else {
      console.log(`✅ MinIO bucket '${bucketName}' exists`);
      
      // Ensure bucket policy is set to public (in case it wasn't before)
      try {
        const policy = {
          Version: '2012-10-17',
          Statement: [
            {
              Effect: 'Allow',
              Principal: '*',
              Action: ['s3:GetObject'],
              Resource: `arn:aws:s3:::${bucketName}/*`,
            },
          ],
        };
        await client.setBucketPolicy(bucketName, JSON.stringify(policy));
        console.log(`✅ MinIO bucket '${bucketName}' policy updated to public`);
      } catch (policyError) {
        console.warn(`⚠️  Could not update bucket policy: ${policyError.message}`);
      }
    }
  } catch (error) {
    console.error('❌ MinIO bucket error:', error.message);
    throw error;
  }
};

export const uploadFileToMinIO = async (fileName, fileBuffer, mimeType) => {
  const client = getMinioClient();
  const bucketName = process.env.MINIO_BUCKET || 'notes-files';

  try {
    await client.putObject(bucketName, fileName, fileBuffer, fileBuffer.length, {
      'Content-Type': mimeType,
    });

    const url = `${process.env.MINIO_URL || 'http://localhost:9000'}/${bucketName}/${fileName}`;
    return url;
  } catch (error) {
    console.error('❌ MinIO upload error:', error.message);
    throw error;
  }
};
