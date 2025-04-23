// modal dialog box used to display a message
// Usage : < isOpen={err!=null} 
//                   setMsg={setMsg} 
//                   title="Message Title."
//                   errMessage="the message to be displayed"
//         />
"use client";
import Image from "next/image";
import Modal from "react-modal";
import {useEffect } from "react";
import styles from "./MsgModal.module.css";


export default function MsgModal({
  isOpen,
  setMsg,
  title,
  message, // the error message
}) {
  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  return (
    <Modal
      contentLabel={title}
      isOpen={isOpen}
      onRequestClose={() => setMsg(null)}
      className={styles.msgModal}
      overlayClassName={styles.msgModalOverlay}
    >
      <Image
        src="/logo.png"
        alt="twilight logo (twitter bird upside down)"
        width={50}
        height={50}
      />
      <h2>{title}</h2>
      <div>
        <p className="font-text txt-small">{message}</p>
        <button className="btn btn-dark" onClick={() => setMsg(null)}>
          Close
        </button>
      </div>
    </Modal>
  );
}
