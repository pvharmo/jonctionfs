import fileSystemAPI from './api/filesystem/api.ts'

interface Interfaces {
  filesystem: any
}

const requestInterfaces: Interfaces = {
  filesystem : fileSystemAPI
}

export const actionHandler = async (req: Request) => {
  const requestApi: string = req.headers.get('api') as string
  const requestAction: string = req.headers.get('action') as string
  const requestSource: string = req.headers.get('data-source') as string
  const user: string = req.headers.get('authenticated-user') as string
  const providerId: string = req.headers.get('provider-id') as string
  const providerType: string = req.headers.get('provider-type') as string
  
  const body = req.body ? await req.json() : {}
  
  try {
    const response = await requestInterfaces[requestApi as keyof Interfaces].api(user, body, {name: providerId, type: providerType}, requestAction)
    const responseBody = response.body ? JSON.stringify(response.body) : ""
    return new Response(responseBody, { 
      status: response.status,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:8080"
      }
    })
  } catch (e) {
    console.error(e)
    return new Response(e, { status: 500 });
  }
}