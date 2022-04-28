// import { newConnection as newLocalStorageConnection } from './localStorage/localStorage.service'
import { newConnection as newS3Connection } from './S3/s3.ts'
import { newConnection as newGoogleDriveConnection } from './GoogleDrive/googledrive.ts'
// import { newConnection as newMysqlConnection } from './SQL/mysql'
import redis from '../redis.ts'
import { Provider } from '../provider.ts'

export const findConnection = async (provider: Provider, userId: string) => {
  switch (provider.type) {
    case 'GoogleDrive':
      return newGoogleDriveConnection('', userId)
      
    default:
    case 'S3':
      const providerId = userId + '_' + provider.name + '_' + provider.type
      const providerConnectionInfoRes = await redis.get(providerId)
      const providerConnectionInfo = JSON.parse(providerConnectionInfoRes as string)
      return newS3Connection(providerConnectionInfo?.data, userId)
    // case 'MySQL':
    //   return newMysqlConnection('', userId)

      // return newLocalStorageConnection('', userId)
  }
}

export const addConnection = async (userId: string, name: string, type: string, data: any) => {
  const connectionName = userId + '_' + name + '_' + type
  const existingEntry = await redis.get(connectionName)

  if (!!existingEntry) {
    return new Response('A service with the name name already exists', { status: 400 })
  }

  redis.set(connectionName, JSON.stringify({
    name,
    data
  }))

  return new Response('New service saved', { status: 201 })

}

export const getConnections = async (userId: string) => {
  const keys = await redis.sendCommand('KEYS','*')
  const values: string[] = keys.value() as string[]
  const connections = values.filter((x: string) => x.startsWith(userId)).map((x: string) => {
    const start = x.indexOf('_') + 1
    const end = x.lastIndexOf('_')
    return {
      id: x.substring(start, end),
      type: x.substring(end+1)
    }
  })

  return new Response(JSON.stringify(connections), { status: 200 })
}