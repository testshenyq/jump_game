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

