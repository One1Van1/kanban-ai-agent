export interface AttachFileResponse {
  id: string;
  filename: string;
  size: number;
  mimeType: string;
  created: string;
  author: {
    accountId: string;
    displayName: string;
  };
}
