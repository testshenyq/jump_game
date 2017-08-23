// backend_interface.js
// 提供与后端交互的接口

/*
发送：
user_info = {
    name : '姓名',
    school : '学校',
    student_id :'学号',
    phone : '手机号',
}

返回：
[ (bool)是否成功，(map)用户详细信息 | (string)失败原因 ]
*/
// 向后端发起学生注册请求，返回用户的详细信息或错误原因
function student_register(uinfo, callback)
{
    console.log("register", uinfo);

    // TODO:send userinfo
    var return_user_info = shallow_clone(uinfo);
    return_user_info.id = '000002';
    return_user_info.max_score = 1;
    callback(true, return_user_info);

    // callback(false, "服务器异常");
    // callback(false, "数据不合法");
}

/*
发送：当前玩家id(可能为null，此时为游客）
返回：[(int)当前玩家排名, (int)当前玩家分数，(array)排行列表]
排行列表格式：[ [ (string)玩家id, (string)玩家姓名, (int)玩家分数 ], ... ]
当前玩家排名为0时说明未入榜
*/
// 向后端请求排行数据，回调结果
function query_rank_info(id, callback)
{
    console.log("query rank info", id);

    // TODO:
    callback(
        2,      // rank
        100,    // score

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

/*
发送：[ (string)玩家id, (int)上报分数, (array)详细操作列表 ]
      注意：本条消息比较敏感，最好加密；详细操作列表可能为空
返回：[ (bool)是否成功，(int)玩家实际最高分数 | (string)失败原因]
*/
// 上报最高分，回调上报结果
function report_score(id, score, extra_info, callback)
{
    var request_info = [id, score, extra_info];
    console.log("report score", request_info);

    var send_text = JSON.stringify(request_info);

    // TODO: encrypt & send to server
    callback(true, score);
}

