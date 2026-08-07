import { useState, useRef, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { SORT_OPTIONS, cn } from "./azoryUtils"
import styles from "../../../styles/User/catalogoAzory.module.css"

export default function SortDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = SORT_OPTIONS.find((o) => o.value === value) ?? SORT_OPTIONS[0]

  useEffect(() => {
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  return (
    <div className={styles.sortWrap} ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={styles.sortButton}
      >
        <span className={styles.sortLabelMuted}>Ordenar</span>
        <span className={styles.sortValue}>{current.label}</span>
        <span className={cn(styles.sortCaret, open && styles.sortCaretOpen)} aria-hidden="true">
          {"\u2304"}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.ul
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            className={styles.sortMenu}
          >
            {SORT_OPTIONS.map((o) => (
              <li key={o.value} role="option" aria-selected={o.value === value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value)
                    setOpen(false)
                  }}
                  className={cn(styles.sortOption, o.value === value && styles.sortOptionActive)}
                >
                  {o.label}
                </button>
              </li>
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </div>
  )
}
