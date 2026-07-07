import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { resetPassword } from "../../services/authApi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const password = watch("password");

  const onSubmit = async ({ password }) => {
    try {
      await resetPassword(token, password);
      setIsDone(true);
      toast.success("Password reset successfully. Please log in.");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err?.response?.data?.message || "This reset link is invalid or has expired");
    }
  };

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Reset your password</h1>
        <p className="mt-1.5 text-sm text-ink-500">Choose a new password for your account.</p>

        {isDone ? (
          <div className="mt-8 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700">
            Your password has been reset. Redirecting you to login…
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Input
              label="New password"
              type="password"
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Password must be at least 6 characters" },
              })}
            />
            <Input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
            />
            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              Reset password
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink-500">
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Back to login
          </Link>
        </p>
      </Card>
    </Container>
  );
};

export default ResetPassword;
