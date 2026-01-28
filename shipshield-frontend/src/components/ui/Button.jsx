const CustomButton = ({
  children,
  variant = "solid", // "solid" | "outline"
  color = "primary",
  className = "",
  ...props
}) => {
  const base = "w-full py-1 px-4 rounded text-sm font-medium transition";

  const colors = {
    primary: {
      solid: "bg-[#7B5CF6] text-white hover:bg-[#6a4fe0]",
      outline: "border border-gray-400 text-gray-600 hover:bg-gray-200",
    },
    danger: {
      solid: "bg-red-500 text-white hover:bg-red-600",
      outline: "border border-gray-400 text-gray-600 hover:bg-gray-200",
    },
    success: {
      solid: "bg-green-500 text-white hover:bg-green-600",
      outline: "border border-gray-400 text-gray-600 hover:bg-gray-200",
    },
  };

  return (
    <button
      className={`${base} ${colors[color][variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
