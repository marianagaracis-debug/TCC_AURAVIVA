import {useEffect, useState} from "react";
import styles from "./Intro.module.css";

function Intro() {
    const [closing, setClosing] = useState(false);

useEffect(() => {
    const timer = setTimeout(() => {
        setClosing(true);
    }, 2000);

    return () => clearTimeout(timer);
}, []);

return (
    <div className={`${styles.intro} ${closing ? styles.introClosing : ""}`}>
        <div className={styles.introContent}>
            <p className={styles.introSmall}>BEM-VINDO À</p>
            <h1>AURAVIVA</h1>
            <p className={styles.introSubtitle}>
                Sementes que cultivam possibilidades
            </p>
        </div>
    </div>
);
}

export default Intro