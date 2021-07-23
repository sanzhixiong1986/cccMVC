# mvc设计-资源管理模块

### 要点

- 解决声音卡顿，资源显示不出的问题
- 对资源管理可以更好的管理

------

### 接口设计

- 加载
- 删除
- 删除多个资源
- 清空单个资源

```typescript
import { _decorator, Component, Node, assetManager, AssetManager, Asset } from 'cc';
/**
 * 资源管理器
 */
const { ccclass, property } = cc._decorator;

export default class ResMgr extends cc.Component {
    //单利模式
    public static Instance: ResMgr = null;
    private totalAb: number = 0;
    private nowAb: number = 0;

    private now: number = 0;
    private total: number = 0;
    onLoad() {
        if (ResMgr.Instance === null)
            ResMgr.Instance = this;
        else
            this.destroy();
        return;
    }

    private loadAndRef(abBundle: AssetManager.Bundle, url: string,
        typeAsset: any,
        progress: Function, endFunc: Function): void {

        abBundle.load(url, typeAsset, (err: any, asset: Asset) => {
            if (err) {
                console.log("load assets: ", err);
                return;
            }


            console.log("load asset success：", url);
            asset.addRef(); // 增加一个引用技术;

            this.now++;
            if (progress) {
                progress(this.now, this.total);
            }
            if (this.now >= this.total) {
                if (endFunc) {
                    endFunc();
                }
            }
        });
    }

    private loadAssetsInUrls(abBundle: AssetManager.Bundle, typeAsset: any, urls: Array<string>, progress: Function, endFunc: Function): void {
        for (let i = 0; i < urls.length; i++) {
            this.loadAndRef(abBundle, urls[i], typeAsset, progress, endFunc);
        }
    }

    private releaseAssetsInUrls(abBundle: AssetManager.Bundle, typeAsset: any, urls: Array<string>): void {
        for (let i = 0; i < urls.length; i++) {
            // console.log(urls[i]);
            let asset: Asset = abBundle.get(urls[i]) as Asset;
            if (!asset) {
                continue;
            }

            // console.log(asset.refCount);
            asset.decRef(true);
        }
    }

    private preloadAssetsInAssetsBundles(resPkg: any, progress: Function, endFunc: Function): void {
        for (var key in resPkg) {
            var abBundle: AssetManager.Bundle = assetManager.getBundle(key) as AssetManager.Bundle;
            if (!abBundle) {
                continue;
            }

            if (resPkg[key] instanceof Array) {
                for (let i = 0; i < resPkg[key].length; i++) {
                    // let info: any = abBundle.getDirWithPath("/");
                    // console.log(info);
                    this.loadAssetsInUrls(abBundle, resPkg[key][i].typeAsset, resPkg[key][i].urls, progress, endFunc);
                }
            }
            else {
                let typeAsset = resPkg[key];
                let infos = abBundle.getDirWithPath("/");
                let urls: any = [];
                for (let i = 0; i < infos.length; i++) {
                    urls.push(infos[i].path);
                }

                this.loadAssetsInUrls(abBundle, typeAsset, urls, progress, endFunc);
            }
        }
    }

    /*
    var resPkg = {
    "Ab包名字": [
    { typeAsset: 资源类型, urls: []},
    { typeAsset: 资源类型, urls: []},
    ...
    ],
    
    "Ab包名字": 资源类型, 表示整包ab包按照一个类型加载;
    ... ..
    };
    
    progress(now, total)
    
    */
    public preloadResPkg(resPkg: any, progress: Function, endFunc: Function): void {
        this.totalAb = 0;
        this.nowAb = 0;

        this.total = 0;
        this.now = 0;

        for (var key in resPkg) {
            this.totalAb++;

            if (resPkg[key] instanceof Array) {
                for (let i = 0; i < resPkg[key].length; i++) {
                    this.total += resPkg[key][i].urls.length;
                }
            }
        }

        // 加载ab包
        for (var key in resPkg) {
            assetManager.loadBundle(key, (err, bundle: AssetManager.Bundle) => {
                if (err) {
                    console.log("load bundle erro: ", err);
                    return;
                }

                this.nowAb++;
                if (!(resPkg[key] instanceof Array)) {
                    let infos = bundle.getDirWithPath("/");
                    this.total += (infos.length);
                }

                if (this.nowAb >= this.totalAb) { // ab包加载完毕
                    this.preloadAssetsInAssetsBundles(resPkg, progress, endFunc);
                }
            });
        }
        // end
    }

    public releaseResPkg(resPkg: any): void {
        for (var key in resPkg) {
            let abBundle: AssetManager.Bundle = assetManager.getBundle(key) as AssetManager.Bundle;
            if (!abBundle) {
                continue;
            }

            if (resPkg[key] instanceof Array) {
                for (let i = 0; i < resPkg[key].length; i++) {
                    this.releaseAssetsInUrls(abBundle, resPkg[key][i].typeAsset, resPkg[key][i].urls);
                }
            }
            else {
                let typeAsset = resPkg[key];
                let infos = abBundle.getDirWithPath("/");
                let urls: any = [];
                for (let i = 0; i < infos.length; i++) {
                    urls.push(infos[i].path);
                }
                this.releaseAssetsInUrls(abBundle, typeAsset, urls);
            }
        }
    }

    public preloadAsset(abName: string, url: string, typeClass: any, endFunc: Function): void {
        assetManager.loadBundle(abName, (err, abBundle: AssetManager.Bundle) => {
            if (err) {
                console.log(err);
                return;
            }

            abBundle.load(url, typeClass, (err, asset: Asset) => {
                if (err) {
                    console.log(err);
                    return;
                }

                if (endFunc) {
                    endFunc();
                }
            });
        });
    }

    public releaseAsset(abName: string, url: string): void {
        var abBundle: AssetManager.Bundle = assetManager.getBundle(abName) as AssetManager.Bundle;
        if (!abBundle) {
            return;
        }

        abBundle.release(url);
    }

    // 同步接口, 前面已经加载好了的资源;
    public getAsset(abName: string, url: string): any {
        var abBundle: AssetManager.Bundle = assetManager.getBundle(abName) as AssetManager.Bundle;
        if (!abBundle) {
            return null;
        }

        return abBundle.get(url);
    }
}
```

------

### 测试

```typescript

import { _decorator, Component, Node, AudioClip, AudioSource } from 'cc';
import { ResMgr } from '../Framework/Managers/ResMgr';

var resPkg = {
    "Sounds": [
        { assetType: AudioClip, urls: 
            ["CK_attack1", 
            "Qinbing_die"
        ]},
    ]

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
        var as = this.node.addComponent(AudioSource);
        as.clip = ResMgr.Instance.getAsset("Sounds", "CK_attack1");
        as.loop = true;
        as.play();

        // end
    }
    
}

```

