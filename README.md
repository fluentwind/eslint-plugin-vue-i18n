# eslint-plugin-vue-i18n

lint vue i18n

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `@fluentwind/eslint-plugin-vue-i18n`:

```
$ npm install @fluentwind/eslint-plugin-vue-i18n --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-vue-i18n` globally.

## Usage

Add `vue-i18n` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@fluentwind/vue-i18n"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "vue-i18n/no-duplicated-values": "warn"
    }
}
```

## Supported Rules

* Fill in provided rules here





