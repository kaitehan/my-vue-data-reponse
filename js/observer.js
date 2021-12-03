class Observer {
    constructor(data){
        this.walk(data)
    }
    walk(data){
        if(!data||typeof data !== "object"){
            return
        }
        Object.keys(data).forEach(key=>{
            this.defineReactive(data,key,data[key])
        })
    }
    defineReactive(obj,key,value){
        let that = this
        // 负责收集依赖，并发送通知
        let dep = new Dep()
        this.walk(value)
        
        Object.defineProperty(obj,key,{
            enumerable:true,
            configurable:true,
            get(){
                // 收集依赖，就是将watcher观察者添加到subs数组中
                // 这里可以通过Dep中的target来获取观察者（Watcher对象），当然target属性还没有创建
                // 后期在创建Watcher观察者的时候，来确定target属性 
                Dep.target&&dep.addSub(Dep.target)
                return value
            },
            set(newValue){
                if(value===newValue){
                    return
                }
                that.walk(newValue)
                value = newValue
                // 发送通知，更新视图
                dep.notify()
            }
        })
    }
}