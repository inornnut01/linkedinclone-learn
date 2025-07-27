export default function PostAction({
  icon,
  text,
  onClick,
}: {
  icon: React.ReactNode;
  text: string;
  onClick: () => void | null;
}) {
  return (
    <button className="flex items-center cursor-pointer" onClick={onClick}>
      <span className="mr-1">{icon}</span>
      <span className="hidden sm:inline">{text}</span>
    </button>
  );
}
