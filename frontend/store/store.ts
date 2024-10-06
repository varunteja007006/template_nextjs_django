import { create } from "zustand";
import { devtools, persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { Store } from "@/types/store.types";

import { createUserSlice } from "./user.slice";

export const useStore = create<Store>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((...a) => ({
          ...createUserSlice(...a),
        }))
      ),
      {
        name: "local-storage",
      }
    )
  )
);
