```js
const then = Promise.resolve();

const nextTick = (cb) => {
  then.then(cb);
};

const STATE = {
  FULL_FILLED: 0,
  PENDING: 1,
  REJECT: 2
};

const isUndef = (tar) => {
  return typeof tar === 'undefined' || tar === null;
};

const isDef = tar => !isUndef(tar);

const isArray = tar => Array.isArray(tar);

class MyPromise {
  state = '';
  callbackQueue = [];
  resolveData = undefined;
  errorData = undefined;

  constructor(fn) {
    this.state = STATE.PENDING;

    // 初次到达的时候直接同步执行
    fn(this.resolve, this.reject);
  }

  detailResolveCb(cbOrCbArray) {
    if (isArray(cbOrCbArray)) {
      // 如果是数组的话，那么就要进行递归调用nextTick进行执行cb
      nextTick(() => {
        if (cbOrCbArray.length === 0) {
          return ;
        }
        let cb = cbOrCbArray.shift();
        try {
          this.resolveData = cb.successCb(this.resolveData);
          this.detailResolveCb(cbOrCbArray)
        } catch (e) {
          cb.errorCb(e);
        }
      })
    } else {
      // 如果不是一个数组，说明是在解决后进行添加，此时对于then的处理方式是直接放到
      nextTick(() => {
        this.resolveData = cbOrCbArray(this.resolveData);
      });
    }
  }

  rejectResolve(err) {
    let cbItem;

    while (this.callbackQueue.length !== 0) {
      cbItem = this.callbackQueue.shift();

      if (isDef(cbItem) && isDef(cbItem.errorCb)) {
        try {
          cbItem.errorCb(err);
        } catch (e) {
          this.rejectResolve(e);
        }
        break;
      }
    }
  }

  resolve = (data) => {
    if (this.state !== STATE.PENDING) {
      return ;
    }
    this.state = STATE.FULL_FILLED;
    this.resolveData = data;
    this.detailResolveCb(this.callbackQueue);
  };

  reject = (err) => {
    if (this.state !== STATE.PENDING) {
      return ;
    }
    this.state = STATE.REJECT;
    this.rejectResolve(err);
  };

  then = (successCb, errorCb) => {
    if (this.state !== STATE.PENDING) {
      // 如果不在pending状态的时候，直接放到微观队列进行执行
      if (this.state === STATE.FULL_FILLED) {
        this.detailResolveCb(successCb);
      }
    } else {
      // 如果在pending的情况下进行存储功能
      this.callbackQueue.push({
        successCb,
        errorCb
      });
    }
    return this;
  };

  catch = (errorCb) => {
    this.callbackQueue.push({
      errorCb
    });
    return this;
  };
}

console.log('start');
let a = new MyPromise((res, rej) => {
  console.log('inner');
  setTimeout(() => {
    rej(123)
  }, 1000)
}).then(res => {
  console.log('resed');
  return 1
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
  throw new Error('故意出错')
}).catch(res => {
  console.log(res)
});
console.log('end');
```

