import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import Container from "../../components/common/Container";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Contact = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async () => {
    // No backend endpoint for this yet — this simply confirms receipt.
    await new Promise((resolve) => setTimeout(resolve, 600));
    toast.success("Thanks for reaching out! We'll get back to you soon.");
    reset();
  };

  return (
    <Container className="py-16">
      <PageTitle
        title="Contact us"
        subtitle="Questions, feedback, or partnership ideas — we'd love to hear from you."
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <Input
                label="Your name"
                placeholder="Jordan Lee"
                error={errors.name?.message}
                {...register("name", { required: "Name is required" })}
              />
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
            </div>
            <Input
              label="Message"
              textarea
              rows={5}
              placeholder="How can we help?"
              error={errors.message?.message}
              {...register("message", { required: "Please add a short message" })}
            />
            <Button type="submit" isLoading={isSubmitting} size="lg">
              Send message
            </Button>
          </form>
        </Card>

        <Card className="p-6">
          <h3 className="font-display text-base font-semibold text-ink-900">Get in touch</h3>
          <dl className="mt-4 space-y-4 text-sm">
            <div>
              <dt className="text-ink-500">Email</dt>
              <dd className="font-medium text-ink-800">support@hirely.example</dd>
            </div>
            <div>
              <dt className="text-ink-500">Location</dt>
              <dd className="font-medium text-ink-800">Nepalgunj, Banke, Nepal</dd>
            </div>
          </dl>
        </Card>
      </div>
    </Container>
  );
};

export default Contact;
