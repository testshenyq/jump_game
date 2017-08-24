// utils.js

//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

// string format
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

// Save user info to cookie
function save_user_info()
{
    if (user_info.id)
        setCookie("userinfo", JSON.stringify(user_info), 30);
}

function shallow_clone(m)
{
    var res = {};
    for (var key in m)
        res[key] = m[key];
    return res;
}

function message_box(msg)
{
    alert(msg);
}

function resize_sprite(sprite, width, height)
{
    sprite.scale.set(width / sprite.width, height / sprite.height);
}

function rand1()
{
    return (Math.random() - 0.5) * 2;
}

// Fill the sprite to fit screen size
function fill_sprite(sprite)
{
    sprite.x = 0;
    sprite.y = 0;
    sprite.scale.x = canvas_width / sprite.width;
    sprite.scale.y = canvas_height / sprite.height;
}

function enable_global_input()
{
    global_input.style.visibility = 'visible';
    global_input.focus();
}

function disable_global_input()
{
    global_input.style.visibility = 'hidden';
}

function create_button(parent, texture, scale, x, y, callback)
{
    var btn = new Sprite(resources[texture].texture);
    btn.scale.x = scale;
    btn.scale.y = scale;
    btn.interactive = true;
    btn.on('pointerdown', callback);
    btn.anchor.set(0.5);
    btn.pivot.set(0.5);
    btn.x = x;
    btn.y = y;
    parent.addChild(btn);
    return btn;
} 

function createText(text, size, color, x, y, extra_info = null)
{
    var textStyle = {
        fontSize : size,
        fill : color,
    };

    if (extra_info != null)
    {
        for (var k in extra_info)
            textStyle[k] = extra_info[k];
    }

    var piText = new PIXI.Text(text, textStyle);
    piText.x = x;
    piText.y = y;
    return piText;
}

function createButton(res_name, x, y, callback)
{
    sprite = new Sprite(resources[res_name].texture);
    sprite.pivot.set(0.5);
    sprite.anchor.set(0.5);
    sprite.x = x;
    sprite.y = y;
    sprite.interactive = true;
    sprite.on('pointerdown', callback);
    return sprite;
}

function setCookie(c_name,value,expiredays)
{
    var exdate=new Date()
    exdate.setDate(exdate.getDate()+expiredays)
    document.cookie=c_name+ "=" + escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
}


function getCookie(c_name)
{
    if (document.cookie.length>0)
    {
        c_start=document.cookie.indexOf(c_name + "=")
        if (c_start!=-1)
        { 
            c_start=c_start + c_name.length+1 
            c_end=document.cookie.indexOf(";",c_start)
            if (c_end==-1) c_end=document.cookie.length
            return unescape(document.cookie.substring(c_start,c_end))
        } 
    }
    return null; 
}
