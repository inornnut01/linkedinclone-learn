import { useState } from "react";
import type { User as UserType } from "../../types/index";

const AboutSection = ({
  userData,
  isOwnProfile,
  onSave,
}: {
  userData: UserType;
  isOwnProfile: boolean;
  onSave: (data: Partial<UserType>) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData.about || "");

  const handleSave = () => {
    setIsEditing(false);
    onSave({ about });
  };

  const handleCancel = () => {
    setIsEditing(false);
    setAbout(userData.about || "");
  };

  // Update local state when userData changes
  if (!isEditing && about !== userData.about) {
    setAbout(userData.about || "");
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">About</h2>
      {isOwnProfile && (
        <>
          {isEditing ? (
            <div>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
              />
              <div className="flex gap-2 justify-start items-center">
                <button
                  onClick={handleSave}
                  className="btn mt-2 btn-primary  text-white py-2 px-4 rounded hover:bg-primary-dark 
								transition duration-300"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="btn btn-outline mt-2 text-black py-2 px-4 rounded hover:bg-gray-200
							 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p>{userData.about}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-outline mt-2 text-primary hover:text-primary-dark transition duration-300"
              >
                Edit
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AboutSection;
