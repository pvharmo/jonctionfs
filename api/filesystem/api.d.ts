import { Response } from '../interfaces.ts'
import { Obj, ObjectId, PresignedUrl } from '../../interfaces.ts'

export interface ContentUrl extends String {}

export interface Metadata {
  size: number
  etag: string
  lastModified: Date
}

export interface Child {
  name: string
  type: string
  contentUrl: string
  lastModified: string
}

export interface File {
  contentUrl: ContentUrl
}

export interface FileSystemAPI {
  get: (objectId: ObjectId) => Promise<Obj>
  upload: (name: string, parents: ObjectId[]) => Promise<PresignedUrl>
  destroy: (objectId: ObjectId) => Promise<void>
  move: (oldParentId: ObjectId, newParentId: ObjectId, objectId: ObjectId) => Promise<void>
  rename: (objectId: ObjectId, newName: string) => Promise<void>
  getContainerContent: (objectId: ObjectId) => Promise<Obj[]>
  createContainer: (name: string, parents: ObjectId[]) => Promise<void>
  destroyContainer: (objectId: ObjectId) => Promise<void>
  getMetadata: (objectId: ObjectId) => Promise<Obj>
}

export interface FileSystemAction {
  readonly getFile: (connection: FileSystemAPI, body: any) => Promise<Response<File>>
  readonly uploadFile: (connection: FileSystemAPI, body: any) => Promise<Response<File>>
  readonly destroyFile: (connection: FileSystemAPI, body: any) => Promise<Response<void>>
  readonly getMetadataFile: (connection: FileSystemAPI, body: any) => Promise<Response<Metadata>>
  readonly moveFile: (connection: FileSystemAPI, body: any) => Promise<Response<void>>
  readonly getFolder: (connection: FileSystemAPI, body: any) => Promise<Response<Child[]>>
  readonly createFolder: (connection: FileSystemAPI, body: any) => Promise<Response<void>>
  readonly destroyFolder: (connection: FileSystemAPI, body: any) => Promise<Response<void>>
}