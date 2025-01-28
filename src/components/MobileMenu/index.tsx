import "@/assets/css/vendors/simplebar.css";
import "@/assets/css/components/mobile-menu.css";
import { Transition } from "react-transition-group";
import { useState, useEffect, createRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toRaw } from "@/utils/helper";
import { selectMenu } from "@/stores/menuSlice";
import { selectTheme } from "@/stores/themeSlice";
import { useAppSelector } from "@/stores/hooks";
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./mobile-menu";
import Lucide from "@/components/Base/Lucide";
import logoUrl from "@/assets/images/logoSingle.png";
import clsx from "clsx";
import SimpleBar from "simplebar";
import { icons } from "lucide-react";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

function Main() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formattedMenu, setFormattedMenu] = useState<
    Array<FormattedMenu | "divider">
  >([]);
  const themeStore = useAppSelector(selectTheme);
  const menuStore = useAppSelector(selectMenu(themeStore.layout));
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const scrollableRef = createRef<HTMLDivElement>();

  const mobileMenu = () => {
    const baseMenu = nestedMenu(toRaw(menuStore), location);
    
    if (!user?.role) {
      return baseMenu;
    }

    return baseMenu.filter(item => {
      if (item === "divider") return true;

      if (user.role === "ADMIN") {
        const adminExcludedTitles = ['Assignment', 'Task Assignment'];
        return !adminExcludedTitles.includes(item.title);
      }

      if (user.role === "FIELD-TECHNICIAN" && item instanceof Object) {
        if (item.subMenu) {
          return item.title === "Assignment";
        }

        const allowedPaths = ['/', '/my-assignments', '/my-tasks', '/my-kpis', '/notification', '/support'];
        const isAllowed = item.pathname ? allowedPaths.includes(item.pathname) : false;
        return isAllowed;
      }

      if ((user.role === "MANAGER" || user.role === "SITE-REP") && item instanceof Object) {
        if (item.subMenu) {
          return item.title === "Assignments" || item.title === "Sites" || 
                 item.title === "Employees" || item.title === "Tasks and KPIs";
        }

        const allowedPaths = ['/', '/assignments', '/notification'];
        const isAllowed = item.pathname ? allowedPaths.includes(item.pathname) : false;
        return isAllowed;
      }

      return false;
    });
  };

  useEffect(() => {
    if (scrollableRef.current) {
      new SimpleBar(scrollableRef.current);
    }
    setFormattedMenu(mobileMenu());
  }, [menuStore, location.pathname, user?.role]);

  return (
    <>
      {/* BEGIN: Mobile Menu */}
      <div
        className={clsx([
          "mobile-menu group top-0 inset-x-0 fixed bg-theme-1/90 z-[60] border-b border-white/[0.08] dark:bg-darkmode-800/90 md:hidden",
          "before:content-[''] before:w-full before:h-screen before:z-10 before:fixed before:inset-x-0 before:bg-black/90 before:transition-opacity before:duration-200 before:ease-in-out",
          "before:invisible before:opacity-0",
          "[&.mobile-menu--active]:before:visible [&.mobile-menu--active]:before:opacity-100",
          activeMobileMenu && "mobile-menu--active",
        ])}
      >
        <div className="h-[70px] px-3 sm:px-8 flex items-center">
          <a href="" className="flex mr-auto">
            <img
              alt="Qaretech Innovative"
              className="w-6"
              src={logoUrl}
            />
          </a>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Lucide
              icon="BarChart2"
              className="w-8 h-8 text-white transform -rotate-90"
              onClick={() => {
                setActiveMobileMenu(!activeMobileMenu);
              }}
            />
          </a>
        </div>
        <div
          ref={scrollableRef}
          className={clsx([
            "h-screen z-20 top-0 left-0 w-[270px] -ml-[100%] bg-primary transition-all duration-300 ease-in-out dark:bg-darkmode-800",
            "[&[data-simplebar]]:fixed [&_.simplebar-scrollbar]:before:bg-black/50",
            "group-[.mobile-menu--active]:ml-0",
          ])}
        >
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            className={clsx([
              "fixed top-0 right-0 mt-4 mr-4 transition-opacity duration-200 ease-in-out",
              "invisible opacity-0",
              "group-[.mobile-menu--active]:visible group-[.mobile-menu--active]:opacity-100",
            ])}
          >
            <Lucide
              icon="XCircle"
              className="w-8 h-8 text-white transform -rotate-90"
              onClick={() => {
                setActiveMobileMenu(!activeMobileMenu);
              }}
            />
          </a>
          <ul className="py-2">
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == "divider" ? (
                <li className="my-6 menu__divider" key={menuKey}></li>
              ) : (
                <li key={menuKey}>
                  <a
                    href={menu.subMenu ? "#" : menu.pathname}
                    className={clsx([
                      menu.active ? "menu menu--active" : "menu",
                    ])}
                    onClick={(event) => {
                      event.preventDefault();
                      linkTo(menu, navigate, setActiveMobileMenu);
                      setFormattedMenu([...formattedMenu]);
                    }}
                  >
                    <div className="menu__icon">
                      <Lucide icon={menu.icon as keyof typeof icons} />
                    </div>
                    <div className="menu__title">
                      {menu.title}
                      {menu.subMenu && (
                        <div
                          className={clsx([
                            "menu__sub-icon",
                            menu.activeDropdown && "transform rotate-180",
                          ])}
                        >
                          <Lucide icon="ChevronDown" />
                        </div>
                      )}
                    </div>
                  </a>
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={clsx({
                          "menu__sub-open": menu.activeDropdown,
                        })}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <a
                              href={subMenu.subMenu ? "#" : subMenu.pathname}
                              className={clsx([
                                subMenu.active ? "menu menu--active" : "menu",
                              ])}
                              onClick={(event) => {
                                event.preventDefault();
                                linkTo(subMenu, navigate, setActiveMobileMenu);
                                setFormattedMenu([...formattedMenu]);
                              }}
                            >
                              <div className="menu__icon">
                                <Lucide icon={subMenu.icon as keyof typeof icons} />
                              </div>
                              <div className="menu__title">
                                {subMenu.title}
                                {subMenu.subMenu && (
                                  <div
                                    className={clsx([
                                      "menu__sub-icon",
                                      subMenu.activeDropdown &&
                                        "transform rotate-180",
                                    ])}
                                  >
                                    <Lucide icon="ChevronDown" />
                                  </div>
                                )}
                              </div>
                            </a>
                            
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={clsx({
                                    "menu__sub-open": subMenu.activeDropdown,
                                  })}
                                >
                                  {subMenu.subMenu.map(
                                    (lastSubMenu, lastSubMenuKey) => (
                                      <li key={lastSubMenuKey}>
                                        <a
                                          href={
                                            lastSubMenu.subMenu
                                              ? "#"
                                              : lastSubMenu.pathname
                                          }
                                          className={clsx([
                                            lastSubMenu.active
                                              ? "menu menu--active"
                                              : "menu",
                                          ])}
                                          onClick={(event) => {
                                            event.preventDefault();
                                            linkTo(
                                              lastSubMenu,
                                              navigate,
                                              setActiveMobileMenu
                                            );
                                            setFormattedMenu([
                                              ...formattedMenu,
                                            ]);
                                          }}
                                        >
                                          <div className="menu__icon">
                                            <Lucide icon={lastSubMenu.icon as keyof typeof icons} />
                                          </div>
                                          <div className="menu__title">
                                            {lastSubMenu.title}
                                          </div>
                                        </a>
                                      </li>
                                    )
                                  )}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>
        </div>
      </div>
      {/* END: Mobile Menu */}
    </>
  );
}

export default Main;
