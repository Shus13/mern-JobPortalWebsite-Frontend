import { Link } from "react-router-dom";
import Container from "../../components/common/Container";
import Button from "../../components/ui/Button";

const NotFound = () => {
  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-display text-8xl font-extrabold text-brand-100">404</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-ink-900">
        This page took a different career path.
      </h1>
      <p className="mt-2 max-w-sm text-sm text-ink-500">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="mt-8">
        <Button size="lg">Back to Home</Button>
      </Link>
    </Container>
  );
};

export default NotFound;
