# Active Inflector [![CI](https://github.com/NullVoxPopuli/active-inflector/workflows/CI/badge.svg)](https://github.com/NullVoxPopuli/active-inflector/actions/)

Active Inflector is a library for inflecting words between plural and singular forms. Active Inflector aims to be compatible with [ActiveSupport::Inflector](http://api.rubyonrails.org/classes/ActiveSupport/Inflector.html) from Ruby on Rails, including the ability to add your own inflections in your app.

## Compatibility

Requirements:
- ESM
- [Private Fields](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Public_class_fields#browser_compatibility)

As always, a consuming project can run a transpiler over dependencies.


## Installation

```
pnpm add active-inflector
```

## Usage

All methods are always available from the `active-inflector` module:

```javascript
import { Inflector } from "active-inflector";
import { singularize, pluralize } from "active-inflector";

Inflector.inflector.singularize("tacos"); // taco
Inflector.inflector.pluralize("taco"); // tacos

singularize("tacos"); // taco
pluralize("taco"); // tacos

pluralize(2, "taco"); // 2 tacos
pluralize(2, "tacos", { withoutCount: true }); // tacos
```

### Custom Rules

If necessary you can setup special inflection rules for your application:

```javascript
import { Inflector } from "active-inflector";

Inflector.inflector.irregular("person", "people");
Inflector.inflector.uncountable("sheep");
```

## Contributing

See the [Contributing](CONTRIBUTING.md) guide for details.

## License

This project is licensed under the [MIT License](LICENSE.md).
