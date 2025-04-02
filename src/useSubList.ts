import { useLocalStorage } from "@raycast/utils";
import type { Subscription } from "./types";

export const useSubList = () => {
  const { value: subs, setValue: setSubs } = useLocalStorage<Subscription[]>("todos", []);

  const add = async (sub: Subscription) => {
    if (!subs || !subs.some((s) => s.id === sub.id)) {
      await setSubs([...(subs || []), sub]);
    }
  };

  const remove = async (id: string) => {
    if (subs) {
      await setSubs(subs.filter((s) => s.id !== id));
    }
  };

  return {
    value: subs,
    add,
    remove,
  };
};
