interface Config {
  endPoint: string
  port: number
  useSSL: boolean
  accessKey: string
  secretKey: string
}

export class Client {
  #accessKey: string
  #secretKey: string
  #endPoint: string

  constructor(config: Config) {
      this.#accessKey = config.accessKey
      this.#secretKey = config.secretKey
      this.#endPoint = config.endPoint
  }

  async presignedGetObject(bucket: string, path: string): Promise<string> {
    const res = await fetch("http://localhost:8000/presignedGetObject", {
      method: "POST",
      headers: {
        endPoint: this.#endPoint,
        port: "9000",
        useSSL: String(false),
        accessKey: this.#accessKey,
        secretKey: this.#secretKey,
        bucket,
        path,
      }
    })
    if (res.status == 500) {
      throw 'received 500 on presignedGetObject'
    }
    return await res.json()
  }

  async removeObject(bucket: string, path: string): Promise<void> {
    const res = await fetch("http://localhost:8000/removeObject", {
      method: "POST",
      headers: {
        endPoint: this.#endPoint,
        port: "9000",
        useSSL: String(false),
        accessKey: this.#accessKey,
        secretKey: this.#secretKey,
        bucket,
        path,
      }
    })
    if (res.status == 500) {
      throw 'received 500 on removeObject'
    }
  }

  async presignedPutObject(bucket: string, path: string, expiry: number): Promise<string> {
    const res = await fetch("http://localhost:8000/presignedPutObject", {
      method: "POST",
      headers: {
        endPoint: this.#endPoint,
        port: "9000",
        useSSL: String(false),
        accessKey: this.#accessKey,
        secretKey: this.#secretKey,
        expiry: expiry.toString(),
        bucket,
        path,
      }
    })
    
    if (res.status == 500) {
      throw 'received 500 on presignedPutObject'
    }
        
    return await res.json()
  }

  async putObject(bucket: string, path: string, object: any): Promise<void> {
    const res = await fetch("http://localhost:8000/putObject", {
      method: "POST",
      headers: {
        endPoint: this.#endPoint,
        port: "9000",
        useSSL: String(false),
        accessKey: this.#accessKey,
        secretKey: this.#secretKey,
        bucket,
        prefix: path,
      },
      body: object
    })
    if (res.status == 500) {
      throw 'received 500 on putObject'
    }
  }

  async listObjectsV2(bucket: string, path: string, recursive = false): Promise<any> {
    const res = await fetch("http://localhost:8000/listObjectsV2", {
      headers: {
        endPoint: this.#endPoint,
        port: "9000",
        useSSL: String(false),
        accessKey: this.#accessKey,
        secretKey: this.#secretKey,
        bucket,
        prefix: path,
        recursive: String(recursive)
      }
    })
    if (res.status == 500) {
      throw 'received 500 on listObjectsV2'
    }
    return await res.json()
  }

  async listBuckets(): Promise<any> {
    const res = await fetch("http://localhost:8000/listBuckets", {
      headers: {
        endPoint: this.#endPoint,
        port: "9000",
        useSSL: String(false),
        accessKey: this.#accessKey,
        secretKey: this.#secretKey,
      }
    })

    if (res.status == 500) {
      throw 'received 500 on listBuckets'
    }
    return await res.json()
  }

  async removeObjects(bucket: string, path: string[]): Promise<void> {
    const res = await fetch("http://localhost:8000/removeObjects", {
      method: "POST",
      headers: {
        endPoint: this.#endPoint,
        port: "9000",
        useSSL: String(false),
        accessKey: this.#accessKey,
        secretKey: this.#secretKey,
        bucket,
        path: path.toString(),
      }
    })
    if (res.status == 500) {
      throw 'received 500 on removeObject'
    }
  }

  async statObject(bucket: string, path: string): Promise<any> {
    // this.#client.statObject(bucket, path)
  }

  async copyObject(bucket: string, newPath: string, oldPath: string): Promise<void> {
    const res = await fetch("http://localhost:8000/copyObject", {
      method: "POST",
      headers: {
        endPoint: this.#endPoint,
        port: "9000",
        useSSL: String(false),
        accessKey: this.#accessKey,
        secretKey: this.#secretKey,
        bucket,
        "new-path": newPath,
        "old-path": oldPath,
      }
    })
    if (res.status == 500) {
      throw 'received 500 on copyObject'
    }
  }
}