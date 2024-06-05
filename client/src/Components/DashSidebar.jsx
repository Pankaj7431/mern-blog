import React, { useEffect, useState } from "react";
import { Sidebar } from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { signOutSuccess } from "../Redux/User/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function DashSideBar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [tab, setTab] = useState("");
  const { currentUser} = useSelector((state) => state.user);
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignOut = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className="w-full md:w-56">
      <Sidebar.ItemGroup>
        <Link to={"/dashboard?tab=profile"}>
          <Sidebar.Item
            active={tab === "profile"}
            icon={HiUser}
            label={currentUser.isAdmin ?  "Admin" : "User"}

            className="cursor-pointer"
            as="div"
          >
            Profile
          </Sidebar.Item>
        </Link>

        <Sidebar.Item
          icon={HiArrowSmRight}
          onClick={handleSignOut}
          className="cursor-pointer"
        >
          Sign Out
        </Sidebar.Item>
      </Sidebar.ItemGroup>
    </Sidebar>
  );
}
