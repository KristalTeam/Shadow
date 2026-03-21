import { notFound } from 'next/navigation';
import { TYPES } from 'src/docparser.mjs';
import { parse as parseMarkdown } from 'src/markdown.js';
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

export async function generateMetadata({ params }){
    return {
        title: String(params.path),
        description: "Kristal API Reference"
    }
}

async function parse(input) {
    if (!input) return null;

    // warning, this sucks
    // try to convert lua://Thing.something to /wiki/api/Thing#something
    // however... apparently its also inconsistent whether lua:// stays normal or turns into file://
    // cause like... `Battle:setState` has this doc comment:
    // --- Changes the state of the battle and calls [onStateChange()](lua://Battle.onStateChange)
    // which turned into
    // Changes the state of the battle and calls [onStateChange()](file:///home/ally/Shadow/tmp/kristal/src/engine/game/battle.lua#386)
    input = input.replace(/\(lua:\/\/([a-zA-Z0-9_.:]+)\)/g, (match, p1) => {
        return `(/wiki/api/${p1.replace(/\./g, '#').replace(/:/g, '#')})`;
    });

    return await parseMarkdown(input);
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
    strs = strs.map( (str) => str.split(/:|>/)[1] ?? str )
    return strs.map( (str, i) => 
        (hoverText[str])
        ? <span key={str + "_" + i} className = {styles.syntaxTypeMod} title = {hoverText[str]}>{str}</span>
        //check outgoing links v 
        : <a key={str + "_" + i} className = {styles.syntaxType} href = { outgoingLinks[str] ?? tryGetLoveWiki(str) ?? ("/wiki/api/" + str) }><span>{str}</span></a>
    )
}

function pushUniqueByName(arr, item) {
    if (!arr.some((existing) => existing.name == item.name)) {
        arr.push(item);
    }
}

function getArgName(arg) {
    return arg.type === "..." ? "..." : arg.name;
}

function getArgText(arg) {
    return arg.type === "..."
        ? "vararg, accepts any amount of arguments of this type"
        : (arg.rawdesc ?? arg.desc) ?? "";
}

function getRenderableArgs(args) {
    return args.filter((arg, index) => !(index == 0 && arg.name == "self"));
}

function hasVisibleArgs(args) {
    return args.length > 0 && !(args[0].name == "self" && args.length == 1);
}

function renderArgsInline(args) {
    const renderableArgs = getRenderableArgs(args);
    return renderableArgs.map((arg, index) => {
        const name = getArgName(arg);
        const text = getArgText(arg);
        return <span key={`${name}_${index}`} style={{color: "lightgray"}}>
            <span className={styles.syntaxSymbol} title={text}>{name}</span>
            <span className={styles.syntax}>: </span>
            {
                parseTypes(arg.view)
            }
            {index < renderableArgs.length - 1 ? <span className = {styles.syntax}>, </span> : null}
        </span>
    });
}

async function renderArgumentRows(ownerName, args) {
    return Promise.all(getRenderableArgs(args).map(async (arg) => {
        const desc = await parse(arg.rawdesc ?? arg.desc);
        const name = getArgName(arg);
        const text = getArgText(arg);
        return <tr key={ownerName + name}>
            <td>
                <span className={styles.syntaxSymbol} title={text}>{name}</span>
                <span className={styles.syntax}>: </span>
                {
                    parseTypes(arg.view)
                }
            </td>
            <td>
                <div style={{color: "lightgray"}}>{desc}</div>
            </td>
        </tr>
    }));
}

async function renderReturnRows(ownerName, returnsList) {
    return Promise.all(returnsList.map(async (ret, index) => {
        const desc = await parse(ret.rawdesc ?? ret.desc);
        return <tr key={ownerName + index}>
            <td>
                <span className = {styles.syntaxSymbol}>{ret.name ?? index + 1}</span>
                <span className = {styles.syntax}>: </span>
                {
                    parseTypes(ret.view)
                }
            </td>
            <td>
                <div style={{color: "lightgray"}}>{desc}</div>
            </td>
        </tr>
    }));
}

