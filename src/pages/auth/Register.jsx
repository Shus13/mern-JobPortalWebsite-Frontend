import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useState } from "react";
import Container from "../../components/common/Container";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const ROLES = [
  {
    value: "JobSeeker",
    title: "Job Seeker",
    description: "Browse roles and apply",
  },
  {
    value: "JobProvider",
    title: "Employer",
    description: "Post jobs and hire",
  },
];

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState("JobSeeker");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: { role: "JobSeeker" } });

  const password = watch("password");

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await registerUser(values);
      toast.success("Account created! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleSelect = (value) => {
    setSelectedRole(value);
    setValue("role", value);
  };

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Create your account</h1>
        <p className="mt-1.5 text-sm text-ink-500">Join Hirely as a job seeker or employer.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink-800">I am a</label>
            <input type="hidden" {...register("role")} />
            <div className="grid grid-cols-2 gap-3">
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r.value}
                  onClick={() => handleRoleSelect(r.value)}
                  className={`focus-ring rounded-xl border p-3.5 text-left transition-colors ${
                    selectedRole === r.value
                      ? "border-brand-400 bg-brand-50"
                      : "border-ink-200 hover:border-ink-300"
                  }`}
                >
                  <p
                    className={`text-sm font-semibold ${
                      selectedRole === r.value ? "text-brand-700" : "text-ink-800"
                    }`}
                  >
                    {r.title}
                  </p>
                  <p className="mt-0.5 text-xs text-ink-500">{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          <Input
            label="Full Name"
            placeholder="Balchhi Dhurbe"
            error={errors.name?.message}
            {...register("name", { required: "Full name is required" })}
          />
          <Input
            label="Email"
            type="email"
            placeholder="balchi@example.com"
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
            })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: { value: 6, message: "Password must be at least 6 characters" },
            })}
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match",
            })}
          />

          <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
            Create account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </p>
      </Card>
    </Container>
  );
};

export default Register;
