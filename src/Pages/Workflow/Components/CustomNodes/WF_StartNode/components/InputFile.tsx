import CommonField from "@/Components/CommonFields";
import CommonStyles from "@/Components/CommonStyles";
import { cn } from "@/lib/utils";
import CustomAdornment from "@/Pages/ChatbotConfigure/components/GenerateDiversity/components/CustomAdornment";
import { Box, useTheme } from "@mui/material";
import { useReactFlow } from "@xyflow/react";
import { FastField, FieldArray, Form, Formik, FormikProps } from "formik";
import { capitalize } from "lodash";
import {
  File,
  FileText,
  FileVideo2,
  FileVolume2,
  Image,
  Plus,
} from "lucide-react";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import {v4 as uuid} from "uuid";

interface InputFileProps {
  data?: InputFileInitialValues;
  type: string;
  nodeId: string;
  setOpenDialog: (value: boolean) => void;
}

export interface InputFileInitialValues {
  input_name: string;
  input_label: string;
  is_required: boolean;
  sp_document_type: boolean;
  sp_image_type: boolean;
  sp_video_type: boolean;
  sp_audio_type: boolean;
  sp_other_type: boolean;
  other_types: string[];
  upload_file_type: UploadFileType;
  numOfFiles?: number;
}

export enum UploadFileType {
  LOCAL = "LOCAL",
  URL = "URL",
  BOTH = "BOTH",
}

const SUPPORT_TYPES_LIST = [
  {
    name: "sp_document_type",
    description:
      "TXT, MD, MARKDOWN, PDF, HTML, XLSX, XLS, DOCX, CSV, EML, MSG, PPTX, PPT, XML, EPUB",
    icon: <FileText />,
  },
  {
    name: "sp_image_type",
    description: "JPG, JPEG, PNG, GIF, WEBP, SVG",
    icon: <Image />,
  },
  {
    name: "sp_video_type",
    description: "MP4, MOV, MPEG, MPGA",
    icon: <FileVideo2 />,
  },
  {
    name: "sp_audio_type",
    description: "MP3, M4A, WAV, WEBM, AMR",
    icon: <FileVolume2 />,
  },
  {
    name: "sp_other_type",
    description: "Specify other file types.",
    icon: <File />,
  },
];

