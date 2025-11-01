import { useAuth } from "../auth/AuthContext";
import useMutation from "../api/useMutation";

export default function ActivityList({ activities }) {
  const { token } = useAuth();

  return (
    <ul>
      {activities.map((activity) => (
        <ActivityItem key={activity.id} activity={activity} token={token} />
      ))}
    </ul>
  );
}

function ActivityItem({ activity, token }) {
  const { mutate, error } = useMutation(
    `/activities/${activity.id}`,
    "DELETE",
    ["activities"]
  );

  const handleDelete = async () => {
    try {
      await mutate();
    } catch (e) {
      // Error is already in state from useMutation
    }
  };

  return (
    <li>
      {activity.name}
      {token && (
        <>
          {" "}
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
      {error && <p role="alert">{error}</p>}
    </li>
  );
}
