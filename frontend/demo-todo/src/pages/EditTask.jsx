import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate, useParams } from "react-router-dom";

const EditTask = () => {
    const [formData, setFormData] = useState({});
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    console.log("id", id);

    const navigate = useNavigate();
    const getTodoById = async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/todo/${id}`, {
                withCredentials: true,
            });
            setFormData(response?.data?.todo);
            setLoading(false);
        } catch (error) {
            alert(error?.response?.data?.error);
            setLoading(false);
        }
    };
    useEffect(() => {
        if (id) {
            getTodoById(id);
        }
    }, [id]);
    console.log("formData", formData);
    const handleFormInput = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const response = await api.put(`/todo/${id}`, formData, {
                withCredentials: true,
            });
            if (response && response.data.message) {
                alert(response.data.message);
            }
            navigate("/");
            setLoading(false);
        } catch (error) {
            alert(error?.response?.data?.error);
            setLoading(false);
        }
    };
    return (
        <form
            onSubmit={onSubmit}
            className="w-[300px] mt-10 p-5 bg-slate-100 mx-auto"
        >
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    <p className="text-xl font-bold">Loading...</p>
                </div>
            )}
            <label className="text-lg text-semibold" htmlFor="title">
                Title
            </label>
            <input
                name="title"
                id="title"
                value={formData.title}
                onChange={handleFormInput}
                type="text"
                required
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
            />
            <label className="text-lg text-semibold" htmlFor="">
                Description
            </label>
            <input
                name="description"
                id="description"
                value={formData.description}
                onChange={handleFormInput}
                type="text"
                required
                className="w-full p-2 border border-gray-300 rounded-md mt-1"
            />
            <div className="bg-blue-500 flex items-center justify-center py-3 mt-5">
                <button className="">submit</button>
            </div>
        </form>
    );
};

export default EditTask;
