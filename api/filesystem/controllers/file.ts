import { FileSystemAPI } from '../api.d.ts'
import { ObjectId } from '../../../interfaces.ts'


export const getFile = async (connection: FileSystemAPI, body: any) => {
  const objectId = new ObjectId(body.objectId)

  try {
    const obj = await connection.get(objectId)
    return {
      status : 200,
      body: {
        contentUrl: obj.contentUrl
      }
    }
  } catch (e) {
    console.error(e)
    return {
      status : 500
    }
  }
}

export const uploadFile = async (connection: FileSystemAPI, body: any) => {
  const name = body.name
  const parents = body.parents.map((x: string) => new ObjectId(x))

  try {
    const obj = await connection.upload(name, parents)
    return {
      status: 201,
      body: {
        contentUrl: obj.contentUrl
      }
    }
  } catch (e) {
    console.error(e)
    return {
      status : 500
    }
  }
}

export const saveFile = async (connection: FileSystemAPI, body: any) => {
  const name = body.name
  const parents = body.parents.map((x: string) => new ObjectId(x))

  try {
    const obj = await connection.upload(name, parents)
    return {
      status: 200,
      body: {
        contentUrl: obj.contentUrl
      }
    }
  } catch (e) {
    console.error(e)
    return {
      status: 500
    }
  }
}

export const destroyFile = async (connection: FileSystemAPI, body: any) => {
  const objectId = new ObjectId(body.objectId)

  try {
    await connection.destroy(objectId)
    return {
      status: 200
    }
  } catch (e) {
    console.error(e)
    return {
      status: 500
    }
  }
}

export const getMetadataFile = async (connection: FileSystemAPI, body: any) => {
  const objectId = new ObjectId(body.objectId)

  try {
    const obj = await connection.getMetadata(objectId)
    return {
      status: 200,
      body: {
        obj
      }
    }
  } catch (e) {
    console.error(e)
    return {
      status: 500
    }
  }
}

export const moveFile = async (connection: FileSystemAPI, body: any) => {
  const oldParentId = new ObjectId(body.oldParentId)
  const newParentId = new ObjectId(body.newParentId)
  const objectId = new ObjectId(body.objectId)

  try {
    await connection.move(oldParentId, newParentId, objectId)
    return {
      status: 200
    }
  } catch (e) {
    console.error(e)
    return {
      status: 500
    }
  }
}

export const rename = async (connection: FileSystemAPI, body: any) => {
  const objectId = new ObjectId(body.objectId)
  const newName = body.newName

  try {
    await connection.rename(objectId, newName)
    return {
      status: 200
    }
  } catch (e) {
    console.error(e)
    return {
      status: 500
    }
  }
}
