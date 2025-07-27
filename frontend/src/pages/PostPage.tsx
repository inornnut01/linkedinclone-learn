import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import type { User as UserType } from "../types/index";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import Post from "../components/PostComponent";

const PostPage = () => {
  const { postId } = useParams();
  const { data: authUser } = useQuery<UserType>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
  });
  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await axiosInstance.get(`/posts/${postId}`);
      return response.data;
    },
  });

  if (isLoading) return <div>Loading post...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={authUser as UserType} />
      </div>

      <div className="col-span-1 lg:col-span-3">
        <Post post={post} />
      </div>
    </div>
  );
};

export default PostPage;
