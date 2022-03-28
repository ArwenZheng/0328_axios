//自定义promise模块,（es5语法）匿名函数调用
(function(window) {
    const PENDING = 'pending';
    const RESOLVED = 'resolved';
    const REJECTED = 'rejected';
    // 1,promise构造函数
    function Promise(excutor) {
        const self = this;
        self.status = PENDING;
        self.data = undefined;
        self.callbacks = [];

        function resolve(value) {
            if (self.status !== PENDING) return;
            self.status = RESOLVED;
            self.data = value;
            if (self.callbacks.length > 0) {
                setTimeout(() => {
                    self.callbacks.forEach(callbacksObj => {
                        callbacksObj.onresolved(value);
                    })
                });
            }
        };

        function reject(reason) {
            if (self.status !== PENDING) return;
            self.status = REJECTED;
            self.data = reason;
            if (self.callbacks.length > 0) {
                setTimeout(() => {
                    self.callbacks.forEach(callbacksObj => {
                        callbacksObj.onrejected(value);
                    })
                });
            }
        };
        try {
            excutor(resolve, reject)
        } catch (error) { //执行器执行出错，当前promise变为失败
            reject(error);
        }
    };
    Promise.prototype.then = function(onresolved, onrejected) {
        const self = this;
        onresolved = typeof onresolved === 'function' ? onresolved : value => value; //将value向下传递
        onrejected = typeof onrejected === 'function' ? onrejected : reason => { throw reason }; //将reason向下传递
        return new Promise((resolve, reject) => {
            function handle(callback) {
                try {
                    const result = callback(self.data);
                    if (result instanceof Promise) {
                        result.then(
                            value => resolve(value),
                            reason => reject(reason)
                        );
                        //result.then(resolve,reject)
                    }
                } catch (error) {
                    reject(error);
                }
            }


            if (self.satus === RESOLVED) {
                setTimeout(() => {
                    handle(onresolved)
                });
            } else if (self.satus === REJECTED) {
                setTimeout(() => {
                    handle(onrejected);

                });
            } else {
                self.callbacks.push({
                    onresolved(value) {
                        handle(onresolved);
                    },
                    onrejected(reason) {
                        handle(onrejected);
                    }
                })
            }
        })
    };
    Promise.prototype.catch = function(onrejected) {
        return this.then(undefined, onrejected)
    };
    Promise.resolve = function(value) {
        return new Promise((resolve, reject) => {
            if (value instanceof Promise) {
                value.then(resolve, reject);
            } else {
                resolve(value)
            }
        })
    };
    Promise.reject = function(reason) {
        return new Promise((resolve, reject) => {
            reject(reason)
        })
    };
    Promise.all = function(promises) {
        return new Promise((resolve, reject) => {
            let resolvedCount = 0;
            let values = new Array(promises.length);
            promises.forEach((p, index) => {
                p.then(
                    value => {
                        resolvedCount++;
                        values[index] = value
                        if (resolvedCount === promises.length) {
                            resolve(values)
                        }
                    },
                    reason => reject()
                )
            })
        })
    };
    Promise.race = function(promises) {
        return new Promise((resolve, reject) => {
            promises.forEach(p => {
                p.then(resolve, reject)
            })
        })
    };

    //返回一个延迟指定时间才成功的promise
    Promise.resolveDelay = function(value, time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (value instanceof Promise) {
                    value.then(resolve, reject);
                } else {
                    resolve(value);
                }
            }, time);
        })
    };
    //返回一个延迟指定时间才失败的promise
    Promise.rejectDelay = function(reason, time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(reason);
            }, time);
        })
    };
    //向外包喽promise
    window.Promise = Promise;
})(window)