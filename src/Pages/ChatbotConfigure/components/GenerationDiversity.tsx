import CommonStyles from "../../../Components/CommonStyles";
import { Box, useTheme } from "@mui/material";
import Hint from "./GenerateDiversity/components/Hint";
import { useFormikContext } from "formik";
import { initialValueEngine } from "./EngineButton";

export const generationDiversityOptions = [
  {
    label: "Precise",
    value: "precise",
  },
  {
    label: "Balanced",
    value: "balanced",
  },
  {
    label: "Creative",
    value: "creative",
  },
  {
    label: "Customize",
    value: "customize",
  },
];

const HintContent = () => {
  return (
    <Box>
      <div>
        <CommonStyles.Typography type="bold14">
          Precise Mode
        </CommonStyles.Typography>
      </div>
      <ul>
        <li>Strictly follows instructions to generate content</li>
        <li>
          Suitable for scenarios requiring accuracy, such as formal documents
          and code
        </li>
      </ul>
      <div>
        <CommonStyles.Typography type="bold14">
          Balanced Mode
        </CommonStyles.Typography>
      </div>
      <ul>
        <li>Seeks a balance between innovation and precision</li>
        <li>
          Suitable for most daily applications, generating content that is
          interesting yet rigorous
        </li>
      </ul>
      <div>
        <CommonStyles.Typography type="bold14">
          Creative Mode
        </CommonStyles.Typography>
      </div>
      <ul>
        <li>Encourages creativity and provides unique ideas</li>
        <li>
          Suitable for scenarios requiring inspiration and unique perspectives,
          such as brainstorming and creative writing
        </li>
      </ul>
      <div>
        <CommonStyles.Typography type="bold14">
          Custom Mode
        </CommonStyles.Typography>
      </div>
      <ul>
        <li>
          Allows users to customize the generation method through advanced
          settings
        </li>
        <li>
          Enables fine-tuning based on specific needs, achieving personalized
          optimization
        </li>
      </ul>
    </Box>
  );
};

const GenerationDiversity = () => {
  //! State
  const { values, setValues } = useFormikContext<initialValueEngine>();
  const theme = useTheme();

  //! Function
  const handleChange = (value: any) => {
    if (value === "precise") {
      setValues({
        ...values,
        generationDiversity: value,
        temperature: 0.1,
        top_p: 1,
      });
    }
    if (value === "balanced") {
      setValues({
        ...values,
        generationDiversity: value,
        temperature: 0.5,
        top_p: 1,
      });
    }
    if (value === "creative") {
      setValues({
        ...values,
        generationDiversity: value,
        temperature: 0.8,
        top_p: 1,
      });
    }
    if (value === "customize") {
      setValues({
        ...values,
        generationDiversity: value,
        temperature: 2,
        top_p: 0.96,
      });
    }
  };

  //! Render
  return (
    <Box mt={"16px"}>
      <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <CommonStyles.Typography type="semiBold16">
          Generation Diversity
        </CommonStyles.Typography>
        <Hint content={<HintContent />} />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4,25%)",
          borderRadius: "8px",
          padding: "4px 8px",
          background: theme.colors.custom.backgroundTab,
          position: "relative",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            transform: `translateY(-50%)`,
            width: "calc((100% - 16px) / 4)",
            left: `calc(${generationDiversityOptions.findIndex(
              (el) => el.value === values.generationDiversity
            )} * (100% - 16px) / 4 + 8px)`,
            transition: "left 0.3s",
            height: "24px",
            background: theme.colors.custom.backgroundCard,
            borderRadius: "8px",
          }}
        ></Box>
        {generationDiversityOptions.map((option) => {
          const isSelected = values?.generationDiversity === option.value;
          return (
            <CommonStyles.Button
              key={option.value}
              onClick={() => {
                handleChange(option.value);
              }}
              sx={{
                borderRadius: "8px",
                padding: "4px 8px",
                height: "24px",
                textTransform: "none",
                color: isSelected
                  ? theme.palette.primary.main
                  : theme.colors.custom.normalColorTypo,
              }}
            >
              <CommonStyles.Typography
                type={isSelected ? "semiBold12" : "normal12"}
              >
                {option.label}
              </CommonStyles.Typography>
            </CommonStyles.Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default GenerationDiversity;
