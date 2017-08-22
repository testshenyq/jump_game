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
var input_image = "images/transparent.png"
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

function show_reg_dom(reg_wnd)
{
    dom_regwnd.style.display = 'inline';
    reg_wnd.input_elements = {};
    console.log(input_user_info);

    for (var type in user_fields)
    {
        // Init value
        var input_elem = get_input_element(type);
        input_elem.value = input_user_info[type];
        reg_wnd.input_elements[type] = input_elem;

        // Register events callbacks
        input_elem.onfocus = function(type, e) {
            console.log(type, "focus");
            this.value = input_user_info[type];
        }.bind(input_elem, type)
        input_elem.onblur = function(type, e) {
            console.log(type, "blur");
            input_user_info[type] = this.value;
        }.bind(input_elem, type)
    }
}

function hide_reg_dom()
{
    // Blur all items before hide
    for (var key in this.input_elements)
    {
        var input_elem = this.input_elements[key];
        input_elem.blur();
    }
    dom_regwnd.style.display = 'none';
}

function get_input_element(name)
{
    return document.getElementById('reg_input_' + name);
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
        var this_wnd = this;
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
        var yoff = window_size[1] * 0.32 , ygap = window_size[1] * 0.073;
        var input;

        // Show dom register window & register events
        show_reg_dom(this);

        // Create buttons
        var btn_off = window_size[1] * 0.15;
        var ok_btn = createButton(btn_ok_image, width/2 - 150, height - btn_off,
            function() {

                if (!this.check_user_info())
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
                    this_wnd.close();
                });
            }.bind(this)
        );

        var ret_btn = createButton(btn_return_image, width/2 + 150, height - btn_off,
            function() {
                // Close window
                this_wnd.close();
            }
        );
        this.window.addChild(ok_btn);
        this.window.addChild(ret_btn);
    }

    check_user_info()
    {
        for (var field in user_fields)
        {
            // Sync the value in input box
            var input_elem = this.input_elements[field];
            input_elem.blur();

            // Check the filed
            if (!check_field(field))
                return false;
        }
        return true;
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }

    close()
    {
        hide_reg_dom();
        stage.removeChild(this.window);
    }
}

