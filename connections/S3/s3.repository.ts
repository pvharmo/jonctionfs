import { Client } from "./s3.client.ts"
import { Path } from './path.ts'
import { Obj } from '../../interfaces.ts'

import * as utils from './s3.utils.ts'

export const get = async (path: Path, minio: Client): Promise<Obj> => {
  const [bucket, bucketPath] = path.extractRoot()
  const contentUrl = await minio.presignedGetObject(bucket, bucketPath.path)
  return { contentUrl }
}

export const destroy = async (path: Path, minio: Client): Promise<void> => {
  const [bucket, bucketPath] = path.extractRoot()
  await minio.removeObject(bucket, bucketPath.path)
}

export const upsert = async (path: Path, minio: Client) => {
  const [bucket, bucketPath] = path.extractRoot()
  const { presignedUrl } = (await minio.presignedPutObject(bucket, bucketPath.path, 30)) as any
  return { contentUrl: presignedUrl, method: 'PUT' }
}

export const move = async (oldPath: Path, newPath: Path, minio: Client): Promise<void> => {
  const [oldBucket, oldBucketPath] = oldPath.extractRoot()
  const [newBucket, newBucketPath] = newPath.extractRoot()
  if (oldPath.isFolder) {
    await utils.moveContainer(oldBucket, oldBucketPath, newBucketPath, minio)
  } else {
    await utils.moveObject(newBucket, oldBucketPath, newBucketPath, minio)
  }
}

export const getContainerContent = async (path: Path, minio: Client): Promise<Obj[]> => {
  if (path.toString() == "/") {
    return await utils.listBuckets(minio)
  }

  const [bucket, bucketPath] = path.extractRoot()
  return await utils.getContainerContent(bucket, bucketPath, minio)
}

export const createContainer = async (path: Path, minio: Client): Promise<void> => {
  const [bucket, bucketPath] = path.extractRoot()
  await minio.putObject(bucket, bucketPath.path + '/.thinkdrive.container', '')
}

export const destroyContainer = async (path: Path, minio: Client): Promise<void> => {
  const [bucket, bucketPath] = path.extractRoot()
  const childrenStream = await minio.listObjectsV2(bucket, bucketPath.path + "/", true)
  const children = []
  for await (const child of childrenStream) {
    children.push(child)
  }
  await minio.removeObjects(
    bucket,
    children.map((x) => {
      return x.name
    })
  )
}

export const getMetadata = async (path: Path, minio: Client): Promise<Obj> => {
  const [bucket, bucketPath] = path.extractRoot()
  const metadata = await minio.statObject(bucket, bucketPath.path)
  return {
    contentUrl: '',
    data: {
      size: metadata.size,
      etag: metadata.etag,
      lastModified: metadata.lastModified,
    }
  }
}