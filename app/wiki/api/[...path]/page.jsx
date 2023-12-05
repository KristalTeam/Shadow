import { notFound } from 'next/navigation';
import { TYPES } from 'src/docparser.js';
import { parse } from 'src/markdown.js';
import Docbox from 'components/Docbox';
import styles from './page.module.css';
import { Fragment } from 'react';

export async function generateStaticParams() {
    const types = TYPES
    // return all keys
    return types.map((type) => {
        return {
            slug: type.name
        }
    });
}

function getClassHeirarchy(type, arr) {
    var parent = TYPES.find((parent) => type?.defines?.[0]?.extends?.[0]?.view == parent.name)
    if(parent) {
        arr.push(parent)
        getClassHeirarchy(parent, arr)
    }
    return arr
}
const hoverText = {
    '|': "either type",
    '?': "optional value",
    '(': "group start",
    ')': "group end"
}
const outgoingLinks = {
    nil: "https://www.lua.org/pil/2.1.html",
    boolean: "https://www.lua.org/pil/2.2.html",
    number: "https://www.lua.org/pil/2.3.html",
    integer: "https://www.lua.org/pil/2.3.html",
    string: "https://www.lua.org/pil/2.4.html",
    table: "https://www.lua.org/pil/2.5.html",
    function: "https://www.lua.org/pil/5.html",
    userdata: "https://www.lua.org/pil/2.7.html",
    thread: "https://www.lua.org/pil/2.7.html",

    any: "https://www.lua.org/pil/2.html"
}

