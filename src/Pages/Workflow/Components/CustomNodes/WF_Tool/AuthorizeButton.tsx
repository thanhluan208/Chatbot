import CommonStyles from "@/Components/CommonStyles";
import useToggleDialog from "@/Hooks/useToggleDialog";
import { KeyRound } from "lucide-react";
import React from "react";
import { CredentialsForProvider } from "../../Toolbar/type";
import AuthorizeDialog from "./AuthorizeDialog";

interface AuthorizeButtonProps {
  credential: CredentialsForProvider;
  provider: string;
  toolName: string;
}

const AuthorizeButton = ({ credential,provider,toolName }: AuthorizeButtonProps) => {
  const { open, shouldRender, toggle } = useToggleDialog();

  return (
    <React.Fragment>
      {shouldRender && (
        <CommonStyles.Dialog
          open={open}
          toggle={toggle}
          maxWidth="sm"
          fullWidth
        >
          <AuthorizeDialog toggle={toggle} credential={credential} provider={provider} toolName={toolName}/>
        </CommonStyles.Dialog>
      )}
      <div className="px-6 py-3">
        <CommonStyles.Button
          className="gap-3"
          variant="contained"
          onClick={toggle}
          fullWidth
        >
          <KeyRound size={14} />
          Authorize
        </CommonStyles.Button>
      </div>
    </React.Fragment>
  );
};

export default AuthorizeButton;
