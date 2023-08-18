import { Inflector } from "./inflector";

export function pluralize() {
  return Inflector.inflector.pluralize(...arguments);
}

export function singularize(word: string) {
  return Inflector.inflector.singularize(word);
}

