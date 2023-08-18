import { afterEach, assert, beforeEach, test } from "vitest";

import { Inflector } from "../src";

let inflector: Inflector;

beforeEach(() => {
  inflector = new Inflector(/* no rule set == no rules */);
});
afterEach(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  inflector = undefined;
});

test("ability to include counts", function () {
  inflector.plural(/$/, "s");
  assert.equal(inflector.pluralize(1, "cat"), "1 cat", "pluralize 1");
  assert.equal(inflector.pluralize(5, "cat"), "5 cats", "pluralize 5");
  assert.equal(
    inflector.pluralize(5, "cat", { withoutCount: true }),
    "cats",
    "without count",
  );
});

test("ability to add additional pluralization rules", function () {
  assert.equal(inflector.pluralize("cow"), "cow", "no pluralization rule");

  inflector.plural(/$/, "s");

  assert.equal(
    inflector.pluralize("cow"),
    "cows",
    "pluralization rule was applied",
  );
});

test("ability to add additional singularization rules", function () {
  assert.equal(
    inflector.singularize("cows"),
    "cows",
    "no singularization rule was applied",
  );

  inflector.singular(/s$/, "");

  assert.equal(
    inflector.singularize("cows"),
    "cow",
    "singularization rule was applied",
  );
});

test("ability to add additional uncountable rules", function () {
  inflector.plural(/$/, "s");
  assert.equal(
    inflector.pluralize("cow"),
    "cows",
    "pluralization rule was applied",
  );

  inflector.uncountable("cow");
  assert.equal(
    inflector.pluralize("cow"),
    "cow",
    "pluralization rule NOT was applied",
  );
  assert.equal(
    inflector.pluralize("redCow"),
    "redCow",
    "pluralization rule NOT was applied",
  );
  assert.equal(
    inflector.pluralize("red-cow"),
    "red-cow",
    "pluralization rule NOT was applied",
  );
  assert.equal(
    inflector.pluralize("red/cow"),
    "red/cow",
    "pluralization rule NOT was applied",
  );
});

test("ability to add additional irregular rules", function () {
  inflector.singular(/s$/, "");
  inflector.plural(/$/, "s");

  assert.equal(
    inflector.singularize("cows"),
    "cow",
    "regular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("cow"),
    "cows",
    "regular pluralization rule was applied",
  );

  assert.equal(
    inflector.singularize("red-cows"),
    "red-cow",
    "regular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("red-cow"),
    "red-cows",
    "regular pluralization rule was applied",
  );

  assert.equal(
    inflector.singularize("redCows"),
    "redCow",
    "regular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("redCow"),
    "redCows",
    "regular pluralization rule was applied",
  );

  assert.equal(
    inflector.singularize("red/cows"),
    "red/cow",
    "regular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("red/cow"),
    "red/cows",
    "regular pluralization rule was applied",
  );

  inflector.irregular("cow", "kine");

  assert.equal(
    inflector.singularize("kine"),
    "cow",
    "irregular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("cow"),
    "kine",
    "irregular pluralization rule was applied",
  );

  assert.equal(
    inflector.singularize("red-kine"),
    "red-cow",
    "irregular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("red-cow"),
    "red-kine",
    "irregular pluralization rule was applied",
  );

  assert.equal(
    inflector.singularize("red-red-cow"),
    "red-red-cow",
    "irregular singularization rule was applied correctly with dasherization",
  );
  assert.equal(
    inflector.singularize("red-red-kine"),
    "red-red-cow",
    "irregular singularization rule was applied correctly with dasherization",
  );
  assert.equal(
    inflector.pluralize("red-red-cow"),
    "red-red-kine",
    "irregular pluralization rule was applied correctly with dasherization",
  );
  assert.equal(
    inflector.pluralize("red-red-kine"),
    "red-red-kine",
    "irregular pluralization rule was applied correctly with dasherization",
  );

  assert.equal(
    inflector.singularize("redKine"),
    "redCow",
    "irregular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("redCow"),
    "redKine",
    "irregular pluralization rule was applied",
  );

  assert.equal(
    inflector.singularize("red/kine"),
    "red/cow",
    "irregular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("red/cow"),
    "red/kine",
    "irregular pluralization rule was applied",
  );
});

test("ability to add identical singular and pluralizations", function () {
  inflector.singular(/s$/, "");
  inflector.plural(/$/, "s");

  assert.equal(
    inflector.singularize("settings"),
    "setting",
    "regular singularization rule was applied",
  );
  assert.equal(
    inflector.pluralize("setting"),
    "settings",
    "regular pluralization rule was applied",
  );

  inflector.irregular("settings", "settings");
  inflector.irregular("userPreferences", "userPreferences");

  assert.equal(
    inflector.singularize("settings"),
    "settings",
    "irregular singularization rule was applied on lowercase word",
  );
  assert.equal(
    inflector.pluralize("settings"),
    "settings",
    "irregular pluralization rule was applied on lowercase word",
  );

  assert.equal(
    inflector.singularize("userPreferences"),
    "userPreferences",
    "irregular singularization rule was applied on camelcase word",
  );
  assert.equal(
    inflector.pluralize("userPreferences"),
    "userPreferences",
    "irregular pluralization rule was applied on camelcase word",
  );
});
