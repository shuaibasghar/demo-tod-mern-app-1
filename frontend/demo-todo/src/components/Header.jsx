import React, { useContext, useState } from "react";

import userImage from "../assets/user.png";
import { FaList } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LuLogOut } from "react-icons/lu";
import { CgClose } from "react-icons/cg";
import { AuthContext } from "../contexts/authContext";
import api from "../utils/api";
const navLinks = [
    {
        id: 1,
        title: "Home",
        link: "/",
    },
    {
        id: 2,
        title: "Add Task",
        link: "/add-task",
    },
];

const Header = () => {
    const { pathname } = useLocation();
    const [showSidebar, setshowSidebar] = React.useState(false);
    const [showDropDown, setShowDropDown] = useState(false);
    const [state, setState] = useContext(AuthContext);
    const navigate = useNavigate();
    const handleLogout = async () => {
        try {
            const response = await api.get("/logout", {
                withCredentials: true,
            });
            if (response?.data) {
                alert(response.data.message);
            }
            localStorage.removeItem("data");

            setState({});
            navigate("/");
        } catch (error) {
            alert(error?.response?.data?.error);
        }
    };
    return (
        <header className="bg-white shadow-lg   ">
            <div className="lg:w-[90%] w-[85%] py-2 mx-auto flex items-center justify-between">
                {/* logo */}
                <h1
                    onClick={() => navigate("/")}
                    className=" text-blue-500 text-3xl font-extrabold"
                >
                    TODO
                </h1>
                <nav className="nav">
                    {navLinks.map((link) => (
                        <li className="nav-item  " key={link.id}>
                            <Link
                                to={link.link}
                                className={`p-2 block  ${
                                    pathname === link.link
                                        ? "text-blue-500"
                                        : "text-slate-600"
                                } `}
                            >
                                {link.title}
                            </Link>
                        </li>
                    ))}
                </nav>
                {/* user */}
                <div
                    className="cursor-pointer md-lg:hidden flex  items-center justify-center gap-2 "
                    onClick={() => setShowDropDown(!showDropDown)}
                >
                    <img className="w-10 h-10" src={userImage} alt="user" />
                    <div>
                        <h3>{state.user?.email}</h3>
                        <h3>{state.user?.name}</h3>
                    </div>
                </div>

                <div
                    onClick={() => setshowSidebar(false)}
                    className="w-[30px] h-[30px] bg-blue-500 text-white  items-center justify-center lg:hidden xl:hidden md-lg:flex hidden    "
                >
                    <span>
                        <FaList />
                    </span>
                </div>
            </div>
            {/* Dropdown Menu */}
            {showDropDown && (
                <div className="absolute right-32 mt-1 w-30 bg-white border border-gray-200 shadow-md rounded-md">
                    <div
                        onClick={handleLogout}
                        className="py-2 px-4 hover:bg-gray-100 cursor-pointer"
                    >
                        <LuLogOut className="inline-block mr-2 text-red-500" />
                        Logout
                    </div>
                </div>
            )}
            <div className="hidden md-lg:block">
                <div
                    onClick={() => setshowSidebar(true)}
                    className={`overlay ${
                        showSidebar ? "invisible" : "visible"
                    }`}
                ></div>
                <div
                    className={`sidebar ${
                        showSidebar ? "-left-[300px] " : "left-0 top-0"
                    }`}
                >
                    <h1
                        onClick={() => navigate("/")}
                        className="flex items-center justify-center text-blue-500 text-3xl font-extrabold"
                    >
                        TODO
                    </h1>
                    <nav className="nav-sidebar">
                        {navLinks.map((link) => (
                            <li className="nav-item  " key={link.id}>
                                <Link
                                    to={link.link}
                                    className={`p-2 block  ${
                                        pathname === link.link
                                            ? "text-blue-500"
                                            : "text-slate-600"
                                    } `}
                                >
                                    {link.title}
                                </Link>
                            </li>
                        ))}
                    </nav>
                    {/* user */}
                    <div className="mt-5 mb-5 flex  items-center justify-start gap-2 font-semibold text-md text-slate-600">
                        <img className="w-10 h-10" src={userImage} alt="user" />
                        <div>
                            <h3>{state.user.email}</h3>
                            <h3>{state.user.name}</h3>
                        </div>
                    </div>
                    <div className="flex items-center justify-start gap-2">
                        <div
                            onClick={handleLogout}
                            className="w-[20px] h-[20px] cursor-pointer bg-red-500 text-white  items-center justify-center lg:hidden xl:hidden md-lg:flex hidden    "
                        >
                            <span>
                                <LuLogOut />
                            </span>
                        </div>
                        <p>Logout</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
