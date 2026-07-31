import styles from "../../../styles/User/toolbarCatalogo.module.css";
import SearchBar from "./SearchBar";
import LayoutToggle from "./LayoutToggle";
import { ChevronDown } from "lucide-react";

export default function ToolbarCatalogo({
    total = 0,
    search,
    setSearch,
    layout,
    setLayout,
    sort,
    setSort,
}) {
    return (
        <div className={styles.toolbar}>

            <div className={styles.info}>

                <h2>Catálogo</h2>

                <span>
                    {total} {total === 1 ? "produto" : "produtos"}
                </span>

            </div>

            <div className={styles.actions}>

                <SearchBar
                    value={search}
                    onChange={setSearch}
                />

                <div className={styles.selectWrapper}>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className={styles.select}
                    >
                        <option value="recent">
                            Mais recentes
                        </option>

                        <option value="priceAsc">
                            Menor preço
                        </option>

                        <option value="priceDesc">
                            Maior preço
                        </option>

                        <option value="name">
                            Nome (A-Z)
                        </option>

                    </select>

                    <ChevronDown
                        size={16}
                        className={styles.icon}
                    />

                </div>

                <LayoutToggle
                    layout={layout}
                    setLayout={setLayout}
                />

            </div>

        </div>
    );
}