import { findConnection as findConnectionInject } from '../../connections/connections.ts'

import { FileSystemAction } from './api.d.ts'
import { getFile, uploadFile, saveFile, destroyFile, getMetadataFile, moveFile, rename } from './controllers/file.ts'
import { getFolder, createFolder, destroyFolder, moveFolder } from './controllers/folder.ts'
import { Provider } from '../../provider.ts'

export const actions = {
  getFile,
  uploadFile,
  saveFile,
  destroyFile,
  getMetadataFile,
  moveFile,
  getFolder,
  createFolder,
  destroyFolder,
  moveFolder,
  rename
}

export default {
  api: async (userId: string, body: any, provider: Provider, action: string, findConnection = findConnectionInject) => {
    const connection = await findConnection(provider, userId)
    
    return await actions[action as keyof FileSystemAction](connection, body)
  }
}
