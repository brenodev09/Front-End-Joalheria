import { Search, X } from "lucide-react";
import styles from "../../../styles/User/searchBar.module.css";

export default function SearchBar({
    value,
    onChange,
    placeholder = "Buscar joias..."
}) {

    function handleClear() {
        onChange("");
    }

    return (
        <div className={styles.searchContainer}>

            <Search
                size={18}
                className={styles.icon}
            />

            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={styles.input}
            />

            {value && (
                <button
                    type="button"
                    onClick={handleClear}
                    className={styles.clearButton}
                >
                    <X size={16} />
                </button>
            )}

        </div>
    );
}