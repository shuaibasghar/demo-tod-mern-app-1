import React, { useContext, useEffect, useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AddTask from "./pages/AddTask";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthContext } from "./contexts/authContext";
import EditTask from "./pages/EditTask";
import ShowDetail from "./pages/ShowDetail";

const App = () => {
    const [state] = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const authenticated = state && state?.token;

    useEffect(() => {
        // Simulate an async check or fetching to determine authentication status
        const checkAuth = () => {
            setLoading(false); // Set loading to false once the authentication check is complete
        };
        checkAuth();
    }, [state]);

    // PrivateRoute component
    const PrivateRoute = ({ children }) => {
        return loading ? null : authenticated ? (
            children
        ) : (
            <Navigate to="/login" />
        );
    };
    return (
        <BrowserRouter>
            {authenticated && <Header />}
            <Routes>
                <Route
                    path="/login"
                    element={authenticated ? <Navigate to="/" /> : <Login />}
                />
                <Route
                    path="/register"
                    element={authenticated ? <Navigate to="/" /> : <Register />}
                />
                <Route
                    path="/"
                    element={
                        <PrivateRoute>
                            <Home />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-task/:id"
                    element={
                        <PrivateRoute>
                            <EditTask />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/show-detail/:id"
                    element={
                        <PrivateRoute>
                            <ShowDetail />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/add-task"
                    element={
                        <PrivateRoute>
                            <AddTask />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

export default App;
