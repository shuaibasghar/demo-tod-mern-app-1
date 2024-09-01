import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [state, setState] = useState({});
    console.log("state", state);

    const localStorageData = () => {
        const data = localStorage.getItem("data");
        const userInfo = JSON.parse(data);
        setState({ ...state, user: userInfo?.user, token: userInfo?.token });
    };
    useEffect(() => {
        localStorageData();
    }, []);
    return (
        <AuthContext.Provider value={[state, setState]}>
            {children}
        </AuthContext.Provider>
    );
};
