import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../contexts/authContext";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        cpassword: "",
    });
    const [errors, setErrors] = useState({});
    const handleFormInput = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const navigate = useNavigate();
    const validateForm = () => {
        const newErrors = {};
        if (!formData?.name?.trim()) {
            newErrors.name = "Name is required";
        }

        if (!formData?.email?.trim()) {
            newErrors.email = "Email is required";
        }

        if (!formData?.password?.trim()) {
            newErrors.password = "Password is required";
        }
        if (!formData?.cpassword?.trim()) {
            newErrors.cpassword = "Confirm Password is required";
        }

        setErrors(newErrors);
        // This will return true because newErrors is empty
        return Object?.keys(newErrors)?.length === 0;
    };
    const [state, setState] = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        if (formData.password != formData.cpassword)
            return alert("Passwords do not match");
        const data = {
            name: formData.name,
            email: formData.email,
            password: formData.password,
        };

        try {
            setLoading(true);
            const response = await api.post("/register", data, {
                withCredentials: true, // This ensures cookies are sent and received
            });

            setState(response.data);
            localStorage.setItem("data", JSON.stringify(response.data));
            setLoading(false);
            if (response?.data?.message === "User registered")
                alert("User Registered Successfully");
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
                onSubmit={handleSubmit}
                className="w-[500px] bg-slate-300 p-5 shadow-lg rounded-md"
            >
                <h1 className="mb-5 text-center font-bold text-3xl text-blue-500">
                    Register{" "}
                </h1>
                <label
                    className="mb-2 block font-semibold text-lg"
                    htmlFor="name"
                >
                    Name
                </label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleFormInput}
                    className=" focus:ring-2 focus:outline-none px-5 w-full h-10 rounded-md border border-blue-500"
                />
                {errors.name && <p className="text-red-500">{errors.name}</p>}
                <label
                    className="mb-2  block font-semibold text-lg"
                    htmlFor="email"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormInput}
                    type="email"
                    className=" focus:ring-2 focus:outline-none px-5 w-full h-10 rounded-md border border-blue-500"
                />
                {errors.email && <p className="text-red-500">{errors.email}</p>}

                <label
                    className="mb-2 block font-semibold text-lg"
                    htmlFor="password"
                >
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleFormInput}
                    className="px-5 focus:ring-2 focus:outline-none w-full h-10 rounded-md border border-blue-500"
                />
                {errors.password && (
                    <p className="text-red-500">{errors.password}</p>
                )}

                <label
                    className="mb-2  block font-semibold text-lg"
                    htmlFor="cpassword"
                >
                    Confirm Password
                </label>
                <input
                    id="cpassword"
                    name="cpassword"
                    value={formData.cpassword}
                    onChange={handleFormInput}
                    type="password"
                    className="px-5 focus:ring-2 focus:outline-none w-full h-10 rounded-md border border-blue-500"
                />
                {errors.cpassword && (
                    <p className="text-red-500">{errors.cpassword}</p>
                )}

                <button className="w-full h-10 mt-8 bg-blue-500 text-white rounded-md">
                    Register
                </button>
                <p className="mt-5 text-center">
                    Already have an account?{" "}
                    <span className="text-blue-500 cursor-pointer">
                        <Link to="/login">Login</Link>
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Register;
