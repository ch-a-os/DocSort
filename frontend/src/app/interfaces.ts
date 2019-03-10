export interface ITag {
  id?: number;
  name: string;
  logo: string;
  colorBackground: string;
  colorForeground: string;
}

export interface IDecodedJwt {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

export interface IUploadFile {
  singleDocument: File;
  title: string;
  note: string;
  tags: Array<any>;
}

export interface IDocument {
  uid: number;
  primaryNumber: number;
  secondaryNumber?: number;
  fileExtension: string;
  title?: string;
  note?: string;
  user?: any;
  tags?: Array<any>;
  mimeType?: string;
  ocrEnabled?: boolean;
  ocrFinished?: boolean;
  ocrText?: string;
  createdAt: Date;
  updatedAt: Date;
}