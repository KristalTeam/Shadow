import * as JsSearch from 'js-search';
import path from 'path';
import fs from 'fs';
import {TYPES} from '/src/docparser.js';
import {ProgrammingTokenizer} from '/src/programTokenizer.ts';

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
    var text = ''+fs.readFileSync(dir + path.sep + rpath);
    var metadata = text.match(/(?<=export\sconst\smetadata\s=\s){[\s\S]+?}/g)?.[0];
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
    return { 
        title: metadata?.title ?? "[no title]",
        description: "(Tutorial) "+(metadata?.description ?? "[no metadata]"),
        text: text,

        route: "/wiki/" + rpath.split(path.sep).join(path.posix.sep).replace(/\/page\..*/,"")
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
                display_title: type.name + "." + field.name, 
                title: field.name,
                description: "(API: " + field.type.replace("set", "").replace("doc.", "") + ")" + ((field.desc ?? field.rawdesc) ?? ""),
                text: type.name + "." + field.name,

                route: "/wiki/api/" + type.name + "#" + field.name
            });
            text = text + " | " + field.name + " " + desc
        });
    }
    apiType.push({
        title: type.name,
        description: "(API: " + type.type.replace("set", "") + ")" + ((type.desc ?? type.rawdesc) ?? ""),
        text: text,

        route: "/wiki/api/" + type.name
    })
})

const wikiPages = apiField.concat(apiType.concat(articles));
const apiAll = apiField.concat(apiType);

//please rewrite this, it's just a bunch of searches thats probably REALLY inefficient
const searchExactClassTitle = new JsSearch.Search("route");
searchExactClassTitle.tokenizer = new ProgrammingTokenizer();
searchExactClassTitle.searchIndex = new JsSearch.UnorderedSearchIndex("route");
searchExactClassTitle.indexStrategy = new JsSearch.ExactWordIndexStrategy();
searchExactClassTitle.addIndex("title");
searchExactClassTitle.addDocuments(apiType);

const searchFuzzyClassTitle = new JsSearch.Search("route");
searchFuzzyClassTitle.tokenizer = new ProgrammingTokenizer();
searchFuzzyClassTitle.searchIndex = new JsSearch.UnorderedSearchIndex("route");
searchFuzzyClassTitle.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
searchFuzzyClassTitle.addIndex("title");
searchFuzzyClassTitle.addDocuments(apiType);

const searchExactFieldTitle = new JsSearch.Search("route");
searchExactFieldTitle.tokenizer = new ProgrammingTokenizer();
searchExactFieldTitle.searchIndex = new JsSearch.UnorderedSearchIndex("route");
searchExactFieldTitle.indexStrategy  = new JsSearch.ExactWordIndexStrategy();
searchExactFieldTitle.addIndex("title");
searchExactFieldTitle.addDocuments(apiField);

const searchFuzzyFieldTitle = new JsSearch.Search("route");
searchFuzzyFieldTitle.tokenizer = new ProgrammingTokenizer();
searchFuzzyFieldTitle.searchIndex = new JsSearch.UnorderedSearchIndex("route");
searchFuzzyFieldTitle.indexStrategy  = new JsSearch.AllSubstringsIndexStrategy();
searchFuzzyFieldTitle.addIndex("title");
searchFuzzyFieldTitle.addDocuments(apiField);

const searchExactArticleTitle = new JsSearch.Search("route");
searchExactArticleTitle.tokenizer = new JsSearch.SimpleTokenizer();
searchExactArticleTitle.searchIndex = new JsSearch.UnorderedSearchIndex("route");
searchExactArticleTitle.indexStrategy = new JsSearch.ExactWordIndexStrategy();
searchExactArticleTitle.addIndex("title");
searchExactArticleTitle.addDocuments(articles);

const searchFuzzyArticleTitle = new JsSearch.Search("route");
searchFuzzyArticleTitle.tokenizer = new JsSearch.SimpleTokenizer();
searchFuzzyArticleTitle.searchIndex = new JsSearch.UnorderedSearchIndex("route");
searchFuzzyArticleTitle.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
searchFuzzyArticleTitle.addIndex("title");
searchFuzzyArticleTitle.addDocuments(articles);

const searchFuzzyArticleDescription = new JsSearch.Search("route");
searchFuzzyArticleDescription.tokenizer = new JsSearch.SimpleTokenizer();
searchFuzzyArticleDescription.searchIndex = new JsSearch.TfIdfSearchIndex("route");
searchFuzzyArticleDescription.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
searchFuzzyArticleDescription.addIndex("description");
searchFuzzyArticleDescription.addDocuments(articles);

const searchFuzzyApiDescription = new JsSearch.Search("route");
searchFuzzyApiDescription.tokenizer = new JsSearch.SimpleTokenizer();
searchFuzzyApiDescription.searchIndex = new JsSearch.TfIdfSearchIndex("route");
searchFuzzyApiDescription.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
searchFuzzyApiDescription.addIndex("description");
searchFuzzyApiDescription.addDocuments(apiAll);

const searchFuzzyText = new JsSearch.Search("route");
searchFuzzyText.tokenizer = new JsSearch.StopWordsTokenizer( new JsSearch.SimpleTokenizer());
searchFuzzyText.searchIndex = new JsSearch.TfIdfSearchIndex("route");
searchFuzzyText.indexStrategy = new JsSearch.AllSubstringsIndexStrategy();
searchFuzzyText.addIndex("text");
searchFuzzyText.addDocuments(wikiPages);

//this order of results seems good
const searches = [
    searchExactClassTitle,
    searchExactArticleTitle,
    searchFuzzyArticleTitle,
    searchFuzzyArticleDescription,
    searchFuzzyClassTitle,
    searchExactFieldTitle,
    searchFuzzyFieldTitle,
    searchFuzzyApiDescription,
    searchFuzzyText];

//https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
const merge = (a, b, predicate = (a, b) => a === b) => {
    const c = [...a]; // copy to avoid side effects
    // add all items from B to copy C if they're not already present
    b.forEach((bItem) => (c.some((cItem) => predicate(bItem, cItem)) ? null : c.push(bItem)))
    return c;
}

export function searchQuery(q){
    let results = [];
    searches.forEach( (search) => results = merge( results, search.search(q) ));
    return results;
}