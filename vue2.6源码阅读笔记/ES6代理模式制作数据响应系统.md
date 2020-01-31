# Vue数据响应系统的代理模式实现

## 1.工具准备

需要的环境如下：

- Node环境（babel）
- TypeScript

需要的知识储备：

- 《ES6标准入门》

## 2.思路

### 2.1总体结构

​	该实践的总体结构是以一个`Watcher`实现类为载体，模拟`Vue`的方式，将需要进行响应的数据（`data`）、渲染函数（`render`）、挂载的`dom`节点输入进来。然后对传参送进来的`data`的属性进行改变的时候，会触发`render`函数的调用（前提是这个修改的数据有在渲染函数中被使用到）。

- `Watcher`类的结构

  ```typescript
  class Watcher {
   	// 渲染函数数组，一个数据可能不止存在于一个渲染函数当中，可能会有多个渲染函数调用
    renderList: Array<Function>;
    // 数据
    data: any;
    // 挂载的el元素
    el: String | HTMLElement;
  }
  ```

  上面是`Watcher`类的结构，将数据、渲染函数、`dom`元素传进来后，就会进行自动进行监测。

- 代理工具实现

  - 对要被观察的对象添加`notifySet`，是一个`Set`。这个集合存放着哪些属性被观察到，如果被观察到的，对其进行`setter`调用的时候，会触发渲染函数进行渲染。
  - 将被观察的对象替换成代理后的对象，使用方式一样，只不过多了一层代理，这也就是代理模式的作用。
  - 本项目默认使用的是深度观察，其实可以多一个`flag`来实现是否深度观察。

- 代理思路

  - 对`getter`和`setter`进行改写，在`getter`的时候进行依赖的确定（因为在`render`函数使用到了，所以这个依赖应当被监控），在`setter`的时候对渲染函数进行调用（当值改变的时候，需要对相应的渲染内容进行更新，这也就是本文章的目的）
  - 在对`notifySet`进行添加属性的时候，只需要将被观察到的属性放进这个`set`中，无关的属性则不放进去。本项目的实现思路是如下：
    - 开启依赖添加模式
    - 创建代理对象
    - 以代理对象为数据执行渲染函数，从而实现依赖的添加
    - 关闭依赖添加模式

- 项目结构

  ```
  -DataBind
  --core
   |- Proxy.ts   // 代理工具
  --utils
   |- Utils.ts   // 通用工具
  Watcher.ts
  ```

### 2.2细节实现

- `Watcher`类的具体实现

  - 构造器

    ```typescript
    interface WatcherOption {
        el: String | HTMLElement;     // 绑定现有的dom对象
        data: any;   // 数据对象
        render: Function;   // 渲染函数
    }
    
    constructor(options: WatcherOptions) {
      if (typeof options.el === 'string') {
        this.el = document.getElementById(options.el);
      } else {
        // @ts-ignore
        this.el = options.el;
      }
      this.data = makeProxy.call(this, options.data);  // 先将整一个数据对象深度遍历构建代理层
      this.addRender(options.render);       // 将渲染函数添加到渲染函数数组中
    }
    ```

    构造器传进来配置(`options`)，配置有三个重要的属性：挂载对象、数据对象、渲染函数。具体流程如下：

    1. 将数据进行创造代理对象，并且将结果返回给`data`属性
    2. 进行添加渲染函数到列表中
    3. 节点的挂载

  - 渲染函数管理

    ```typescript
    /**
     * @description 为渲染函数所调用到的对象查询需要代理的对象
     * @param fn
     */
    public addRender(fn: Function): void {
      Watcher.target = this;  		// 开启代理模式，这个target对象是Watcher类的静态变量，在proxy函数里面会使用到
      this.renderList.push(fn);
      this.notify();
      Watcher.target = null;			// 关闭代理模式
    }
    ```

    `Watcher.target`是`Watcher`的静态属性，这个属性的作用是记录当前进行观测的对象。这个对象会在代理的时候用到。使用这个原因是：在添加依赖的时候，先当前的`Watcher`设置为`Watcher.target`，然后调用渲染函数，渲染函数会调用响应的属性的`getter`，从而触发代理层进行添加依赖（后面重新渲染的时候，是不会进行依赖的重复添加，因为`Watcher.target`为空。这个在**makeProxy**函数里面可以查看到。

    所以这个函数是先将记录当前的`Watcher`实例，然后将渲染函数推进数组中，再进行调用渲染函数。此时会进行依赖的添加，然后将`target`设为空。

