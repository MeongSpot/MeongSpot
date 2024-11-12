// components/common/Message/FormErrorMessage.tsx
interface FormErrorMessageProps {
  message: string;
}

const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
  return <div className="mt-1 text-sm text-red-500">* {message}</div>;
};

export default FormErrorMessage;
