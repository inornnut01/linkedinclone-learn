import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios.ts";
import toast from "react-hot-toast";
import { LetterText, Loader, Lock, Mail, User } from "lucide-react";
import type { AxiosError } from "axios";

type SignUpData = {
  name: string;
  username: string;
  email: string;
  password: string;
};
const SignUpForm = () => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const queryClient = useQueryClient();

  const { mutate: signUpMutation, isPending } = useMutation({
    mutationFn: async (data: SignUpData) => {
      const response = await axiosInstance.post("/auth/signup", data);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Account created successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "Something went wrong");
    },
  });

  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    signUpMutation({ name, username, email, password });
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-4">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-5">
          <LetterText size={20} />
        </span>
        <input
          type="text"
          placeholder="Full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full pl-10"
          required
        />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-5">
          <User size={20} />
        </span>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="input input-bordered w-full pl-10"
          required
        />
      </div>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-5">
          <Mail size={20} />
        </span>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered w-full pl-10"
          required
        />
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-5">
          <Lock size={20} />
        </span>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input input-bordered w-full pl-10"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary w-full text-white"
      >
        {isPending ? (
          <Loader className="size-5 animate-spin" />
        ) : (
          "Agree & Join"
        )}
      </button>
    </form>
  );
};

export default SignUpForm;
