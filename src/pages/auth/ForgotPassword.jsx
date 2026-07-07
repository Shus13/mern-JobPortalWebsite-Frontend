import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { forgotPassword } from "../../services/authApi";

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async ({ email }) => {
    try {
      await forgotPassword(email);
      // Always show success, regardless of whether the email exists —
      // avoids leaking which addresses are registered.
      setIsSubmitted(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <Container className="flex min-h-[80vh] items-center justify-center py-16">
      <Card className="w-full max-w-md p-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">Forgot password?</h1>
        <p className="mt-1.5 text-sm text-ink-500">
          Enter your email and we'll send you a link to reset it.
        </p>

        {isSubmitted ? (
          <div className="mt-8 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700">
            If that email is registered, a reset link has been sent. Please check your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              error={errors.email?.message}
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email" },
              })}
            />
            <Button type="submit" className="w-full" size="lg" isLoading={isSubmitting}>
              Send reset link
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink-500">
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">
            Back to login
          </Link>
        </p>
      </Card>
    </Container>
  );
};

export default ForgotPassword;
