import { Client } from "./s3.client.ts"
import { Path } from './path.ts'
import { Obj } from '../../interfaces.ts'

export async function moveContainer(
  bucket: string,
  oldPath: Path,
  newPath: Path,
  minio: Client
) {
  const childrenStream = await minio.listObjectsV2(bucket, oldPath.path, true)
  for await (const child of childrenStream) {
    if (child.name) {
      const newName = child.name.replace(oldPath.path, newPath.path)
      await minio.copyObject(
        bucket,
        newName,
        `/${bucket}/${child.name}`,
      )
      await minio.removeObject(bucket, child.name)
    }
  }
}

export async function moveObject(bucket: string, oldPath: Path, newPath: Path, minio: Client) {
  await minio.copyObject(
    bucket,
    newPath.path,
    `/${bucket}/${oldPath.path}`,
  )
  await minio.removeObject(bucket, oldPath.path)
}

export async function getContainerContent(
  bucket: string,
  path: Path,
  minio: Client
): Promise<Obj[]> {
  const childrenStream = await minio.listObjectsV2(bucket, path.path + '/')
  const children = []
  for (const child of childrenStream) {
    const splitIndex =
      (child.name?.lastIndexOf('/') ||
        child.prefix?.slice(0, -1)?.lastIndexOf('/')) + 1
    const name = child.name?.substring(splitIndex) || child.prefix?.slice(splitIndex, -1)
    const contentPath = path.path == '/' ? path.path : path.path[0] == '/' || path.path == '' ? path.path + '/' : '/' + path.path + '/'
    const id = '/' + bucket + contentPath + name + (child.prefix? '/' : '')
    children.push({
      id,
      type: child.prefix ? 'container' : 'object',
      name,
      location:
        '/' +
        (child.name?.substring(0, splitIndex) ||
          child.prefix?.substring(0, splitIndex) ||
          ''),
      lastModified: child.lastModified,
      contentUrl: id
    })
  }

  return children
}

export async function listBuckets(minio: Client): Promise<Obj[]> {
  const bucketStream = await minio.listBuckets()
  const buckets = []
  for (const bucket of bucketStream) {
    const name = bucket.name
    const id = '/' + name
    buckets.push({
      id,
      type: 'container',
      name,
      location: '/' + name,
      contentUrl: id
    })
  }

  return buckets
}