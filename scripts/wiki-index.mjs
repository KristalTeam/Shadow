import path from 'path';
import fs from 'fs';
import {TYPES} from '../src/docparser.mjs';
import sanitizeHtml from 'sanitize-html';

import {remark} from 'remark';
import mdx from 'remark-mdx';
import strip from 'remark-mdx-to-plain-text';
import lunr from 'lunr';

const FILE_NAME = "wiki-index.json"

const BOOST = Object.freeze({
    ARTICLE: 3,
    API_TYPE: 2,
    API_FIELD: 1,

    TITLE: 4,
    DESCRIPTION: 2,
    CONTENT: 1,
});

console.log("[wiki-index] Generating search index...");

const dirRelativeToPublicFolder = './wiki/'
const dir = path.resolve('./app/', dirRelativeToPublicFolder);
const paths = fs.readdirSync(dir, {recursive: true})
    .filter( (rpath) => 
            //only text content; handle API pages seperately
            rpath.includes("page") &&
            !rpath.includes(".module") &&
            !rpath.includes("api") &&
            !rpath.match(/^page\..../)); 
    //.map( (rpath) => dir + path.sep + rpath )

const articles = paths.map(rpath => {
    var name = rpath.substring(0,rpath.indexOf("\\"));
    var body = fs.readFileSync(dir + path.sep + rpath).toString()
    
    var metadata = body.match(/(?<=export\sconst\smetadata\s=\s){[\s\S]+?}/g)?.[0];
    body = body.replace(metadata,"");
    if(metadata){
        //sanitize JSON
        metadata.match(/(?<=\s)\w+(?=:)/g).forEach( (k) => {metadata = metadata.replace(k, "'"+k+"'")});
        metadata = metadata.replace(/('(?=(,\s*')))|('(?=:))|((?<=([{:,]\s*))')|((?<={)')|('(?=}))/g, '"');
        let i = metadata.lastIndexOf("'");
        metadata = metadata.substring(0,i) + '"' + metadata.substring(i+1);   //regex replace fails?
        metadata = metadata.replace(/,[\s]*}/g, "}");
        metadata = metadata.replace(/\\./g, (m) => {
            switch (m){
                case "\\\"": return "\"";
                case "\\\'": return "\'"
                case "\\n" :  return "\n";
                case "\\t" : return "\t";
            }
        });
        metadata = JSON.parse(metadata);
    }

    remark()
    .use(mdx)
    .use(strip)
    .process(
        body.split("\n")
        .map( (line) =>
            {
                line = line[0] == "#" ? line.replace(/(?<!# )\[[\w-]*\]/g, "") : line; //preliminary heading-link parse out, dont match ### [text](link), parsed later
                line = line.indexOf("import ") == 0 ? "" : line; //remark mdx doesnt catch this
                line = line.indexOf("export ") == 0 ? "" : line; //this neither :(
                return line;
            }
        ).join("\n"),
        function(err, file) {
            body = sanitizeHtml(String(file.value), {allowedTags: []});
            if (err){
                console.warn("Couldn't parse "+name+", is it .mdx?");
                //throw err;
            }     
    });
    
    return {
        id: JSON.stringify({
            route: "/wiki/" + rpath.split(path.sep).join(path.posix.sep).replace(/\/page\..*/,""),
            title: metadata.title ?? "[NO TITLE]",
            description: metadata.description ?? "[NO DESCRIPTION]"
        }),

        title: metadata.title ?? "[NO TITLE]",
        description: metadata.description ?? "[NO DESCRIPTION]",
        content: body,
        boost: BOOST.ARTICLE
    }
});
//type and function of type lookup

const apiType = [];
const apiField = [];
TYPES.forEach( (type) => {
    let text = "";
    if(type.fields) {
        type.fields.forEach( (field) => {
            let desc =  (field.desc ?? field.rawdesc) ?? "";
            apiField.push({
                id: JSON.stringify({
                    route: "/wiki/api/" + type.name + "#" + field.name,
                    title: type.name + "." + field.name,
                    description: "(API: " + field.type.replace("set", "").replace("doc.", "") + ")" + ((field.desc ?? field.rawdesc) ?? "")
                }),

                title: type.name + "." + field.name,
                description: "(API: " + field.type.replace("set", "").replace("doc.", "") + ")" + ((field.desc ?? field.rawdesc) ?? ""),
                content: type.name + "." + field.name,
                boost: BOOST.API_FIELD
            });
            text = text + " | " + field.name + " " + desc
        });
    }
    apiType.push({
        id: JSON.stringify({
            route: "/wiki/api/" + type.name,
            title: type.name,
            description: "(API: " + type.type.replace("set", "") + ")" + ((type.desc ?? type.rawdesc) ?? "")
        }),

        title: type.name,
        description: "(API: " + type.type.replace("set", "") + ")" + ((type.desc ?? type.rawdesc) ?? ""),
        content: text,
        boost: BOOST.API_TYPE
    })
})

const corpus = articles.concat(apiType).concat(apiField);

var index = lunr(function() {
    this.ref("id");
    this.field("title", {boost: BOOST.TITLE});
    this.field("description", {boost: BOOST.DESCRIPTION});
    this.field("content", {boost: BOOST.CONTENT});

    corpus.forEach(function (doc) {
        this.add(doc, doc.boost);
    }, this);
})

console.log(`[wiki-index] Generated index for ${corpus.length} documents.`);

fs.writeFileSync(path.join(process.cwd(),`/app/data/${FILE_NAME}`),
    JSON.stringify(index, null, 4)
);

console.log(`[wiki-index] Done! Wrote index to /app/data/${FILE_NAME}`);