import { createContext, useContext, useState } from 'react'
import {
    getAuth,
    signOut
} from 'firebase/auth'
import { signIn } from './firebaseConfig'
export interface User {
    uid: string | null;
    email: string | null;
    name: string | null;
    picture: string | null;
    credits: number | null;
}
export interface UserContext {
    user: User | null,
    logout: () => void;
    login: () => void;
    updateCredits: (credits: number) => void;
}
export const UserContext = createContext<UserContext|undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const auth = getAuth()
    // A helper function to merge partial     updates or reset the user (logout)
    const updateUser = (newUser: Partial<User> | null) => {
        if (newUser === null) {
        setUser(null);
        } else {
        setUser((prevUser) => (prevUser ? { ...prevUser, ...newUser } as User : newUser as User));
        }
    };

    const logout = async () => {
        await signOut(auth)
        updateUser(null)
    }

    const login = async () => {
        const data = await signIn()
        updateUser(data)
    }

    const updateCredits = (credits: number) => {
        updateUser({ credits });
    };

    return (
        <UserContext.Provider value={{ user, logout, login, updateCredits }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};