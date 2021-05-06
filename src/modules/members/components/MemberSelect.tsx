import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {DiContainer} from "../DiContainer";
import {Member} from "../domain/Member";

export const MemberSelect = (): JSX.Element => {
  const [members, setMembers] = useState<Member[]>();
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    DiContainer.getInstance()
      .memberService.getAll()
      .then((loadedMembers) => setMembers(loadedMembers));
  }, []);

  useEffect(() => {
    dispatchEvent(new CustomEvent("member:select", {detail: {memberId: selectedId}}));
  }, [selectedId]);

  if (!members) {
    return <></>;
  }

  return (
    <>
      <label>Assignee</label>
      <Select value={selectedId} onChange={({target}) => setSelectedId(target.value)}>
        <option disabled value="">
          -- select an option --
        </option>
        {members.map((member, i) => (
          <option key={i} value={member.id}>
            {member.name}
          </option>
        ))}
      </Select>
    </>
  );
};

const Select = styled.select`
  border: 1px solid red;
  outline: red;
`;
