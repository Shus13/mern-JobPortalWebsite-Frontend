import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import JobForm from "../../components/employer/JobForm";
import { createJob } from "../../services/jobApi";

const PostJob = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await createJob(values);
      toast.success("Job posted successfully");
      navigate("/dashboard/jobs");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageTitle title="Post a Job" subtitle="Share the details candidates need to know." />
      <Card className="max-w-2xl p-6 sm:p-8">
        <JobForm onSubmit={handleSubmit} isSubmitting={isSubmitting} submitLabel="Post Job" />
      </Card>
    </div>
  );
};

export default PostJob;
