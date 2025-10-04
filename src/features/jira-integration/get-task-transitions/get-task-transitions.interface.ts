export interface TransitionResponse {
  id: string;
  name: string;
  fromStatusId: string;
  fromStatusName: string;
  toStatusId: string;
  toStatusName: string;
  isAvailable: boolean;
}
