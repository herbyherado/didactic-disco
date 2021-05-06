import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {DiContainer} from "../DiContainer";

interface Props {
  slot: JSX.Element;
}

export const AddChore = ({slot}: Props): JSX.Element => {
  const [description, setDescription] = useState<string>("");
  const [assigneeId, setAssigneeId] = useState<string>("");

  const handleMemberUpdate = (e: CustomEventInit<{memberId: string}>) => {
    setAssigneeId(e.detail.memberId);
  };

  useEffect(() => {
    window.addEventListener("member:select", handleMemberUpdate);
    return () => window.removeEventListener("member:select", handleMemberUpdate);
  }, []);

  const handleAdd = async () => {
    if (!description || !assigneeId) return;
    await DiContainer.getInstance().choreService.addChore({description, assigneeId});
    resetField();
  };

  const resetField = () => {
    setDescription("");
  };

  return (
    <div>
      <Form>
        <label htmlFor="description">Description</label>
        <input
          name="description"
          type="text"
          value={description}
          onChange={({target}) => setDescription(target.value)}
        />

        {slot}

        <div className="action">
          <Button onClick={handleAdd}>Add Chore</Button>
        </div>
      </Form>
    </div>
  );
};

const Form = styled.div`
  padding: 20px;
  border: 1px solid blue;
  display: inline-flex;
  flex-direction: column;

  align-items: flex-start;

  input {
    border: 1px solid blue;
  }

  .action {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 20px;
  }
`;

const Button = styled.button`
  border: 1px solid blue;
  border-radius: 16px;

  cursor: pointer;
`;
