
//Aliases
var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Texture = PIXI.Texture,
    Sprite = PIXI.Sprite,
    Graphics = PIXI.Graphics;

class ScrollWindow
{
    constructor(sprite, mask_sprite, x, y, width, height)
    {
        var window = new Container();
        window.x = x;
        window.y = y;
        window.addChild(sprite);
        window.addChild(mask_sprite);
        this.window = window;
        this.width = width;
        this.height = height;
        
        sprite.interactive = true;

        resize_sprite(sprite, width, height);
        resize_sprite(mask_sprite, width, height);

        sprite
            .on('pointerdown', this.onDragStart)
            .on('pointerup', this.onDragEnd)
            .on('pointerupoutside', this.onDragEnd)
            .on('pointermove', this.onDragMove);

        this.container = new Container();
        this.container.mask = mask_sprite;
        window.addChild(this.container);

        sprite.scroll_wnd = this;
        this.items = [];
        this.xoff = 20;
        this.yoff = 50;
        this.heightInterval = 10;
        this.draging = false;
        this.last_pos = 0;
        this.min_pos = 0;
        this.max_pos = 0;
    }

    setItemInfo(xoff, heightInterval)
    {
        this.xoff = xoff;
        this.heightInterval = heightInterval;
    }

    scroll(delta)
    {
        var y = this.container.y;
        y += delta;
        y = Math.max(y, this.min_pos);
        y = Math.min(y, this.max_pos);
        this.container.y = y;
    }

    addItem(item, click_callback)
    {
        var height = item.height + this.heightInterval;
        item.anchor.set(0,0);
        item.x = this.xoff;
        item.y = this.items.length * height + this.yoff;
        this.container.addChild(item);
        this.items.push(item);
        this.min_pos = Math.min(0, this.height - (this.items.length * height + this.yoff + 50));
    }

    onDragStart(e)
    {
        this.draging = true;
        this.last_pos = e.data.global.y;
    }

    onDragEnd(e)
    {
        this.draging = false;
    }

    onDragMove(e)
    {
        if (this.draging)
        {
            var delta = Math.floor(e.data.global.y - this.last_pos);
            this.scroll_wnd.scroll(delta);
            this.last_pos = e.data.global.y;
        }
    }
}

