export interface OauthTokens {
  access_token: string
  refresh_token: string
  expiry_date: string
  token_type: string
}

export class OauthClient
{
  access_token: string
  refresh_token: string
  expiry_date: string
  token_type: string

  constructor(tokens: OauthTokens) {
    this.access_token = tokens.access_token
    this.refresh_token = tokens.refresh_token
    this.expiry_date = tokens.expiry_date
    this.token_type = tokens.token_type
  }

  async fetch(url: string, init: RequestInit | undefined = {}) {
    if (!init.headers) {
      init.headers = {
        Accept: 'application/json',
        Authorization: "Bearer " + this.access_token
      }
    } else {
      init.headers = {
        ...init.headers,
        Accept: 'application/json',
        Authorization: "Bearer " + this.access_token
      }
    }
    
    let res = await fetch(url, init)
    const body = await res.json().catch(() => null)

    return {
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      body
    }
  }
}