import React from "react";
import styled from "styled-components";
import {DiContainer} from "../DiContainer";

interface Props {
  choreId: string;
}

export const DeleteChoreButton = ({choreId}: Props): JSX.Element => {
  const handleDelete = async (choreId: string): Promise<void> => {
    await DiContainer.getInstance().choreService.deleteChore(choreId);
  };

  return (
    <span>
      <Button onClick={() => handleDelete(choreId)}>Mark as done</Button>
    </span>
  );
};

const Button = styled.button`
  border: 1px solid blue;
  border-radius: 16px;

  cursor: pointer;
`;
