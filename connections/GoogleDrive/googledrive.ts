import redis from '../../redis.ts'

import { OauthClient, OauthTokens } from '../../oauth.ts'

import { Metadata, FileSystemAPI} from '../../api/filesystem/api.d.ts'
import { Obj } from '../../interfaces.ts'

interface GoogleDriveFile {
  kind: string
  id: string
  name: string
  mimeType: string
}

export const createConnection = async (_id: string, userId: string) => {

  const tokens = JSON.parse((await redis.get(userId + 'Google Drive_GoogleDrive')) as string)

  const client = new OauthClient(tokens as OauthTokens)

  const connection: FileSystemAPI = {
    async get(obj): Promise<Obj> {
      const res = await client.fetch(
        'https://www.googleapis.com/drive/v3/files/' + obj.toString() + 
        '?fields=webViewLink'
      ).catch(err => {
        console.error(err)
      })

      return {
        contentUrl: res?.body?.webViewLink as string,
        type: 'object'
      }
    },
    async destroy(obj): Promise<void> {
      await client.fetch('https://www.googleapis.com/drive/v3/files/' + obj.toString(), {
        method: 'DELETE'
      })
    },
    async rename(obj, newName): Promise<void> {
      await client.fetch('https://www.googleapis.com/drive/v3/files/' + obj.toString(), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      })
    },
    async upload(obj, parents){
      const fileMetadata = {
        name: obj.toString(),
        parents: parents.length > 0 ? parents.map(x => x.toString()) : ["root"]
      };

      const res = await client.fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileMetadata)
      })

      return {
        contentUrl: 'http://localhost:3002/upload/google-drive/' + res.headers?.get('Location'),
        method: 'POST'
      }
    },
    async move(parent, newParent, objectId) {
      let params = new URLSearchParams({
        removeParents: parent.toString(),
        addParents: newParent.toString()
      })

      await client.fetch(`https://www.googleapis.com/drive/v3/files/${objectId.toString()}?` + params, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json'
        }
      })
    },
    async getContainerContent(obj): Promise<Obj[]> {

      let params

      if (!obj.toString()) {
        params = new URLSearchParams({q: `'root' in parents and trashed = false`})
      } else {
        params = new URLSearchParams({q: `'${obj.toString()}' in parents and trashed = false`})
      }
      
      const res = await client.fetch('https://www.googleapis.com/drive/v3/files?' + params, {
        headers: {
          Accept: 'application/json'
        }
      })
      
      return res.body.files?.map((file: GoogleDriveFile) => {
        return {
          id: file.id,
          type: file.mimeType === 'application/vnd.google-apps.folder' ? 'container' : 'object',
          name: file.name,
          location: '/' + file.name,
          contentUrl: file.id
        }
      }) || []
    },
    async createContainer(name, parents): Promise<void> {
      const fileMetadata = {
        name: name,
        mimeType: 'application/vnd.google-apps.folder',
        parents: parents || ["root"]
      };

      await client.fetch('https://www.googleapis.com/drive/v3/files', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fileMetadata)
      })
    },
    async destroyContainer(path): Promise<void> {
      await this.destroy(path)
    },
    async getMetadata(path): Promise<Obj> {
      // const [bucket, bucketPath] = path.extractRoot()
      // const metadata = await repository.getMetadata(bucket, bucketPath)
      // return {
      //   size: metadata.size,
      //   etag: metadata.etag,
      //   lastModified: metadata.lastModified,
      // }
      return await {
        contentUrl: '',
        type: 'object',
        data: {
          size: 0,
          etag: '',
          lastModified: new Date()
        }
      }
    },
  }

  return connection
}

export const newConnection = async (
  id: string,
  userId: string
): Promise<FileSystemAPI> => {
  return await createConnection(id, userId)
}
