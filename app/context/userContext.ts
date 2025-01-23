import { createContext, Dispatch, SetStateAction } from "react";

export type User = {
    firstName: string;
    lastName: string;
    email: string;
}

type UserContextType = {
    loggedIn: boolean,
    user: User | null;
    setUser: Dispatch<SetStateAction<User | null>>
}

const UserContext = createContext<UserContextType>({
    loggedIn: false,
    user: null,
    setUser: () => {}
});

export default UserContext;