import useQuery from "../api/useQuery";
import { useAuth } from "../auth/AuthContext";

import ActivityList from "./ActivityList";
import ActivityForm from "./ActivityForm";

export default function ActivitiesPage() {
  const { token } = useAuth();
  const {
    data: activities,
    loading,
    error,
  } = useQuery("/activities", "activities");

  if (loading) return <p>Loading activities...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <>
      <h1>Activities</h1>
      <ActivityList activities={activities || []} />
      {token && <ActivityForm />}
    </>
  );
}
