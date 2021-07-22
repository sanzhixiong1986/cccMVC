# mvc设计-进入游戏

### 要点

- 进入游戏的逻辑设计
- 单利模式
- 进入游戏的方法编写

------

单利模式的进入游戏的代码

```typescript
import { _decorator, Component, Node } from 'cc';
export class GameApp extends cc.Component {
  public static Instance:GameApp = null;
  onLoad():void{
    //单利模式
    if(GameApp.Instance === null){
      GameApp.Instance = this;
    }else{
      this.distroy();
      return;
    }
  }
  
  //进入游戏的方法
  public EnterGame():void{
    this.EnterLoadingScene();
  }
  
  private EnterLoadingScene():void{
    //释放游戏地图
    //end
    
    //释放角色
    //end
    
    //释放游戏ui
    //end
  }
}
```

------

### 在游戏界面挂的脚本GameLanch加载我们刚才的代码

```typescript
import { _decorator, Component, Node } from 'cc';
import { GameApp } from './Game/GameApp';
const {ccclass, property} = cc._decorator;

@ccclass('GameLanch')
export default class GameLanch extends cc.Component{
  onLoad():void{
    //在节点上增加一个代码
    this.node.addComponet(GameApp);
    
    GameApp.Instance.EnterGame();//进入游戏的方法
  }
}
```

