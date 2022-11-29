import React, { FC } from "react";
import { useParams } from "react-router-dom";

export const Header: FC = () => {
  const { projectName } = useParams();
  console.log(projectName);
  return <div>Header</div>;
};
