import React, { useContext, useEffect, useState } from "react";
import { CgAdd } from "react-icons/cg";
import { BiDetail, BiEdit } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { TaskContext } from "../contexts/taskContext";
import api from "../utils/api";
import { Link } from "react-router-dom";
import ShowDetail from "./ShowDetail";

const Home = () => {
    const [todo, setTodo, loading, setLoading] = useContext(TaskContext);
    console.log("line9todo", todo);
    const getAllTodos = async () => {
        try {
            setLoading(true);
            const response = await api.get("/todo", { withCredentials: true });
            console.log("response", response.data);
            setTodo(response.data.todos);
            setLoading(false);
        } catch (error) {
            alert(error.response.data.error);
            setLoading(false);
        }
    };
    useEffect(() => {
        getAllTodos();
    }, []);

    const deleteTask = async (id) => {
        try {
            setLoading(true);
            const response = await api.delete(`/todo/${id}`, {
                withCredentials: true,
            });
            if (response && response.data.message) {
                alert(response.data.message);
            }
            getAllTodos();
            setLoading(false);
        } catch (error) {
            alert(error.response.data.error);
            setLoading(false);
        }
    };

    const sortedArray = todo
        ? [...todo].sort((a, b) => {
              return new Date(b.createdAt) - new Date(a.createdAt);
          })
        : [];
    return (
        <div className="">
            {loading && (
                <div className="fixed bg-white flex items-center justify-center z-50 opacity-55 inset-0">
                    <p className="font-bold text-3xl">Loading...</p>
                </div>
            )}
            <main className="lg:[w-90%] w-[85%] mx-auto  p-10">
                <h1 className=" mb-5 text-3xl font-bold text-blue-500 text-center">
                    ALL TASKS
                </h1>
                <div className="min-h-screen bg-gray-200 shadow-lg rounded-[10px] p-5">
                    <div className="w-full p-5">
                        {/* <div className="flex items-center justify-center">
                            <button className="flex gap-2 bg-blue-500 text-center px-12 py-2 text-white font-bold ">
                                {" "}
                                <span>
                                    <CgAdd className="text-2xl " />{" "}
                                </span>{" "}
                                Add Task
                            </button>
                        </div> */}
                        {todo?.length === 0 && (
                            <div className="flex items-center justify-center">
                                <h1 className="text-2xl font-bold">
                                    No Task Created yet
                                </h1>
                            </div>
                        )}

                        {sortedArray?.map((item) => (
                            <div
                                key={item._id}
                                className="mt-5 mb-5 bg-slate-100 w-full rounded-md shadow-xl "
                            >
                                <div className="flex items-center justify-between flex-wrap  p-5">
                                    <div className=" cursor-pointer  flex items-center gap-5">
                                        <h4 className="text-lg font-semibold">
                                            {item.title}
                                        </h4>
                                    </div>
                                    <div className="flex flex-wrap  gap-2">
                                        <div className="cursor-pointer bg-blue-500 rounded-md w-10 h-10 flex items-center justify-center text-white">
                                            <Link
                                                to={`/show-detail/${item._id}`}
                                            >
                                                <BiDetail />
                                            </Link>
                                        </div>
                                        <div className="cursor-pointer bg-blue-500 rounded-md w-10 h-10 flex items-center justify-center text-white">
                                            <Link to={`/edit-task/${item._id}`}>
                                                <BiEdit />
                                            </Link>
                                        </div>
                                        <div
                                            onClick={() => deleteTask(item._id)}
                                            className="bg-red-500 cursor-pointer rounded-md w-10 h-10 flex items-center justify-center text-white"
                                        >
                                            <MdDelete />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
