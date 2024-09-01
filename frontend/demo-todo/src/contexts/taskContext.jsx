import { createContext, useEffect, useState } from "react";
import api from "../utils/api";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const [todo, setTodo] = useState([]);
    const [loading, setLoading] = useState(false);

    return (
        <TaskContext.Provider value={[todo, setTodo, loading, setLoading]}>
            {children}
        </TaskContext.Provider>
    );
};
