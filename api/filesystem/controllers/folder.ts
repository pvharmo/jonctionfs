import { FileSystemAPI, Child } from '../api.d.ts'
import { ObjectId } from '../../../interfaces.ts'

export const getFolder = async (connection: FileSystemAPI, body: any) => {
  const objectId = new ObjectId(body.objectId)

  try {
    const object = await connection.getContainerContent(objectId)
    const responseBody: Child[] = object.map((x) => {
      return {
        id: x.id,
        name: x.name || '',
        type: x.type || '',
        contentUrl: x.contentUrl,
        lastModified: ''
      }
    })
    return { status: 200, body: responseBody }
  } catch (e) {
    console.error(e)
    return { status: 500 }
  }
}

export const createFolder = async (connection: FileSystemAPI, body: any) => {
  const name = body.name
  const parents = body.parents.map((x: string) => new ObjectId(x))

  try {
    await connection.createContainer(name, parents)
    return { status: 201 }
  } catch (e) {
    console.error(e)
    return { status: 500 }
  }
}

export const destroyFolder = async (connection: FileSystemAPI, body: any) => {
  const objectId = new ObjectId(body.objectId)

  try {
    await connection.destroyContainer(objectId)
    return { status: 200 }
  } catch (e) {
    console.error(e)
    return { status: 500 }
  }
}

export const moveFolder = async (connection: FileSystemAPI, body: any) => {
  const oldParentId = new ObjectId(body.oldParentId)
  const newParentId = new ObjectId(body.newParentId)
  const objectId = new ObjectId(body.objectId)

  try {
    await connection.move(oldParentId, newParentId, objectId)
    return { status: 200 }
  } catch (e) {
    console.error(e)
    return { status: 500 }
  }
}
