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

var window_bg = "images/rank_bg.png"
var btn_ok_image = "images/btn_ok.png"
var btn_return_image = "images/btn_return.png"
var input_image = "images/rank_item.jpg"
var window_size = [850,1300]
var editing_input;
var regwnd_x;
var regwnd_y;

function update_input()
{
    if (editing_input != null && global_input.value != null)
          editing_input.input_text.text = global_input.value;
}

function create_text_box(label, x, y)
{
    var font_size = 50;
    var input_width = 400;
    var input_height = 60;
    var wnd = new Container();
    wnd.x = x;
    wnd.y = y;
    var input_off = 200;

    var text = createText(label, font_size, '0x030303', 0, 0);
    var input_text = createText("", 40, "0x030303", input_off, 3);
    /*
    var input = new PixiTextInput("", {
        fontSize : font_size, 
    });*/
    var input = new Sprite(resources[input_image].texture);
    input.scale.set(0.5);
    input.interactive = true;
    input.on('pointerdown', function(e){ 
        update_input();
        editing_input = input;
        var canvas = renderer.view;
        var ws = canvas.offsetHeight / canvas_height;
        global_input.onblur = function() {
            update_input();
            disable_global_input();
        }
        enable_global_input();
        global_input.value = input_text.text; 
        /*
        global_input.style.width = (input.width * ws).toString() +"px";
        global_input.style.height = (input.height * ws).toString() + "px";
        global_input.style.left = (canvas.offsetLeft - canvas.offsetWidth/2 + (x + input_off + regwnd_x) * ws).toString() + "px";
        global_input.style.top = ((y+regwnd_y) * ws).toString() + "px";
        */
    });
    input.input_text = input_text;
    input.x = input_off;
    input.y = 0;

    wnd.addChild(text);
    wnd.addChild(input);
    wnd.addChild(input_text);

    return wnd;
}

class RegisterWindow
{
    constructor(x, y)
    {
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
        var bg = new Sprite(resources[window_bg].texture);
        resize_sprite(bg, width, height);
        window.addChild(bg);

        // Text
        var label = createText("来者何人？", 60, "0x040404", width/2, 180);
        label.anchor.set(0.5);
        window.addChild(label);
        label = createText("学生登陆才可参与排行榜争夺", 35, "0x111111", width/2, 300);
        label.anchor.set(0.5);
        window.addChild(label);

        label = createText("请填写真实信息，以确保可以领取奖励哦！", 30, "0x111111", width/2, height - 350);
        label.anchor.set(0.5);
        window.addChild(label);

        // Create input fileds
        var xoff= 100;
        var yoff = 400, ygap = 120;
        var input;

        input = create_text_box("姓名", xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box("学校", xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box("学号", xoff, yoff);
        window.addChild(input);
        yoff += ygap;

        input = create_text_box("手机", xoff, yoff);
        window.addChild(input);

        // Create buttons
        var ok_btn = createButton(btn_ok_image, width/2 - 150, height - 200,
            function(){
                update_input();
                disable_global_input();
                // TODO: connect to server and register
            }
        );
        ok_btn.scale.set(1.5);

        var ret_btn = createButton(btn_return_image, width/2 + 150, height - 200,
            function(){
                update_input();
                disable_global_input();
                stage.removeChild(window);
            }
        );
        ret_btn.scale.set(1.5);
        this.window.addChild(ok_btn);
        this.window.addChild(ret_btn);
    }

    attachTo(parent)
    {
        parent.addChild(this.window);
    }
}

