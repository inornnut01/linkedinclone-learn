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
  title: string;
  company: string;
  startDate: Date;
  endDate: Date;
  description: string;
}

export interface Education {
  school: string;
  fieldOfStudy: string;
  startYear: number;
  endYear: number;
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
  createdAt: Date;
  user: User;
}

export interface notification {
  _id: string;
  recipient: User;
  type: string;
  relatedUser: User;
  relatedPost: Post;
  read: boolean;
}

export interface connectionRequest {
  _id: string;
  sender: User;
  recipient: User;
  status: string;
}
