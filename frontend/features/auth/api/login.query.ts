import { useQuery } from "react-query";
import { validateToken } from "./login.api";

export const validateTokenQuery = () => {
  return useQuery({
    queryKey: ["validate-token"],
    queryFn: validateToken,
    retry: false,
  });
};