const InputFile = ({ data, type, nodeId,setOpenDialog }: InputFileProps) => {
  const { t } = useTranslation("node");
  const theme = useTheme();
  const { updateNode, getNode } = useReactFlow();
  const formikRef = useRef<FormikProps<InputFileInitialValues> | null>(null);

  const initialValues = useMemo<InputFileInitialValues>(() => {
    return {
      input_name: data?.input_name || "",
      input_label: data?.input_label || "",
      is_required: data?.is_required || false,
      sp_document_type: data?.sp_document_type || false,
      sp_image_type: data?.sp_image_type || false,
      sp_video_type: data?.sp_video_type || false,
      sp_audio_type: data?.sp_audio_type || false,
      sp_other_type: data?.sp_other_type || false,
      other_types: data?.other_types || [""],
      upload_file_type: data?.upload_file_type || UploadFileType.LOCAL,
      numOfFiles: data?.numOfFiles || 1,
    };
  }, []);

  const validationSchema = useMemo(() => {
    return Yup.object({
      input_name: Yup.string().required("Required"),
      input_label: Yup.number().required("Required").min(1),
    });
  }, []);

  const handleCheckOtherType = (type: string) => {
    if (!formikRef.current) return;
    const { values, setValues } = formikRef.current;

    if (type === "sp_other_type") {
      setValues({
        ...values,
        sp_other_type: !values.sp_other_type,
        sp_audio_type: false,
        sp_document_type: false,
        sp_image_type: false,
        sp_video_type: false,
      });
    } else {
      setValues({
        ...values,
        [type]: !values[type as keyof typeof values],
        sp_other_type: false,
      });
    }
  };

  const handleSubmit = (values: InputFileInitialValues) => {
    const currentNodeData = getNode(nodeId)?.data;
    const currentNodeInputs = (currentNodeData?.inputs as unknown[]) || [];
    if (!currentNodeData) return;

    if(!data) {
      updateNode(nodeId, {
        data: {
          ...currentNodeData,
          inputs: [
            ...currentNodeInputs,
            {
              ...values,
              type,
              id: uuid(),
            },
          ],
        },
      });
    } else {
      const newInputs = currentNodeInputs.map((elm: any) => {
        if (elm.input_name === data.input_name) {
          return {
            ...values,
            type,
            id: uuid(),
          };
        }
        return elm;
      });

      updateNode(nodeId, {
        data: {
          ...currentNodeData,
          inputs: newInputs,
        },
      });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      innerRef={formikRef}
    >
      {({ values, setFieldValue }) => {
        return (
          <Form className="flex flex-col ">
            <FastField
              name="input_name"
              component={CommonField.InputField}
              label={t("WF_Startnode.input_name")}
              placeholder={t("WF_Startnode.input_name")}
              fullWidth
              required
            />

            <FastField
              name="input_label"
              component={CommonField.InputField}
              label={t("WF_Startnode.input_label")}
              placeholder={t("WF_Startnode.input_label")}
              fullWidth
            />

            <div className="mt-2 flex flex-col gap-2">
              <CommonStyles.Typography type="bold14" className="w-full">
                {t("WF_Startnode.supported_file_types")}
              </CommonStyles.Typography>
              {SUPPORT_TYPES_LIST.map((item) => {
                const title = `WF_Startnode.${item.name}`;
                const isSelected = values[item.name as keyof typeof values];

                return (
                  <Box
                    className=" rounded-lg "
                    key={item.name}
                    sx={{
                      background: theme.colors.custom.background,
                      border: `1px solid ${
                        isSelected
                          ? theme.palette.primary.main
                          : theme.colors.custom.borderColor
                      }`,
                    }}
                  >
                    <div
                      className={cn(
                        "py-2 px-4 flex gap-4 items-center",
                        item.name === "sp_other_type" &&
                          isSelected &&
                          "border-b-[1px] border-slate-600"
                      )}
                    >
                      {item.icon}
                      <div className="flex flex-col gap-1 w-full ">
                        <CommonStyles.Typography type="semiBold16">
                          {t(title as unknown as TemplateStringsArray)}
                        </CommonStyles.Typography>
                        <CommonStyles.Typography
                          type="normal10"
                          className="opacity-60"
                        >
                          {item.description}
                        </CommonStyles.Typography>
                      </div>
                      <FastField
                        name={item.name}
                        component={CommonField.CheckBoxField}
                        onChangeCustomize={() =>
                          handleCheckOtherType(item.name)
                        }
                      />
                    </div>
                    {item.name === "sp_other_type" && isSelected && (
                      <div className="my-3 px-4">
                        <FieldArray
                          name="other_types"
                          render={(helper) => {
                            return (
                              <div className="flex flex-wrap gap-2 w-full">
                                {values.other_types.map(
                                  (_: string, index: number) => {
                                    return (
                                      <div className="flex gap-2">
                                        {index <
                                        values.other_types.length - 1 ? (
                                          <CommonStyles.Chip
                                            label={values.other_types[index]}
                                            handleDelete={() =>
                                              helper.remove(index)
                                            }
                                          />
                                        ) : (
                                          <FastField
                                            key={index}
                                            name={`other_types.${index}`}
                                            component={CommonField.InputField}
                                            placeholder={t(
                                              "WF_Startnode.file_type"
                                            )}
                                            sx={{
                                              width: "100px",
                                            }}
                                          />
                                        )}
                                      </div>
                                    );
                                  }
                                )}
                                <CommonStyles.Button
                                  isIcon
                                  hasBorder={false}
                                  disabled={
                                    !values.other_types[
                                      values.other_types.length - 1
                                    ]
                                  }
                                  onClick={() => {
                                    values.other_types[
                                      values.other_types.length - 1
                                    ] && helper.push("");
                                  }}
                                >
                                  <Plus />
                                </CommonStyles.Button>
                              </div>
                            );
                          }}
                        />
                      </div>
                    )}
                  </Box>
                );
              })}
            </div>

            <div className="mt-2 flex flex-col gap-2">
              <CommonStyles.Typography type="bold14" className="w-full">
                {t("WF_Startnode.upload_file_type")}
              </CommonStyles.Typography>
              <div className="grid grid-cols-3 gap-2">
                {Object.keys(UploadFileType).map((item) => {
                  return (
                    <Box
                      onClick={() => {
                        setFieldValue("upload_file_type", item);
                      }}
                      className="px-4 py-3 rounded-lg text-center"
                      sx={{
                        background: theme.colors.custom.background,
                        border: `1px solid ${
                          values.upload_file_type === item
                            ? theme.palette.primary.main
                            : theme.colors.custom.borderColor
                        }`,
                      }}
                    >
                      <CommonStyles.Typography type="semiBold16">
                        {capitalize(item.toLowerCase())}
                      </CommonStyles.Typography>
                    </Box>
                  );
                })}
              </div>
            </div>

            {type === "list_file" && (
              <div className="mt-2 flex flex-col gap-2">
                <CommonStyles.Typography type="bold14" className="w-full">
                  {t("WF_Startnode.max_number_of_files")}
                </CommonStyles.Typography>
                <div className="flex gap-10">
                  <FastField
                    name="numOfFiles"
                    component={CommonField.InputField}
                    type="number"
                    sxContainer={{ width: "100px" }}
                    InputProps={{
                      endAdornment: (
                        <CustomAdornment
                          name="numOfFiles"
                          min={1}
                          max={10}
                          step={1}
                        />
                      ),
                    }}
                  />
                  <FastField
                    name="numOfFiles"
                    component={CommonField.SliderField}
                    marks={[
                      {
                        value: 1,
                        label: "1",
                      },
                      {
                        value: 10,
                        label: "10",
                      },
                    ]}
                    min={1}
                    max={10}
                    fullWidth
                    sxContainer={{
                      width: "50%",
                      "& .MuiSlider-root": {
                        margin: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                      },
                    }}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                </div>
              </div>
            )}

            <div className="flex gap-1 items-center mt-2">
              <FastField
                name="is_required"
                component={CommonField.CheckBoxField}
                label={t("WF_Startnode.is_required")}
              />
              <CommonStyles.Typography type="bold14">
                {t("WF_Startnode.is_required")}
              </CommonStyles.Typography>
            </div>

            <div className="w-full flex justify-end gap-2">
              <CommonStyles.Button
                variant="outlined"
                onClick={() => setOpenDialog(false)}
              >
                {t("WF_Startnode.cancel")}
              </CommonStyles.Button>
              <CommonStyles.Button variant="contained" type="submit">
                {t("WF_Startnode.save")}
              </CommonStyles.Button>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export default InputFile;
