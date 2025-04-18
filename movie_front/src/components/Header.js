import React, { useEffect, useState } from "react";
import logo from "../assets/logos.png";
import user from "../assets/profile.png";
import { FaSearch } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";

const Header = () => {
  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const navigation = [
    {
      label: "Movies",
      href: "movie",
    },
  ];

  useEffect(() => {
    if (searchInput) {
      navigate(`/search?q=${searchInput}`);
    } else {
      navigate("");
    }
  }, [searchInput]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <header className="fixed top-0 w-full h-16 bg-black bg-opacity-75 z-40">
      <div className="container mx-auto px-3 flex items-center h-full">
        <Link to={"/"}>
          <img src={logo} alt="logo" width={180} />
        </Link>

        <nav className="flex items-center gap-1 ml-8 text-lg mt-4">
          {navigation.map((nav, index) => {
            return (
              <div>
                <NavLink
                  key={nav.label}
                  to={nav.href}
                  className={({ isActive }) =>
                    `px-3 hover:text-neutral-100 ${
                      isActive && "text-neutral-100"
                    }`
                  }
                >
                  {nav.label}
                </NavLink>
              </div>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-10">
          <form className="flex items-center gap-2" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Search here...."
              className="bg-transparent px-4 py-1 outline-none border-none"
              onChange={(e) => setSearchInput(e.target.value)}
              value={searchInput}
            />
            <button className="text-2xl text-white">
              <FaSearch />
            </button>
          </form>

          <div className="w-11 h-11 cursor-pointer active:scale-50 transition-all">
            <img src={user} alt="profile" className="w-ful h-full" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
