import React, {useState, useEffect} from "react";

import {Chore as ChoreDomain} from "../domain/Chore";

import {DiContainer} from "../DiContainer";

interface Props {
  choreId: string;
  children: ({chore, isLoading}: {chore: ChoreDomain; isLoading: boolean}) => JSX.Element;
}

const Chore = ({choreId, children}: Props) => {
  const [chore, setChore] = useState<ChoreDomain>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    DiContainer.getInstance()
      .choreService.getById(choreId)
      .then((loadedChore) => setChore(loadedChore))
      .finally(() => {
        setIsLoading(false);
      });
  }, [choreId]);

  return children({chore, isLoading});
};
