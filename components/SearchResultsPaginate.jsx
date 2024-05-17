"use client"
import styles from "./SearchResultsPaginate.module.css";
import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';
import Link from 'next/link';
//https://www.npmjs.com/package/react-paginate

function Items({ currentItems }) {
    return (
        <>
            {currentItems &&
                currentItems.map((item) => (
                    <li key = {item.route} className = {styles.items} >
                        <Link href = {item.route}>
                            <h3 style={{display: "inline"}}>{item.title}</h3>
                        </Link>
                        <div className = {styles.description} ><i>{item.description}</i></div>
                    </li>
                ))}
        </>
    );
}

export default function SearchResultsPaginate({ itemsPerPage, items }) {
    // Here we use item offsets; we could also use page offsets
    // following the API or data you're working with.
    const [itemOffset, setItemOffset] = useState(0);

    // Simulate fetching items from another resources.
    // (This could be items from props; or items loaded in a local state
    // from an API endpoint with useEffect and useState)
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = items.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(items.length / itemsPerPage);
    
    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % items.length;
        setItemOffset(newOffset);
    };

    return (
        <>
            <ul><Items currentItems={currentItems} /></ul>
            <ReactPaginate
                breakLabel="..."
                nextLabel=""
                previousLabel=""
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                renderOnZeroPageCount={null}

                breakClassName = {styles.pbreak}
                breakLinkClassName = {styles.pbreaklink}
                containerClassName = {styles.pcontainer}
                pageClassName = {styles.ppage}
                activeClassName = {styles.pactive}
                activeLinkName = {styles.pactivelink}
                nextClassName = {styles.pnext}
                nextLinkClassName = {styles.pnextlink}
                previousClassName = {styles.pprevious}
                previousLinkClassName = {styles.ppreviouslink}
                disabledClassName = {styles.pdisabled}
                disabledLinkClassName = {styles.pdisabledlink}

            />
        </>
    );
}