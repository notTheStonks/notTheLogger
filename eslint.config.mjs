import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

const rules = {
  // Best Practices
  "@typescript-eslint/no-explicit-any": "off", // Disallow unused variables
  "no-unused-vars": "error", // Disallow unused variables
  "eqeqeq": "error", // Require === and !==
  "indent": [ "error", 2 ], // Enforce 2-space indentation
  "accessor-pairs": "error", // Enforces getter/setter pairs in objects
  "array-callback-return": "error", // Enforces return statements in callbacks of array's methods
  "block-scoped-var": "error", // Treat var statements as if they were block scoped
  "class-methods-use-this": "error", // Enforce that class methods utilize this
  "complexity": [ "error", 10 ], // Specify the maximum cyclomatic complexity allowed in a program
  "consistent-return": "error", // Require return statements to either always or never specify values
  "curly": "error", // Enforce consistent brace style for all control statements
  "default-case": "error", // Require default case in switch statements
  "default-case-last": "error", // Enforces that a default statement is last in a switch statement
  "default-param-last": "error", // Enforce default parameters to be last
  "dot-location": [ "error", "property" ], // Enforce consistent newlines before and after dots
  "dot-notation": "error", // Enforce dot notation whenever possible
  "grouped-accessor-pairs": "error", // Require grouped accessor pairs in object literals and classes
  "guard-for-in": "error", // Require for-in loops to include an if statement
  "max-classes-per-file": [ "error", 1 ], // Enforce a maximum number of classes per file
  "no-alert": "warn", // Disallow the use of alert, confirm, and prompt
  "no-caller": "error", // Disallow use of arguments.caller or arguments.callee
  "no-case-declarations": "error", // Disallow lexical declarations in case/default clauses
  "no-constructor-return": "error", // Disallow returning value from constructor
  "no-div-regex": "error", // Disallow division operators explicitly at the beginning of regular expressions
  "no-else-return": "error", // Disallow else blocks after return statements in if statements
  "no-empty-function": "error", // Disallow empty functions
  "no-empty-pattern": "error", // Disallow empty destructuring patterns
  "no-eq-null": "error", // Disallow null comparisons without type-checking operators
  "no-eval": "error", // Disallow use of eval()
  "no-extend-native": "error", // Disallow extending native types
  "no-extra-bind": "error", // Disallow unnecessary function binding
  "no-extra-label": "error", // Disallow unnecessary labels
  "no-fallthrough": "error", // Disallow fallthrough of case statements
  "no-floating-decimal": "error", // Disallow the use of leading or trailing decimal points in numeric literals
  "no-global-assign": "error", // Disallow assignments to native objects or read-only global variables
  "no-implicit-coercion": "error", // Disallow implicit type conversions
  "no-implicit-globals": "error", // Disallow var and named functions in global scope
  "no-implied-eval": "error", // Disallow use of eval()-like methods
  "no-invalid-this": "error", // Disallow this keywords outside of classes or class-like objects
  "no-iterator": "error", // Disallow usage of __iterator__ property
  "no-labels": "error", // Disallow labeled statements
  "no-lone-blocks": "error", // Disallow unnecessary nested blocks
  "no-loop-func": "error", // Disallow creating functions within loops
  "no-magic-numbers": "off", // Disallow magic numbers (can be useful but sometimes too restrictive)
  "no-multi-spaces": "error", // Disallow multiple spaces
  "no-multi-str": "error", // Disallow multiline strings
  "no-new": "error", // Disallow use of new for side effects
  "no-new-func": "error", // Disallow use of new Function()
  "no-new-wrappers": "error", // Disallows creating new instances of String, Number, and Boolean
  "no-octal": "error", // Disallow use of octal literals
  "no-octal-escape": "error", // Disallow use of octal escape sequences in string literals
  "no-param-reassign": "error", // Disallow reassignment of function parameters
  "no-proto": "error", // Disallow usage of __proto__ property
  "no-redeclare": "error", // Disallow declaring the same variable more then once
  "no-restricted-properties": "off", // Disallow certain object properties
  "no-return-assign": "error", // Disallow assignment in return statement
  "no-return-await": "error", // Disallows unnecessary return await
  "no-script-url": "error", // Disallow javascript: urls
  "no-self-assign": "error", // Disallow self assignment
  "no-self-compare": "error", // Disallow comparisons where both sides are exactly the same
  "no-sequences": "error", // Disallow use of comma operator
  "no-throw-literal": "error", // Restrict what can be thrown as an exception
  "no-unmodified-loop-condition": "error", // Disallow unmodified conditions of loops
  "no-unused-expressions": "error", // Disallow unused expressions
  "no-unused-labels": "error", // Disallow unused labels
  "no-useless-call": "error", // Disallow unnecessary .call() and .apply()
  "no-useless-catch": "error", // Disallow unnecessary catch clauses
  "no-useless-concat": "error", // Disallow unnecessary concatenation of literals or template literals
  "no-useless-escape": "error", // Disallow unnecessary string escaping
  "no-useless-return": "error", // Disallow redundant return statements
  "no-void": "error", // Disallow use of void operator
  "no-warning-comments": "off", // Disallow specified warning terms in comments
  "no-with": "error", // Disallow use of the with statement
  "prefer-named-capture-group": "error", // Prefer using named capture group in regular expression
  "prefer-promise-reject-errors": "error", // Require using Error objects as Promise rejection reasons
  "prefer-regex-literals": "error", // Disallow use of the RegExp constructor in favor of regular expression literals
  "radix": "error", // Enforce the consistent use of the radix argument when using parseInt()
  "require-await": "error", // Disallow async functions which have no await expression
  "require-unicode-regexp": "error", // Enforce the use of u flag on RegExp
  "vars-on-top": "error", // Requires to declare all vars on top of their containing scope
  "wrap-iife": [ "error", "any" ], // Require immediate function invocation to be wrapped in parentheses
  "yoda": "error", // Require or disallow Yoda conditions
  // Possible Errors
  "no-cond-assign": "error", // Disallow assignment in conditional expressions
  "no-console": "warn", // Disallow console statements (warn or error)
  "no-debugger": "error", // Disallow debugger statements
  "no-dupe-args": "error", // Disallow duplicate arguments in functions
  "no-dupe-keys": "error", // Disallow duplicate keys when creating object literals
  "no-duplicate-case": "error", // Disallow a duplicate case label
  "no-empty": "error", // Disallow empty statements
  "no-ex-assign": "error", // Disallow reassignments of exceptions in catch clauses
  "no-extra-boolean-cast": "error", // Disallow unnecessary boolean casts
  "no-extra-parens": "error", // Disallow unnecessary parentheses
  "no-extra-semi": "error", // Disallow unnecessary semicolons
  "no-func-assign": "error", // Disallow reassignments of function declarations
  "no-inner-declarations": "error", // Disallow variable or function declarations in nested blocks
  "no-invalid-regexp": "error", // Disallow invalid regular expression strings in the RegExp constructor
  "no-irregular-whitespace": "error", // Disallow irregular whitespace outside of strings and comments
  "no-obj-calls": "error", // Disallow calling global object properties as functions
  "no-prototype-builtins": "error", // Disallow direct use of Object.prototypes builtins
  "no-regex-spaces": "error", // Disallow multiple spaces in a regular expression literal
  "no-sparse-arrays": "error", // Disallow sparse arrays
  "no-template-curly-in-string": "error", // Disallow template literal placeholder syntax in regular strings
  "no-unexpected-multiline": "error", // Disallow confusing multiline expressions
  "no-unreachable": "error", // Disallow unreachable statements after a return, throw, continue, or break statement
  "no-unsafe-finally": "error", // Disallow control flow statements in finally blocks
  "no-unsafe-negation": "error", // Disallow negating the left operand of relational operators
  "use-isnan": "error", // Require calls to isNaN() when checking for NaN
  "valid-typeof": "error", // Enforce comparing typeof expressions against valid strings

}

/** @type {import('eslint').Linter.Config[]} */
export default [

  {
    files: [ "**/*.{js,mjs,cjs,ts}" ],
    rules: rules
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];