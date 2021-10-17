interface IButton {
  children: React.ReactNode;
  onClick: () => void;
  [key: string]: any;
}

export const Button = ({ children, onClick, ...rest }: IButton) => {
  const handleClick = (event) => {
    event.stopPropagation();
    onClick();
  };
  return (
    <button
      className="button background-hover w-max hover:scale-105"
      onClick={handleClick}
      {...rest}
    >
      {children}
    </button>
  );
};
