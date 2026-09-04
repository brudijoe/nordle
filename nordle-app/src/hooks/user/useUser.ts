
import { useQuery } from "@tanstack/react-query";
import { fetchUser } from "../../api/user"

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
  });
}