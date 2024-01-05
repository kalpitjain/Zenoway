import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import LeftSidebar from "../components/LeftSidebar";
import NotificationBox from "../components/NotificationBox";
import Suggestionbar from "../components/Suggestionbar";
import { useAccount } from "wagmi";
import {
  readNotifications,
  clearNotifications,
} from "../functions/notificationFunctions";
import RefreshIcon from "@mui/icons-material/Refresh";

function Alert() {
  const [notifications, setNotifications] = useState([]);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const { address: userAddress } = useAccount();
  const [reloadComponent, setReloadComponent] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { notifications, notificationsCount } = await readNotifications(
        userAddress
      );
      setNotifications(notifications);
      setNotificationsCount(notificationsCount);
    }

    fetchData();
  }, [userAddress, reloadComponent]);

  async function handleClearNotifications() {
    await clearNotifications();
    setReloadComponent((prev) => !prev);
  }

  return (
    <>
      <Header />
      <LeftSidebar />
      <div
        className="clear-notification-button-container"
        onClick={handleClearNotifications}
      >
        {notificationsCount === 0 ? null : (
          <span className="clear-button">Clear Notifications</span>
        )}
      </div>
      <div
        style={{ paddingLeft: "5%", paddingRight: "5%" }}
        className="notification-container"
      >
        {notificationsCount === 0 ? (
          <div className="warning notification-warning">
            <span
              onClick={() => {
                setReloadComponent((prev) => !prev);
              }}
            >
              <RefreshIcon
                style={{
                  transform: "scale(2)",
                  margin: "1.5rem",
                  cursor: "pointer",
                }}
              />
            </span>
            <br />
            <span style={{ cursor: "pointer" }}>No Notifications Yet...</span>
          </div>
        ) : (
          notifications
            .slice(0)
            .reverse()
            .map((notification, index) => (
              <NotificationBox
                key={index}
                address={notification.userAddress}
                action={notification.action}
                time={notification.time.toNumber()}
              />
            ))
        )}
      </div>
      <Suggestionbar />
    </>
  );
}

export default Alert;
