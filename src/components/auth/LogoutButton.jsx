"use client";
import { EGG_PATH } from "@/app/constants";
import styles from "./LogoutButton.module.css";
import Image from "next/image";
import { logout } from "@/services/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MsgModal from "../ui/MsgModal";

export default function LogoutButton() {
  const router = useRouter();
  const [msg, setMsg] = useState(null);
  const handleLogout = async () => {
    const response = await logout();
    if (!response.result) {
      setMsg(response.message);
    }
    router.replace("/auth");
  };
  return (
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
      />
      <div>
        <p className="font-text txt-small txt-primary-color txt-bold">John</p>
        <p className="font-text txt-small txt-greyed-color">@JohnCena</p>
      </div>
    </div>
  );
}
