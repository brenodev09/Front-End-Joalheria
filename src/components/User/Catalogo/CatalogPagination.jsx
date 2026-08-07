import { cn } from "./azoryUtils"
import styles from "../../../styles/User/catalogoAzory.module.css"

export default function CatalogPagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className={styles.pagination} aria-label="Paginação">
      {pages.map((p) => {
        const active = p === page
        return (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={active ? "page" : undefined}
            className={styles.pageBtn}
          >
            <span className={cn(styles.pageNum, active && styles.pageNumActive)}>
              {String(p).padStart(2, "0")}
            </span>
            <span className={cn(styles.pageBar, active && styles.pageBarActive)} />
          </button>
        )
      })}
    </nav>
  )
}
