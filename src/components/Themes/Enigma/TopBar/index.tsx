import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import Lucide from "@/components/Base/Lucide";
import logoUrl from "@/assets/images/logoSingle.png";
import Breadcrumb from "@/components/Base/Breadcrumb";
import { FormInput } from "@/components/Base/Form";
import { Menu, Popover } from "@/components/Base/Headless";
import _ from "lodash";
import clsx from "clsx";
import { logout } from "@/stores/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "@/stores/store";
import api from "@/api/axios";

function Main(props: { layout?: "side-menu" }) {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [searchDropdown, setSearchDropdown] = useState(false);

  const user = useSelector((state: RootState) => state.auth.user);

  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };
  const token = localStorage.getItem('token');

  const handleLogout = async () => {
    try {
      await api.post('/users/logout', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(logout());
      navigate("/login");
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  const handleViewProfile = () => {
    if (user?._id) {
      navigate(`/profile/${user._id}`);
    }
  };


  const handleChangePassword = () => {
    navigate('/change-password');
  };

  return (
    <>
      <div
        className={clsx([
          "h-[70px] md:h-[65px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:fixed md:inset-x-0 md:top-0 sm:px-8 md:px-10 md:pt-10 md:bg-gradient-to-b md:from-slate-100 md:to-transparent dark:md:from-darkmode-700",
          "before:content-[''] before:absolute before:h-[65px] before:inset-0 before:top-0 before:mx-7 before:bg-primary/30 before:mt-3 before:rounded-xl before:hidden before:md:block before:dark:bg-darkmode-600/30",
          "after:content-[''] after:absolute after:inset-0 after:h-[65px] after:mx-3 after:bg-primary after:mt-5 after:rounded-xl after:shadow-md after:hidden after:md:block after:dark:bg-darkmode-600",
        ])}
      >
        <div className="flex items-center h-full">
          {/* BEGIN: Logo */}
          <Link
            to="/"
            className={clsx([
              "-intro-x hidden md:flex",
              props.layout == "side-menu" && "xl:w-[180px]",
            ])}
          >
            <img
              alt="Qaretech Innovative"
              className="w-6"
              src={logoUrl}
            />
            <span
              className={clsx([
                "ml-3 text-lg text-white",
                props.layout == "side-menu" && "hidden xl:block",
              ])}
            >
              {" "}
              RTS{" "}
            </span>
          </Link>
          {/* END: Logo */}

          {/* BEGIN: Breadcrumb */}
          <Breadcrumb
            light
            className={clsx([
              "h-[45px] md:ml-10 md:border-l border-white/[0.08] dark:border-white/[0.08] mr-auto -intro-x",
              
            ])}
          >
            <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
            <Breadcrumb.Link to="/" active={true}>
              Dashboard
            </Breadcrumb.Link>
          </Breadcrumb>
          {/* END: Breadcrumb */}

          {/* BEGIN: Search */}
          <div className="relative mr-3 intro-x sm:mr-6">
            <div className="relative hidden sm:block">
              <FormInput
                type="text"
                className="border-transparent w-56 shadow-none rounded-full bg-slate-200 pr-8 transition-[width] duration-300 ease-in-out focus:border-transparent focus:w-72 dark:bg-darkmode-400"
                placeholder="Search..."
                onFocus={showSearchDropdown}
                onBlur={hideSearchDropdown}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-5 h-5 my-auto mr-3 text-slate-600 dark:text-slate-500"
              />
            </div>
            <a className="relative text-white/70 sm:hidden" href="">
              <Lucide icon="Search" className="w-5 h-5 dark:text-slate-500" />
            </a>
          </div>
          {/* END: Search */}

          {/* BEGIN: Notifications */}
          <Popover className="mr-4 intro-x sm:mr-6">
            <Popover.Button
              className="
              relative text-white/70 outline-none block
              before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger
            "
            >
              <Lucide icon="Bell" className="w-5 h-5 dark:text-slate-500" />
            </Popover.Button>
            <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
              <div className="mb-5 font-medium">Notifications</div>
              
            </Popover.Panel>
          </Popover>
          {/* END: Notifications */}

          {/* BEGIN: Account Menu */}
          <Menu>
            <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
              <img
                alt="Qaretech Innovative"
                src={user?.image ? user?.image : logoUrl}
              />
            </Menu.Button>
            <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
              <Menu.Header className="font-normal">
                <div className="font-medium">{`${user?.firstName} ${user?.lastName}` || "Guest"}</div>
                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                  {user?.role}
                </div>
              </Menu.Header>
              <Menu.Divider className="bg-white/[0.08]" />
              <Menu.Item onClick={handleViewProfile} className="hover:bg-white/5">
                <Lucide icon="User" className="w-4 h-4 mr-2" /> Profile
              </Menu.Item>
              <Menu.Item onClick={handleChangePassword} className="hover:bg-white/5">
                <Lucide icon="Lock" className="w-4 h-4 mr-2" /> Change Password
              </Menu.Item>
              <Menu.Item className="hover:bg-white/5">
                <Lucide icon="HelpCircle" className="w-4 h-4 mr-2" /> Help
              </Menu.Item>
              <Menu.Divider className="bg-white/[0.08]" />
              <Menu.Item className="hover:bg-white/5" onClick={handleLogout} >
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Logout
              </Menu.Item>
            </Menu.Items>
          </Menu>
          {/* END: Account Menu */}
        </div>
      </div>
    </>
  );
}

export default Main;
