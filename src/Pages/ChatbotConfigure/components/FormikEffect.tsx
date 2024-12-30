import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";

const FormikEffect = () => {
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
  }, [values, dirty]);
  return null;
};

export default FormikEffect;
