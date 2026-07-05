import Container from "../../components/common/Container";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";

const SECTIONS = [
  {
    title: "Information we collect",
    body: "When you create an account, we collect your name, email address, and role (job seeker or employer). Job seekers may optionally upload a profile photo and resume/CV. Employers may optionally upload a profile photo used to represent their listings.",
  },
  {
    title: "How we use your information",
    body: "Your information is used to operate core features of the platform: displaying job listings, processing applications, showing employers who has applied, and letting you track application status. We do not sell your personal data to third parties.",
  },
  {
    title: "Resumes and uploaded files",
    body: "Resumes uploaded by job seekers are only accessible to that job seeker and to employers whose job postings they've applied to. Employers cannot access a resume unless a candidate has actively applied to one of their listings.",
  },
  {
    title: "Data retention",
    body: "You can withdraw an application or delete a job posting at any time, which removes the associated record. Uploaded files remain on our servers until replaced or the associated account content is removed.",
  },
  {
    title: "Contact",
    body: "Questions about this policy can be sent through our Contact page.",
  },
];

const Privacy = () => {
  return (
    <Container className="py-16">
      <PageTitle
        title="Privacy Policy"
        subtitle="How Hirely collects, uses, and protects your information."
      />
      <Card className="max-w-3xl space-y-6 p-8">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h3 className="font-display text-base font-semibold text-ink-900">
              {section.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{section.body}</p>
          </div>
        ))}
      </Card>
    </Container>
  );
};

export default Privacy;
