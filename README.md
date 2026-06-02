# 识字乐园 📚

专为3-7岁儿童设计的趣味汉字学习PWA应用。

**🌐 在线地址**：`https://liuliu6416.github.io/shizileyuan/`

---

## 功能特点

- ✅ **100个汉字**，分10级循序渐进
- ✅ **认→练→写** 三步学习法
- ✅ **卡通风格**，emoji插图，小朋友喜欢
- ✅ **语音朗读**，标准中文发音
- ✅ **PWA支持**，添加到iPhone/iPad主屏幕，像APP一样使用
- ✅ **离线可用**，第一次加载后无需网络
- ✅ **完全免费**，无广告，无内购

---

## 部署到 GitHub Pages

### 方法一：网页直接上传（最简单）

1. 登录你的 GitHub 账号 [github.com](https://github.com)
2. 点击右上角 **+** → **New repository**
3. 仓库名填写：`识字乐园`
4. 选择 **Public**（公开）
5. **不要**勾选 "Add a README file"
6. 点击 **Create repository**
7. 在创建后的页面上，点击 **uploading an existing file**
8. 把整个 `识字乐园` 文件夹拖进去
9. 点击 **Commit changes**
10. 进入仓库 **Settings** → **Pages**
11. 在 "Source" 中选择 **main** 分支，点击 **Save**
12. 等待1-2分钟，访问 `https://liuliu6416.github.io/shizileyuan/`

### 方法二：iPhone/iPad 添加到主屏幕

1. 用 **Safari** 打开 `https://liuliu6416.github.io/shizileyuan/`
2. 点击底部中间的 **分享按钮**（↑）
3. 滑动找到 **添加到主屏幕**
4. 点击 **添加**
5. 主屏幕上会出现"识字乐园"图标，点开即可使用！

---

## 项目结构

```
识字乐园/
├── index.html          # 主页面
├── manifest.json       # PWA配置
├── sw.js               # 离线缓存
├── css/
│   └── style.css       # 卡通样式
├── js/
│   ├── app.js          # 主程序
│   ├── data.js         # 100个汉字数据
│   ├── storage.js      # 进度存储
│   ├── tts.js          # 语音朗读
│   ├── home.js         # 首页
│   ├── learn.js        # 认字页
│   ├── practice.js     # 练字页
│   ├── write.js        # 写字页
│   └── review.js       # 复习页
├── assets/             # 图标和启动图
└── README.md
```

---

## 如何自己添加更多汉字

编辑 `js/data.js` 文件，按照下面的格式添加新字：

```javascript
{ id: 101, char: "新", pinyin: "xīn", level: 10, emoji: "🆕",
  keywords: ["新鲜", "新年"],
  words: [{ word: "新年", pinyin: "xīn nián" }],
  sentences: ["新年快乐！"],
  strokeCount: 13, category: "concept" }
```

注意：
- `id` 不能重复
- `level` 是1-10之间
- 改完后重新上传到 GitHub 即可

---

## 技术说明

- 纯 HTML/CSS/JS，无需安装任何开发环境
- 使用浏览器内置语音合成（SpeechSynthesis）实现中文朗读
- 使用 Hanzi Writer 实现笔画动画
- 使用 localStorage 保存学习进度
- 符合 PWA 标准，支持 iOS 和 Android
