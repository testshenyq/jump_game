// register_window.js

//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

var btn_ok_image = "images/btn_ok.png"
var btn_return_image = "images/btn_return.png"
var input_image = "images/rank_item.png"
var window_size = [canvas_width, canvas_height];
var editing_input;
var regwnd_x;
var regwnd_y;

var user_fields = {
    name        : '姓名',
    school      : '学校',
    student_id  : '学号',
    phone       : '手机',
};

var input_user_info = {}

function create_text_box(info, x, y)
{
    var font_size = 26;
    var wnd = new Container();
    wnd.x = x;
    wnd.y = y;
    var input_off = window_size[0] * 0.2;
    var label = user_fields[info];
    var text_margin = 8;

    // var text = createText(label, font_size, '0x030303', 0, 0);
    var input_text = createText(input_user_info[info], 
            font_size, "0x030303", input_off + text_margin, text_margin);
    /*
    var input = new PixiTextInput("", {
        fontSize : font_size, 
    });*/
    var input = new Sprite(resources[input_image].texture);
    var scalex = 0.6, scaley = 0.4;
    input.scale.set(scalex, scaley);
    input.interactive = true;
    input.on('pointerdown', function(e){ 
        var str = window.prompt('请输入' + label, input_user_info[info]);
        if (str == null)
            return;
        input_text.text = str;
        input_user_info[info] = str;
    });
    input.input_text = input_text;
    input.x = input_off;
    input.y = 0;

    // wnd.addChild(text);
    wnd.addChild(input);
    wnd.addChild(input_text);

    return wnd;
}

function save_user_info()
{
    console.log("save");
    setCookie("userinfo", JSON.stringify(user_info), 30);
}

function check_field(key)
{
    if (!input_user_info[key] || input_user_info[key].length == 0)
    {
        message_box("{0}不能为空".format(user_fields[key]));
        return false;
    }
    return true;
}

function check_user_info()
{
    for (var field in user_fields)
    {
        if (!check_field(field))
            return false;
    }
    return true;
}

class RegisterWindow
{
    constructor(x, y)
    {
        // Compose the input user info
        input_user_info = {
            name    : user_info.name,
            school  : user_info.school,
            student_id : user_info.student_id,
            phone   : user_info.phone,
        };

        // Create rank window sprite
        var window = new Container();
        this.window = window;
        var width = window_size[0];
        var height = window_size[1];
        window.x = x - width / 2;
        window.y = y;
        regwnd_x = window.x;
        regwnd_y = y;

        // Create bg sprite
        var bg = new Sprite(resources[register_wnd_image].texture);
        bg.interactive = true;
        resize_sprite(bg, width, height);
        window.addChild(bg);

        // Create input fileds
        var xoff= window_size[0] * 0.12;
        var yoff = window_size[1] * 0.33 , ygap = window_size[1] * 0.072;
        var input;

        input = create_text_box('name', xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box('school', xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box('student_id', xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box('phone', xoff, yoff);
        window.addChild(input);

        // Create buttons
        var btn_off = window_size[1] * 0.15;
        var ok_btn = createButton(btn_ok_image, width/2 - 150, height - btn_off,
            function() {

                if (!check_user_info())
                    return;

                // Clear the user_info.id and try to login
                input_user_info.id = null;
                student_register(input_user_info, function(success, info) {
                    if (!success)
                    {
                        message_box("学生登陆失败：" + info);
                        return;
                    }
                    
                    // Set user id & save user info
                    user_info = info;
                    save_user_info();

                    // Close window
                    stage.removeChild(window);
                });
            }
        );

        var ret_btn = createButton(btn_return_image, width/2 + 150, height - btn_off,
            function() {
                // Close window
                stage.removeChild(window);
            }
        );
        this.window.addChild(ok_btn);
        this.window.addChild(ret_btn);
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }
}