async function Api_type(type, { params }) {
    const classHeirarchy = getClassHeirarchy(type, [])
    const methods = []
    const fields = []
    const undocumented = []
    for (const field of type.fields) {
        if (field.extends.type == "function")
        {
            // loop through all methods, if something with the same name already exists, ignore
            pushUniqueByName(methods, field);
        }
        //this filters out field names not yet documented with --@field (they're probably not ment to be accessed anyways)
        else if(field.extends.type == "doc.type") 
        {
            pushUniqueByName(fields, field);
        }
        else
        {
            pushUniqueByName(undocumented, field);
        }
    }

    const initIndex = methods.findIndex((method) => method.name == "init")
    const initializer = initIndex > -1 ? methods.splice(initIndex, 1)[0] : null

    const desc = await parse(type?.defines?.[0].rawdesc ?? type?.defines?.[0].desc);

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
            <br/>
            <span style={{color: "lightgray"}}>{desc}</span>

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
                    {renderArgsInline(initializer.extends.args)}
                    <span className = {styles.syntax}>)</span>
                    </h3>
                    <div style={{color: "lightgray"}}>{await parse(initializer.rawdesc ?? initializer.desc)}</div>
                    { hasVisibleArgs(initializer.extends.args) &&
                        <>
                            <p>Arguments:</p>
                            <table>
                                <tbody>
                                {
                                    await renderArgumentRows(initializer.name, initializer.extends.args)
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
        {
            methods.length > 0 && <>
                <details id="Methods" open>
                <summary className={styles.detailHeader}><h2 className = {styles.syntaxMethod}>Methods</h2></summary>
                {
                    methods.map(async (method) => {
                        const desc = await parse(method.rawdesc ?? method.desc);
                        return <Fragment key={method.name}>
                        <hr/>
                        <div id={method.name}>
                            <h3>
                            <a href={"#"+method.name}>
                                <span className = {styles.syntaxObject}>{type.name}</span>
                                <span className = {styles.syntax}>{ method.extends.args[0] && method.extends.args[0].name=="self" ? ":" : "."}</span>
                                <span className = {styles.syntaxMethod}>{method.name}</span>
                            </a>
                            <span className = {styles.syntax}>(</span>
                            {renderArgsInline(method.extends.args)}
                            <span className = {styles.syntax}>)</span>
                            </h3>
                            <div style={{color: "lightgray"}}>{desc}</div>
                            { hasVisibleArgs(method.extends.args) &&
                                <>
                                    <p>Arguments:</p>
                                    <table>
                                        <tbody>
                                        {
                                            await renderArgumentRows(method.name, method.extends.args)
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
                                            await renderReturnRows(method.name, method.extends.returns)
                                        }
                                        </tbody>
                                    </table>
                                </>
                            }
                        </div>
                        <br/>
                    </Fragment>
                })
            }
        </details>
        <hr/>
        <br/>
        </>
        }
        {
            fields.length > 0 && <>
                <details id="Fields" open>
                    <summary className = {styles.detailHeader}><h2 className = {styles.syntaxField}>Fields</h2></summary>
                    {
                        fields.map(async (field) => {
                            const desc = await parse(field.rawdesc ?? field.desc);
                            return <Fragment key={field.name}>
                            <hr/>
                            <div id={field.name}>
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
                                <div style={{color: "lightgray"}}>{desc}</div>
                            </div>
                            </Fragment>
                        })
                    }
                </details>
                <hr/>
                <br/>
            </>
        }
        {
            undocumented.length > 0 &&
            <>
                <details id="Undocumented" open>
                    <summary className={styles.detailHeader}><h2 className = {styles.syntaxUndocumented}>Undocumented</h2></summary>
                    {
                        undocumented.map(async (field) => {
                            const desc = await parse(field.rawdesc ?? field.desc);
                            return <Fragment key={field.name}>
                            <hr/>
                            <br/>
                            <div id={field.name} key={field.name}>
                                <h3>
                                    <a href={"#"+field.name}>
                                        <span className={styles.syntaxObject}>{type.name}</span>
                                        <span className={styles.syntax}>.</span>
                                        <span className={styles.syntaxUndocumented}>{field.name}</span>
                                    </a>
                                    <span style={{color: "gray"}}>: </span>
                                    {
                                        parseTypes(field.extends.view)
                                    }
                                </h3>
                                <div style={{color: "lightgray"}}>{desc}</div>
                            </div>
                            </Fragment>
                        })
                    }
                </details>
                <hr/>
            </>
        }
        </Docbox>
    </div>
}

function Api_variable(type, { params }) {
    return <div>
        <Docbox className={styles.wikiNoShadow}>
        <div id={type.name}>
            <h1>
                <a href={"#" + type.name}>{type.name}</a>
            </h1>
            {type.rawdesc ?? type.desc}
        </div>

        </Docbox>
    </div>
}

export default async function Api({ params }) {
        
    // read the types from TYPES 

    const type = TYPES.find((current) => current.name == params.path[0]);

    if (!type) {
        return notFound();
    }
    if(type.type === "type"){
        return Api_type(type, { params })
    }else if (type.type === "variable"){
        return Api_variable(type, { params })
    }
}
