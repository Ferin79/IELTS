import React, { useState, useContext, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { AiOutlineClose } from "react-icons/ai";
import { MdNotificationsNone } from "react-icons/md";
import { IconContext } from "react-icons";
import sidebarDataFunction from "./sidebarData";
import firebase from "../data/firebase";
import { Context } from "../data/context";

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { institution } = useContext(Context);
  const sidebarData = sidebarDataFunction();

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("notifications")
      .where("institute_id", "==", institution)
      .orderBy("createdAt", "desc")
      .onSnapshot((snapshot) => {
        const changes = snapshot.docChanges();
        const oldNotifications = notifications;
        changes.forEach((change) => {
          oldNotifications.push(change.doc.data());
        });
        setNotifications([...oldNotifications]);
      });

    return () => {
      unsubscribe();
    };
  }, [institution, notifications]);

  return (
    <>
      <IconContext.Provider
        value={{
          color: "#FFF",
        }}
      >
        <div className="navbar">
          <FiMenu
            className="menu-bars"
            onClick={() => {
              document.querySelector(".nav-menu").classList.add("active");
              setSidebar(true);
            }}
          />
          <Link to="/" className="menu-bars">
            <h5>IELTS PREPS</h5>
          </Link>

          {firebase.auth().currentUser ? (
            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic">
                <MdNotificationsNone size={25} />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {notifications.length ? (
                  notifications.map((item, index) => {
                    return (
                      <div key={index}>
                        <Dropdown.Item>
                          <h6>{item.title}</h6>
                          <p>{item.body}</p>
                        </Dropdown.Item>
                        <Dropdown.Divider />
                      </div>
                    );
                  })
                ) : (
                  <span></span>
                )}
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <span></span>
          )}
        </div>

        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items">
            <li className="navbar-toggle">
              <AiOutlineClose
                className="menu-bars"
                onClick={() => {
                  document
                    .querySelector(".nav-menu")
                    .classList.remove("active");
                  setSidebar(false);
                }}
              />
            </li>
            <li className="user-name-info">
              <p>Welcome,</p>
              <h5>
                {firebase.auth().currentUser
                  ? firebase.auth().currentUser.email
                  : "Guest"}
              </h5>
            </li>
            {sidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
};

export default Header;
