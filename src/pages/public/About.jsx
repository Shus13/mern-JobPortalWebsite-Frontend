import Container from "../../components/common/Container";
import PageTitle from "../../components/ui/PageTitle";
import Card from "../../components/ui/Card";

const About = () => {
  return (
    <Container className="py-16">
      <PageTitle
        title="About Hirely"
        subtitle="A focused space where job seekers and employers find the right match, faster."
      />
      <Card className="max-w-3xl space-y-4 p-8 text-sm leading-relaxed text-ink-600">
        <p>
          Hirely was built to strip away the noise most job boards add — endless
          filters, recycled listings, and applications that vanish into a void.
          Instead, we focus on two things: making it effortless for employers to
          post real openings, and making it just as effortless for job seekers to
          find and apply to them.
        </p>
        <p>
          Whether you're hiring for your first role or looking for your next one,
          Hirely keeps the process simple — a clean list of jobs, a straightforward
          application flow, and a dashboard that actually tells employers what
          they need to know.
        </p>
        <p>
          This project is a demonstration job portal built with React, Node.js,
          Express, and PostgreSQL, showcasing a complete hiring workflow from job
          posting through to application review.
        </p>
      </Card>
    </Container>
  );
};

export default About;
