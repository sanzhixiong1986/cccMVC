var game_mgr = require('game_mgr');
var game_app = cc.Class({
    extends: game_mgr,
    //静态属性
    statics:{
        Interce:null,
    },

    onLoad () {
        //懒汉方式
        if(game_app.Interce === null){
            game_app.Interce = this;
        }
        else{
            //销毁节点
            this.destroy();
            return;
        }

        //调用父类的onload方法
        game_mgr.prototype.onLoad.call(this);
    },

    start () {

    },

    // update (dt) {},
});
