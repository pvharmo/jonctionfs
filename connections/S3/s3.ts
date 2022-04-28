import { Client } from "./s3.client.ts"
import { FileSystemAPI } from '../../api/filesystem/api.d.ts'
import { Obj, PresignedUrl } from '../../interfaces.ts'
import { Path } from './path.ts'

import * as repository from './s3.repository.ts'

export const newConnection = async (
  connectionInfo: any,
  _userId: string
): Promise<FileSystemAPI> => {

  const minio = await new Client({
    endPoint: connectionInfo.endPoint,
    port: connectionInfo.port,
    useSSL: false,
    accessKey: connectionInfo.accessKey,
    secretKey: connectionInfo.secretKey,
  })

  const connection: FileSystemAPI = {
    async get(path): Promise<Obj> {
      return await repository.get(new Path(path.toString()), minio)
    },
    async destroy(path): Promise<void> {
      await repository.destroy(new Path(path.toString()), minio)
    },
    async upload(name, parents): Promise<PresignedUrl> {
      const path = new Path(parents[0].toString() + name)
      return await repository.upsert(path, minio)
    },
    async move(oldPath, newPath) {
      return await repository.move(new Path(oldPath.toString()), new Path(newPath.toString()), minio)
    },
    async rename(path, newName) {
      await Promise.reject()
    },
    async getContainerContent(path): Promise<Obj[]> {
      return await repository.getContainerContent(new Path(path.toString()), minio)
    },
    async createContainer(name, parents): Promise<void> {
      const path = new Path(parents[0].toString() + name)
      await repository.createContainer(path, minio)
    },
    async destroyContainer(path): Promise<void> {
      await repository.destroyContainer(new Path(path.toString()), minio)
    },
    async getMetadata(path): Promise<Obj> {
      return await repository.getMetadata(new Path(path.toString()), minio)
    },
  }

  return connection
}
