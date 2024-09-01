import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

const ShowDetail = () => {
    const { id } = useParams();
    const [todo, setTodo] = useState({});
    const [loading, setLoading] = useState(false);
    const getTodoById = async (id) => {
        try {
            console.log("id", id);

            setLoading(true);
            const response = await api.get(`/todo/${id}`, {
                withCredentials: true,
            });
            setTodo(response?.data?.todo);
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
    return (
        <main className="lg:[w-90%] w-[85%] mx-auto  p-10">
            {loading && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
                    <p className="text-xl font-bold">Loading...</p>
                </div>
            )}
            <h1 className=" mb-5 text-3xl font-bold text-blue-500 text-center">
                Todo Detail
            </h1>
            <div className="min-h-screen bg-gray-200 shadow-lg rounded-[10px] p-5">
                <div className="w-full p-5">
                    <div className="flex items-center justify-center">
                        <div className="w-full text-center bg-slate-100 p-5">
                            <h1 className="text-2xl font-bold text-center">
                                {todo?.title}
                            </h1>
                            <p className="text-lg font-semibold mt-2">
                                {todo?.description}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default ShowDetail;
