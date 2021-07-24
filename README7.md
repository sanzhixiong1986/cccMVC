# mvc设计- UI模块设计

### 要点

- 解决的问题

  1. 方便我们显示数据
  2. 方便从UI视图上介入我们的UI事件

- 规范

  GUI文件下，用来存我们的UI资源，GUI/UIPrtfabs用来存Prtfabs预制体

  ui的适配问题

------

UIMgr类的设计

```typescript
import { ResMgr } from './ResMgr';

export class UIMgr extends Component {
    public static Instance: UIMgr = null as unknown as UIMgr;

    private canvas: Node = null as unknown as Node;
		private uiMap = {};
    onLoad(): void {
        if(UIMgr.Instance === null) {
            UIMgr.Instance = this;
        }
        else {
            this.destroy();
            return;
        }

        // 挂我们的UI视图的一个根节点;
        this.canvas = find("Canvas") as Node;

        // 特殊的挂载点, ....
        // end 
    }

    // 显示一个UI到我们的视图上面;
    public ShowUIView(viewName: string, parent?: Node): void {
        // 实例化UI视图出来; 
        var uiPrefab = ResMgr.Instance.getAsset("GUI", "UIPrefabs/" + viewName);
        if(!uiPrefab) {
            console.log("cannot find ui Prefab: ", viewName);
            return;
        }

        var uiView: Node = instantiate(uiPrefab) as Node;
        parent = (!parent)? this.canvas : parent;
        parent.addChild(uiView);
        // console.log(uiView);
				this.uiMap[viewName] = uiView;
        //往根节点上挂下UI视图脚本;
        uiView.addComponent(viewName + "_Ctrl");
    }
  
  	public remove_ui(ui_name) {
        if (this.uiMap[ui_name]) {
            this.uiMap[ui_name].removeFromParent();
            this.uiMap[ui_name] = null;
        }
    }

    public clearAll() {
        for (var key in this.uiMap) {
            if (this.uiMap[key]) {
                this.uiMap[key].removeFromParent();
                this.uiMap[key] = null;
            }
        }
    }
}
```



------

UICtrl类设计

```typescript
export class UICtrl extends Component {
    protected view: any = {}; // 路径--->节点; this.view["路径"] --->获得节点;

    private loadAllNodeInView(root: any, path: string) {
        for(let i = 0; i < root.children.length; i ++) {
            this.view[path + root.children[i].name] = root.children[i];
            this.loadAllNodeInView(root.children[i], path + root.children[i].name + "/");
        }
    }

    onLoad(): void {
        // 遍历它下面所有的孩子，然后将所有的节点路径---》节点对象生成到view表里面;
        this.loadAllNodeInView(this.node, "");
    }

    // 按钮事件
    public AddButtonListener(viewName: string, caller: any, func: any) {
        var view_node = this.view[viewName];
        if (!view_node) {
            return;
        }
        
        var button = view_node.getComponent(Button);
        if (!button) {
            return;
        }

        view_node.on("click", func, caller);
    }

    // 其他UI事件, ....
}

```

在Framework在创建i一个新的文件夹UIControllers文件，用来存放对应的ui，这个ui用图片做成预制体，然后预制体上挂对应的代码，我这个下面做了一个login登陆的界面，loginUI_ctrl.ts继承于UI_ctrl类

```typescript
import { UICtrl } from "./../../Framework/Managers/UICtrl";

@ccclass('LoginUI_Ctrl')
export class LoginUI_Ctrl extends UICtrl {
    private Version: Label = null as unknown as Label;

    onLoad(): void {
        super.onLoad();
        this.Version = this.view["Version"].getComponent(Label);

        this.Version.string = "2.0.0";

        this.AddButtonListener("Start", this, this.onGameStartClick);
    }

    private onGameStartClick(): void {
        console.log("onGameStartClick");
    }
}
```



### 测试

```typescript

import { _decorator, Component, Node, AudioClip, AudioSource } from 'cc';
import { ResMgr } from '../Framework/Managers/ResMgr';
import { SoundMgr } from '../Framework/Managers/SoundMgr';

var resPkg = {
    "Sounds": [
        { assetType: AudioClip, urls: 
            ["CK_attack1", 
            "Qinbing_die"
        ]},
    ],
  	"GUI": [
        {
            assetType: Prefab, 
            urls: [
                "UIPrefabs/LoginUI",
            ],
        },
    ],

    // "Sounds": AudioClip,
}

export class GameApp extends Component {
    
    public static Instance: GameApp = null as unknown as GameApp

    onLoad(): void {
        if(GameApp.Instance === null) {
            GameApp.Instance = this;
        }
        else {
            this.destroy();
            return;
        }


    }

    // 游戏逻辑入口
    public EnterGame(): void {
        console.log("Enter Game ....!");

        ResMgr.Instance.preloadResPkg(resPkg, (now: any, total: any)=>{
            console.log(now, total);
        }, ()=>{
            this.EnterLoadingScene();
        });
    }

    public EnterLoadingScene(): void {
        console.log("EnterLoadingScene");
        
        /*
        // 释放测试
        ResMgr.Instance.releaseResPkg(resPkg);

        this.scheduleOnce(()=>{
            console.log(ResMgr.Instance.getAsset("Sounds", "CK_attack1"));
        }, 3)*/
        
        // 释放游戏地图
        // end

        // 释放游戏角色
        // end

        // 释放我们的游戏UI
        // end

        // 播放声音
        /*var as = this.node.addComponent(AudioSource);
        as.clip = ResMgr.Instance.getAsset("Sounds", "CK_attack1");
        as.loop = true;
        as.play();
				*/
      	/*var clip = ResMgr.Instance.getAsset("Sounds","CK_attack1");
      	SoundMgr.Instance.playBgMusic(clip,true);*/
        // end
      UIMgr.Instance.ShowUIView("LoginUI");//显示ui
    }
    
}

```

