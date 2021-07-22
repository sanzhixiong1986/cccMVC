import { _decorator, Component, Node } from 'cc';
import { GameApp } from './Game/GameApp';
const {ccclass, property} = cc._decorator;

@ccclass('GameLanch')
export default class GameLanch extends cc.Component {
    onLoad():void{
        console.log("Game Lanching.....");
        //初始化框架
        this.node.addComponent(GameApp);
        //end

        //检查更新我们资源
        //end

        //进入游戏
        GameApp.Instance.EnterGame();
        //end
    }
}
