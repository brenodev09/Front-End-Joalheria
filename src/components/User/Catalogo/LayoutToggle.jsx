import { LayoutGrid, Rows3 } from "lucide-react";
import styles from "../../../styles/User/layoutToggle.module.css";

export default function LayoutToggle({
    layout,
    setLayout
}) {

    return (

        <div className={styles.container}>

            <button
                type="button"
                onClick={() => setLayout("compact")}
                className={`${styles.button} ${
                    layout === "compact" ? styles.active : ""
                }`}
                aria-label="Visualização em grade compacta"
            >
                <LayoutGrid size={18} />
            </button>

            <button
                type="button"
                onClick={() => setLayout("expanded")}
                className={`${styles.button} ${
                    layout === "expanded" ? styles.active : ""
                }`}
                aria-label="Visualização expandida"
            >
                <Rows3 size={18} />
            </button>

        </div>

    );
}