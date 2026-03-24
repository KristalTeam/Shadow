import Box from 'components/Box'
import styles from './page.module.css'
import { searchQuery } from 'src/wikisearch.js'
import SearchResultsPaginate from 'components/SearchResultsPaginate'
import Searchbar from '../../../components/Searchbar'

export default function Page({params, searchParams}) {
    return (<>
        <h1 className={styles.search}>Search The Wiki</h1>

        <Box>
        {
            searchParams.query ? <div className={styles.searchbox}>
                <Searchbar placeholder="Enter a term to search for..." defaultValue={searchParams.query} submit="Search" />
                <h2>{"Search Results for: \"" + searchParams.query + "\""}</h2>
                <SearchResultsPaginate itemsPerPage={10} items={searchQuery(searchParams.query)}/>
            </div> : <>
                <p>
                    Enter a term in the search bar above to search through the wiki!
                </p>
            </>
        }
        </Box>
    </>)
}
