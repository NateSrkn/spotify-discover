interface IButton {
  children: React.ReactNode;
  onClick: () => void;
}

export const Button = ({ children, onClick }: IButton) => {
  return (
    <button className="button background-hover w-max" onClick={onClick}>
      {children}
    </button>
  );
};
