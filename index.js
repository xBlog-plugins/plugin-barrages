// 使用博客系统提供的接口
const router =xBlog.router
const database =xBlog.database
const tools = xBlog.tools
const widget = xBlog.widget
// 一些字段
const dbBarrage = "barrage"
const keyBackground = "dou_ban_img"
// 获取所有弹幕
router.registerRouter("GET","",function(context){
    let db = database.newDb(dbBarrage)
    db.FindMany({
        "sort": { "_id":-1 }
    },function (err,data){
        if (err == null){
            let response = []
            // 遍历查询到的数据
            data.forEach(function (item){
                // 只放入我们需要的值
                response.push({
                    avatar : item.avatar,
                    content : item.content,
                    nickname : item.nickname,
                    color : item.color
                })
            })
            // 返回赞助数据
            router.response.ResponseOk(context,response)
        } else {
            router.response.ResponseServerError(context,"获取友链数据失败")
        }
    })
})

// 用户提交弹幕
router.registerRouter("POST","",function (context){
    // 先获取请post请求的数据
    let param = router.getPostJson(context)
    // 验证关键字段是否为空
    if (
        tools.verifyField(param.content) &&
        tools.verifyField(param.nickname) &&
        tools.verifyField(param.color)
    ){
        // 设置需要插入的数据
        let data = {
            avatar: param.avatar,
            content: param.content,
            nickname: param.nickname,
            color: param.color,
            send: new Date(),
        }
        // 插入数据
        let db = database.newDb(dbBarrage)
        db.InsertOne(data,function (err,res){
            // 判断是否插入成功
            if (err==null){
                // 为了兼容旧版接口，我们还需要返回值
                data.id = res.InsertedID
                router.response.ResponseCreated(context,data)
            } else {
                router.response.ResponseServerError(context)
            }
        })
    } else {
        router.response.ResponseBadRequest(context,"请检查颜色、内容、昵称是否填写并正确！")
    }
})

// 注册豆瓣接口
widget.addPage({
    background: tools.getSetting(keyBackground),
    file:"index.html",
    headMeta: {
        title: "弹幕留言墙",
    },
    css: ["element"],
    script: ["vue","element","jquery"],
    url: "",
    full: false,
    side: false
},function (){
    //获取一言
    // setting.Talk = tools.HttpGet("https://v1.hitokoto.cn?c=a&c=b&c=c&c=d&c=e&c=f&c=g&c=h&c=i&c=j&c=k&c=l&encode=text")
    let talk = ""
    // 友链设置
    return {
        server: "/plugins/static/barrages"
    }
})




