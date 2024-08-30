import { Fragment } from "react/jsx-runtime";
import useToggleDialog from "../../../Hooks/useToggleDialog";
import CommonStyles from "../../../Components/CommonStyles";
import CommonIcons from "../../../Components/CommonIcons";
import { memo } from "react";
import { FieldArray, Form, Formik } from "formik";
import { Box, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { isArray, isEmpty } from "lodash";
import { v4 as uuid } from "uuid";
import UserPermission, { PermissionOption } from "./UserPermission";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import httpServices from "../../../Services/httpServices";
import { updateKnowledgePermission } from "../../../Constants/api";
import { ListUser } from "../../../Hooks/User/useGetListUser";

interface User {
  id: string;
  user?: ListUser;
  permission: string;
}

const UpdatePriviledgeDialog = memo(({ toggle }: { toggle: () => void }) => {
  //! State
  const params = useParams();
  const userId = params?.id;
  const knowledgeId = params?.knowledgeId;
  const initialValues = {
    users: [
      {
        id: uuid(),
        user: undefined,
        permission: PermissionOption[0].value,
      },
    ],
  };

  //! Function
  const handleSubmit = async (values: { users: User[] }) => {
    if (!userId || !knowledgeId) return;

    const toastId = toast.loading("Updating permission...", {
      isLoading: true,
      autoClose: false,
    });

    try {
      const listReq: any[] = [];
      values.users.forEach((user) => {
        const req = httpServices.axios.post(updateKnowledgePermission, {
          user_id: userId,
          knowledge_storage_id: knowledgeId,
          dest_user_id: user.user?.user_id,
          permission_level: user.permission,
        });
        listReq.push(req);
      });

      const response = await Promise.all(listReq);

      console.log("response", response);

      toast.update(toastId, {
        isLoading: false,
        render: "Update permission successfully!",
        type: "success",
        autoClose: 3000,
      });
    } catch (error) {
      toast.update(toastId, {
        isLoading: false,
        render: "Update permission failed!",
        type: "error",
        autoClose: 3000,
      });
    }
  };

  //! Render
  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit}>
      {({ isSubmitting, errors, dirty, values }) => {
        return (
          <Form>
            <DialogTitle>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                alignItems={"center"}
                mb={3}
              >
                <CommonStyles.Typography type="semiBold18">
                  Knowledge permission
                </CommonStyles.Typography>
                <CommonStyles.Button isIcon onClick={toggle}>
                  <CommonIcons.Clear />
                </CommonStyles.Button>
              </Box>
            </DialogTitle>

            <DialogContent>
              <FieldArray
                name="users"
                render={({ push, remove }) => {
                  return (
                    <Fragment>
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "45% 45% 5%",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginBottom: "20px",
                        }}
                      >
                        <CommonStyles.Typography
                          sx={{
                            textAlign: "right",
                          }}
                          color="#bbbbbb"
                          type="bold14"
                        >
                          User
                        </CommonStyles.Typography>
                        <CommonStyles.Typography
                          sx={{ width: "200px" }}
                          color="#bbbbbb"
                          type="bold14"
                        >
                          Permission
                        </CommonStyles.Typography>
                        <CommonStyles.Typography></CommonStyles.Typography>
                      </Box>
                      {isArray(values.users) &&
                        values.users.map((user, index: number) => {
                          const handleRemove = () => {
                            remove(index);
                          };

                          return (
                            <UserPermission
                              name={`users.${index}`}
                              remove={handleRemove}
                              key={user.id}
                            />
                          );
                        })}
                      <CommonStyles.Button
                        startIcon={<CommonIcons.Add />}
                        onClick={() => {
                          push({
                            id: uuid(),
                            user: "",
                            permission: "",
                          });
                        }}
                        sx={{
                          marginTop: "20px",
                        }}
                      >
                        Add user
                      </CommonStyles.Button>
                    </Fragment>
                  );
                }}
              />
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
                  disabled={isSubmitting || !isEmpty(errors) || !dirty}
                >
                  Confirm
                </CommonStyles.Button>
              </Box>
            </DialogActions>
          </Form>
        );
      }}
    </Formik>
  );
});

const EditKnowledge = () => {
  //! State
  const { shouldRender, toggle, open } = useToggleDialog();

  //! Function

  //! Render
  return (
    <Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="md"
          fullWidth
        >
          <UpdatePriviledgeDialog toggle={toggle} />
        </CommonStyles.Dialog>
      )}
      <CommonStyles.Button isIcon onClick={toggle} color="primary">
        <CommonIcons.AdminPanelSettings />
      </CommonStyles.Button>
    </Fragment>
  );
};

export default EditKnowledge;