- 代理层的实现

  ```typescript
  
  /**
   * @description 这个是我们本文章的核心代码，因为我没有设置watch、computed属性，所以也就不需要筐来存放watcher。也就不会有Dep这个类
   * @param object
   * @param this Wacther对象
   */
  export function makeProxy(this: Watcher, object: any): any {
      object.__proxy__ = {};
      // @ts-ignore
      object.__proxy__.notifySet = new Set<string | number | symbol>();
      object.__watcher__ = this;
  
      // @ts-ignore
      let proxy = new Proxy(object, {
          get(target: any, p: string | number | symbol, receiver: any): any {
              if (Watcher.target != null) {
                  Watcher.addDep(object, p);  // 添加依赖
              }
              return target[p];
          },
          set(target: any, p: string | number | symbol, value: any, receiver: any): boolean {
              if (target[p] !== value) {
                  // 两个值不同的时候才需要去渲染视图层
                  target[p] = value;
                  if (target.__proxy__.notifySet.has(p)) {
                      target.__watcher__.notify();
                  }
              }
  
              return true;
          }
      });
  
      // 获取对象的所有子属性，并且对子属性进行递归代理以便实现深度观察
      let propertyNames = Object.getOwnPropertyNames(object);
  
      for (let i = 0; i < propertyNames.length; i++) {
          // @ts-ignore
          if (isPlainObject(object[propertyNames[i]]) && (!propertyNames[i].startsWith('__') && !propertyNames[i].endsWith('__'))) {
              object[propertyNames[i]] = makeProxy.call(this, object[propertyNames[i]]);
          }
      }
  
      return proxy;
  }
  
  ```

  此功能有两个特别注意的点，第一个是对object属性的添加、第二个是代理对象的细节。

  - `object`属性的添加：

    - `__proxy__.notifySet`:这是存放`set`实例的属性，这个`set`实例是进行记录哪个属性被监听到，如果该属性被监听，那么会放到这个集合中，方便得知监听哪个属性
    - `__watcher__`:这个是指向当前的`wacher`实例对象。

  - 代理对象的生成:

    ```typescript
    new Proxy(object, {
      get(target: any, p: string | number | symbol, receiver: any): any {
        if (Watcher.target != null) {
          Watcher.addDep(object, p);  // 添加依赖
        }
        return target[p];
      },
      set(target: any, p: string | number | symbol, value: any, receiver: any): boolean {
        if (target[p] !== value) {
          // 两个值不同的时候才需要去渲染视图层
          target[p] = value;
          if (target.__proxy__.notifySet.has(p)) {
            // 仅仅当notifySet拥有这个属性的时候，才进行渲染函数的执行
            target.__watcher__.notify();
          }
        }
    
        return true;
      }
    });
    ```

    - `getter`:要特别主要到一个判断语句:

    ```typescript
    if (Watcher.target != null) {
    	Watcher.addDep(object, p);  // 添加依赖
    }
    ```

    还记得在添加渲染函数的时候，修改`Watcher.target`吗？这个条件不为空的时候就是在添加渲染函数的时候，将对象的属性添加进`notifySet`中，方便调用该属性的时候执行回调函数

    - `setter`：这个已经代码已经解释得很清楚了，就是判断这个属性有没有被渲染函数被添加至集合中，如果有的话，就进行调用渲染函数。

## 3.代码

- `Watcher`

