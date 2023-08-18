import { expect,test } from 'vitest';

import { pluralize, singularize } from '../src/index';

test("pluralize", function(assert) {
  assert.expect(3);

  expect(pluralize('word')).toEqual('words');
  expect(pluralize('ox')).toEqual('oxen');
  expect(pluralize('octopus')).toEqual('octopi');
});

test("singularize", function(assert) {
  assert.expect(3);

  expect(singularize('words')).toEqual('word');
  expect(singularize('oxen')).toEqual('ox');
  expect(singularize('octopi')).toEqual('octopus');
});
