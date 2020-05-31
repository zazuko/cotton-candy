# cotton-candy 🍬

ES6 Template String template engine


# Use Cases
- Substituting parts of the template with applications specific variables.
- Uniform site theming through included HTML.
- The dynamic creation of Navigation Elements from Arrays.

# Features
- Base features from [ES6](https://tc39.github.io/ecma262/#sec-template-literals) Template Literals [1],[2]
- Includes ``${include('cwd:views/header.html')}`` for theming of sites. (Supports configTools paths.)
- Setters ``${set('moduleHeader','<script></script>')}``and Getters ``${get('moduleHeader')}`` inside templates allow injecting HTML inside included templates.




[1]: https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals
[2]: http://exploringjs.com/es6/ch_template-literals.html
