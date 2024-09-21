import CommonIcons from "../../../Components/CommonIcons";
import CommonStyles from "../../../Components/CommonStyles";

interface UserDescriptionProps {
  description: string;
  ableToEdit?: boolean;
}

const UserDescription = (props: UserDescriptionProps) => {
  const { description, ableToEdit } = props;
  return (
    <CommonStyles.Typography type="normal14" sx={{opacity:".5"}}>
      {description}
      {ableToEdit && (
        <CommonStyles.Typography component="span">
          <CommonStyles.Button
            isIcon
            sx={{
              svg: {
                height: 14,
                width: 14,
              },
            }}
          >
            <CommonIcons.Edit />
          </CommonStyles.Button>
        </CommonStyles.Typography>
      )}
    </CommonStyles.Typography>
  );
};

export default UserDescription;
