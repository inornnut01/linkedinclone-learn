import { useState } from "react";
import type { User as UserType } from "../../types/index";
import { Briefcase, X } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

const ExperienceSection = ({
  userData,
  isOwnProfile,
  onSave,
}: {
  userData: UserType;
  isOwnProfile: boolean;
  onSave: (data: Partial<UserType>) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(userData.experiences || []);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });

  const handleAddExperience = () => {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.startDate
    ) {
      setExperiences([...experiences, newExperience]);
      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
    }
  };

  const handleDeleteExperience = (id: string) => {
    setExperiences(experiences.filter((exp) => exp._id !== id));
  };

  const handleSave = () => {
    onSave({ experiences: experiences });
    setIsEditing(false);
  };

  const handleCurrentlyWorkingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewExperience({
      ...newExperience,
      currentlyWorking: e.target.checked,
      endDate: e.target.checked ? "" : newExperience.endDate,
    });
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Experience</h2>
      {experiences.map((exp, index) => (
        <div
          key={exp._id || `temp-${index}`}
          className="mb-4 flex justify-between items-start"
        >
          <div className="flex items-start">
            <Briefcase size={20} className="mr-2 mt-1" />
            <div>
              <h3 className="font-semibold">{exp.title}</h3>
              <p className="text-gray-600">{exp.company}</p>
              <p className="text-gray-500 text-sm">
                {formatDate(exp.startDate)} -{" "}
                {exp.endDate ? formatDate(exp.endDate) : "Present"}
              </p>
              <p className="text-gray-700">{exp.description}</p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteExperience(exp._id || "")}
              className="text-red-500 btn"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Title"
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience({ ...newExperience, title: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="text"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <input
            type="date"
            placeholder="Start Date"
            value={newExperience.startDate}
            onChange={(e) =>
              setNewExperience({ ...newExperience, startDate: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={newExperience.currentlyWorking}
              onChange={handleCurrentlyWorkingChange}
              className="mr-2"
            />
            <label htmlFor="currentlyWorking">I currently work here</label>
          </div>
          {!newExperience.currentlyWorking && (
            <input
              type="date"
              placeholder="End Date"
              value={newExperience.endDate}
              onChange={(e) =>
                setNewExperience({ ...newExperience, endDate: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
          )}
          <textarea
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleAddExperience}
            className="btn btn-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
          >
            Add Experience
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <div className="flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="mt-4 btn btn-primary text-white py-2 px-4 rounded hover:bg-primary-dark transition duration-300"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="btn btn-outline mt-4 text-black py-2 px-4 rounded hover:bg-gray-200
							 transition duration-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-outline mt-4 text-primary hover:text-primary-dark transition duration-300"
            >
              Edit Experiences
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ExperienceSection;
