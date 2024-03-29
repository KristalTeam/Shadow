import Box from 'components/Box'
import styles from './page.module.css'
import '/src/wikisearch.js'
import Link from 'next/link'
import {searchQuery} from 'src/wikisearch.js'
export default function Page({
    params,
    searchParams,
}) {

    return(<>
    <img src="title_logo_shadow.png" alt="title logo" className={styles.logo}/>
    
    {
        searchParams.search ?
        (<Box>
        <h2>
            {"Search Reults for: \""+searchParams.search+"\""}
        </h2>
        <hr/>
        <ol>
            {searchQuery(searchParams.search).map(p => (
            <li> 
                <Link href = {p.route ?? ("/wiki/api/"+p.name) }>
                    <h3 style={{display: "inline"}}>{p.display_title ?? p.title}</h3>
                    <div>{p.description}</div>
                </Link>
                <br/>
            </li>
            ))}
        </ol>
        
        </Box>)
        :
        <></>
    }
    <Box>
        Kristal is an *awesome* DELTARUNE fangame engine, written in Lua, using LÖVE.
    </Box>

    <Box>
        <h2> Getting Started </h2>
        <hr/>

        The first thing you should do is go ahead and download the engine. Read the [download guide](/wiki/downloading) for more information.
    </Box>

    <Box>
        <h2>Contributing to the Wiki</h2>
        <hr/>

        If you want to contribute to the wiki, you can do so by forking the repository and making a pull request. You can find the repository [here](https://github.com/KristalTeam/Shadow).
    </Box>

    </>)
}
