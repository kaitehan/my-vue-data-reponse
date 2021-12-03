// 接受初始化参数
// 把data中 的属性注入到Vue中，并转成getter/setter
// 调用observer监听data中的所有属性变化
// 调用compiler解析指令或者插值表达式

// _proxyData私有方法将data中的属性转成getter/setter


class Vue{
    constructor(options){
        // 1.接受传递过来的选项，并且进行保存
        // options:表示在创建Vue实例的时候传递过来的参数，将其保存到$options中。
        this.$options = options || {}
        // 获取选项参数中的data
        this.$data = options.data||{}
        this.$el = typeof options.el==='string' ? document.querySelector(options.el):options.el
        // 2.把data转换成getter/setter
        //通过proxy函数后，在控制台上，可以通过vm.msg直接获取数据，而不用输入vm.$data.msg
        this._proxyData(this.$data)
         //3.调用observer对象，监听数据的变化
        new Observer(this.$data)
        //4.调用compiler对象，解析指令和差值表达式
        new Compiler(this)
    }
    _proxyData(data){
        //遍历data中的所有属性
        Object.keys(data).forEach(key=>{
            // 把data中的属性输入注入到Value实例中，注意，这里使用的是箭头函数，this表示的就是Vue的实例。
            //后期我们可以通过this的形式来访问data中的属性。
            Object.defineProperty(this,key,{
                enumerable:true,
                configurable:true,
                get(){
                    return data[key]
                },
                set(newValue){
                    if(data[key]===newValue){
                        return
                    }
                    data[key] = newValue
                }
                
            })
        })
    }
}