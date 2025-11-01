import { useState } from "react";
import useMutation from "../api/useMutation";

/** Form for a user to create a new activity with a name and description. */
export default function ActivityForm() {
  const { mutate, error } = useMutation("/activities", "POST", ["activities"]);

  const tryCreateActivity = async (formData) => {
    const name = formData.get("name");
    const description = formData.get("description");

    try {
      await mutate({ name, description });
      // Clear the form on success
      formData.target.reset();
    } catch (e) {
      // Error is already in state from useMutation
    }
  };

  return (
    <>
      <h2>Add a new activity</h2>
      <form action={tryCreateActivity}>
        <label>
          Name
          <input type="text" name="name" required />
        </label>
        <label>
          Description
          <input type="text" name="description" required />
        </label>
        <button>Add activity</button>
      </form>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
