# @fluentwind/eslint-plugin-vue-i18n

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

Add `@fluentwind/vue-i18n` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "@fluentwind/vue-i18n"
    ]
}
```

Or `@fluentwind/vue-i18n` to the extends section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "extends": [
        "plugin:@fluentwind/vue-i18n/base"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "@fluentwind/vue-i18n/no-duplicated-values": "warn"
    }
}
```

## Supported Rules

###no-duplicated-values
多个文件共同扫描时：
1. 检测不同语言中相同的key-value
2. 单个文件中重复定义的value
3. 在其他语言没定义的key

en.js:
````js
export default {
  all: 'All',
  submit: 'Submit',
  operation: {
    submit: '操作',
    submit2: '操作en',
  },
};
````

zh-CN.js:
````js
export default {
  all: 'All',
  submit: '操作',
  operation: {
    submit: '操作',
    submit2: '操作',
    submit3: '操作',
  },
};
````
zh-TW.js:
````js
export default {
  all: 'All',
  submit: '操作TW',
  operation: {
    submit: '操作',
    submit2: '操作',
  },
  submit2: '操作TW',
};

````
输出:
````
eslint-plugin-vue-i18n\tests\data2\en.js
  3:3  warning  'all': 'All' 在所有国际化语言中都相同，建议无需国际化              no-duplicated-values
  6:5  warning  'operation.submit': '操作' 在所有国际化语言中都相同，建议无需国际化  no-duplicated-values

eslint-plugin-vue-i18n\tests\data2\zh-CN.js
  3:3  warning  'all': 'All' 在所有国际化语言中都相同，建议无需国际化              no-duplicated-values
  6:5  warning  'operation.submit': '操作' 在所有国际化语言中都相同，建议无需国际化  no-duplicated-values
  8:5  warning  'operation.submit3' 在语言en中未定义                  no-duplicated-values
  8:5  warning  'operation.submit3' 在语言zh-TW中未定义               no-duplicated-values
  8:5  warning  当前语言中重复定义了值 'operation.submit3': '操作'          no-duplicated-values

eslint-plugin-vue-i18n\tests\data2\zh-TW.js
  3:3  warning  'all': 'All' 在所有国际化语言中都相同，建议无需国际化              no-duplicated-values
  6:5  warning  'operation.submit': '操作' 在所有国际化语言中都相同，建议无需国际化  no-duplicated-values
  9:3  warning  'submit2' 在语言en中未定义                            no-duplicated-values
  9:3  warning  'submit2' 在语言zh-CN中未定义                         no-duplicated-values
  9:3  warning  当前语言中重复定义了值 'submit2': '操作TW'                  no-duplicated-values

✖ 12 problems (0 errors, 12 warnings)
````