```typescript
// @ts-ignore
import {makeProxy} from "./core/Proxy";

interface WatcherOption {
    el: String | HTMLElement;     // 绑定现有的dom对象
    data: any;   // 数据对象
    render: Function;   // 渲染函数
}

/**
 * @description 观察者对象，由于我们目的是用代理模式来进行模拟vue数据响应系统，那么就从简设计这个类
 */
export class Watcher {
    // 全局使用到watcher实例，指向当前的watcher对象，方便proxy使用
    public static target: any;
    data: any = {};
    el: HTMLElement;
    renderList: Array<Function> = new Array<Function>();

    constructor(options: WatcherOption) {
        if (typeof options.el === 'string') {
            this.el = document.getElementById(options.el);
        } else {
            // @ts-ignore
            this.el = options.el;
        }
        this.data = makeProxy.call(this, options.data);  // 先将整一个数据对象深度遍历构建代理层
        this.addRender(options.render);       // 将渲染函数添加到渲染函数数组中
    }

    // 响应并且调用观察者对象
    notify(): void {
        for (let item of this.renderList) {
            item.call(this.data, this.createElement);
        }
    }

    /**
     * @description 为渲染函数所调用到的对象查询需要代理的对象
     * @param fn
     */
    public addRender(fn: Function): void {
        Watcher.target = this;  // 进行添加依赖的时候，要确定给哪个
        this.renderList.push(fn);
        this.notify();
        Watcher.target = null;
    }

    /**
     * @description 为每个数据对象添加代理层的需要观察的观察者列表
     * @param object
     * @param property
     */
    static addDep(object, property): void {
        object.__proxy__.notifySet.add(property);
    }

    static removeDep(object, property): void {
        object.__proxy___.notifySet.remove(property);
    }

    private createElement(innerHTML: string) {
        _createElement(this.el, innerHTML);
    }
}

const _createElement = (dom: HTMLElement, innerHtml: string) => {
    dom.innerHTML = innerHtml;
};

```

- `Proxy`

```typescript
/**
 * 在对象上添加一个属性  __proxy__
 * 这个属性代表着这个对象的代理层所存放的东西
 */
import {isPlainObject} from "../utils/Utils";
import {Watcher} from "../Watcher";

/**
 * @description 这个是我们本文章的核心代码，因为我没有设置watch、computed属性，所以也就不需要筐来存放watcher。也就不会有Dep这个类
 * @param object
 * @param this Wacther对象
 */
export function makeProxy(this: Watcher, object: any): any {
    object.__proxy__ = {};
    // @ts-ignore
    object.__proxy__.notifySet = new Set<string | number | symbol>();
    object.__watcher__ = this;

    // @ts-ignore
    let proxy = new Proxy(object, {
        get(target: any, p: string | number | symbol, receiver: any): any {
            if (Watcher.target != null) {
                Watcher.addDep(object, p);  // 添加依赖
            }
            return target[p];
        },
        set(target: any, p: string | number | symbol, value: any, receiver: any): boolean {
            if (target[p] !== value) {
                // 两个值不同的时候才需要去渲染视图层
                target[p] = value;
                if (target.__proxy__.notifySet.has(p)) {
                    // 仅仅当notifySet拥有这个属性的时候，才进行渲染函数的执行
                    target.__watcher__.notify();
                }
            }

            return true;
        }
    });

    // 获取对象的所有子属性，并且对子属性进行递归代理以便实现深度观察
    let propertyNames = Object.getOwnPropertyNames(object);

    for (let i = 0; i < propertyNames.length; i++) {
        // @ts-ignore
        if (isPlainObject(object[propertyNames[i]]) && (!propertyNames[i].startsWith('__') && !propertyNames[i].endsWith('__'))) {
            object[propertyNames[i]] = makeProxy.call(this, object[propertyNames[i]]);
        }
    }

    return proxy;
}

```

- `utils`

```typescript
const _toString = Object.prototype.toString
/**
 * @description 用于普通的函数，提取函数的内部代码块
 * @param func
 */
export function getFunctionValue(func: Function): string {
    let funcString: string = func.toLocaleString();
    let start: number = 0;

    for (let i = 0; i < funcString.length; i++) {
        if (funcString[i] == '{') {
            start = i + 1;
            break;
        }
    }

    return funcString.slice(start, funcString.length - 1);
}

export function isPlainObject (obj: any): boolean {
    return _toString.call(obj) === '[object Object]'
}
```

