import type {ITokenizer} from 'js-search/source/Tokenizer/Tokenizer.js';

var REGEX = /[\s.:]+/i;

/**
 * SimpleTokenizer that only splits on whitespace characters, as well as : and . for lua purpouses
 */
export class ProgrammingTokenizer implements ITokenizer {
  tokenize(text : string) : Array<string> {
    return text
      .split(REGEX)
      .filter(
        (text) => text // Filter empty tokens
      );
  }
};