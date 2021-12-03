class Dep{
    constructor(){
        // 存储所有的观察者
        this.subs=[]
    }
    // 收集依赖
    addSub(sub){
        // 判断传递过来的内容必须有值同时还必须是一个观察者，观察者中会有一个update方法
        if(sub&&sub.update){
            this.subs.push(sub)
        }
    }
    // 发送通知
    notify(){
        this.subs.forEach(sub=>{
            sub.update()
        })

    }

}