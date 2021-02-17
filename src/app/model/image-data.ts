export interface ImageData {
  id: number;
  location: string;
  title: string;
  description: string;
  imageUrl: string;
  thumbnailUrl: string;
  imageFileName: string;
  telescope: string;
  camera: string;
  mount: string;
  exposureTimes: string;
  date: Date;
  listOfDates: string;
  filters: string;
  userProfileId: number;
  object: string;
  userProfileNickname: string;
}
