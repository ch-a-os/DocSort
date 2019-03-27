export interface ITagSelectItemStateChange {
  tagId: string;
  state: "selected" | "available";
}

export interface ITag {
  _id?: string;
  name: string;
  style: {
      colorBackground?: string;
      colorForeground?: string;
      logo?: string;
  };
}

export interface IDecodedJwt {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

export interface IUploadFile {
  file: File;
  document: IDocument;
}

export interface IDocument {
  _id?: string;
  index?: number;
  number?: {
    primary?: number;
    secondary?: number;
  };
  title?: string;
  note?: string;
  fileExtension?: string;
  user_R?: string;
  tags_R?: Array<string>;
  mimeType?: string;
  textRecognition?: {
      enabled?: boolean;
      finished?: boolean;
      content?: string;
  };
  createdAt?: Date;
  updatedAt?: Date;
}