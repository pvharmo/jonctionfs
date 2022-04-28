export interface Obj {
  contentUrl: string
  parents?: string[]
  type?: string
  name?: string
  id?: string
  properties?: any
  data?: any
}

export class ObjectId {
  #id
  constructor(id: string) {
    this.#id = id
  }

  toString() {
    return this.#id
  }
}

export interface PresignedUrl {
  contentUrl: string
  method: string
}