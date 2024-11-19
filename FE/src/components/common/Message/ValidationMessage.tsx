interface ValidationMessageProps {
  message: string;
  isValid: boolean;
}

const ValidationMessage = ({ message, isValid }: ValidationMessageProps) => {
  return (
    <div className="flex items-center space-x-2 text-sm">
      <span className={`${isValid ? 'text-blue-500' : 'text-gray-500'}`}>✓ {message}</span>
    </div>
  );
};

export default ValidationMessage;
