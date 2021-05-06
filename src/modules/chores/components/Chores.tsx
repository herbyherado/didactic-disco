import React, {useEffect, useState} from "react";

import {Chore} from "../domain/Chore";
import {DiContainer} from "../DiContainer";

interface Props {
  children: ({chores, isLoading}: {chores: Chore[]; isLoading: boolean}) => JSX.Element;
}

export const Chores = ({children}: Props): JSX.Element => {
  const [chores, setChores] = useState<Chore[]>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const subscription = DiContainer.getInstance()
      .choreService.observeChores()
      .subscribe((loadedChores) => {
        if (!loadedChores) {
          return;
        }
        setChores(loadedChores);
        setIsLoading(false);
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return children({chores, isLoading});
};
