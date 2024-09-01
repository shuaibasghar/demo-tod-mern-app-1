import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/authContext";
import api from "../utils/api";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({});
    const [state, setState] = useContext(AuthContext);
    const [loading, setLoading] = useState();
    const navigate = useNavigate();
    const handleFormInput = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const validateForm = () => {
        let newErrors = {};
        if (!formData?.email?.trim()) {
            newErrors.email = "Email is required";
        }
        if (!formData?.password?.trim()) {
            newErrors.password = "Password is required";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        if (!validateForm()) return;
        try {
            setLoading(true);
            const response = await api.post("/login", formData, {
                withCredentials: true,
            });

            localStorage.setItem("data", JSON.stringify(response?.data));
            setState(response?.data);

            if (response && response.data) {
                return alert(response?.data?.message);
            }
            setLoading(false);
            navigate("/");
        } catch (error) {
            alert(error?.response?.data?.error);
            setLoading(false);
        }
    };
    return (
        <div className="bg-slate-100 h-screen flex items-center justify-center px-5">
            {loading && (
                <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                    <p className="text-lg font-bold">Loading...</p>
                </div>
            )}

            <form
                onSubmit={onSubmit}
                className="w-[500px] bg-slate-300 p-5 shadow-lg rounded-md"
            >
                <h1 className="mb-10 text-center font-bold text-3xl text-blue-500">
                    Login{" "}
                </h1>
                <label
                    className="mb-2 block font-semibold text-lg"
                    htmlFor="email"
                >
                    Email
                </label>
                <input
                    name="email"
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormInput}
                    className=" focus:ring-2 focus:outline-none px-5 w-full h-10 rounded-md border border-blue-500"
                />
                {errors && <p className="text-red-500">{errors.email}</p>}
                <label
                    className="mb-2 mt-5 block font-semibold text-lg"
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    name="password"
                    id="password"
                    type="password "
                    value={formData.password}
                    onChange={handleFormInput}
                    className="px-5 focus:ring-2 focus:outline-none w-full h-10 rounded-md border border-blue-500"
                />
                {errors && <p className="text-red-500">{errors.password}</p>}

                <button className="w-full h-10 mt-8 bg-blue-500 text-white rounded-md">
                    Login
                </button>
                <p className="mt-5 text-center">
                    Don't have an account?{" "}
                    <span className="text-blue-500 cursor-pointer">
                        <Link to="/register">Register</Link>
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;
