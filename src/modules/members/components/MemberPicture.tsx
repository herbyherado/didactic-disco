import React, {Children, useEffect, useState} from "react";
import styled from "styled-components";
import {DiContainer} from "../DiContainer";
import {Member} from "../domain/Member";

interface Props {
  memberId: string;
}

export const MemberPicture = ({memberId}: Props): JSX.Element => {
  const [member, setMember] = useState<Member>();

  useEffect(() => {
    DiContainer.getInstance()
      .memberService.getById(memberId)
      .then((loadedMember) => setMember(loadedMember));
  }, [memberId]);

  if (!member) {
    return <Avatar></Avatar>;
  }

  return (
    <Avatar>
      <img src={member.imgUrl} alt={member.name} />
    </Avatar>
  );
};

const Avatar = styled.div`
  border-radius: 100px;
  border: 2px solid red;

  overflow: hidden;
  width: 50px;
  height: 50px;

  position: relative;

  img {
    height: 100%;
    margin: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;
