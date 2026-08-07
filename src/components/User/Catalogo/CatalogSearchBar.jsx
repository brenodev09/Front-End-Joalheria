import styles from "../../../styles/User/catalogoAzory.module.css"

export default function CatalogSearchBar({ value, onChange, placeholder = "Buscar no arquivo" }) {
  return (
    <div className={styles.search}>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar peças"
        className={styles.searchInput}
      />
    </div>
  )
}
