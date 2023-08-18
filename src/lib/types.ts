
export interface RuleSet {
  plurals: [singularMatcher: RegExp | string, replacement: string][];
  singular: [pluralMatcher: RegExp | string, replacement: string][];
  irregularPairs: [singular: string, plural: string][];
  uncountable: string[];
}
