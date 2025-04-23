import "@/styles/globals.css"
import styles from "@/styles/LoginLayout.module.css" 
import Image from "next/image";
import { LOGO_PATH } from "@/app/constants";
export const metadata = {
  title: "Twitter Light application",
  description: "Login page for the Twitter Light application",
  icons: {
    icon: "/logo-black.ico"
  }
};
export default function LoginLayout({ children }) {
    console.log(__filename);
    return (
      <html lang="en">
      
        <body className={styles.loginLayout} suppressHydrationWarning>
          <div className={styles.loginIllustration}>
            <Image className={styles.logoPicture}
              src= {LOGO_PATH}
              alt= "Twilight application Logo - big dimension"
              width={100}
              height={100}
              layout="intrinsic"
            />
          </div>
          <main className={styles.loginRightSection}>{children}</main>
        </body>
      </html>
    );
  }