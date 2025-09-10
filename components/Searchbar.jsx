"use client"
//from https://www.emgoto.com/react-search-bar/
import styles from "./Searchbar.module.css";

export default function Searchbar(props) {
    const placeholder = props.placeholder || "Search"
    const submit = props.submit || "Submit"
    const id = props.id || "searchbar"

    return (
    <form action="/" method="get" className={styles.form}>
        {/* Header, for screen readers: */}
        <label htmlFor={id}>
            <span className={styles.hidden}>{placeholder}</span> 
        </label>

        <input
            type="text"
            id={id}
            placeholder={placeholder}
            name="search"
            className={styles.input}
        />
        <button
            type="submit"
            formAction="/wiki"
            className={styles.button}
        >
            {submit}
        </button>
    </form>
    )
}