import { Fragment, ReactNode } from "react";

export interface WorkflowCategories {
  title: string;
  name: string;
  icon?: ReactNode;
}

export const workflowCategories: WorkflowCategories[] = [
  {
    name: "ai",
    title: "A.I",
    icon: <Fragment />,
  },
  {
    name: "sales",
    title: "Sales",
    icon: <Fragment />,
  },
  {
    name: "engineering",
    title: "Engineering",
    icon: <Fragment />,
  },
  {
    name: "design",
    title: "Design",
    icon: <Fragment />,
  },
  {
    name: "other",
    title: "Other",
    icon: <Fragment />,
  },
];
