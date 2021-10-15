interface IButton {
  children: React.ReactNode;
  onClick: () => void;
}

export const Button = ({ children, onClick }: IButton) => {
  return (
    <button
      className="button background-hover w-max hover:scale-105"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
