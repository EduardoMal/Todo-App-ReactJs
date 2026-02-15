import { useContext, useState, useEffect, Fragment } from "react";
import Profile from "../components/Auth/Profile";
import TasksStore from "../store/tasks-store";
import Overlay from "../components/UI/Overlay";
import ErrorModal from "../components/UI/ErrorModal";
import { USER_PROFILE_DATA_URL, API_KEY } from "../utils/config/config";

const ProfilePage = function () {
  const [err, setErr] = useState(null);
  const tasksCtx = useContext(TasksStore);
  const { token, updateProfile } = tasksCtx;

  useEffect(() => {
    (async () => {
      const url = `${USER_PROFILE_DATA_URL}${API_KEY}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          idToken: token,
        }),
      });

      if (!response.ok) {
        let errorMessage = "Error fetching data.";
        const errData = await response.json();
        if (errData && errData.error.message) {
          errorMessage = `${errData.error.code}: ${errData.error.message}`;
        }
        setErr(errorMessage);
      } else {
        const respData = await response.json();
        updateProfile({
          displayName: respData.users[0].displayName,
          email: respData.users[0].email,
        });
      }
    })();
  }, [token, updateProfile]);

  if (err) {
    return (
      <Fragment>
        <Overlay onClick={() => setErr(null)} />
        <ErrorModal text={err} />
      </Fragment>
    );
  }

  return (
    <Profile
      name={tasksCtx.profile.displayName || ""}
      email={tasksCtx.profile.email || ""}
      image={tasksCtx.profile.photoUrl || ""}
      onLogOut={tasksCtx.logout}
    />
  );
};

export default ProfilePage;
