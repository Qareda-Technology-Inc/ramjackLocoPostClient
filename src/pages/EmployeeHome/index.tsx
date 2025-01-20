import _ from "lodash";
import clsx from "clsx";
import fakerData from "@/utils/faker";
import Button from "@/components/Base/Button";
import { FormInput } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import LeafletMap from "@/components/LeafletMap";
import { Menu, Tab } from "@/components/Base/Headless";
import { useSelector } from 'react-redux';
import { RootState } from '@/stores/store';

function Main() {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <>
      <div className="relative">
        <div className="grid grid-cols-12 gap-6">
          <div className="z-20 col-span-12 xl:col-span-9 2xl:col-span-9">
            <div className="mt-6 -mb-6 intro-y">
            </div>
            <div className="grid grid-cols-12 mb-3 mt-14 sm:gap-10 intro-y">
              <div className="relative col-span-12 py-6 text-center sm:col-span-6 md:col-span-4 sm:pl-5 md:pl-0 lg:pl-5 sm:text-left">
                <div className="-mb-1 text-sm font-medium 2xl:text-base">
                  Hi {user?.firstName} {user?.lastName},{" "}
                  <span className="font-normal text-slate-600 dark:text-slate-300">
                    welcome back!
                  </span>
                </div>
                <div className="flex items-center justify-center text-base leading-3 2xl:text-lg sm:justify-start text-slate-600 dark:text-slate-300 mt-14 2xl:mt-24">
                  My Total Assignments
                  <Tippy
                    as="div"
                    content="Your total yearly assignments"
                  >
                    <Lucide
                      icon="AlertCircle"
                      className="w-5 h-5 ml-1.5 mt-0.5"
                    />
                  </Tippy>
                </div>
                <div className="mt-5 mb-3 2xl:flex">
                  <div className="flex items-center justify-center sm:justify-start">
                    <div className="relative pl-3 text-2xl font-medium leading-6 2xl:text-3xl 2xl:pl-4">
                      10
                    </div>
                    <a className="ml-4 text-slate-500 2xl:ml-16" href="">
                      <Lucide icon="RefreshCcw" className="w-4 h-4" />
                    </a>
                  </div>
                  <div className="mt-5 2xl:flex 2xl:justify-center 2xl:mt-0 2xl:-ml-20 2xl:w-14 2xl:flex-none 2xl:pl-2.5">
                    <Tippy
                      as="div"
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-white rounded-full cursor-pointer bg-success 2xl:text-sm 2xl:p-0 2xl:text-success 2xl:bg-transparent 2xl:flex 2xl:justify-center"
                      content="49% Higher than last month"
                    >
                      49%
                      <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                    </Tippy>
                  </div>
                </div>
                <div className="text-slate-500">Last updated 1 hour ago</div>
                <Menu className="mt-14 2xl:mt-24 w-44 2xl:w-52">
                  <Menu.Button
                    as={Button}
                    variant="primary"
                    rounded
                    className="relative justify-start w-full px-4"
                  >
                    Approve New Location
                    <span className="absolute top-0 bottom-0 right-0 flex items-center justify-center w-8 h-8 my-auto ml-auto mr-1">
                      <Lucide icon="ChevronDown" className="w-4 h-4" />
                    </span>
                  </Menu.Button>
                  <Menu.Items
                    placement="bottom-start"
                    className="w-44 2xl:w-52"
                  >
                    <Menu.Item>
                      <Lucide icon="FileText" className="w-4 h-4 mr-2" />
                      Obuase
                    </Menu.Item>
                    <Menu.Item>
                      <Lucide icon="FileText" className="w-4 h-4 mr-2" />
                      Daman
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </div>
              <div className="col-span-12 md:col-span-8 mt-3">
                <div className="flex items-center h-10 intro-x">
                  <h2 className="mr-5 text-lg font-medium truncate">
                    Employees Location
                  </h2>
                  <a href="" className="ml-auto truncate text-primary">
                    Show More
                  </a>
                </div>
                <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                  <div className="relative flex items-center mb-3 intro-x">
                    <div className="before:block before:absolute before:w-20 before:h-px before:bg-slate-200 before:dark:bg-darkmode-400 before:mt-5 before:ml-5">
                      <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                        <img
                          alt="Profile"
                          src={fakerData[9].photos[0]}
                        />
                      </div>
                    </div>
                    <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                      <div className="flex items-center">
                        <div className="font-medium">
                          {fakerData[9].users[0].name}
                        </div>
                        <div className="ml-auto text-xs text-slate-500">
                          07:00 PM
                        </div>
                      </div>
                      <div className="mt-1 text-slate-500">
                        Has changed{" "}
                        <a className="text-primary" href="">
                          {fakerData[9].products[0].name}
                        </a>{" "}
                        status to complete
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="top-0 right-0 z-30 grid w-full h-full grid-cols-12 gap-6 pb-6 -mt-8 xl:absolute xl:mt-0 xl:pb-0 xl:z-auto">
          <div className="z-30 col-span-12 xl:col-span-3 xl:col-start-10 xl:pb-16">
            <div className="flex flex-col h-full">
              <div className="p-5 mt-6 box bg-primary intro-x">
                <div className="flex flex-wrap gap-3">
                  <div className="mr-auto">
                    <div className="flex items-center leading-3 text-white text-opacity-70 dark:text-slate-300">
                      MY CURRENT LOCATION
                      <Tippy
                        as="div"
                        content="You are currently assigned here"
                      >
                        <Lucide icon="AlertCircle" className="w-4 h-4 ml-1.5" />
                      </Tippy>
                    </div>
                    <div className="text-white relative text-2xl font-medium leading-5 pl-4 mt-3.5">
                      BENIN
                    </div>
                  </div>
                  <a
                    className="flex items-center justify-center w-12 h-12 text-white bg-white rounded-full dark:bg-darkmode-300 bg-opacity-20 hover:bg-opacity-30"
                    href=""
                  >
                    <Lucide icon="Plus" className="w-6 h-6" />
                  </a>
                </div>
              </div>
              <div
                className={clsx([
                  "intro-x xl:min-h-0 relative mt-5",
                  "before:box before:absolute before:inset-x-3 before:mt-3 before:h-full before:bg-slate-50 before:content-['']",
                ])}
              >
                <div className="max-h-full xl:overflow-y-auto box">
                  <div className="top-0 px-5 pt-5 pb-6 xl:sticky">
                    <div className="flex items-center">
                      <div className="mr-5 text-lg font-medium truncate">
                        Upcoming Tasks
                      </div>
                      <a
                        href=""
                        className="flex items-center ml-auto text-primary"
                      >
                        <Lucide icon="RefreshCcw" className="w-4 h-4 mr-3" />
                        Refresh
                      </a>
                    </div>
                  </div>

                  <div className="px-5 pb-5">
                    <div className="grid grid-cols-12 gap-y-6">
                      <div className="col-span-12">
                        <div className="text-slate-500">Pending Approvals</div>
                        <div className="mt-1.5 flex items-center">
                          <div className="text-lg">5 Tasks</div>
                          <Tippy
                            as="div"
                            className="flex ml-2 text-xs font-medium cursor-pointer text-success"
                            content="20% Higher than last week"
                          >
                            20%
                            <Lucide
                              icon="ChevronUp"
                              className="w-4 h-4 ml-0.5"
                            />
                          </Tippy>
                        </div>
                      </div>
                      
                      <Button
                        variant="outline-secondary"
                        className="relative justify-start col-span-12 mb-2 border-dashed border-slate-300 dark:border-darkmode-300"
                      >
                        <span className="mr-5 truncate">
                          View All Tasks
                        </span>
                        <span className="w-8 h-8 absolute flex justify-center items-center right-0 top-0 bottom-0 my-auto ml-auto mr-0.5">
                          <Lucide icon="ArrowRight" className="w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={clsx([
          "z-40 grid grid-cols-12 gap-6 -mb-10 -mx-[16px] md:-mx-[22px] relative px-[22px] min-h-[400px] xl:-mt-5 2xl:-mt-8 2xl:z-10",
          "before:content-[''] before:rounded-t-[30px] xl:before:rounded-t-[30px] before:rounded-b-[30px] xl:before:shadow-[0px_3px_20px_#0000000b] before:w-full before:h-full before:bg-slate-100 before:absolute before:top-0 before:left-0 before:right-0 before:dark:bg-darkmode-700",
        ])}
      >
        <div className="relative col-span-12 2xl:col-span-9">
          <div className="gap-6">
            <div className="col-span-12 mt-6 xl:col-span-8">
              <div className="items-center block h-10 intro-y sm:flex">
                <h2 className="mr-5 text-lg font-medium truncate">
                  Employees Location
                </h2>
                <div className="relative mt-3 sm:ml-auto sm:mt-0 text-slate-500">
                  <Lucide
                    icon="MapPin"
                    className="absolute inset-y-0 left-0 z-10 w-4 h-4 my-auto ml-3"
                  />
                  <FormInput
                    type="text"
                    className="pl-10 sm:w-56 !box"
                    placeholder="Filter by city"
                  />
                </div>
              </div>
              <div className="p-5 mt-12 intro-y box sm:mt-5">
                <div>
                  250 Official Sites in 21 countries, click the marker to see
                  location details.
                </div>
                <LeafletMap className="h-[310px] mt-5 rounded-md bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
