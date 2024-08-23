import React, { useCallback, useMemo } from "react";
import { FastField, Form, Formik } from "formik";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import CommonStyles from "../../../../Components/CommonStyles";
import CommonIcons from "../../../../Components/CommonIcons";
import CommonField from "../../../../Components/CommonFields";
import { isEmpty } from "lodash";
import Dropzone, { useDropzone } from "react-dropzone";

interface IUploadLocalDialog {
  toggle: () => void;
}

const UploadLocalDialog = (props: IUploadLocalDialog) => {
  //! State
  const { toggle } = props;
  const [isDragOver, setIsDragOver] = React.useState(false);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDragEnter: () => {
      setIsDragOver(true);
    },
    onDragLeave: () => {
      setIsDragOver(false);
    },
    onDrop: () => {
      setIsDragOver(false);
    },
    maxFiles: 1,
  });


  const initialValues = useMemo(() => {
    return {
      description: "",
    };
  }, []);

  //! Function

  const handleSubmit = useCallback(async () => {}, []);

  //! Render
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validateOnChange
      validateOnBlur
      validateOnMount
    >
      {({ isSubmitting, errors }) => {
        return (
          <Form
            style={{
              display: "flex",
              gap: "16px",
              flexDirection: "column",
            }}
          >
            <Box>
              <DialogTitle>
                <Box
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  mb={3}
                >
                  <CommonStyles.Typography type="semiBold18">
                    Upload knowledge from local
                  </CommonStyles.Typography>
                  <CommonStyles.Button isIcon onClick={toggle}>
                    <CommonIcons.Clear />
                  </CommonStyles.Button>
                </Box>
              </DialogTitle>

              <DialogContent>
                <FastField
                  name="description"
                  component={CommonField.InputField}
                  fullWidth
                  label="Description"
                  placeholder="Enter folder knowledge description"
                  multiline
                  minRows={6}
                  maxChar={2000}
                />
                <Dropzone
                  onDragOver={() => {
                    console.log("hehe");
                  }}
                >
                  {({}) => {
                    return (
                      <div
                        onDragOver={() => {
                          console.log("hehe");
                        }}
                        {...getRootProps({ className: "dropzone" })}
                      >
                        <input {...getInputProps()} />
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            mt: "20px",
                            border: `1px dashed ${
                              isDragOver ? "#4e40e5" : "#ccc"
                            }`,
                            borderRadius: "8px",
                            padding: "20px",
                            backgroundColor: isDragOver ? "#4e40e50f" : "#fff",
                            transition: "all 0.3s",
                            svg: {
                              width: "150px",
                              height: "150px",
                            },
                            "&:hover": {
                              border: "1px dashed #4e40e5",
                              backgroundColor: "#4e40e50f",
                            },
                          }}
                        >
                          <CommonIcons.UploadUnDraw />
                          <CommonStyles.Typography type="normal14">
                            Click to upload or drag and drop files here
                          </CommonStyles.Typography>
                          {isDragOver && (
                            <CommonStyles.Typography
                              type="bold14"
                              color={"#4e40e5"}
                            >
                              Release and start uploading
                            </CommonStyles.Typography>
                          )}
                        </Box>
                      </div>
                    );
                  }}
                </Dropzone>
                {acceptedFiles?.[0] && (
                  <Box mt={4}>
                    <CommonStyles.Chip
                      label={`${acceptedFiles[0].name} - ${acceptedFiles[0].size} bytes`}
                    />
                  </Box>
                )}
              </DialogContent>

              <DialogActions>
                <Box
                  display="flex"
                  justifyContent={"end"}
                  gap="16px"
                  sx={{
                    button: {
                      fontWeight: "550",
                      padding: "6px 20px",
                    },
                  }}
                >
                  <CommonStyles.Button
                    variant="contained"
                    sx={{
                      background: "#fff",
                      color: "#000",
                      "&:hover": {
                        background: "#fff",
                      },
                    }}
                    onClick={toggle}
                    disabled={isSubmitting}
                    type="button"
                  >
                    Cancel
                  </CommonStyles.Button>
                  <CommonStyles.Button
                    variant="contained"
                    sx={{
                      color: "#fff",
                    }}
                    type="submit"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || !isEmpty(errors)}
                  >
                    Confirm
                  </CommonStyles.Button>
                </Box>
              </DialogActions>
            </Box>
          </Form>
        );
      }}
    </Formik>
  );
};

export default UploadLocalDialog;
