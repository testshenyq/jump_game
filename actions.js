// actions.js
// All the actions like player jump

function ActionManager() 
{
    if (arguments.callee._singletonInstance) 
    {
        return arguments.callee._singletonInstance;
    }
    arguments.callee._singletonInstance = this;

    // Properties
    this.actions = [];

    // Functions 
    this.start_action = function(action, ob)
    {
        if (!ob.actions)
            ob.actions = [];
        action.owner = ob;
        ob.actions.push(action);
        this.actions.push(action);
        console.log(this.actions);
    }

    this.update = function()
    {
        for (var i = 0; i < this.actions.length; i++)
        {
            var action = this.actions[i];
            if (!action.update())
            {
                var owner = action.owner;
                var idx = owner.actions.indexOf(action);
                owner.actions.splice(idx, 1);
                this.actions.splice(i, 1); 
                i--;
            }
        } 
    }

    this.stop_actions = function(ob)
    {
        if (ob.actions)
        {
            for (var i = 0; i < ob.actions.length; i++)
                ob.actions[i].stop();
        }
    }
} 

// Player y scale action when jump
class PlayerJump
{
    constructor(player, scale_change, timeout)
    {
        this.player = player;
        this.scale_change = scale_change;
        this.timeout = timeout * 1000;
        this.start_time = last_time;
        this.ori_y = 1;
    }

    update()
    {
        if (this.stopped)
            return false;

        var start_time = this.start_time;
        var ori_y = this.ori_y;
        var player = this.player;
        var timeout = this.timeout;
        var pass_time = last_time - start_time;
        var pass_val = pass_time / timeout * 3.14 * 2;
        var sin_val = Math.sin(pass_val);
        var scale_y = ori_y - sin_val * this.scale_change;
        player.scale.y = scale_y;

        if (pass_time > timeout)
        {
            this.stop();
            return false;
        }
        return true;
    }

    reset()
    {
        this.player.scale.y = this.ori_y;
        this.start_time = last_time;
    }

    stop()
    {
        this.player.scale.y = this.ori_y; 
        this.stopped = true;
    }
}

