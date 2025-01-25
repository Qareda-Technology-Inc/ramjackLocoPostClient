import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Site } from "@/types/site";
import api from "@/api/axios";
import { LoadingTag } from "@/components/Loading";
// import { showNotification } from "@/components/ShowMessage"; // Adjust the path accordingly
// ... import other components

function Main() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [site, setSite] = useState<Site | null>(null);

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const { data } = await api.get(`/sites/${id}`);
        setSite(data);
      } catch (error) {
        console.error("Error fetching site:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [id]);

  const onSubmit = async (formData: any) => {
    try {
      await api.put(`/sites/${id}`, formData);
      navigate('/sites');
      // showNotification(true, "Site updated successfully");
    } catch (error) {
      console.error("Error updating site:", error);
      // showNotification(false, "Failed to update site");
    }
  };

  if (loading) return <LoadingTag />;
  if (!site) return <div>Site not found</div>;

  // Use the same form as AddSite but with pre-filled values
  return (
    <div className="mt-5">
      <h2 className="text-2xl font-medium">Edit Site: {site.name}</h2>
      {/* Copy the form from AddSite and set defaultValue/value for each field */}
    </div>
  );
}

export default Main; 