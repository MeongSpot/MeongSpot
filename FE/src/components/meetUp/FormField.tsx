// components/meetUp/FormField.tsx

const FormField = ({
  label,
  required = false,
  optionalText,
  currentLength,
  maxLength,
  children,
}: {
  label: string;
  required?: boolean;
  optionalText?: string;
  currentLength?: number;
  maxLength?: number;
  children: React.ReactNode;
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <label className="text-sm px-2 font-semibold text-gray-700">{label}</label>
        {required ? (
          <span className="text-xs text-deep-coral">필수</span>
        ) : (
          <span className="text-xs text-gray-500">(선택)</span>
        )}
      </div>
      {maxLength && (
        <span className="text-sm px-2 text-gray-500">
          {currentLength}/{maxLength}
        </span>
      )}
    </div>
    {children}
    {optionalText && <p className="px-2 mt-1 text-xs text-gray-500">{optionalText}</p>}
  </div>
);

export default FormField;
