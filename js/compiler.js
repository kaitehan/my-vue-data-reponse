class Compiler{
    constructor(vm){
        this.el = vm.$el
        this.vm = vm
        this.compiler(this.el)
    }
    // 编译模板
    compiler(el){
        // 获取el的所有子节点
        let childNodes = el.childNodes
    // 由于这个节点数组是一个伪数组，所以需要通过Array.from转换成数组
        Array.from(childNodes).forEach(node=>{
            // 处理文本节点
            if(this.isTextNode(node)){
                this.compileText(node)

            }else if(this.isElementNode(node)){
                // 处理元素节点
                this.compileElement(node)
            }
            // 判断node是否有子节点，  如果有子节点，需要递归调用compile方法
            if(node.childNodes&&node.childNodes.length){
                this.compiler(node)
            }
        })


    }
    // 编译文本节点，处理插值表达式
    compileText(node){
        // console.log(node);
        // 用data中的属性值替换掉大括号中的内容
        let reg  = /\{\{(.+)\}\}/
        // 获取文本节点内容
        let value = node.textContent
        console.log(value);
        // 判断文本节点的内容是否能够匹配正则表达式
        if(reg.test(value)){
            // {{msg}}
            // 获取插值表达式中的变量名，去掉空格（$1 表示获取第一个分组的内容）
            let key = RegExp.$1.trim()
            // console.log(key);
            // 根据变量名，获取data中的具体值，然后替换掉插值表达式中的变量名
            node.textContent = value.replace(reg,this.vm[key])

            // 创建Watcher对象，当数据发生变化后，更新视图
            new Watcher(this.vm,key,(newValue)=>{
                // newValue是更新后的值
                node.textContent = newValue
            })
        }

    }
    // 编译元素节点，处理指令
    compileElement(node){
        // 1.获取当前节点下的所有属性，然后通过循环 的方式，取出每个属性，判断是否为指令
        // 2.如果是指令，获取指令名称与指令对应的值
        // 3.分别对v-text指令与v-model指令的情况进行处理
        // 由于这个属性数组是一个伪数组，所以需要通过Array.from转换成数组
        Array.from(node.attributes).forEach(attr=>{
            // 获取属性名字
            let attrName = attr.name
            // console.log(attrName);
            // 判断是否为指令
            if(this.isDirective(attrName)){
                // 如果是指令，需要分别进行处理，也就是分别对v-text与v-model指令
                // 进行处理
                // 为了避免在这里书写大量的if判断语句，这里做一个简单的处理
            // 对属性名进行截取,只获取v-text/v-model中的text/model
                attrName = attrName.substr(2)
                // 获取指令对应的值 v-text指令对应的值为msg，v-model指令对应的值为msg,count
                let key = attr.value
                this.update(node,key,attrName)
            }
        })

    }
    update(node,key,attrName){
        // 根据传递过来 的属性名字拼接Updater后缀获取方法
        let updateFn = this[attrName+'Updater']
        updateFn&&updateFn.call(this,node,this.vm[key],key) //注意：传递的是根据指令的值获取到的是data中对应属性的值
    }
    // 处理v-text指令
    textUpdater(node,value,key){
        node.textContent = value
        new Watcher(this.vm,key,newValue=>{
            node.textContent= newValue
        })
    }
    // 处理v-model
    modelUpdater(node,value,key){
        // v-model是文本框的属性，给文本框赋值需要通过value属性
        node.value = value
        new Watcher(this.vm,key,newValue=>{
            node.value = newValue
        })
        // 监听元素的原生事件，给data中的属性赋值，调用set方法触发观察者函数   实现双向绑定
        node.addEventListener('input',()=>{
            this.vm[key] = node.value
        })
    }
    // 判断元素属性是否为指令
    isDirective(attrName){
        // 指令都是以v-开头
        return attrName.startsWith("v-")
    }
    // 判断节点是否为文本节点
    isTextNode(node){
        // nodeType: 节点类型 1：元素节点  3：文本节点
        return node.nodeType === 3
    }
    // 判断节点是否为元素节点
    isElementNode(node){
        return node.nodeType === 1
    }
}