"use client";
import { EGG_PATH } from "@/app/constants";
import styles from "./LogoutButton.module.css"
import Image from "next/image";

import { useRouter } from "next/navigation";
export default function LogoutButton() {
    const router = useRouter();
    const handleLogout = ()=>{
        router.replace("/");
    }
  return (
    <div className={styles.logout}>
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
