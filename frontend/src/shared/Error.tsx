export const Error = ({ text }: { text?: string }) =>
  text ? <p className="text-red-500 text-xs mt-1">{text}</p> : null;