import path from 'path';
import fs from 'fs';

const file = fs.readFileSync(path.join(process.cwd(),'/app/data/doc.json'), 'utf8');
const data = JSON.parse(file);

const types = [];
const indexed = new Map();

for (const element of data) {
    if (element.type === 'type') {
        let index = indexed.get(element.name)
        if (index){
            types[index] = element;
        } else {
            types.push(element);
            indexed.set(element.name, types.length - 1); //name and index to indexed
        }
    } else if (element.type === 'variable' && !indexed.get(element.name) && !(element.name.indexOf('.') > -1) ) { //rejects global variables that are indexed (should be part of type's fields instead)
        types.push(element);
        indexed.set(element.name, types.length - 1)
    }
}

export function sanitizeLink(link) {
    // strip anything before /Kristal/ in the URL
    const index = link.indexOf('/Kristal/');
    return link.substring(index);
}

export function sanitizeLinkToGithub(link){
    return "https://github.com/KristalTeam/Kristal/" + sanitizeLink(link)
}
export const TYPES = types;