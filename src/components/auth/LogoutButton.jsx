"use client";
import { EGG_PATH } from "@/app/constants";
import styles from "./LogoutButton.module.css";
import Image from "next/image";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector } from "react-redux";
import MsgModal from "../ui/MsgModal";

export default function LogoutButton() {
  const router = useRouter();
  const [msg, setMsg] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const loggedInUser = useSelector((state) => state.user.user);
  const firstname = loggedInUser? loggedInUser.firstname : "";
  const username=loggedInUser? loggedInUser.username : "";
  const handleMouseEnter = (e) => {
    setShowTooltip(true);
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };
  const handleLogout = async () => {
    const response = await logout();
    if (!response.result) {
      setMsg(response.message);
    }
    router.replace("/auth");
  };
  return (
    <>
      <div className={styles.logout}>
        <MsgModal
          isOpen={msg != null}
          setMsg={setMsg}
          title="Logout Error"
          message={msg}
        />
        <Image
          className="pointer"
          src={EGG_PATH}
          alt="Twitter-like egg logo"
          width={50}
          height={50}
          onClick={handleLogout}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        />

        <div>
          <p className="font-text txt-small txt-primary-color txt-bold">
            {firstname}
          </p>
          <p className="font-text txt-small txt-greyed-color">
            @{username}
          </p>
        </div>
      </div>
      {showTooltip && (
        <div
          className={`${styles.tooltip} txt-small font-text`}
          style={{
            left: mousePosition.x,
            top: mousePosition.y - 40,
          }}
        >
          Logout
        </div>
      )}
    </>
  );
}
