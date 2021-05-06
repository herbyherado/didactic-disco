import React from "react";
import styled from "styled-components";

import {AddChore, Chores, DeleteChoreButton} from "./modules/chores";
import {MemberPicture} from "./modules/members";
import {MemberSelect} from "./modules/members/components/MemberSelect";

const App = (): JSX.Element => {
  return (
    <Root>
      <h1>Chore List</h1>
      <Layout>
        <AddChore slot={<MemberSelect />} />

        <Chores>
          {({chores, isLoading}) =>
            isLoading ? (
              <p>loading...</p>
            ) : (
              <div>
                {chores.map((chore, i) => (
                  <Card key={i}>
                    <div>
                      <label>{chore.description}</label>
                    </div>
                    <div className="action">
                      <MemberPicture memberId={chore.assignee} />
                      <DeleteChoreButton choreId={chore.id} />
                    </div>
                  </Card>
                ))}
              </div>
            )
          }
        </Chores>
      </Layout>
    </Root>
  );
};

export default App;

const Root = styled.div`
  text-align: center;
`;

const Layout = styled.div`
  display: flex;
  flex-direction: row;

  > div {
    flex: 1;
  }
`;

const Card = styled.div`
  width: 200px;
  padding: 20px;
  border: 1px solid blue;
  text-align: left;

  :not(:last-child) {
    margin-bottom: 10px;
  }

  .action {
    margin-top: 10px;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;
