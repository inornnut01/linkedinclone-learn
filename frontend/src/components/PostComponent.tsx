import type { Post, Comment, User } from "../types/index";
import { Link, useParams } from "react-router-dom";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";
import {
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import PostAction from "./PostAction";
import type { AxiosError } from "axios";

const PostComponent = ({ post }: { post: Post }) => {
  const { postId } = useParams();

  const { data: authUser } = useQuery<User>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
  });
  const [showComments, setShowComments] = useState<boolean>(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const isOwner = authUser?._id === post.author._id;
  const isLiked = post.likes.includes(authUser?._id || "");

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.delete(`/posts/delete/${post._id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "Failed to delete post");
    },
  });

  const { mutate: createCommend, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment: string) => {
      const response = await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "Failed to add comment");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(`/posts/${post._id}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleDeletePost = () => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    deletePost();
  };

  const handleLikePost: () => void = async () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newComment.trim()) {
      createCommend(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser?._id || "",
            name: authUser?.name || "",
            profilePicture: authUser?.profilePicture || "",
          },
          createAt: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="bg-secondary rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post.author.profilePicture || "avatar.png"}
                alt={post.author.name}
                className="size-10 rounded-full mr-3"
              />
            </Link>

            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold">{post.author.name}</h3>
              </Link>
              <p className="text-xs text-info">{post.author.headline}</p>
              <p className="text-xs text-info">
                {formatDistanceToNow(new Date(post.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleDeletePost}
              className="text-red-500 hover:text-red-700"
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
        <p className="mb-4">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post content"
            className="rounded-lg w-full mb-4"
          />
        )}

        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500  fill-blue-300" : ""}
              />
            }
            text={`Like (${post.likes.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction
            icon={<Share2 size={18} />}
            text="Share"
            onClick={() => null}
          />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-base-100 p-2 rounded flex items-start"
              >
                <img
                  src={comment.user?.profilePicture || "/avatar.png"}
                  alt={comment.user?.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">
                      {comment.user?.name}
                    </span>
                    <span className="text-xs text-info">
                      {formatDistanceToNow(new Date(comment.createAt || ""))}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default PostComponent;
