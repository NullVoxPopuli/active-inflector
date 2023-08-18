/* eslint-disable prefer-rest-params */
import { capitalCase as capitalize } from "capital-case";

import defaultRules from "./inflections";

import type { RuleSet } from './types';

const BLANK_REGEX = /^\s*$/;
const LAST_WORD_DASHED_REGEX = /([\w/-]+[_/\s-])([a-z\d]+$)/;
const LAST_WORD_CAMELIZED_REGEX = /([\w/\s-]+)([A-Z][a-z\d]*$)/;
const CAMELIZED_REGEX = /[A-Z][a-z\d]*$/;

function loadUncountable(rules: ResolvedRuleCache, uncountable: string[]) {
  if (!uncountable) return;
  if (!Array.isArray(uncountable)) return;

  for (let word of uncountable) {
    rules.uncountable[word.toLowerCase()] = true;
  }
}

interface ResolvedRuleCache extends Omit<RuleSet, 'uncountable' | 'irregularPairs'> {
  uncountable: { [word: string]: boolean };
  irregular: { [singular: string]: string };
  irregularInverse: { [plural: string]: string };
}

function loadIrregular(rules: ResolvedRuleCache, irregularPairs: RuleSet['irregularPairs']) {
  if (!irregularPairs) return;
  if (!Array.isArray(irregularPairs)) return;

  for (let [singular, plural] of irregularPairs) {
    //pluralizing
    rules.irregular[singular.toLowerCase()] = plural;
    rules.irregular[plural.toLowerCase()] = plural;

    //singularizing
    rules.irregularInverse[singular.toLowerCase()] = singular;
    rules.irregularInverse[plural.toLowerCase()] = singular;
  }
}


/**
  Inflector.Ember provides a mechanism for supplying inflection rules for your
  application. Ember includes a default set of inflection rules, and provides an
  API for providing additional rules.

  Examples:

  Creating an inflector with no rules.

  ```js
  var inflector = new Ember.Inflector();
  ```

  Creating an inflector with the default ember ruleset.

  ```js
  var inflector = new Ember.Inflector(Ember.Inflector.defaultRules);

  inflector.pluralize('cow'); //=> 'kine'
  inflector.singularize('kine'); //=> 'cow'
  ```

  Creating an inflector and adding rules later.

  ```javascript
  var inflector = Ember.Inflector.inflector;

  inflector.pluralize('advice'); // => 'advices'
  inflector.uncountable('advice');
  inflector.pluralize('advice'); // => 'advice'

  inflector.pluralize('formula'); // => 'formulas'
  inflector.irregular('formula', 'formulae');
  inflector.pluralize('formula'); // => 'formulae'

  // you would not need to add these as they are the default rules
  inflector.plural(/$/, 's');
  inflector.singular(/s$/i, '');
  ```

  Creating an inflector with a nondefault ruleset.

  ```javascript
  var rules = {
    plurals:  [
      [ /$/, 's' ]
    ],
    singular: [
      [ /\s$/, '' ]
    ],
    irregularPairs: [
      [ 'cow', 'kine' ]
    ],
    uncountable: [ 'fish' ]
  };

  var inflector = new Ember.Inflector(rules);
  ```
*/
export class Inflector {
  static defaultRules = defaultRules;
  static inflector: Inflector;

  static {
    this.inflector = new Inflector(defaultRules);
  }

  rules: ResolvedRuleCache;

  #cacheUsed = false;
  #sCache: { [word: string]: string } | null = null;
  #pCache: { [cacheKey: string]: string } | null = null;


  constructor(ruleSet?: Partial<RuleSet>) {
    let normalizedRuleSet: Partial<RuleSet> = ruleSet || {};

    normalizedRuleSet.uncountable = normalizedRuleSet.uncountable || [];
    normalizedRuleSet.irregularPairs = normalizedRuleSet.irregularPairs || [];

    this.rules = {
      plurals: normalizedRuleSet.plurals || [],
      singular: normalizedRuleSet.singular || [],
      irregular: makeDictionary(),
      irregularInverse: makeDictionary(),
      uncountable: makeDictionary(),
    };

    loadUncountable(this.rules, normalizedRuleSet.uncountable);
    loadIrregular(this.rules, normalizedRuleSet.irregularPairs);

    this.enableCache();
  }
  /**
    @public

    As inflections can be costly, and commonly the same subset of words are repeatedly
    inflected an optional cache is provided.

    @method enableCache
  */
  enableCache() {
    this.purgeCache();
  }

  /**
    @public

    @method purgeCache
  */
  purgeCache() {
    this.#cacheUsed = false;
    this.#sCache = makeDictionary();
    this.#pCache = makeDictionary();
  }

