const Card = ({ children, className = "", hover = false, as: Tag = "div", ...props }) => {
  return (
    <Tag
      className={`rounded-2xl border border-ink-100 bg-white shadow-soft ${
        hover ? "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-soft-lg" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Card;
