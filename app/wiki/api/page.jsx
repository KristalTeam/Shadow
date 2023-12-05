import { TYPES, sanitizeLink } from '/src/docparser.js';
import Docbox from 'components/Docbox';
import styles from './page.module.css';
import Link from 'next/link';
import SwapVisibilityButton from 'components/SwapVisibilityButton'
import { Fragment } from 'react';

export const metadata = {
    title: 'API Reference',
    description: 'Kristal\'s API reference',
}

function sortAlphabet(types){
    var container = []
    types.forEach( (type) => {
        let letter = type.name[0].toUpperCase().charCodeAt(0)
        if(! container[letter]){
            container[letter] = []
        }
        container[letter].push(type)
    })

    //sort subheadings alphabetically
    container.forEach( (section, i) => {
        section.sort((a,b) => a.name.toUpperCase() > b.name.toUpperCase() ? 1 : -1)
    })
    
    //to react html
    return container
}

function getClassHeirarchy(type, arr = []) {
    var parent = TYPES.find((parent) => type?.defines?.[0]?.extends?.[0]?.view == parent.name)
    if(parent) {
        getClassHeirarchy(parent, arr)
    }
    arr.push(type)
    return arr
}

function sortTree(types){
    var container = []
    types.forEach( (type) => {
        var super_container = container
        getClassHeirarchy(type).forEach((parent) => {
            var parent_container = super_container.find( (container) => container.data == parent)
            if(! parent_container){
                parent_container = {data: parent, children: []}
                super_container.push(parent_container)
            }
            super_container = parent_container.children
        })
    }) 

    return container
}
//https://stackoverflow.com/questions/53773088/create-nested-jsx-list-items-from-multi-level-nested-array-of-objects-reactjs
const ListTreeItem = ({ item }) => {
    let children = null;
    if (item.children && item.children.length) {
      children = (
        <ul>
          {item.children.map(i => (
            <ListTreeItem item={i} key={i.data.name} />
          ))}
        </ul>
      );
    }
  
    return (
        <li>
        {
        children ?
            <details open>
                <summary><Link href={`/wiki/api/${item.data.name}`} className={styles.type}>{item.data.name}</Link></summary>
                <ul>
                    {children}
                </ul>
            </details>
        :
            <Link href={`/wiki/api/${item.data.name}`} className={styles.type}>{item.data.name}</Link>
        }
        </li>
    )
}

export default async function Api() {

    // read the json file from data/doc.json
    // and parse it into a javascript object

    // then, use the object to generate the page

    const types = TYPES
    const alphabetical = sortAlphabet(types)
    const tree = sortTree(types)
    return (
        <>
        <h1 style = {{textAlign: "center"}}>API Reference</h1>
        <SwapVisibilityButton componentA = "tree" componentB = "alphabetical">schmesting</SwapVisibilityButton>
        <Docbox id = "tree" className = {styles.wikiNoShadow} style={{display: "none"}}>
            <ul className={styles.tree}>
                {tree.map(i => (
                    <ListTreeItem item={i} key={i.data.name} />
                ))}
            </ul>
        </Docbox>
        
        <Docbox id = "alphabetical" className = {styles.wikiNoShadow}>
        {
            alphabetical.map( (section, letter) => {
                return <Fragment key={letter}>
                    <details id="letter" open>
                        <summary><h1>{String.fromCharCode(letter).toUpperCase()}</h1></summary>
                        <hr/>
                        {
                            section.map( (type) => {
                            return <div key={type.name}>
                            <Link href={`/wiki/api/${type.name}`} className={styles.type}>{type.name}</Link>
                            </div>
                            })
                        }
                    </details>
                    <br/>
                </Fragment>
            })
        }
        </Docbox>
        </>
    )
}
