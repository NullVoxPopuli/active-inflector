import { Inflector } from "./inflector";

import type { Pluralize, PluralizeWithCount } from "./types";

export function pluralize(word: string): string;
export function pluralize(
  count: number,
  word: string,
  options?: { withoutCount?: boolean },
): string;

export function pluralize(
  ...args: Parameters<Pluralize> | Parameters<PluralizeWithCount>
): string {
  if (args.length === 1) {
    return Inflector.inflector.pluralize(args[0]);
  }

  return Inflector.inflector.pluralize(...args);
}

export function singularize(word: string): string {
  return Inflector.inflector.singularize(word);
}
