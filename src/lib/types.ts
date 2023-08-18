
export interface RuleSet {
  plurals: [singularMatcher: RegExp | string, replacement: string][];
  singular: [pluralMatcher: RegExp | string, replacement: string][];
  irregularPairs: [singular: string, plural: string][];
  uncountable: string[];
}

export type Pluralize = (word: string) => string;
export type PluralizeWithCount = (count: number, word: string, options?: { withoutCount?: boolean }) => string;
