import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../ui/Input";
import Button from "../ui/Button";

const JobForm = ({ defaultValues, onSubmit, isSubmitting, submitLabel = "Post Job" }) => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultValues || {
      title: "",
      company: "",
      location: "",
      salary: "",
      description: "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Job Title"
          placeholder="e.g. Senior Frontend Engineer"
          error={errors.title?.message}
          {...register("title", { required: "Job title is required" })}
        />
        <Input
          label="Company"
          placeholder="e.g. HireNest"
          error={errors.company?.message}
          {...register("company", { required: "Company is required" })}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Location"
          placeholder="e.g. Remote, Kathmandu"
          error={errors.location?.message}
          {...register("location", { required: "Location is required" })}
        />
        <Input
          label="Salary (in month)"
          type="number"
          placeholder="e.g. 85000"
          error={errors.salary?.message}
          {...register("salary", {
            required: "Salary is required",
            min: { value: 0, message: "Salary must be a positive number" },
          })}
        />
      </div>

      <Input
        label="Description"
        textarea
        rows={6}
        placeholder="Describe responsibilities, requirements, and benefits…"
        error={errors.description?.message}
        {...register("description", {
          required: "Description is required",
          minLength: { value: 30, message: "Description should be at least 30 characters" },
        })}
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default JobForm;
