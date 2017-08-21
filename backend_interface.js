// backend_interface.js
// 提供与后端交互的接口

/*
user_info = {
    name : '姓名',
    school : '学校',
    student_id :'学号',
    phone : '手机号',
};*/
// 向后端发起学生注册请求，返回用户的ID或错误原因
function student_register(userinfo, callback)
{
    // TODO:
    var id = '000002';
    callback(true, id);

    // callback(false, "服务器异常");
    // callback(false, "数据不合法");
}

// 向后端请求排行数据，回调结果
function query_rank_info(callback)
{
    // TODO:
    callback(
        // rank list
        [
            // id, name, score
            ['000001', "doing", 1000],
            ['000002', "shenyq", 100],
            ['000003', "xxx", 5],
            ['000004', "xxx", 5],
            ['000005', "xxx", 5],
            ['000006', "xxx", 5],
            ['000007', "xxx", 5],
            ['000008', "xxx", 5],
            ['000009', "xxx", 5],
            ['000010', "xxx", 5],
            ['000011', "xxx", 5],
        ]
    );
}

// 上报最高分，回调上报结果
function report_score(id, score, extra_info, callback)
{
    // TODO:    
    callback(true, "");
}

