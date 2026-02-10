import Box from 'components/Box'
import styles from './page.module.css'
import Link from 'next/link'
import { searchQuery } from 'src/wikisearch.js'
import SearchResultsPaginate from 'components/SearchResultsPaginate'
import NewTab from "components/NewTab"

export default function Page({
    params,
    searchParams,
}) {

    return (<>
    <h1 className={styles.logo}>
        <picture className={styles.logo}>
            <img src="title_logo_shadow.png" alt="Kristal" />
        </picture>
    </h1>
    
    {
        searchParams.search ?
        <Box>
            <h2>{"Search Results for: \""+searchParams.search+"\""}</h2>
            <SearchResultsPaginate itemsPerPage = {10} items = {searchQuery(searchParams.search)}/>
        </Box>
        : <>
            <Box>
                <p>
                    Kristal is an *awesome* <b>DELTARUNE</b> fangame engine, written in <b>Lua</b>, using <NewTab href="https://love2d.org/">LÖVE</NewTab>.
                </p>
            </Box>

            <Box>
                <h2>Getting Started</h2>
                <hr/>
                <p>
                    No matter whether you&apos;re making a fangame, or playing one, the first step is <b>downloading the engine.</b> Read the <Link href="/wiki/downloading">download guide</Link> for more information!
                </p>
            </Box>

    <Box>
        <h2>Contributing to the Wiki</h2>
        <hr/>

        <p>
            If you want to contribute <strong>wiki articles</strong>, you can do so by forking <Link href="https://github.com/KristalTeam/Shadow">the website&apos;s GitHub repository</Link> and making a pull request.
            If you want to <strong>document the API</strong>, it is generated automatically from the annotations in <Link href="https://github.com/KristalTeam/Kristal">Kristal&apos;s source code</Link>.
        </p>
    </Box>
    </>
    }

    </>)
}
