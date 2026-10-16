# SIDE B

像素风酒吧题材剧情互动游戏(原型)。玩家扮演夜班调酒师 KYUU,在雨夜接待熟客,通过对话选择与调饮推进剧情,不同的信任与选择会导向不同结局。

> 个人项目,使用 AI 工具辅助生成像素素材与音效、协助编码;世界观、角色、剧情分支与玩法设计由作者负责。

## 特点

- 多分支剧情:237 个剧情节点,隐藏的角色信任度/资料授权共同决定走向,共 4 个结局
- 调饮玩法:基础液、酒精、碳酸、温度、添加物五项组合,10 款饮品,错误成品有不同角色的拒收反馈
- 存档系统:3 个手动存档位 + 自动存档,带版本号与旧档迁移,损坏存档可识别
- 原生 Web Audio 合成的音乐、雨声与交互音效,无外部音频依赖
- 像素 UI、立绘表情、端杯演出等全部为 Canvas / CSS 实现

## 技术栈

HTML / CSS / 原生 JavaScript(无框架),Node 内置测试脚本,Electron + electron-builder 打包 macOS 应用。

## 运行

直接在浏览器打开 `index.html`,或:

```bash
python3 -m http.server 8765 --bind 127.0.0.1
# 访问 http://127.0.0.1:8765
```

存档保存在浏览器 localStorage,请固定使用同一地址、端口和浏览器。

桌面版(Electron):

```bash
npm install
npm start          # 开发模式
npm run build      # 打包 macOS dmg,输出到 dist/
```

## 测试

```bash
node tests/state.test.cjs
node tests/audio-sfx.test.cjs
```

覆盖存读档、分支与结局可达性、调饮判定、存档迁移、音效路由等。

## 目录结构

| 路径 | 说明 |
|---|---|
| `index.html` | 游戏主体与状态逻辑 |
| `narrative.js` / `expansion.js` | 剧情数据与扩展事件 |
| `scripts/` | 饮品、音频、端杯演出、头像等模块 |
| `pixel-ui.css` / `pixel-ui.js` | 像素风 UI |
| `main.js` | Electron 入口 |
| `tests/` | 状态与音效测试 |
| `docs/` | 设计文档与完整剧本导出 |

更详细的开发记录见 [CHANGELOG.md](CHANGELOG.md),剧情分支设计见《剧情分支设计.md》。
