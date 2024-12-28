import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

interface ModelStatsConfigProps {
  nodeId?: string;
  handleUpdateNodeData?: (nodeId: string, payload: any) => void;
  handleChange?: (payload: any) => void;
}

const FormikEffect = ({
  nodeId,
  handleUpdateNodeData,
}: ModelStatsConfigProps) => {
  const { values, dirty, submitForm } = useFormikContext<any>();
  const debounceRef = useRef<number | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (!dirty) return;

      submitForm();
    }, 500);
  }, [values, handleUpdateNodeData, nodeId, dirty]);
  return null;
};

export default FormikEffect;
