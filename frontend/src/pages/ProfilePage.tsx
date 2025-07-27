import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import type { User as UserType } from "../types";
import { toast } from "react-hot-toast";
import ProfileHeader from "../components/Profile/ProfileHeader";
import AboutSection from "../components/Profile/AboutSection";
import ExperienceSection from "../components/Profile/ExperienceSection";
import EducationSection from "../components/Profile/EducationSection";
import SkillsSection from "../components/Profile/SkillsSection";

const ProfilePage = () => {
  const { username } = useParams();
  const queryClient = useQueryClient();

  const { data: authUser, isLoading } = useQuery<UserType>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
  });

  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: async () => {
      const response = await axiosInstance.get(`/users/${username}`);
      return response.data;
    },
  });

  const { mutate: updateProfile } = useMutation({
    mutationFn: async (updatedData: Partial<UserType>) => {
      const response = await axiosInstance.put("/users/profile", updatedData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  if (isLoading || isUserProfileLoading) return null;

  const isOwnProfile = authUser?.username === userProfile.username;
  const userData = isOwnProfile ? authUser : userProfile;

  const handleSave = (updatedData: Partial<UserType>) => {
    updateProfile(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <ProfileHeader
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <AboutSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <ExperienceSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <EducationSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
      <SkillsSection
        userData={userData}
        isOwnProfile={isOwnProfile}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProfilePage;
