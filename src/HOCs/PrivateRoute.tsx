interface IPrivateRoute {
  children: React.ReactNode;
}
const PrivateRoute = (props: IPrivateRoute) => {
  const { children } = props;
    


  return children;
};
