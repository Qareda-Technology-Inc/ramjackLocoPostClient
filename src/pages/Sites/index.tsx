import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import Button from "@/components/Base/Button";;
import { FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import Tippy from "@/components/Base/Tippy";
import { Dialog, Menu } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import api from "@/api/axios";
import { Site } from "@/types/site";
import imageUrl from '@/assets/images/logoSingle.png';
import { useNavigate } from "react-router-dom";
import { LoadingTag } from "@/components/Loading";
import Notification from "@/components/Base/Notification";


function Main() {
  const navigate = useNavigate();
  const [sites, setSites] = useState<Site[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"success" | "error">("success");
  const deleteButtonRef = useRef(null);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);

  const handleNotification = (type: "success" | "error", message: string) => {
    setNotificationType(type);
    setNotificationMessage(message);
    setShowNotification(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter users based on search query
  const filteredSites = sites.filter(site =>
    site.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
    site.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchSites = async () => {
      try {
        setLoading(true);
        const { data } = await api.get("/sites/list", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setSites(data);
      } catch (error) {
        console.error(error);
        handleNotification('error', 'Failed to fetch sites');
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [token]);

  const handleAddSite = () => {
    navigate("/add-site");
  };

  const viewSite = (site: Site) => {
    navigate(`/view-site/${site._id}`, {state: {site: site}});
  };

  const editSite = (siteId: string) => {
    navigate(`/edit-site/${siteId}`);
  };

  const deleteSite = async () => {
    if (!selectedSite) return;
    
    try {
      await api.delete(`/sites/${selectedSite._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Remove site from state
      setSites(sites.filter(site => site._id !== selectedSite._id));
      setDeleteConfirmationModal(false);
      handleNotification('success', 'Site deleted successfully');
    } catch (error) {
      console.error("Error deleting site:", error);
      handleNotification('error', 'Failed to delete site');
    }
  };

  return (
    <> 
    {loading ? (<LoadingTag />) : (
    <>
      <h2 className="mt-10 text-lg font-medium intro-y">Site List</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
          <Button variant="primary" className="mr-2 shadow-md" onClick={handleAddSite}>
            Add New Site
          </Button>
          <div className="hidden mx-auto md:block text-slate-500">
            Showing Sites
          </div>
          <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
            <div className="relative w-56 text-slate-500">
              <FormInput
                type="text"
                className="w-56 pr-10 !box"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
          </div>
        </div>
        {/* BEGIN: Data List */}
        <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
          <Table className="border-spacing-y-[10px] border-separate -mt-2">
            <Table.Thead>
              <Table.Tr>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  IMAGE
                </Table.Th>
                <Table.Th className="border-b-0 whitespace-nowrap">
                  SITE NAME
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  LOCATION
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  COUNTRY
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  DESCRIPTION
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  STATUS
                </Table.Th>
                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                  ACTIONS
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {filteredSites.map((site, id) => (
                <Table.Tr key={id} className="intro-x">
                  <Table.Td className="box w-40 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    <div className="flex">
                      <div className="w-10 h-10 image-fit zoom-in">
                        <Tippy
                          as="img"
                          alt="Qaretech Innovative"
                          className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                          src={site.image ? site.image : imageUrl}
                          content={`Uploaded at ${site.location}`}
                        />
                      </div>
                    </div>
                  </Table.Td>
                  <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    <a 
                      href="#" 
                      onClick={(event) => {
                        event.preventDefault();
                        viewSite(site);
                      }} className="font-medium whitespace-nowrap">
                      {site.name}
                    </a>
                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                      {site.location}
                    </div>
                  </Table.Td>
                  <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    {site.location}
                  </Table.Td>
                  <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    {site.country}
                  </Table.Td>
                  <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    {site.description}
                  </Table.Td>
                  <Table.Td className="box w-40 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                    <div
                      className={clsx([
                        "flex items-center justify-center",
                        { "text-success": site.active },
                        { "text-danger": !site.active },
                      ])}
                    >
                      <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                      {site.active ? "Active" : "Inactive"}
                    </div>
                  </Table.Td>
                  <Table.Td
                    className={clsx([
                      "box w-56 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600",
                      "before:absolute before:inset-y-0 before:left-0 before:my-auto before:block before:h-8 before:w-px before:bg-slate-200 before:dark:bg-darkmode-400",
                    ])}
                  >
                    <div className="flex items-center justify-center">
                      <a 
                        className="flex items-center mr-3" 
                        href="#" 
                        onClick={(event) => {
                          event.preventDefault();
                          editSite(site._id);
                        }}>
                        <Lucide icon="CheckSquare" className="w-4 h-4 mr-1" />{" "}
                        Edit
                      </a>
                      <a
                        className="flex items-center text-danger"
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          setSelectedSite(site);
                          setDeleteConfirmationModal(true);
                        }}
                      >
                        <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
                      </a>
                    </div>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </div>
        {/* END: Data List */}
      </div>
      </>
        
    )}


      {/* BEGIN: Delete Confirmation Modal */}
      <Dialog
        open={deleteConfirmationModal}
        onClose={() => {
          setDeleteConfirmationModal(false);
        }}
        initialFocus={deleteButtonRef}
      >
        <Dialog.Panel>
          <div className="p-5 text-center">
            <Lucide
              icon="XCircle"
              className="w-16 h-16 mx-auto mt-3 text-danger"
            />
            <div className="mt-5 text-3xl">Are you sure?</div>
            <div className="mt-2 text-slate-500">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <Button
              variant="outline-secondary"
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false);
              }}
              className="w-24 mr-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              type="button"
              className="w-24"
              ref={deleteButtonRef}
              onClick={deleteSite}
            >
              Delete
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
      {/* END: Delete Confirmation Modal */}

      <Notification
        show={showNotification}
        type={notificationType}
        message={notificationMessage}
        onClose={() => setShowNotification(false)}
        duration={3000}
      />
    </>
  );
}

export default Main;
