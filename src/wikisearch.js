import lunr from 'lunr';
import data from '/app/data/wiki-index.json'

const STRING_MAX_SIZE = 80;

const index = lunr.Index.load(data);
export function searchQuery(q){
    return typeof(q) == "string" && q.length > 0 ? 
        index.search(q).map( (raw) => {
            var trim = JSON.parse(raw.ref);
            //trim.route = 
            trim.title = trim.title.length > STRING_MAX_SIZE - 3 ? trim.title.substring(0, STRING_MAX_SIZE - 3) + "..." : trim.title;
            trim.description = trim.description.length > STRING_MAX_SIZE - 3 ? trim.description.substring(0, STRING_MAX_SIZE - 3 ) + "..." : trim.description;
            return trim;
        })
        :
        []
}