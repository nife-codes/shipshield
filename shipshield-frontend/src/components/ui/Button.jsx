const CustomButton = ({
  children,
  variant = "solid", // "solid" | "outline"
  color = "primary",
  className = "",
  disabled = false,
  ...props
}) => {
  const base = "py-3 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2";

  const colors = {
    primary: {
      solid: "bg-[#4F5BD5] text-white hover:bg-[#4048b8] disabled:bg-gray-300 disabled:cursor-not-allowed",
      outline: "border border-gray-400 text-gray-600 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
    },
    danger: {
      solid: "bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed",
      outline: "border border-gray-400 text-gray-600 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
    },
    success: {
      solid: "bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed",
      outline: "border border-gray-400 text-gray-600 hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed",
    },
  };

  return (
    <button
      className={`${base} ${colors[color][variant]} ${className} hover:scale-105 active:scale-95`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default CustomButton;
