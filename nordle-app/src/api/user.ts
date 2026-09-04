export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
};

export async function fetchUser(): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    id: "1",
    name: "Max Mustermann",
    email: "max@example.com",
    avatarUrl: "https://i.pravatar.cc/150?u=1",
  };
}