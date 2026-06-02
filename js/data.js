/**
 * 识字乐园 - 汉字数据库
 * 100个汉字，按难度分为10级，每级约10个字
 */

const CHARACTER_DB = [
  // ===== 第1级：基础象形字（一~五） =====
  { id: 1, char: "一", pinyin: "yī", level: 1, emoji: "1️⃣", keywords: ["数字", "一个"], words: [{ word: "一个", pinyin: "yī gè" }, { word: "一天", pinyin: "yī tiān" }, { word: "一起", pinyin: "yī qǐ" }], sentences: ["我有一个苹果。", "我们一起玩吧！"], strokeCount: 1, category: "number" },
  { id: 2, char: "二", pinyin: "èr", level: 1, emoji: "2️⃣", keywords: ["数字", "两个"], words: [{ word: "二月", pinyin: "èr yuè" }, { word: "第二", pinyin: "dì èr" }], sentences: ["我有两只手。", "二月花开了。"], strokeCount: 2, category: "number" },
  { id: 3, char: "三", pinyin: "sān", level: 1, emoji: "3️⃣", keywords: ["数字", "三个"], words: [{ word: "三个", pinyin: "sān gè" }, { word: "三月", pinyin: "sān yuè" }], sentences: ["三角形有三个角。", "三月春天来了。"], strokeCount: 3, category: "number" },
  { id: 4, char: "四", pinyin: "sì", level: 1, emoji: "4️⃣", keywords: ["数字", "四个"], words: [{ word: "四方", pinyin: "sì fāng" }, { word: "四月", pinyin: "sì yuè" }], sentences: ["一年有四个季节。", "桌子有四条腿。"], strokeCount: 5, category: "number" },
  { id: 5, char: "五", pinyin: "wǔ", level: 1, emoji: "5️⃣", keywords: ["数字", "五个"], words: [{ word: "五星", pinyin: "wǔ xīng" }, { word: "五月", pinyin: "wǔ yuè" }], sentences: ["手上有五个手指。", "红旗上有五颗星。"], strokeCount: 4, category: "number" },
  { id: 6, char: "十", pinyin: "shí", level: 1, emoji: "🔟", keywords: ["数字", "十个"], words: [{ word: "十分", pinyin: "shí fēn" }, { word: "十月", pinyin: "shí yuè" }], sentences: ["我有十根手指。", "十月一日是国庆节。"], strokeCount: 2, category: "number" },
  { id: 7, char: "人", pinyin: "rén", level: 1, emoji: "🧑", keywords: ["人物", "人们"], words: [{ word: "大人", pinyin: "dà rén" }, { word: "好人", pinyin: "hǎo rén" }, { word: "人们", pinyin: "rén men" }], sentences: ["我是一个中国人。", "大人要保护小孩。"], strokeCount: 2, category: "people" },
  { id: 8, char: "大", pinyin: "dà", level: 1, emoji: "🙆", keywords: ["大小", "大"], words: [{ word: "大人", pinyin: "dà rén" }, { word: "大山", pinyin: "dà shān" }, { word: "大家", pinyin: "dà jiā" }], sentences: ["大象好大啊！", "这是我的大家庭。"], strokeCount: 3, category: "concept" },
  { id: 9, char: "小", pinyin: "xiǎo", level: 1, emoji: "🤏", keywords: ["大小", "小"], words: [{ word: "小孩", pinyin: "xiǎo hái" }, { word: "小鸟", pinyin: "xiǎo niǎo" }], sentences: ["小猫好可爱！", "我有一只小狗。"], strokeCount: 3, category: "concept" },
  { id: 10, char: "口", pinyin: "kǒu", level: 1, emoji: "👄", keywords: ["嘴巴", "入口"], words: [{ word: "口水", pinyin: "kǒu shuǐ" }, { word: "门口", pinyin: "mén kǒu" }, { word: "人口", pinyin: "rén kǒu" }], sentences: ["我用口吃饭。", "我家门口有棵树。"], strokeCount: 3, category: "body" },

  // ===== 第2级：象形字 =====
  { id: 11, char: "日", pinyin: "rì", level: 2, emoji: "☀️", keywords: ["太阳", "日子"], words: [{ word: "日出", pinyin: "rì chū" }, { word: "日光", pinyin: "rì guāng" }, { word: "生日", pinyin: "shēng rì" }], sentences: ["太阳每天升起。", "今天是我的生日。"], strokeCount: 4, category: "nature" },
  { id: 12, char: "月", pinyin: "yuè", level: 2, emoji: "🌙", keywords: ["月亮", "月份"], words: [{ word: "月亮", pinyin: "yuè liang" }, { word: "月光", pinyin: "yuè guāng" }, { word: "五月", pinyin: "wǔ yuè" }], sentences: ["月亮好圆啊！", "中秋节看月亮。"], strokeCount: 4, category: "nature" },
  { id: 13, char: "水", pinyin: "shuǐ", level: 2, emoji: "💧", keywords: ["喝水", "水流"], words: [{ word: "水果", pinyin: "shuǐ guǒ" }, { word: "喝水", pinyin: "hē shuǐ" }, { word: "大水", pinyin: "dà shuǐ" }], sentences: ["我每天喝很多水。", "河水清清的真好看。"], strokeCount: 4, category: "nature" },
  { id: 14, char: "火", pinyin: "huǒ", level: 2, emoji: "🔥", keywords: ["火焰", "火苗"], words: [{ word: "火山", pinyin: "huǒ shān" }, { word: "火车", pinyin: "huǒ chē" }, { word: "大火", pinyin: "dà huǒ" }], sentences: ["火能做饭。", "小朋友不能玩火！"], strokeCount: 4, category: "nature" },
  { id: 15, char: "山", pinyin: "shān", level: 2, emoji: "🏔️", keywords: ["高山", "爬山"], words: [{ word: "大山", pinyin: "dà shān" }, { word: "火山", pinyin: "huǒ shān" }, { word: "爬山", pinyin: "pá shān" }], sentences: ["山好高啊！", "我喜欢爬山。"], strokeCount: 3, category: "nature" },
  { id: 16, char: "木", pinyin: "mù", level: 2, emoji: "🌳", keywords: ["树木", "木头"], words: [{ word: "木头", pinyin: "mù tou" }, { word: "树木", pinyin: "shù mù" }, { word: "木马", pinyin: "mù mǎ" }], sentences: ["森林里有很多树木。", "小鸟飞到树上。"], strokeCount: 4, category: "nature" },
  { id: 17, char: "土", pinyin: "tǔ", level: 2, emoji: "🟫", keywords: ["土地", "泥土"], words: [{ word: "土地", pinyin: "tǔ dì" }, { word: "泥土", pinyin: "ní tǔ" }, { word: "土豆", pinyin: "tǔ dòu" }], sentences: ["小草长在土里。", "土地能种花。"], strokeCount: 3, category: "nature" },
  { id: 18, char: "上", pinyin: "shàng", level: 2, emoji: "⬆️", keywords: ["上面", "上学"], words: [{ word: "早上", pinyin: "zǎo shang" }, { word: "上学", pinyin: "shàng xué" }, { word: "上面", pinyin: "shàng miàn" }], sentences: ["小鸟飞上天空。", "我每天早上去上学。"], strokeCount: 3, category: "concept" },
  { id: 19, char: "下", pinyin: "xià", level: 2, emoji: "⬇️", keywords: ["下面", "下午"], words: [{ word: "下午", pinyin: "xià wǔ" }, { word: "下面", pinyin: "xià miàn" }, { word: "下雨", pinyin: "xià yǔ" }], sentences: ["太阳下山了。", "下雨天要打伞。"], strokeCount: 3, category: "concept" },
  { id: 20, char: "中", pinyin: "zhōng", level: 2, emoji: "🎯", keywords: ["中间", "中国"], words: [{ word: "中国", pinyin: "zhōng guó" }, { word: "中午", pinyin: "zhōng wǔ" }, { word: "中心", pinyin: "zhōng xīn" }], sentences: ["我是中国人。", "中午吃午饭。"], strokeCount: 4, category: "concept" },

  // ===== 第3级：自然与生活 =====
  { id: 21, char: "天", pinyin: "tiān", level: 3, emoji: "🌤️", keywords: ["天空", "天气"], words: [{ word: "天空", pinyin: "tiān kōng" }, { word: "今天", pinyin: "jīn tiān" }, { word: "春天", pinyin: "chūn tiān" }], sentences: ["天空真蓝呀！", "今天天气好晴朗。"], strokeCount: 4, category: "nature" },
  { id: 22, char: "地", pinyin: "dì", level: 3, emoji: "🌍", keywords: ["大地", "地面"], words: [{ word: "大地", pinyin: "dà dì" }, { word: "地方", pinyin: "dì fāng" }, { word: "草地", pinyin: "cǎo dì" }], sentences: ["大地上长满了花。", "我们在草地上玩。"], strokeCount: 6, category: "nature" },
  { id: 23, char: "云", pinyin: "yún", level: 3, emoji: "☁️", keywords: ["白云", "云朵"], words: [{ word: "白云", pinyin: "bái yún" }, { word: "云朵", pinyin: "yún duǒ" }], sentences: ["天上有白云。", "云朵像棉花糖。"], strokeCount: 4, category: "nature" },
  { id: 24, char: "风", pinyin: "fēng", level: 3, emoji: "💨", keywords: ["刮风", "风车"], words: [{ word: "大风", pinyin: "dà fēng" }, { word: "风车", pinyin: "fēng chē" }, { word: "春风", pinyin: "chūn fēng" }], sentences: ["今天的风好大！", "风车在风中转动。"], strokeCount: 4, category: "nature" },
  { id: 25, char: "雨", pinyin: "yǔ", level: 3, emoji: "🌧️", keywords: ["下雨", "雨水"], words: [{ word: "下雨", pinyin: "xià yǔ" }, { word: "大雨", pinyin: "dà yǔ" }, { word: "雨伞", pinyin: "yǔ sǎn" }], sentences: ["下雨了，要打伞。", "雨后天空有彩虹。"], strokeCount: 8, category: "nature" },
  { id: 26, char: "花", pinyin: "huā", level: 3, emoji: "🌸", keywords: ["花朵", "花园"], words: [{ word: "花朵", pinyin: "huā duǒ" }, { word: "花园", pinyin: "huā yuán" }, { word: "开花", pinyin: "kāi huā" }], sentences: ["花儿真好看！", "妈妈喜欢养花。"], strokeCount: 7, category: "nature" },
  { id: 27, char: "草", pinyin: "cǎo", level: 3, emoji: "🌿", keywords: ["小草", "草地"], words: [{ word: "小草", pinyin: "xiǎo cǎo" }, { word: "草地", pinyin: "cǎo dì" }, { word: "草莓", pinyin: "cǎo méi" }], sentences: ["小草绿绿的。", "草地上开满了花。"], strokeCount: 9, category: "nature" },
  { id: 28, char: "石", pinyin: "shí", level: 3, emoji: "🪨", keywords: ["石头", "石子"], words: [{ word: "石头", pinyin: "shí tou" }, { word: "石子", pinyin: "shí zǐ" }, { word: "宝石", pinyin: "bǎo shí" }], sentences: ["河边有很多石头。", "这块石头好漂亮！"], strokeCount: 5, category: "nature" },
  { id: 29, char: "田", pinyin: "tián", level: 3, emoji: "🌾", keywords: ["田地", "田野"], words: [{ word: "田地", pinyin: "tián dì" }, { word: "田野", pinyin: "tián yě" }, { word: "水田", pinyin: "shuǐ tián" }], sentences: ["农民在田里种稻子。", "田野上一片金黄。"], strokeCount: 5, category: "nature" },
  { id: 30, char: "星", pinyin: "xīng", level: 3, emoji: "⭐", keywords: ["星星", "星空"], words: [{ word: "星星", pinyin: "xīng xing" }, { word: "星空", pinyin: "xīng kōng" }, { word: "五星", pinyin: "wǔ xīng" }], sentences: ["天上有很多星星。", "五星红旗真好看。"], strokeCount: 9, category: "nature" },

  // ===== 第4级：动物与身体 =====
  { id: 31, char: "马", pinyin: "mǎ", level: 4, emoji: "🐴", keywords: ["小马", "马路"], words: [{ word: "小马", pinyin: "xiǎo mǎ" }, { word: "马路", pinyin: "mǎ lù" }, { word: "马上", pinyin: "mǎ shàng" }], sentences: ["小马跑得真快！", "过马路要小心。"], strokeCount: 3, category: "animal" },
  { id: 32, char: "牛", pinyin: "niú", level: 4, emoji: "🐮", keywords: ["水牛", "牛奶"], words: [{ word: "水牛", pinyin: "shuǐ niú" }, { word: "牛奶", pinyin: "niú nǎi" }, { word: "小牛", pinyin: "xiǎo niú" }], sentences: ["牛在田里吃草。", "我每天喝牛奶。"], strokeCount: 4, category: "animal" },
  { id: 33, char: "羊", pinyin: "yáng", level: 4, emoji: "🐑", keywords: ["小羊", "羊毛"], words: [{ word: "小羊", pinyin: "xiǎo yáng" }, { word: "山羊", pinyin: "shān yáng" }, { word: "羊毛", pinyin: "yáng máo" }], sentences: ["小羊咩咩叫。", "羊毛可以做衣服。"], strokeCount: 6, category: "animal" },
  { id: 34, char: "鱼", pinyin: "yú", level: 4, emoji: "🐟", keywords: ["小鱼", "金鱼"], words: [{ word: "小鱼", pinyin: "xiǎo yú" }, { word: "金鱼", pinyin: "jīn yú" }, { word: "鱼缸", pinyin: "yú gāng" }], sentences: ["河里有很多鱼。", "金鱼在水里游来游去。"], strokeCount: 8, category: "animal" },
  { id: 35, char: "鸟", pinyin: "niǎo", level: 4, emoji: "🐦", keywords: ["小鸟", "飞鸟"], words: [{ word: "小鸟", pinyin: "xiǎo niǎo" }, { word: "鸟儿", pinyin: "niǎo ér" }], sentences: ["小鸟在树上唱歌。", "鸟儿会飞。"], strokeCount: 5, category: "animal" },
  { id: 36, char: "虫", pinyin: "chóng", level: 4, emoji: "🐛", keywords: ["虫子", "昆虫"], words: [{ word: "虫子", pinyin: "chóng zi" }, { word: "小虫", pinyin: "xiǎo chóng" }], sentences: ["花上有小虫子。", "小鸟爱吃虫。"], strokeCount: 6, category: "animal" },
  { id: 37, char: "手", pinyin: "shǒu", level: 4, emoji: "✋", keywords: ["小手", "手掌"], words: [{ word: "小手", pinyin: "xiǎo shǒu" }, { word: "手指", pinyin: "shǒu zhǐ" }, { word: "洗手", pinyin: "xǐ shǒu" }], sentences: ["我有两只手。", "吃饭前要洗手。"], strokeCount: 4, category: "body" },
  { id: 38, char: "足", pinyin: "zú", level: 4, emoji: "🦶", keywords: ["足球", "足"], words: [{ word: "足球", pinyin: "zú qiú" }, { word: "不足", pinyin: "bù zú" }, { word: "十足", pinyin: "shí zú" }], sentences: ["我喜欢踢足球。", "走路要用足。"], strokeCount: 7, category: "body" },
  { id: 39, char: "目", pinyin: "mù", level: 4, emoji: "👁️", keywords: ["眼睛", "目光"], words: [{ word: "目光", pinyin: "mù guāng" }, { word: "目前", pinyin: "mù qián" }, { word: "节目", pinyin: "jié mù" }], sentences: ["用目看世界。", "眼睛能看见东西。"], strokeCount: 5, category: "body" },
  { id: 40, char: "耳", pinyin: "ěr", level: 4, emoji: "👂", keywords: ["耳朵", "木耳"], words: [{ word: "耳朵", pinyin: "ěr duo" }, { word: "木耳", pinyin: "mù ěr" }], sentences: ["我用耳朵听声音。", "小兔子的耳朵很长。"], strokeCount: 6, category: "body" },

  // ===== 第5级：家人与情感 =====
  { id: 41, char: "爸", pinyin: "bà", level: 5, emoji: "👨", keywords: ["爸爸", "父亲"], words: [{ word: "爸爸", pinyin: "bà ba" }, { word: "爸妈", pinyin: "bà mā" }], sentences: ["爸爸爱我。", "爸爸带我去公园。"], strokeCount: 8, category: "family" },
  { id: 42, char: "妈", pinyin: "mā", level: 5, emoji: "👩", keywords: ["妈妈", "母亲"], words: [{ word: "妈妈", pinyin: "mā ma" }, { word: "爸妈", pinyin: "bà mā" }], sentences: ["妈妈做菜好好吃。", "妈妈给我讲故事。"], strokeCount: 6, category: "family" },
  { id: 43, char: "我", pinyin: "wǒ", level: 5, emoji: "🙋", keywords: ["自己", "我们"], words: [{ word: "我们", pinyin: "wǒ men" }, { word: "我的", pinyin: "wǒ de" }], sentences: ["我是小学生。", "我们一起去玩吧！"], strokeCount: 7, category: "concept" },
  { id: 44, char: "你", pinyin: "nǐ", level: 5, emoji: "👉", keywords: ["你们", "你好"], words: [{ word: "你好", pinyin: "nǐ hǎo" }, { word: "你们", pinyin: "nǐ men" }, { word: "你的", pinyin: "nǐ de" }], sentences: ["你好呀！", "你的书包真好看。"], strokeCount: 7, category: "concept" },
  { id: 45, char: "他", pinyin: "tā", level: 5, emoji: "👦", keywords: ["他们", "他人"], words: [{ word: "他们", pinyin: "tā men" }, { word: "他的", pinyin: "tā de" }], sentences: ["他是我的好朋友。", "他们一起踢足球。"], strokeCount: 5, category: "concept" },
  { id: 46, char: "好", pinyin: "hǎo", level: 5, emoji: "👍", keywords: ["好人", "好看"], words: [{ word: "你好", pinyin: "nǐ hǎo" }, { word: "好人", pinyin: "hǎo rén" }, { word: "好看", pinyin: "hǎo kàn" }], sentences: ["你是个好孩子！", "这朵花好漂亮。"], strokeCount: 6, category: "concept" },
  { id: 47, char: "爱", pinyin: "ài", level: 5, emoji: "❤️", keywords: ["爱心", "可爱"], words: [{ word: "爱心", pinyin: "ài xīn" }, { word: "可爱", pinyin: "kě ài" }, { word: "热爱", pinyin: "rè ài" }], sentences: ["妈妈我爱您！", "好可爱的小猫。"], strokeCount: 10, category: "feeling" },
  { id: 48, char: "笑", pinyin: "xiào", level: 5, emoji: "😊", keywords: ["笑脸", "欢笑"], words: [{ word: "笑脸", pinyin: "xiào liǎn" }, { word: "大笑", pinyin: "dà xiào" }, { word: "玩笑", pinyin: "wán xiào" }], sentences: ["小朋友笑得好开心。", "大家开心地笑了。"], strokeCount: 10, category: "feeling" },
  { id: 49, char: "哭", pinyin: "kū", level: 5, emoji: "😢", keywords: ["哭泣", "大哭"], words: [{ word: "大哭", pinyin: "dà kū" }, { word: "哭泣", pinyin: "kū qì" }], sentences: ["宝宝哭了。", "不要哭，要笑！"], strokeCount: 10, category: "feeling" },
  { id: 50, char: "心", pinyin: "xīn", level: 5, emoji: "💕", keywords: ["爱心", "心情"], words: [{ word: "爱心", pinyin: "ài xīn" }, { word: "开心", pinyin: "kāi xīn" }, { word: "小心", pinyin: "xiǎo xīn" }], sentences: ["我有颗爱心。", "祝你天天开心！"], strokeCount: 4, category: "body" },

  // ===== 第6级：动作行为 =====
  { id: 51, char: "走", pinyin: "zǒu", level: 6, emoji: "🚶", keywords: ["走路", "行走"], words: [{ word: "走路", pinyin: "zǒu lù" }, { word: "行走", pinyin: "xíng zǒu" }], sentences: ["我们一起走路去学校。", "小鸟在地上走。"], strokeCount: 7, category: "action" },
  { id: 52, char: "跑", pinyin: "pǎo", level: 6, emoji: "🏃", keywords: ["跑步", "奔跑"], words: [{ word: "跑步", pinyin: "pǎo bù" }, { word: "跑车", pinyin: "pǎo chē" }], sentences: ["哥哥跑得很快！", "不要在教室里跑。"], strokeCount: 12, category: "action" },
  { id: 53, char: "看", pinyin: "kàn", level: 6, emoji: "👀", keywords: ["看见", "看书"], words: [{ word: "看见", pinyin: "kàn jiàn" }, { word: "看书", pinyin: "kàn shū" }, { word: "好看", pinyin: "hǎo kàn" }], sentences: ["我能看见星星。", "我喜欢看书。"], strokeCount: 9, category: "action" },
  { id: 54, char: "吃", pinyin: "chī", level: 6, emoji: "🍽️", keywords: ["吃饭", "好吃"], words: [{ word: "吃饭", pinyin: "chī fàn" }, { word: "好吃", pinyin: "hǎo chī" }, { word: "小吃", pinyin: "xiǎo chī" }], sentences: ["我要吃饭了。", "妈妈做的菜真好吃！"], strokeCount: 6, category: "action" },
  { id: 55, char: "喝", pinyin: "hē", level: 6, emoji: "🥤", keywords: ["喝水", "喝茶"], words: [{ word: "喝水", pinyin: "hē shuǐ" }, { word: "喝茶", pinyin: "hē chá" }], sentences: ["天热要多喝水。", "爸爸喜欢喝茶。"], strokeCount: 12, category: "action" },
  { id: 56, char: "说", pinyin: "shuō", level: 6, emoji: "🗣️", keywords: ["说话", "说话"], words: [{ word: "说话", pinyin: "shuō huà" }, { word: "听说", pinyin: "tīng shuō" }], sentences: ["老师说我真棒！", "说话要讲礼貌。"], strokeCount: 9, category: "action" },
  { id: 57, char: "听", pinyin: "tīng", level: 6, emoji: "👂", keywords: ["听见", "听讲"], words: [{ word: "听见", pinyin: "tīng jiàn" }, { word: "好听", pinyin: "hǎo tīng" }, { word: "听讲", pinyin: "tīng jiǎng" }], sentences: ["我听见鸟叫声。", "上课要认真听讲。"], strokeCount: 7, category: "action" },
  { id: 58, char: "见", pinyin: "jiàn", level: 6, emoji: "👁️", keywords: ["看见", "见面"], words: [{ word: "看见", pinyin: "kàn jiàn" }, { word: "再见", pinyin: "zài jiàn" }, { word: "见面", pinyin: "jiàn miàn" }], sentences: ["明天见！", "我看见一只蝴蝶。"], strokeCount: 4, category: "action" },
  { id: 59, char: "开", pinyin: "kāi", level: 6, emoji: "🚪", keywords: ["开门", "开心"], words: [{ word: "开门", pinyin: "kāi mén" }, { word: "开心", pinyin: "kāi xīn" }, { word: "开始", pinyin: "kāi shǐ" }], sentences: ["请开门。", "祝你玩得开心！"], strokeCount: 4, category: "action" },
  { id: 60, char: "关", pinyin: "guān", level: 6, emoji: "🔒", keywords: ["关门", "关心"], words: [{ word: "关门", pinyin: "guān mén" }, { word: "关心", pinyin: "guān xīn" }, { word: "开关", pinyin: "kāi guān" }], sentences: ["请关门。", "妈妈很关心我。"], strokeCount: 6, category: "action" },

  // ===== 第7级：日常物品 =====
  { id: 61, char: "门", pinyin: "mén", level: 7, emoji: "🚪", keywords: ["大门", "门口"], words: [{ word: "大门", pinyin: "dà mén" }, { word: "门口", pinyin: "mén kǒu" }, { word: "开门", pinyin: "kāi mén" }], sentences: ["我家的大门是红色的。", "学校门口有棵树。"], strokeCount: 3, category: "object" },
  { id: 62, char: "书", pinyin: "shū", level: 7, emoji: "📖", keywords: ["书本", "看书"], words: [{ word: "书本", pinyin: "shū běn" }, { word: "看书", pinyin: "kàn shū" }, { word: "书包", pinyin: "shū bāo" }], sentences: ["我喜欢看书。", "书包里有很多书。"], strokeCount: 4, category: "object" },
  { id: 63, char: "笔", pinyin: "bǐ", level: 7, emoji: "✏️", keywords: ["铅笔", "写字"], words: [{ word: "铅笔", pinyin: "qiān bǐ" }, { word: "毛笔", pinyin: "máo bǐ" }, { word: "画笔", pinyin: "huà bǐ" }], sentences: ["我用笔写字。", "这支笔是红色的。"], strokeCount: 10, category: "object" },
  { id: 64, char: "车", pinyin: "chē", level: 7, emoji: "🚗", keywords: ["汽车", "车子"], words: [{ word: "汽车", pinyin: "qì chē" }, { word: "火车", pinyin: "huǒ chē" }, { word: "自行车", pinyin: "zì xíng chē" }], sentences: ["爸爸开车去上班。", "马路上有很多车。"], strokeCount: 4, category: "object" },
  { id: 65, char: "衣", pinyin: "yī", level: 7, emoji: "👕", keywords: ["衣服", "穿衣"], words: [{ word: "衣服", pinyin: "yī fu" }, { word: "大衣", pinyin: "dà yī" }, { word: "毛衣", pinyin: "máo yī" }], sentences: ["穿好衣服出去玩。", "这件衣服好漂亮。"], strokeCount: 6, category: "object" },
  { id: 66, char: "米", pinyin: "mǐ", level: 7, emoji: "🍚", keywords: ["大米", "米饭"], words: [{ word: "大米", pinyin: "dà mǐ" }, { word: "米饭", pinyin: "mǐ fàn" }, { word: "玉米", pinyin: "yù mǐ" }], sentences: ["米饭香香的。", "田里种了很多稻米。"], strokeCount: 6, category: "object" },
  { id: 67, char: "果", pinyin: "guǒ", level: 7, emoji: "🍎", keywords: ["水果", "苹果"], words: [{ word: "水果", pinyin: "shuǐ guǒ" }, { word: "苹果", pinyin: "píng guǒ" }, { word: "如果", pinyin: "rú guǒ" }], sentences: ["多吃水果身体好。", "苹果又红又甜。"], strokeCount: 8, category: "object" },
  { id: 68, char: "瓜", pinyin: "guā", level: 7, emoji: "🍉", keywords: ["西瓜", "瓜子"], words: [{ word: "西瓜", pinyin: "xī guā" }, { word: "瓜子", pinyin: "guā zǐ" }, { word: "冬瓜", pinyin: "dōng guā" }], sentences: ["夏天吃西瓜好凉快！", "西瓜又大又甜。"], strokeCount: 5, category: "object" },
  { id: 69, char: "灯", pinyin: "dēng", level: 7, emoji: "💡", keywords: ["灯光", "电灯"], words: [{ word: "灯光", pinyin: "dēng guāng" }, { word: "电灯", pinyin: "diàn dēng" }], sentences: ["天黑了要开灯。", "房间里的灯好亮。"], strokeCount: 6, category: "object" },
  { id: 70, char: "刀", pinyin: "dāo", level: 7, emoji: "🔪", keywords: ["小刀", "剪刀"], words: [{ word: "小刀", pinyin: "xiǎo dāo" }, { word: "剪刀", pinyin: "jiǎn dāo" }], sentences: ["小朋友不能玩刀。", "剪刀可以剪纸。"], strokeCount: 2, category: "object" },

  // ===== 第8级：学校与生活 =====
  { id: 71, char: "学", pinyin: "xué", level: 8, emoji: "🏫", keywords: ["学习", "学校"], words: [{ word: "学习", pinyin: "xué xí" }, { word: "学校", pinyin: "xué xiào" }, { word: "上学", pinyin: "shàng xué" }], sentences: ["我去学校上学。", "学习让我快乐。"], strokeCount: 8, category: "life" },
  { id: 72, char: "校", pinyin: "xiào", level: 8, emoji: "🏫", keywords: ["学校", "校园"], words: [{ word: "学校", pinyin: "xué xiào" }, { word: "校园", pinyin: "xiào yuán" }], sentences: ["学校里有好多小朋友。", "校园里开满了花朵。"], strokeCount: 10, category: "life" },
  { id: 73, char: "家", pinyin: "jiā", level: 8, emoji: "🏠", keywords: ["家园", "大家"], words: [{ word: "大家", pinyin: "dà jiā" }, { word: "回家", pinyin: "huí jiā" }, { word: "家人", pinyin: "jiā rén" }], sentences: ["我爱我家。", "大家一起玩。"], strokeCount: 10, category: "life" },
  { id: 74, char: "园", pinyin: "yuán", level: 8, emoji: "🏞️", keywords: ["公园", "花园"], words: [{ word: "公园", pinyin: "gōng yuán" }, { word: "花园", pinyin: "huā yuán" }, { word: "幼儿园", pinyin: "yòu ér yuán" }], sentences: ["周末去公园玩。", "花园里有好多花。"], strokeCount: 7, category: "life" },
  { id: 75, char: "玩", pinyin: "wán", level: 8, emoji: "🎮", keywords: ["玩耍", "好玩"], words: [{ word: "好玩", pinyin: "hǎo wán" }, { word: "玩具", pinyin: "wán jù" }, { word: "玩耍", pinyin: "wán shuǎ" }], sentences: ["小朋友在公园里玩。", "这个玩具真好玩！"], strokeCount: 8, category: "action" },
  { id: 76, char: "画", pinyin: "huà", level: 8, emoji: "🎨", keywords: ["画画", "图画"], words: [{ word: "画画", pinyin: "huà huà" }, { word: "图画", pinyin: "tú huà" }, { word: "画笔", pinyin: "huà bǐ" }], sentences: ["我喜欢画画。", "这幅画真美！"], strokeCount: 8, category: "action" },
  { id: 77, char: "写", pinyin: "xiě", level: 8, emoji: "✍️", keywords: ["写字", "书写"], words: [{ word: "写字", pinyin: "xiě zì" }, { word: "写画", pinyin: "xiě huà" }], sentences: ["我会写自己的名字。", "她在认真地写字。"], strokeCount: 5, category: "action" },
  { id: 78, char: "字", pinyin: "zì", level: 8, emoji: "🔤", keywords: ["汉字", "文字"], words: [{ word: "汉字", pinyin: "hàn zì" }, { word: "写字", pinyin: "xiě zì" }, { word: "名字", pinyin: "míng zì" }], sentences: ["汉字真有趣！", "我会写很多字了。"], strokeCount: 6, category: "object" },
  { id: 79, char: "歌", pinyin: "gē", level: 8, emoji: "🎵", keywords: ["唱歌", "歌曲"], words: [{ word: "唱歌", pinyin: "chàng gē" }, { word: "歌曲", pinyin: "gē qǔ" }, { word: "儿歌", pinyin: "ér gē" }], sentences: ["我喜欢唱歌。", "这首歌真好听。"], strokeCount: 14, category: "life" },
  { id: 80, char: "乐", pinyin: "lè", level: 8, emoji: "😄", keywords: ["快乐", "欢乐"], words: [{ word: "快乐", pinyin: "kuài lè" }, { word: "欢乐", pinyin: "huān lè" }, { word: "乐园", pinyin: "lè yuán" }], sentences: ["祝你生日快乐！", "识字乐园真好玩。"], strokeCount: 5, category: "feeling" },

  // ===== 第9级：季节颜色 =====
  { id: 81, char: "春", pinyin: "chūn", level: 9, emoji: "🌸", keywords: ["春天", "春风"], words: [{ word: "春天", pinyin: "chūn tiān" }, { word: "春风", pinyin: "chūn fēng" }, { word: "春节", pinyin: "chūn jié" }], sentences: ["春天花儿开了。", "春风吹得好暖和。"], strokeCount: 9, category: "nature" },
  { id: 82, char: "夏", pinyin: "xià", level: 9, emoji: "☀️", keywords: ["夏天", "夏日"], words: [{ word: "夏天", pinyin: "xià tiān" }, { word: "夏日", pinyin: "xià rì" }], sentences: ["夏天好热啊！", "夏天可以吃西瓜。"], strokeCount: 10, category: "nature" },
  { id: 83, char: "秋", pinyin: "qiū", level: 9, emoji: "🍂", keywords: ["秋天", "秋风"], words: [{ word: "秋天", pinyin: "qiū tiān" }, { word: "秋风", pinyin: "qiū fēng" }], sentences: ["秋天叶子落了。", "秋天的天空好蓝。"], strokeCount: 9, category: "nature" },
  { id: 84, char: "冬", pinyin: "dōng", level: 9, emoji: "❄️", keywords: ["冬天", "冬日"], words: [{ word: "冬天", pinyin: "dōng tiān" }, { word: "冬日", pinyin: "dōng rì" }], sentences: ["冬天下雪了。", "冬天要穿厚衣服。"], strokeCount: 5, category: "nature" },
  { id: 85, char: "红", pinyin: "hóng", level: 9, emoji: "🔴", keywords: ["红色", "红花"], words: [{ word: "红色", pinyin: "hóng sè" }, { word: "红花", pinyin: "hóng huā" }, { word: "红心", pinyin: "hóng xīn" }], sentences: ["苹果是红色的。", "我喜欢红色的花。"], strokeCount: 6, category: "color" },
  { id: 86, char: "白", pinyin: "bái", level: 9, emoji: "⬜", keywords: ["白色", "白云"], words: [{ word: "白色", pinyin: "bái sè" }, { word: "白云", pinyin: "bái yún" }, { word: "白雪", pinyin: "bái xuě" }], sentences: ["雪花是白色的。", "天上有白云。"], strokeCount: 5, category: "color" },
  { id: 87, char: "长", pinyin: "cháng", level: 9, emoji: "📏", keywords: ["长短", "长"], words: [{ word: "长江", pinyin: "cháng jiāng" }, { word: "长大", pinyin: "zhǎng dà" }, { word: "长远", pinyin: "cháng yuǎn" }], sentences: ["长江是中国最长的河。", "我希望快快长大。"], strokeCount: 4, category: "concept" },
  { id: 88, char: "短", pinyin: "duǎn", level: 9, emoji: "📐", keywords: ["短", "短小"], words: [{ word: "长短", pinyin: "cháng duǎn" }, { word: "短小", pinyin: "duǎn xiǎo" }], sentences: ["铅笔变短了。", "兔子的尾巴很短。"], strokeCount: 12, category: "concept" },
  { id: 89, char: "高", pinyin: "gāo", level: 9, emoji: "🏗️", keywords: ["高兴", "高山"], words: [{ word: "高兴", pinyin: "gāo xìng" }, { word: "高山", pinyin: "gāo shān" }, { word: "高大", pinyin: "gāo dà" }], sentences: ["我真高兴见到你！", "那座山好高好高。"], strokeCount: 10, category: "concept" },
  { id: 90, char: "快", pinyin: "kuài", level: 9, emoji: "⚡", keywords: ["快乐", "飞快"], words: [{ word: "快乐", pinyin: "kuài lè" }, { word: "飞快", pinyin: "fēi kuài" }, { word: "快点", pinyin: "kuài diǎn" }], sentences: ["祝你生日快乐！", "运动员跑得好快。"], strokeCount: 7, category: "concept" },

  // ===== 第10级：进阶字 =====
  { id: 91, char: "左", pinyin: "zuǒ", level: 10, emoji: "👈", keywords: ["左边", "左手"], words: [{ word: "左边", pinyin: "zuǒ bian" }, { word: "左手", pinyin: "zuǒ shǒu" }, { word: "左右", pinyin: "zuǒ yòu" }], sentences: ["我用左手拿书。", "学校在我家的左边。"], strokeCount: 5, category: "concept" },
  { id: 92, char: "右", pinyin: "yòu", level: 10, emoji: "👉", keywords: ["右边", "右手"], words: [{ word: "右边", pinyin: "yòu bian" }, { word: "右手", pinyin: "yòu shǒu" }, { word: "左右", pinyin: "zuǒ yòu" }], sentences: ["我用右手写字。", "向右转！"], strokeCount: 5, category: "concept" },
  { id: 93, char: "前", pinyin: "qián", level: 10, emoji: "⏩", keywords: ["前面", "前后"], words: [{ word: "前面", pinyin: "qián miàn" }, { word: "前天", pinyin: "qián tiān" }, { word: "前后", pinyin: "qián hòu" }], sentences: ["学校在我家前面。", "向前走就到了。"], strokeCount: 9, category: "concept" },
  { id: 94, char: "后", pinyin: "hòu", level: 10, emoji: "⏪", keywords: ["后面", "以后"], words: [{ word: "后面", pinyin: "hòu miàn" }, { word: "以后", pinyin: "yǐ hòu" }, { word: "前后", pinyin: "qián hòu" }], sentences: ["他站在我后面。", "以后我要好好学习。"], strokeCount: 6, category: "concept" },
  { id: 95, char: "多", pinyin: "duō", level: 10, emoji: "📊", keywords: ["多少", "很多"], words: [{ word: "多少", pinyin: "duō shǎo" }, { word: "很多", pinyin: "hěn duō" }, { word: "多么", pinyin: "duō me" }], sentences: ["天上有多少颗星星？", "我有好多好多朋友。"], strokeCount: 6, category: "concept" },
  { id: 96, char: "少", pinyin: "shǎo", level: 10, emoji: "🤏", keywords: ["多少", "少"], words: [{ word: "多少", pinyin: "duō shǎo" }, { word: "少数", pinyin: "shǎo shù" }, { word: "很少", pinyin: "hěn shǎo" }], sentences: ["水太少了。", "冬天花儿很少。"], strokeCount: 4, category: "concept" },
  { id: 97, char: "来", pinyin: "lái", level: 10, emoji: "🚶‍➡️", keywords: ["过来", "回来"], words: [{ word: "过来", pinyin: "guò lái" }, { word: "回来", pinyin: "huí lái" }, { word: "未来", pinyin: "wèi lái" }], sentences: ["快来跟我一起玩！", "春天来了花开了。"], strokeCount: 7, category: "action" },
  { id: 98, char: "去", pinyin: "qù", level: 10, emoji: "🚶", keywords: ["出去", "回去"], words: [{ word: "出去", pinyin: "chū qù" }, { word: "回去", pinyin: "huí qù" }, { word: "去年", pinyin: "qù nián" }], sentences: ["我要出去玩了。", "去年我还不认识这个字。"], strokeCount: 5, category: "action" },
  { id: 99, char: "有", pinyin: "yǒu", level: 10, emoji: "✅", keywords: ["没有", "拥有"], words: [{ word: "没有", pinyin: "méi yǒu" }, { word: "只有", pinyin: "zhǐ yǒu" }, { word: "有趣", pinyin: "yǒu qù" }], sentences: ["我有一只小狗。", "这个故事真有趣！"], strokeCount: 6, category: "concept" },
  { id: 100, char: "不", pinyin: "bù", level: 10, emoji: "🚫", keywords: ["不是", "不要"], words: [{ word: "不是", pinyin: "bù shì" }, { word: "不要", pinyin: "bù yào" }, { word: "不好", pinyin: "bù hǎo" }], sentences: ["我不是小孩子了。", "不能一个人去河边。"], strokeCount: 4, category: "concept" }
];

// ===== 辅助索引 =====
const CHAR_BY_LEVEL = {};
CHARACTER_DB.forEach(function(c) {
  if (!CHAR_BY_LEVEL[c.level]) CHAR_BY_LEVEL[c.level] = [];
  CHAR_BY_LEVEL[c.level].push(c);
});

const CHAR_BY_ID = {};
CHARACTER_DB.forEach(function(c) {
  CHAR_BY_ID[c.id] = c;
});

function getCharsByLevel(level) {
  return CHAR_BY_LEVEL[level] || [];
}

function getCharById(id) {
  return CHAR_BY_ID[id] || null;
}

function getTotalLevels() {
  return 10;
}

function getTotalChars() {
  return CHARACTER_DB.length;
}
