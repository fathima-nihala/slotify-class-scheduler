export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 ${
      props.className || ""
    }`}
  />
);