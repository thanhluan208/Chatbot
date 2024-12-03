import CommonStyles from "@/Components/CommonStyles";
import { useRef } from "react";

interface DescriptionInputProps {
  value?: string;
  handleUpdate: (
    payload: Partial<any>,
    onSuccess?: () => void,
    onFailed?: () => void
  ) => void;
}

const DescriptionInput = ({ value, handleUpdate }: DescriptionInputProps) => {
  const timeoutRef = useRef<number | null>(null);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      handleUpdate({
        desc: event.target.value,
      });
    }, 500);
  };

  return (
    <div className="mt-3">
      <CommonStyles.Input
        fullWidth
        multiline
        minRows={2}
        initValue={value}
        placeholder="Enter node description... "
        afterOnchange={handleChange}
      />
    </div>
  );
};

export default DescriptionInput;
