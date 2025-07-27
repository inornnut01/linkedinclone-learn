export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  profilePicture: string;
  bannerImg: string;
  headline: string;
  location: string;
  about: string;
  skills: string[];
  experiences: Experience[];
  education: Education[];
  connections: string[];
}

export interface Experience {
  _id?: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  currentlyWorking: boolean;
}

export interface Education {
  _id?: string;
  school: string;
  fieldOfStudy: string;
  startYear: string;
  endYear: string;
}

export interface Post {
  _id: string;
  author: User;
  content: string;
  image: string;
  likes: string[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  content: string;
  createAt: Date;
  user: User;
}

export interface Notification {
  _id: string;
  recipient: User;
  type: string;
  relatedUser: User;
  relatedPost: Post;
  read: boolean;
  createdAt: Date;
}

export interface ConnectionRequest {
  _id: string;
  sender: User;
  recipient: User;
  status: string;
}
