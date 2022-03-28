/*
自定义Promise模块
*/
(function(window) {
    const PENDING = 'pending';
    const RESOLVED = 'resolved';
    const REJECTED = 'rejected';
    /*
  Promise构造函数
    */
    function Promise(excutor) {
        const self = this;
        //状态属性，初始值为pending，代表初始未确定的状态
        self.status = PENDING;
        self.data = undefined; //用来存储结果数据的属性，初始值为undefined
        self.callbacks = [];
        //将promise的状态改为成功，指定成功的value
        function resolve(value) {
            if (self.status !== PENDING) return;
            self.status = RESOLVED;
            self.data = value;
            if (self.callbacks.length > 0) {
                setTimeout(() => {
                    self.callbacks.forEach(cbsObj => {
                        cbsObj.onResolved(value)
                    })
                });
            }
        };
        //将promise的状态改为失败，指定成功的reason

        function reject(reason) {
            if (self.status !== PENDING) return;
            self.status = REJECTED;
            self.data = reason;
            if (self.callbacks.length > 0) {
                setTimeout(() => {
                    self.callbacks.forEach(cbsObj => {
                        cbsObj.onRejected(reason)
                    })
                });
            }

        }
        //调用excutor
        try {
            excutor(resolve, reject)

        } catch (error) {
            reject(error);
        }
    };
    /*
            用来指定成功/失败回调函数的方法
            返回一个新的promise对象
            */
    ;
    Promise.prototype.then = function(onResolved, onRejected) {
        const self = this; //promise对象



        //返回一个新的promise对象
        return new Promise((resolve, reject) => {
            //try--catch 封装
            function handle(callback) {
                try {
                    const result = callback(self.data);
                    if (result instanceof Promise) {
                        result.then(
                            value => resolve(value),
                            reason => reject(reason)
                        )
                    } else {
                        resolve(result)
                    }
                } catch (error) { //抛出error===》变为rejected，结果值为error
                    reject(error);
                }
            }



            if (self.status === RESOLVED) {
                setTimeout(() => {
                    handle(onResolved)
                });
            } else if (self.status === REJECTED) {
                setTimeout(() => {
                    handle(onRejected)
                });
            } else { //PENGDING
                self.callbacks.push({
                    onResolved(value) {
                        handle(onResolved)
                    },
                    onRejected(reason) {
                        handle(onRejected)
                    }
                })
            }
        })

    };
    /*
            用来指定失败回调函数的方法
            */
    ;
    Promise.prototype.catch = function(onRejected) {

    };
    /*
            用来返回一个指定value的成功promise
            */
    ;
    Promise.resolve = function(value) {

    };
    /*
            用来返回一个指定reason的失败promise
            */
    ;
    Promise.reject = function(reason) {

    };
    /*
    返回一个promise，只有当数组中所有promise都成功才成功，否则失败
    */
    Promise.all = function(promises) {

    };
    /*
        返回一个promise，由第一个完成promise决定;
        */
    Promise.race = function(promises) {

    };
    //向外暴露Promise
    window.Promise = Promise;
})(window)