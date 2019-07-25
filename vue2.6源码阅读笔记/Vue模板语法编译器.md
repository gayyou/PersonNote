#  Vue的语法模板编译器

## 一、编译器内部结构以及解释

### 1.抽象语法树的生成

#### 抽象语法树解析函数

| 函数名                    | 作用                                                         |
| ------------------------- | ------------------------------------------------------------ |
| compileToFunctions        | 生成渲染函数、静态渲染函数                                   |
| createCompiler            | compileToFunctions、compile方法的生成函数                    |
| createCompilerCreator     | 可以根据传进来的基础编译方法（bashCompile）生成不同的createCompiler |
| createCompileToFunctionFn | 将compile转为compileToFunctions方法                          |
| compile                   | 根据baseCompile组合而成的方法                                |

#### 调用关系路径图

![12](images/12.png)

- `createCompilerCreator`函数通过传入`baseCompile`，将`baseComile`进行添加属性配置，从而返回一个创建编译器的方法（`createCompiler`）。
- `createCompiler`可以通过传入参数配置得到编译器`compile`以及编译器转成的函数`compileToFunctions`。`compileToFunctions`可以得到渲染函数以及静态渲染函数
- `compileToFunctions`是由`compile`通过调用`createCompileToFunctionsFn`函数生成

#### 为何要有这种内部结构

- 为何要有`baseCompile`进行传参从而返回`createCompiler`呢？

  首先我们要知道`Vue`源码中的编译器的目录结构：

  ```text
  ├── src
  │   ├── compiler -------------------------- 编译器代码的存放目录
  │   ├── ├── codegen ----------------------- 根据AST生成目标平台代码
  │   ├── ├── parser ------------------------ 解析原始代码并生成AST
  ```

  编译器由两部分组成，一部分是进行解析原始的代码生成抽象语法树（AST），第二部分则是根据抽象语法树生成目标平台代码。

  两个部分分别会导出一个函数进行调用生成：

  - `codegen`导出`generate`方法将AST生成目标代码
  - `parser`导出`parse`将模板生成AST

  有了上面的两个方法，就可以制作一个自己的编译器，可以通过模板编译形成目标代码，如下：

  ```js
  function myCompiler (template, options) {
  	const ast = parse(template.trim(), options);
    const code = generate(ast, options);
    
    // 检验错误的代码
    
    retrun code;
  }
  ```

  上面的代码就封装了一个编译器，可以直接使用。但是如果现在多了一个需求，需要再制作别的类型的编译器，那么就需要进行定义其他类型的编译器 。

  ```js
  function myCompiler (template, options) {
  	const ast = parse(template.trim(), options);
    const code = otherGenerate(ast, options);
    
    // 检验错误的代码
    
    retrun code;
  }
  ```

  ast是不会进行改变的。并且一般情况下，检验错误的代码是相同的，这时候就会出现一个代码冗余的现象。如果可以将检错代码封装起来，叫做`createCompilerCreator`。然后通过传入`baseCompile`生成一个`createCompiler`。如下：

  ```js
  function createCompilerCreator (baseCompile) {
    return createCompiler function (template: string, options: CompilerOptions) {
  
      // 一些处理编译错误的代码
  
      return baseCompile(template, options)
    }
  }
  ```

  这样我们就可以根据具体情况生成不同平台的语法编译器

  ```js
  // 创建 web 平台的编译器
  const webCompiler = createCompilerCreator(function baseCompile (template, options) {
    const ast = parse(template.trim(), options)
    const code = generate(ast, options)
    return code
  })
  
  // 创建其他平台的编译器
  const otherCompiler = createCompilerCreator(function baseCompile (template, options) {
    const ast = parse(template.trim(), options)
    const code = otherGenerate(ast, options)
    return code
  })
  ```

  实际上，`Vue`中有两种平台，一种是web平台，另外一种是ssr平台，两者的编译器是不同的。

  现在我们再来看 `src/compiler/index.js` 文件中的如下这段代码：

  ```js
  export const createCompiler = createCompilerCreator(function baseCompile (
    template: string,
    options: CompilerOptions
  ): CompiledResult {
    const ast = parse(template.trim(), options)
    if (options.optimize !== false) {
      optimize(ast, options)
    }
    const code = generate(ast, options)
    return {
      ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  })
  ```

  实际上这段代码所创建的就是 `web` 平台下的编译器，大家可以打开 `src/server/optimizing-compiler/index.js` 文件，你会看到如下这段代码：

  ```js
  export const createCompiler = createCompilerCreator(function baseCompile (
    template: string,
    options: CompilerOptions
  ): CompiledResult {
    const ast = parse(template.trim(), options)
    optimize(ast, options)
    const code = generate(ast, options)
    return {
      ast,
      render: code.render,
      staticRenderFns: code.staticRenderFns
    }
  })
  ```

  而这段代码是用来创建服务端渲染环境的编译器，注意如上代码中的 `generate` 函数和 `optimize` 函数已经是来自 `src/server` 目录下的相关文件了。

- `compile`和`compileToFunctions`有什么区别呢？

  `compileToFunctions`是`compile`通过`createCompileToFunctionsFn`方法生成的。`compile`是将代码以字符串形式生成，`compileToFunctions`则是将字符串的代码生成真正可用的代码。

## 二、词法分析器

## 三、句法分析器