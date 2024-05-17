import Box from 'components/Box'
import styles from './page.module.css'
import Link from 'next/link'
import {searchQuery} from 'src/wikisearch.js'
import SearchResultsPaginate from 'components/SearchResultsPaginate'

export default function Page({
    params,
    searchParams,
}) {

    return(<>
    <img src="title_logo_shadow.png" alt="title logo" className={styles.logo}/>
    
    {
        searchParams.search ?
        <Box>
            <h2>{"Search Reults for: \""+searchParams.search+"\""}</h2>
            <SearchResultsPaginate itemsPerPage = {10} items = {searchQuery(searchParams.search)}/>
        </Box>
        :<></>
    }
    <Box>
        Kristal is an *awesome* DELTARUNE fangame engine, written in Lua, using LÖVE.
    </Box>

    <Box>
        <h2> Getting Started </h2>
        <hr/>

        The first thing you should do is go ahead and download the engine. Read the <Link href="/wiki/downloading">download guide</Link> for more information.
    </Box>

    <Box>
        <h2>Contributing to the Wiki</h2>
        <hr/>

        If you want to contribute to the wiki, you can do so by forking the repository and making a pull request. You can find the repository <Link href="https://github.com/KristalTeam/Shadow">here</Link>.
    </Box>

    </>)
}