  /**
    @public
    disable caching

    @method disableCache;
  */
  disableCache() {
    this.#sCache = null;
    this.#pCache = null;
  }

  /**
    * adds to the list of plural rules, clearing the cache
    */
  plural(regex: RegExp, string: string) {
    if (this.#cacheUsed) {
      this.purgeCache();
    }

    this.rules.plurals.push([regex, string.toLowerCase()]);
  }

  /**
    * adds to the list of singular rules, clearing the cache
    */
  singular(regex: RegExp, string: string) {
    if (this.#cacheUsed) {
      this.purgeCache();
    }

    this.rules.singular.push([regex, string.toLowerCase()]);
  }

  /**
    * adds to the list of uncountable rules, clearing the cache
    */
  uncountable(string: string) {
    if (this.#cacheUsed) {
      this.purgeCache();
    }

    loadUncountable(this.rules, [string.toLowerCase()]);
  }

  /**
    * adds to the list of irregular rules, clearing the cache
    */
  irregular(singular: string, plural: string) {
    if (this.#cacheUsed) {
      this.purgeCache();
    }

    loadIrregular(this.rules, [[singular, plural]]);
  }

   pluralize(word: string): string;
   pluralize(
    count: number,
    word: string,
    options?: { withoutCount?: boolean }
   ): string;
  pluralize(...args: unknown[]) {
    console.log(args, this.#pCache, this.#cacheUsed);

    let [wordOrCount, word, options] = args as [string] | [count: number, word: string, options?: { withoutCount?: boolean }];

    if (this.#pCache) {
      this.#cacheUsed = true;

      let cacheKey = [wordOrCount, word, options?.withoutCount].join('');

      return (
        this.#pCache[cacheKey] ||
        (this.#pCache[cacheKey] = this.#pluralize(wordOrCount, word, options))
      );
    }

    // eslint-disable-next-line prefer-rest-params
    return this.#pluralize(wordOrCount, word, options);
  }

  #pluralize(wordOrCount: string | number, word?: string, options?: { withoutCount?: boolean }) {

    if (word === undefined) {
      return this.inflect(
        wordOrCount,
        this.rules.plurals,
        this.rules.irregular,
      );
    }

    if (typeof wordOrCount === 'number' || parseFloat(wordOrCount) !== 1) {
      word = this.inflect(word, this.rules.plurals, this.rules.irregular);
    }

    return options?.withoutCount ? word : `${wordOrCount} ${word}`;
  }

  singularize(word: string) {
    if (this.#sCache) {
      this.#cacheUsed = true;

      return (
        this.#sCache[word] || (this.#sCache[word] = this.#singularize(word))
      );
    }

    return this.#singularize(word);
  }

  #singularize(word: string) {
    return this.inflect(word, this.rules.singular, this.rules.irregularInverse);
  }

  inflect(word: string | number, typeRules: [string | RegExp, string][], irregular: Record<string, string>) {
    let inflection,
      substitution,
      result,
      lowercase,
      wordSplit,
      lastWord,
      isBlank,
      isCamelized,
      rule,
      isUncountable;

    word = String(word);

    isBlank = !word || BLANK_REGEX.test(word);
    isCamelized = CAMELIZED_REGEX.test(word);

    if (isBlank) {
      return word;
    }

    lowercase = word.toLowerCase();
    wordSplit =
      LAST_WORD_DASHED_REGEX.exec(word) || LAST_WORD_CAMELIZED_REGEX.exec(word);

    if (wordSplit) {
      lastWord = wordSplit[2]?.toLowerCase();
    }

    isUncountable =
      this.rules.uncountable[lowercase] || this.rules.uncountable[lastWord];

    if (isUncountable) {
      return word;
    }

    for (rule in irregular) {
      if (lowercase.match(rule + "$")) {
        substitution = irregular[rule];

        if (isCamelized && irregular[lastWord]) {
          substitution = capitalize(substitution);
          rule = capitalize(rule);
        }

        return word.replace(new RegExp(rule, "i"), substitution);
      }
    }

    for (let i = typeRules.length, min = 0; i > min; i--) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      inflection = typeRules[i - 1]!;
      rule = inflection[0];

      if (rule.test(word)) {
        break;
      }
    }

    inflection = inflection || [];

    rule = inflection[0];
    substitution = inflection[1];

    result = word.replace(rule, substitution);

    return result;
  }
}

function makeDictionary(): {}  {
  let cache = Object.create(null);

  cache["_dict"] = null;
  delete cache["_dict"];

  return cache;
}

