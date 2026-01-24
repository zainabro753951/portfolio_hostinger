import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import s3Client from '../aws_s3.config'

const getObjectURL = async key => {
  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: key,
  })

  const url = await getSignedUrl(s3Client, command)
  return url
}

export default getObjectURL
