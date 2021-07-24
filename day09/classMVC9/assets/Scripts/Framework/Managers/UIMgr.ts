
import { _decorator, Component, Node, find, instantiate } from 'cc';
import { ResMgr } from './ResMgr';

export class UIMgr extends Component {
    public static Instance: UIMgr = null as unknown as UIMgr;

    private canvas: Node = null as unknown as Node;

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

        //往根节点上挂下UI视图脚本;
        uiView.addComponent(viewName + "_Ctrl");
    }
}

