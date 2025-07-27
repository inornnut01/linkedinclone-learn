import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import type { User as UserType } from "../../types/index";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { UserPlus, UserCheck, X, Clock, Camera, MapPin } from "lucide-react";
import type { AxiosError } from "axios";

const ProfileHeader = ({
  userData,
  onSave,
  isOwnProfile,
}: {
  userData: UserType;
  onSave: (data: Partial<UserType>) => void;
  isOwnProfile: boolean;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<UserType>>({});
  const queryClient = useQueryClient();

  const { data: authUser } = useQuery<UserType>({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data;
    },
  });

  const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery(
    {
      queryKey: ["connectionStatus", userData._id],
      queryFn: async () => {
        const response = await axiosInstance.get(
          `/connections/status/${userData._id}`
        );
        return response.data;
      },
      enabled: !isOwnProfile,
    }
  );

  const isConnected = userData.connections.some(
    (connection) => connection === authUser?._id
  );

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.post(
        `/connections/request/${userId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Connection request sent");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "An error occurred");
    },
  });

  const { mutate: acceptConnectionRequest } = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await axiosInstance.put(
        `/connections/accept/${requestId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Connection request accepted");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "An error occurred");
    },
  });

  const { mutate: rejectConnectionRequest } = useMutation({
    mutationFn: async (requestId: string) => {
      const response = await axiosInstance.put(
        `/connections/reject/${requestId}`
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Connection request rejected");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "An error occurred");
    },
  });

  const { mutate: removeConnection } = useMutation({
    mutationFn: async (userId: string) => {
      const response = await axiosInstance.delete(`/connections/${userId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Connection removed");
      refetchConnectionStatus();
      queryClient.invalidateQueries({ queryKey: ["connectionRequests"] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      toast.error(error.response?.data?.error || "An error occurred");
    },
  });

  const getConnectionStatus = useMemo(() => {
    if (isConnected) return "connected";
    if (!isConnected) return "not_connected";
    return connectionStatus?.status;
  }, [isConnected, connectionStatus]);

  const renderConnectionButton = () => {
    const baseClass =
      "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center";
    switch (getConnectionStatus) {
      case "connected":
        return (
          <div className="flex gap-2 justify-center">
            <div className={`${baseClass} bg-green-500 hover:bg-green-600`}>
              <UserCheck size={20} className="mr-2" />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm`}
              onClick={() => removeConnection(userData._id)}
            >
              <X size={20} className="mr-2" />
              Remove Connection
            </button>
          </div>
        );

      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className="mr-2" />
            Pending
          </button>
        );

      case "received":
        return (
          <div className="flex gap-2 justify-center">
            <button
              onClick={() =>
                acceptConnectionRequest(connectionStatus.data.requestId)
              }
              className={`${baseClass} bg-green-500 hover:bg-green-600`}
            >
              Accept
            </button>
            <button
              onClick={() =>
                rejectConnectionRequest(connectionStatus.data.requestId)
              }
              className={`${baseClass} bg-red-500 hover:bg-red-600`}
            >
              Reject
            </button>
          </div>
        );
      default:
        return (
          <button
            onClick={() => sendConnectionRequest(userData._id)}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"
          >
            <UserPlus size={20} className="mr-2" />
            Connect
          </button>
        );
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedData((prev) => ({ ...prev, [e.target.name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(editedData);
    setIsEditing(false);
  };

  return (
    <div className="bg-white shadow rounded-lg mb-6">
      <div
        className="relative h-48 rounded-t-lg bg-cover bg-center"
        style={{
          backgroundImage: `url('${
            editedData.bannerImg || userData.bannerImg || "/banner.png"
          }')`,
        }}
      >
        {isEditing && (
          <label className="absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer hover:scale-110 transition-transform duration-200">
            <Camera size={20} />
            <input
              type="file"
              className="hidden"
              name="bannerImg"
              onChange={handleImageChange}
              accept="image/*"
            />
          </label>
        )}
      </div>
      <div className="p-4">
        <div className="relative -mt-20 mb-4">
          <img
            className="w-32 h-32 rounded-full mx-auto object-cover"
            src={
              editedData.profilePicture ||
              userData.profilePicture ||
              "/avatar.png"
            }
            alt={userData.name}
          />

          {isEditing && (
            <label className="absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer hover:scale-110 transition-transform duration-200">
              <Camera size={20} />
              <input
                type="file"
                className="hidden"
                name="profilePicture"
                onChange={handleImageChange}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <div className="text-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={editedData.name ?? userData.name}
              onChange={(e) =>
                setEditedData({ ...editedData, name: e.target.value })
              }
              className="text-2xl font-bold mb-2 text-center w-full bg-gray-100 p-2 rounded-lg"
            />
          ) : (
            <h1 className="text-2xl font-bold mb-2">{userData.name}</h1>
          )}

          {isEditing ? (
            <input
              type="text"
              value={editedData.headline ?? userData.headline}
              onChange={(e) =>
                setEditedData({ ...editedData, headline: e.target.value })
              }
              className="text-gray-600 text-center w-full bg-gray-100 p-2 rounded-lg"
            />
          ) : (
            <p className="text-gray-600">{userData.headline}</p>
          )}

          <div className="flex justify-center items-center mt-2  p-2 rounded-lg">
            <MapPin size={16} className="text-gray-500 mr-1" />
            {isEditing ? (
              <input
                type="text"
                value={editedData.location ?? userData.location}
                onChange={(e) =>
                  setEditedData({ ...editedData, location: e.target.value })
                }
                className="text-gray-600 text-center bg-gray-100"
              />
            ) : (
              <span className="text-gray-600">{userData.location}</span>
            )}
          </div>
        </div>

        {isOwnProfile ? (
          isEditing ? (
            <div className="flex gap-2 justify-center items-center">
              <button
                className="btn w-1/2 btn-primary text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300"
                onClick={handleSave}
              >
                Save Profile
              </button>
              <button
                className="btn btn-outline w-1/2 text-black py-2 px-4 rounded-full hover:bg-gray-200
							 transition duration-300"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-primary w-full text-white py-2 px-4 rounded-full hover:bg-primary-dark
							 transition duration-300 "
            >
              Edit Profile
            </button>
          )
        ) : (
          <div className="flex justify-center">{renderConnectionButton()}</div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
