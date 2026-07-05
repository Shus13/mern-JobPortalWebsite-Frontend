import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";
import Loader from "../../components/ui/Loader";
import JobForm from "../../components/employer/JobForm";
import { getJobById, updateJob } from "../../services/jobApi";

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await getJobById(id);
        if (mounted) setJob(data.job || data);
      } catch {
        toast.error("Could not load job details");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      await updateJob(id, values);
      toast.success("Job updated successfully");
      navigate("/dashboard/jobs");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not update job");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader label="Loading job…" fullHeight />;

  return (
    <div>
      <PageTitle title="Edit Job" subtitle="Update the details of this job posting." />
      <Card className="max-w-2xl p-6 sm:p-8">
        <JobForm
          defaultValues={{
            title: job?.title || "",
            company: job?.company || "",
            location: job?.location || "",
            salary: job?.salary || "",
            description: job?.description || "",
          }}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          submitLabel="Update Job"
        />
      </Card>
    </div>
  );
};

export default EditJob;
