import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import AvatarUploader from "../../components/profile/AvatarUploader";
import { useAuth } from "../../hooks/useAuth";
import { uploadProfilePhoto, updateProfile, fileUrl } from "../../services/userApi";

const AdminProfile = () => {
  const { user, updateUser } = useAuth();
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isSavingDetails, setIsSavingDetails] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: { name: user?.name, email: user?.email } });

  const handlePhotoUpload = async (file) => {
    setIsUploadingPhoto(true);
    try {
      const data = await uploadProfilePhoto(file);
      updateUser({ profilePhoto: data.profilePhoto });
      toast.success("Profile photo updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not upload photo");
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleEditClick = () => {
    reset({ name: user?.name, email: user?.email });
    setIsEditingDetails(true);
  };

  const handleSaveDetails = async (values) => {
    setIsSavingDetails(true);
    try {
      const data = await updateProfile(values);
      updateUser(data.user);
      toast.success("Profile updated");
      setIsEditingDetails(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update profile");
    } finally {
      setIsSavingDetails(false);
    }
  };

  return (
    <div>
      <PageTitle title="My Profile" subtitle="Manage your admin account photo and details." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h3 className="mb-5 font-display text-base font-semibold text-ink-900">Profile photo</h3>
          <AvatarUploader
            currentPhotoUrl={fileUrl(user?.profilePhoto)}
            userName={user?.name}
            onUpload={handlePhotoUpload}
            isUploading={isUploadingPhoto}
          />
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-base font-semibold text-ink-900">Account details</h3>
            {!isEditingDetails && (
              <button
                onClick={handleEditClick}
                className="focus-ring text-xs font-semibold text-brand-600 hover:text-brand-700"
              >
                Edit
              </button>
            )}
          </div>

          {!isEditingDetails ? (
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink-500">Name</dt>
                <dd className="font-medium text-ink-800">{user?.name}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Email</dt>
                <dd className="font-medium text-ink-800">{user?.email}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink-500">Role</dt>
                <dd className="font-medium capitalize text-ink-800">{user?.role}</dd>
              </div>
            </dl>
          ) : (
            <form onSubmit={handleSubmit(handleSaveDetails)} className="space-y-4">
              <Input
                label="Name"
                error={errors.name?.message}
                {...register("name", { required: "Name is required" })}
              />
              <Input
                label="Email"
                type="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
                })}
              />
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsEditingDetails(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" isLoading={isSavingDetails}>
                  Save
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminProfile;