function tryGetLoveWiki(str){
    var loveRef = str.split("love.")[1]
    if(loveRef) {
        return "https://love2d.org/wiki/" + loveRef
    }
}
//parses type tree and assigns appropriate refrences
function parseTypes(view){
    //split by ? and |
    var strs = view.split(/(\?|\||\(|\))/)
    //remove trailing nullstring if it exists (? at end probably) 
    if(strs[strs.length - 1] == "") {
        strs.pop()
    }
    //remove <T> from string. not quite sure why this happens to some and not others
    strs = strs.map( (str) => str.split(/:|>/)[1] || str )
    return strs.map( (str, i) => 
        (hoverText[str])
        ? <span key={str} className = {styles.syntaxTypeMod} title = {hoverText[str]}>{str}</span>
        //check outgoing links v 
        : <a key={str} className = {styles.syntaxType} href = { outgoingLinks[str] ||tryGetLoveWiki(str) ||("/wiki/api/" + str) }><span>{str}</span></a>
    )
}
export default async function Api({ params }) {

    // read the types from TYPES 

    let type = null;

    for (const current of TYPES)
    {
        if (current.name == params.path[0]) {
            type = current;
            break
        }
    }

    if (!type) {
        return notFound();
    }
    const classHeirarchy = getClassHeirarchy(type, [])
    const methods = []
    const fields = []
    const undocumented = []
    for (const field of type.fields) {
        if (field.extends.type == "function")
        {
            methods.push(field);
        }
        //this filters out field names not yet documented with --@field (they're probably not ment to be accessed anyways)
        else if(field.extends.type == "doc.type") 
        {
            fields.push(field);
        }
        else
        {
            undocumented.push(field)
        }
    }

    var init_index = methods.findIndex( (method) => method.name == "init")
    const initializer = init_index > -1 ? methods.splice(methods.findIndex( (method) => method.name == "init"), 1)[0] : null
    
    return <div>
        <Docbox className = {styles.wikiNoShadow}>
        
        <div id={type.name}>

            <h1>
                <a href={"#"+type.name}>{type.name}</a> 
            </h1>
            <h4>
            {classHeirarchy.map( (cls, index) => 
                    <span key={cls.name} style={{color: "gray"}}>
                    {index === 0 ? "┗> " : " > "}
                    <a href={"/wiki/api/" + cls.name}>{cls.name}</a>
                    </span>
            )}
            </h4>
            <p>{type.rawdesc || type.desc}</p>

        </div>
        <br/>
        {
        initializer ?
        <>
        <details id="Constructor" open>
            <summary className = {styles.detailHeader}><h2 className = {styles.syntaxObject}>Constructor</h2></summary>
                <hr/>
                <div id={initializer.name} key={initializer.name}>
                    <h3>
                    <a className = {styles.syntaxObject} href={"#"+initializer.name}>
                        <span>{type.name}</span>
                    </a>
                    <span className = {styles.syntax}>(</span>
                    {
                        initializer.extends.args.map((arg, index) => {
                            if (index == 0 && arg.name == "self") {
                                // imagine this is a continue
                            }
                            else
                            {
                                return <span key={`${arg.name}_${index}`} style={{color: "lightgray"}}>
                                    <span className = {styles.syntaxSymbol}>{arg.name}</span>
                                    <span className = {styles.syntax}>: </span>
                                    {
                                        parseTypes(arg.view)
                                    }
                                    {index < initializer.extends.args.length-1 ? <span className = {styles.syntax}>, </span> : null}
                                </span>
                            }

                        })
                    }
                    <span className = {styles.syntax}>)</span>
                    </h3>
                    <div style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(initializer.rawdesc || initializer.desc)}}></div>
                    { initializer.extends.args.length > 0 && !(initializer.extends.args[0].name == "self" && initializer.extends.args.length == 1) &&
                        <>
                            <p>Arguments:</p>
                            <table>
                                <tbody>
                                {
                                    await Promise.all(initializer.extends.args.map(async (arg, index) => {
                                        if (index == 0 && arg.name == "self") {
                                            // imagine this is a continue
                                            return <Fragment key={initializer.name + arg.name}></Fragment>
                                        }
                                        else
                                        {
                                            return <tr key={initializer.name + arg.name} >
                                                <td>
                                                    <span className = {styles.syntaxSymbol}>{arg.name}</span>
                                                    <span className = {styles.syntax}>: </span>
                                                    {
                                                        parseTypes(arg.view)
                                                    }
                                                </td>
                                                <td>
                                                    <div style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(arg.rawdesc || arg.desc)}}></div>
                                                </td>
                                            </tr>
                                        }
                                    }))
                                }
                                </tbody>
                            </table>
                        </>
                    }
                </div>
                <br/>
            <br/>
        </details>   
        <hr/>
        <br/>
        </>
        : <div></div>
        }
        <details id="Methods" open>
            
            <summary className = {styles.detailHeader}><h2 className = {styles.syntaxMethod}>Methods</h2></summary>
            {
                methods.map(async (method) => {
                    return <>
                    <hr/>
                    <div id={method.name} key={method.name}>
                        <h3>
                        <a href={"#"+method.name}>
                            <span className = {styles.syntaxObject}>{type.name}</span>
                            <span className = {styles.syntax}>{ method.extends.args[0] && method.extends.args[0].name=="self" ? ":" : "."}</span>
                            <span className = {styles.syntaxMethod}>{method.name}</span>
                        </a>
                        <span className = {styles.syntax}>(</span>
                        {
                            method.extends.args.map((arg, index) => {
                                if (index == 0 && arg.name == "self") {
                                    // imagine this is a continue
                                }
                                else
                                {
                                    return <span key={`${arg.name}_${index}`} style={{color: "lightgray"}}>
                                        <span className = {styles.syntaxSymbol}>{arg.name}</span>
                                        <span className = {styles.syntax}>: </span>
                                        {
                                            parseTypes(arg.view)
                                        }
                                        {index < method.extends.args.length-1 ? <span className = {styles.syntax}>, </span> : null}
                                    </span>
                                }

                            })
                        }
                        <span className = {styles.syntax}>)</span>
                        </h3>
                        <div style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(method.rawdesc || method.desc)}}></div>
                        { method.extends.args.length > 0 && !(method.extends.args[0].name == "self" && method.extends.args.length == 1) &&
                            <>
                                <p>Arguments:</p>
                                <table>
                                    <tbody>
                                    {
                                        await Promise.all(method.extends.args.map(async (arg, index) => {
                                            if (index == 0 && arg.name == "self") {
                                                // imagine this is a continue
                                                return <Fragment key={method.name + arg.name}></Fragment>
                                            }
                                            else
                                            {
                                                return <tr key={method.name + arg.name}>
                                                    <td>
                                                        <span className = {styles.syntaxSymbol}>{arg.name}</span>
                                                        <span className = {styles.syntax}>: </span>
                                                        {
                                                            parseTypes(arg.view)
                                                        }
                                                    </td>
                                                    <td>
                                                        <div style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(arg.rawdesc || arg.desc)}}></div>
                                                    </td>
                                                </tr>
                                            }
                                        }))
                                    }
                                    </tbody>
                                </table>
                            </>
                        }
                        {
                            method.extends.returns && method.extends.returns.length > 0 && <>
                                <p>Returns: </p>
                                <table>
                                    <tbody>
                                    {
                                        await Promise.all(method.extends.returns.map(async (ret, index) => {
                                            return <tr key={method.name + index}>
                                                <td>
                                                    <span className = {styles.syntaxSymbol}>{ret.name || index + 1}</span>
                                                    <span className = {styles.syntax}>: </span>
                                                    {
                                                        parseTypes(ret.view)
                                                    }
                                                </td>
                                                <td>
                                                    <div style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(ret.rawdesc || ret.desc)}}></div>
                                                </td>
                                            </tr>
                                        }))
                                    }
                                    </tbody>
                                </table>
                            </>
                        }
                    </div>
                    <br/>
                    </>
                })
            }

        </details>
        <hr/>
        <br/>
        <details id="Fields" open>
            <summary className = {styles.detailHeader}><h2 className = {styles.syntaxField}>Fields</h2></summary>
            {
                fields.map(async (field) => {
                    return <>
                    <hr/>
                    <div id={field.name} key={field.name}>
                        <h3>
                            <a href={"#"+field.name}>
                                <span className = {styles.syntaxObject}>{type.name}</span>
                                <span className = {styles.syntax}>.</span>
                                <span className = {styles.syntaxField}>{field.name}</span>
                            </a>
                            <span style={{color: "gray"}}>: </span>
                            {
                                parseTypes(field.extends.view)
                            }
                        </h3>
                        <div style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(field.rawdesc || field.desc)}}></div>
                    </div>
                    </>
                })
            }

        </details>
        <hr/>
        <br/>
        <details id="Undocumented" open>

            <summary className = {styles.detailHeader}><h2 className = {styles.syntaxUndocumented}>Undocumented</h2></summary>
            
            {
                undocumented.map(async (field) => {
                    return <>
                    <hr/>
                    <br/>
                    <div id={field.name} key={field.name}>
                        <h3>
                            <a href={"#"+field.name}>
                                <span className = {styles.syntaxObject}>{type.name}</span>
                                <span className = {styles.syntax}>.</span>
                                <span className = {styles.syntaxUndocumented}>{field.name}</span>
                            </a>
                            <span style={{color: "gray"}}>: </span>
                            {
                                parseTypes(field.extends.view)
                            }
                        </h3>
                        <div style={{color: "lightgray"}} dangerouslySetInnerHTML={{__html: await parse(field.rawdesc || field.desc)}}></div>
                    </div>
                    </>
                })
            }
            
        </details>
        <hr/>
        </Docbox>
    </div>
}
