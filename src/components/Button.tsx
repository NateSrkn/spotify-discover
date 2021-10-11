interface IButton {
  children: React.ReactNode;
  onClick: () => void;
}

export default function Button({ children, onClick }: IButton) {
  return (
    <button className="button background-hover" onClick={onClick}>
      {children}
    </button>
  );
}
