class Watcher{
    constructor(vm,key,cb){
        this.vm= vm
        // data中属性名称
        this.key = key
        // 回调函数，负责更新视图
        this.cb = cb
        // 把watcher对象记录添加到Dep类的静态属性target上
        Dep.target = this
        // 触发get方法，因为在get方法中会调用addSub方法（下面我们通过vm来获取key对应的值的时候，就执行了get方法，因为我们已经将data属性变成了响应式，为其添加了‘getter/setter’）
        // 获取更新前的旧值
        this.oldValue = vm[key]
        // 由于上面的语句是获取data中的值，所以会调用一次getter，即target已经被存储到了观察者队列中
        // 添加观察者实例后。为防止以后重复性的添加，将target静态属性置为空
        Dep.target =null
    }
    // 当数据发生变化时更新视图
    update(){
        // 只要update方法调用，获取到的值就是新值，因为当数据放生了变化，才会调用该方法
        let newValue = this.vm[this.key]
        // console.log(newValue);
        if(newValue===this.oldValue){
            return
        }
        // 调用cb回调函数更新视图，将新值传递到该回调函数中
        this.cb(newValue)
    }
}