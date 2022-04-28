export enum ProvidersTypes {
  GoogleDrive = "GoogleDrive",
  S3 = "S3",
  SQL = "SQL"
}

export interface Provider {
  name: string
  type: ProvidersTypes
}