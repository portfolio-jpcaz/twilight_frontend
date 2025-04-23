import "@/styles/globals.css";
import styles from "@/styles/HomeLayout.module.css";
import Link from "next/link";
import Image from "next/image";
import LogoutButton from "@/components/auth/logoutButton";
import { LOGO_PATH } from "../constants";
import Trends from "@/components/ui/Trends"
export const metadata = {
  title: "Twitter Light application",
  description: "User Dashboard for the Twitter Light application",
  icons: {
    icon: "/logo-black.ico",
  },
};

export default function HomeLayout({ children }) {
  console.log(__filename);

  return (
    <html lang="en">
      <body className={styles.dashboard} suppressHydrationWarning>
        <div className={styles.dashboardLeft}>
          <Link href="/home">
            <Image
              className={styles.logo}
              src={LOGO_PATH}
              alt="Twilight application logo :white twitter bird upside down"
              width={40}
              height={40}
            />
          </Link>
          <LogoutButton />
        </div>
        <div className={styles.dashboardMiddle}>{children}</div>
        <div className={styles.dashboardRight}>
          <h2 className="txt-primary-color font-text txt-large">Trends</h2>
          <Trends/>
        </div>
      </body>
    </html>
  );
}
