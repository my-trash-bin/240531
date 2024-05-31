# \[`type-graphql`\] Bug when the field and the field resolver has the same name

Say we have GraphQL ObjectType `Foo` with field `@Field((type) => Boolean) bar: boolean`, and its field resolver `@FieldResolver((returns) => Boolean, { nullable: true }) bar(): boolean | null { return null; }`.

Then, resulting schema is `type Foo { bar: Boolean! }`, but querying Foo::bar produces an error: `Cannot return null for non-nullable field Foo.bar.`

## How to reproduce

```shell
git clone https://github.com/my-trash-bin/240531.git
npm i
npm start
```

## Result

Emitted schema:

```graphql
type Foo {
  bar: Boolean!
}
```

Query:

```graphql
{
  foo {
    bar
  }
}
```

Error message:

```json
{
  "errors": [
    {
      "message": "Cannot return null for non-nullable field Foo.bar.",
      "locations": [
        {
          "line": 3,
          "column": 5
        }
      ],
      "path": [
        "foo",
        "bar"
      ],
      "extensions": {
        "code": "INTERNAL_SERVER_ERROR",
        "stacktrace": [
          "Error: Cannot return null for non-nullable field Foo.bar.",
          "    at completeValue (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:605:13)",
          "    at executeField (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:500:19)",
          "    at executeFields (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:414:22)",
          "    at completeObjectValue (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:925:10)",
          "    at completeValue (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:646:12)",
          "    at completeValue (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:595:23)",
          "    at executeField (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:500:19)",
          "    at executeFields (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:414:22)",
          "    at executeOperation (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:344:14)",
          "    at execute (/Users/user/workspace/my-trash-bin/240531/node_modules/graphql/execution/execute.js:136:20)"
        ]
      }
    }
  ]
}
```

## Expected behavior

- Error should occurred on `buildSchema`
- Foo::bar should be `Boolean` instead of `Boolean!`
- ... or anything intuitive
