// === Plan Data ===
const PLANS = [
  {
    id: 1, title: '莫干山竹海发呆', transit: '高铁47min · 德清', duration: '2天', category: 'weekend',
    stayType: '精品民宿', price: '¥400-800/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'德清站',lat:30.533,lng:119.978},{name:'莫干山',lat:30.633,lng:119.877},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'裸心谷竹林徒步+山顶手冲',photo:'photo-1518335935020-cfd6580c1ab4',weather:{icon:'☀️',temp:'28°'}},
      {label:'Day2',activity:'骑行环山路+返程',photo:'photo-1534787238916-9ba6764efd4f',weather:{icon:'⛅',temp:'26°'}}
    ],
    legs: ['🚄47min', '🚗25min'],
    detail: {
      transitInfo:['杭州东→德清站 高铁47min','班次密集 每30min一班','票价¥28.5 二等座','德清站打车到莫干山约25min'],
      fullItinerary:[{label:'Day 1',content:'出发去苏州站→高铁47min到德清站(¥28.5)→打车25min到莫干山→裸心谷竹林徒步(约2h)→山顶精品咖啡馆→入住莫干山民宿→晚上萤火虫观赏'},{label:'Day 2',content:'民宿早餐→骑行环山路(可租电动车)→沿途茶园和竹海→庾村文创小镇午餐→打车到德清站→高铁47min返回苏州站→回家'}],
      accommodation:'裸心谷/莫干山精品民宿，均价¥400-800/晚。推荐提前1周预订。'
    }
  },
  {
    id: 2, title: '西塘深夜场', transit: '高铁1h · 嘉善', duration: '2天', category: 'weekend',
    stayType: '临水客栈', price: '¥200-400/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'嘉善站',lat:30.841,lng:120.926},{name:'西塘',lat:30.893,lng:120.893},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'夜游西塘(人超少)+酒吧街',photo:'photo-1470004914212-05527e49370b',weather:{icon:'🌙',temp:'25°'}},
      {label:'Day2',activity:'清晨空巷拍照+烟雨长廊',photo:'photo-1528164344705-47542687000d',weather:{icon:'☀️',temp:'29°'}}
    ],
    legs: ['🚄1h', '🚗20min'],
    detail: {
      transitInfo:['高铁1h 苏州→嘉善南','票价¥49 二等座','嘉善南打车20min到西塘'],
      fullItinerary:[{label:'Day 1',content:'出发去苏州站→高铁1h到嘉善南站(¥49)→打车20min到西塘古镇→入住临水客栈→黄昏逛巷子→夜游西塘(人超少!)→酒吧街'},{label:'Day 2',content:'6点起床拍空巷→烟雨长廊→早茶→打车20min到嘉善南站→高铁1h返回苏州站→回家'}],
      accommodation:'临水客栈¥200-400/晚，选河边的，夜景好。'
    }
  },
  {
    id: 3, title: '太湖东山杨梅季', transit: '自驾1h', duration: '2天', category: 'weekend',
    stayType: '农家乐', price: '¥150-300/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'太湖东山',lat:31.067,lng:120.425},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'果园采杨梅+环太湖骑行',photo:'photo-1501785888041-af3ef285b470',weather:{icon:'☀️',temp:'31°'}},
      {label:'Day2',activity:'东山古街+碧螺春茶园',photo:'photo-1587162146766-e06b1189b907',weather:{icon:'⛅',temp:'29°'}}
    ],
    legs: ['🚗1h'],
    detail: {
      transitInfo:['自驾1h 苏州→东山','停车方便','油费约¥60'],
      fullItinerary:[{label:'Day 1',content:'自驾1h到东山→杨梅果园采杨梅(6月限定!)→太湖三白午餐→环太湖骑行15km→太湖边看日落→入住东山农家乐'},{label:'Day 2',content:'东山古街→碧螺春茶园→买茶手信→自驾1h返回苏州→回家'}],
      accommodation:'农家乐¥150-300/晚，含农家饭。'
    }
  },
  {
    id: 4, title: '径山问茶', transit: '自驾1.5h', duration: '2天', category: 'weekend',
    stayType: '茶宿', price: '¥300-500/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'径山',lat:30.397,lng:119.847},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'径山古道徒步到茶田+径山寺',photo:'photo-1448375240586-882707db888b',weather:{icon:'🌤️',temp:'27°'}},
      {label:'Day2',activity:'手工炒茶体验+竹林散步',photo:'photo-1587162146766-e06b1189b907',weather:{icon:'☀️',temp:'29°'}}
    ],
    legs: ['🚗1.5h'],
    detail: {
      transitInfo:['自驾1.5h 苏州→径山','油费约¥100'],
      fullItinerary:[{label:'Day 1',content:'自驾1.5h到径山→径山古道入口→徒步4km到茶田观景→径山寺禅茶→入住山中茶宿'},{label:'Day 2',content:'径山村手工炒茶体验→竹林→山下农家午餐→自驾1.5h返回苏州→回家'}],
      accommodation:'茶宿¥300-500/晚，山里安静。'
    }
  },
  {
    id: 5, title: '南浔静巷', transit: '高铁40min', duration: '2天', category: 'weekend',
    stayType: '水边民宿', price: '¥250-450/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'湖州站',lat:30.868,lng:120.089},{name:'南浔',lat:30.878,lng:120.418},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'百间楼日落+张石铭故居',photo:'photo-1551524559-8af4e6624178',weather:{icon:'⛅',temp:'27°'}},
      {label:'Day2',activity:'小莲庄晨光+丝绸博物馆',photo:'photo-1533929736458-ca588d08c8be',weather:{icon:'☀️',temp:'30°'}}
    ],
    legs: ['🚄40min', '🚗30min'],
    detail: {
      transitInfo:['高铁40min 苏州→湖州','票价¥24 二等座','湖州站打车到南浔30min'],
      fullItinerary:[{label:'Day 1',content:'出发去苏州站→高铁40min到湖州站(¥24)→打车30min到南浔古镇→百间楼看日落→张石铭故居→河边晚餐→入住南浔水边民宿'},{label:'Day 2',content:'小莲庄晨光拍照→丝绸博物馆(周一闭馆)→午餐→打车30min到湖州站→高铁40min返回苏州站→回家'}],
      accommodation:'水边民宿¥250-450/晚，选百间楼附近。'
    }
  },
  {
    id: 6, title: '皖南写生三日', transit: '高铁2.5h · 黄山北', duration: '3天', category: '3day',
    stayType: '民宿', price: '¥200-400/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'黄山北',lat:30.314,lng:118.31},{name:'宏村',lat:30.055,lng:117.977},{name:'塔川',lat:30.042,lng:117.962},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'宏村南湖写生+月沼夜景',photo:'photo-1551524559-8af4e6624178',weather:{icon:'☀️',temp:'26°'}},
      {label:'Day2',activity:'卢村木雕楼+塔川日落',photo:'photo-1500382017468-9049fed747ef',weather:{icon:'⛅',temp:'25°'}},
      {label:'Day3',activity:'碧山书局+返程',photo:'photo-1448375240586-882707db888b',weather:{icon:'🌤️',temp:'27°'}}
    ],
    legs: ['🚄2.5h', '🚗40min', '🚗10min'],
    detail: {
      transitInfo:['高铁2.5h 苏州→黄山北','票价¥86 二等座','黄山北站公交/包车到宏村'],
      fullItinerary:[{label:'Day 1',content:'出发去苏州站→高铁2.5h到黄山北站(¥86)→公交/包车到宏村→南湖写生→月沼夜景→入住宏村民宿'},{label:'Day 2',content:'卢村木雕楼→农家菜午餐→塔川骑行→塔川看日落→入住塔川民宿'},{label:'Day 3',content:'碧山书局→午餐→包车到黄山北站→高铁2.5h返回苏州站→回家'}],
      accommodation:'宏村民宿¥200-400/晚，选南湖边的。'
    }
  },
  {
    id: 7, title: '千岛湖骑行+萤火虫', transit: '高铁2h', duration: '3天', category: '3day',
    stayType: '湖景酒店', price: '¥400-600/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'千岛湖站',lat:29.604,lng:118.93},{name:'芹川古村',lat:29.56,lng:118.87},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'环湖绿道北线30km',photo:'photo-1534787238916-9ba6764efd4f',weather:{icon:'☀️',temp:'30°'}},
      {label:'Day2',activity:'芹川古村+晚上看萤火虫!',photo:'photo-1448375240586-882707db888b',weather:{icon:'🌤️',temp:'28°'}},
      {label:'Day3',activity:'南线骑行20km+返程',photo:'photo-1501785888041-af3ef285b470',weather:{icon:'☀️',temp:'31°'}}
    ],
    legs: ['🚄2h', '🚗30min'],
    detail: {
      transitInfo:['高铁2h 苏州→千岛湖','票价¥65 二等座','景区内租自行车'],
      fullItinerary:[{label:'Day 1',content:'出发去苏州站→高铁2h到千岛湖站(¥65)→租自行车→环湖绿道北线骑行30km→湖景晚餐→入住湖景酒店'},{label:'Day 2',content:'芹川古村→溪边午餐→下午休整→晚上看萤火虫(6-8月限定!)→回酒店'},{label:'Day 3',content:'南线骑行20km→午餐千岛湖鱼头→还车→千岛湖站高铁2h返回苏州站→回家'}],
      accommodation:'湖景酒店¥400-600/晚。'
    }
  },
  {
    id: 8, title: '浙闽山海七日', transit: '高铁起步', duration: '7天', category: 'week',
    stayType: '各地民宿', price: '¥200-500/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'丽水',lat:28.468,lng:119.923},{name:'缙云',lat:28.661,lng:120.091},{name:'霞浦',lat:26.885,lng:120.005},{name:'福鼎',lat:27.324,lng:120.216},{name:'太姥山',lat:27.175,lng:120.185},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'杭州→丽水 古堰画乡',photo:'photo-1501785888041-af3ef285b470',weather:{icon:'☀️',temp:'29°'}},
      {label:'Day2',activity:'缙云仙都 鼎湖峰',photo:'photo-1464822759023-fed622ff2c3b',weather:{icon:'🌤️',temp:'27°'}},
      {label:'Day3',activity:'丽水→霞浦',photo:'photo-1507525428034-b723cf961d3e',weather:{icon:'⛅',temp:'26°'}},
      {label:'Day4',activity:'霞浦滩涂日出(4:30起!)',photo:'photo-1470252649378-9c29740c9fa8',weather:{icon:'☀️',temp:'28°'}},
      {label:'Day5',activity:'福鼎白茶山',photo:'photo-1587162146766-e06b1189b907',weather:{icon:'☀️',temp:'27°'}},
      {label:'Day6',activity:'太姥山全天',photo:'photo-1464822759023-fed622ff2c3b',weather:{icon:'🌤️',temp:'25°'}},
      {label:'Day7',activity:'返程',photo:'photo-1507525428034-b723cf961d3e',weather:{icon:'⛅',temp:'26°'}}
    ],
    legs: ['🚄2.5h', '🚗1.5h', '🚗3h', '🚗1h', '🚗30min'],
    detail: {
      transitInfo:['苏州→丽水 高铁2.5h','丽水→霞浦 建议租车','总行程约1200km'],
      fullItinerary:[{label:'Day 1',content:'出发去苏州站→高铁2.5h到丽水站(¥120)→打车到古堰画乡→古堰画乡游览→入住丽水酒店'},{label:'Day 2',content:'缙云仙都景区(鼎湖峰+朱潭山)→午餐→入住缙云酒店'},{label:'Day 3',content:'租车/自驾3h到霞浦→入住霞浦民宿'},{label:'Day 4',content:'霞浦滩涂日出点(4:30起!)→上午休息→东壁日落→回民宿'},{label:'Day 5',content:'自驾1h到福鼎→福鼎白茶山→入住福鼎酒店'},{label:'Day 6',content:'自驾30min到太姥山景区→太姥山全天(约5h)→入住太姥山附近'},{label:'Day 7',content:'自驾到福鼎站→还车→高铁返回苏州→回家'}],
      accommodation:'各地民宿/酒店¥200-500/晚。'
    }
  },
  {
    id: 9, title: '江南水乡慢收集', transit: '高铁+公交', duration: '5天', category: '5day',
    stayType: '各镇客栈', price: '¥150-350/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'周庄',lat:31.113,lng:120.845},{name:'同里',lat:31.128,lng:120.737},{name:'南浔',lat:30.878,lng:120.418},{name:'乌镇',lat:30.745,lng:120.487},{name:'西塘',lat:30.893,lng:120.893},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'周庄 双桥+沈厅',photo:'photo-1528164344705-47542687000d',weather:{icon:'☀️',temp:'28°'}},
      {label:'Day2',activity:'同里 退思园+走三桥',photo:'photo-1533929736458-ca588d08c8be',weather:{icon:'🌤️',temp:'27°'}},
      {label:'Day3',activity:'南浔 百间楼+小莲庄',photo:'photo-1551524559-8af4e6624178',weather:{icon:'☀️',temp:'29°'}},
      {label:'Day4',activity:'乌镇西栅 夜景绝杀',photo:'photo-1470004914212-05527e49370b',weather:{icon:'⛅',temp:'26°'}},
      {label:'Day5',activity:'西塘 烟雨长廊+清晨',photo:'photo-1528164344705-47542687000d',weather:{icon:'☀️',temp:'28°'}}
    ],
    legs: ['🚗40min', '🚗30min', '🚗1h', '🚗40min', '🚗50min'],
    detail: {
      transitInfo:['苏州→周庄 公交/打车40min','古镇间打车/公交 30-60min','建议买联票'],
      fullItinerary:[{label:'Day 1',content:'自驾/打车40min到周庄古镇→双桥→沈厅→入住周庄客栈'},{label:'Day 2',content:'打车30min到同里古镇→退思园→走三桥→入住同里客栈'},{label:'Day 3',content:'打车1h到南浔古镇→百间楼→小莲庄→入住南浔民宿'},{label:'Day 4',content:'打车40min到乌镇西栅→西栅游览→夜景(8点后最美)→入住乌镇民宿'},{label:'Day 5',content:'打车50min到西塘古镇→烟雨长廊→午餐→打车50min返回苏州→回家'}],
      accommodation:'各镇客栈¥150-350/晚。'
    }
  },
  {
    id: 10, title: '徽州深度一周', transit: '高铁2.5h起步', duration: '7天', category: 'week',
    stayType: '徽州民宿', price: '¥200-500/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'黄山北',lat:30.314,lng:118.31},{name:'黄山',lat:30.137,lng:118.167},{name:'西递',lat:30.058,lng:117.934},{name:'宏村',lat:30.055,lng:117.977},{name:'呈坎',lat:30.006,lng:118.185},{name:'新安江',lat:29.856,lng:118.55},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'屯溪老街夜游',photo:'photo-1533929736458-ca588d08c8be',weather:{icon:'☀️',temp:'26°'}},
      {label:'Day2',activity:'黄山全天(住山顶!)',photo:'photo-1464822759023-fed622ff2c3b',weather:{icon:'☀️',temp:'18°'}},
      {label:'Day3',activity:'下山→西递古村',photo:'photo-1551524559-8af4e6624178',weather:{icon:'🌤️',temp:'25°'}},
      {label:'Day4',activity:'宏村 南湖+月沼',photo:'photo-1500382017468-9049fed747ef',weather:{icon:'☀️',temp:'26°'}},
      {label:'Day5',activity:'呈坎八卦村+唐模',photo:'photo-1551524559-8af4e6624178',weather:{icon:'⛅',temp:'24°'}},
      {label:'Day6',activity:'新安江山水画廊游船',photo:'photo-1501785888041-af3ef285b470',weather:{icon:'☀️',temp:'27°'}},
      {label:'Day7',activity:'屯溪采购+返程',photo:'photo-1533929736458-ca588d08c8be',weather:{icon:'🌤️',temp:'26°'}}
    ],
    legs: ['🚄2.5h', '🚗30min', '🚗20min', '🚗15min', '🚗40min', '🚗1h'],
    detail: {
      transitInfo:['高铁2.5h 苏州→黄山北','当地建议租车','黄山门票¥190+索道¥80'],
      fullItinerary:[{label:'Day 1',content:'出发去苏州站→高铁2.5h到黄山北站(¥86)→打车到屯溪老街→屯溪老街夜游→入住屯溪酒店'},{label:'Day 2',content:'打车到黄山南大门/北大门→索道上山→黄山全天(排云亭+光明顶)→住山顶看日出!'},{label:'Day 3',content:'下山→打车到西递古村→西递游览→入住西递民宿'},{label:'Day 4',content:'打车15min到宏村→南湖→月沼→写生→入住宏村民宿'},{label:'Day 5',content:'打车40min到呈坎→呈坎八卦村→唐模→入住呈坎附近'},{label:'Day 6',content:'打车1h到新安江码头→新安江山水画廊游船→入住屯溪'},{label:'Day 7',content:'屯溪采购伴手礼→打车到黄山北站→高铁2.5h返回苏州站→回家'}],
      accommodation:'徽州民宿¥200-500/晚。'
    }
  },
  {
    id: 11, title: '同里古镇半日闲', transit: '自驾40min', duration: '1天', category: 'tomorrow',
    stayType: '当天往返', price: '人均¥200',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'同里',lat:31.128,lng:120.737},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'半日',activity:'退思园+走三桥+状元蹄',photo:'photo-1528164344705-47542687000d',weather:{icon:'☀️',temp:'32°'}}
    ],
    legs: ['🚗40min'],
    detail: {
      transitInfo:['自驾40min 苏州→同里','门票¥100(含所有景点)'],
      fullItinerary:[{label:'上午',content:'自驾40min到同里古镇→退思园→走三桥→穿堂街买芡实糕'},{label:'下午',content:'明清街午餐(状元蹄必吃)→罗星洲坐船→日落→自驾40min返回苏州→回家'}],
      accommodation:'当天往返，无需住宿。'
    }
  },
  {
    id: 12, title: '灵岩山徒步', transit: '地铁+公交1h', duration: '1天', category: 'tomorrow',
    stayType: '当天往返', price: '人均¥80',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'灵岩山',lat:31.237,lng:120.517},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'半日',activity:'灵岩山步道+山顶寺+木渎午餐',photo:'photo-1464822759023-fed622ff2c3b',weather:{icon:'⛅',temp:'30°'}}
    ],
    legs: ['🚇+🚌1h'],
    detail: {
      transitInfo:['地铁1号线→木渎站→公交15min','或自驾30min','免门票'],
      fullItinerary:[{label:'上午',content:'地铁1号线到木渎站→公交15min到灵岩山→灵岩山步道登山(约45min)→灵岩寺→山顶俯瞰太湖'},{label:'下午',content:'下山→木渎古镇午餐(鲃肺汤)→严家花园→地铁返回苏州→回家'}],
      accommodation:'当天往返。'
    }
  },
  {
    id: 13, title: '阳澄湖骑行', transit: '自驾30min', duration: '1天', category: 'tomorrow',
    stayType: '当天往返', price: '人均¥150',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'阳澄湖',lat:31.411,lng:120.755},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'半日',activity:'环湖骑行20km+莲花岛+日落',photo:'photo-1501785888041-af3ef285b470',weather:{icon:'☀️',temp:'33°'}}
    ],
    legs: ['🚗30min'],
    detail: {
      transitInfo:['自驾30min到阳澄湖骑行驿站','租车¥50/天'],
      fullItinerary:[{label:'上午',content:'自驾30min到阳澄湖骑行驿站→租车→环湖骑行绿道20km→美人腿半岛'},{label:'下午',content:'莲花岛码头坐船上岛→湖边咖啡馆→看日落→自驾30min返回苏州→回家'}],
      accommodation:'当天往返。'
    }
  },
  {
    id: 14, title: '浙南山水5日', transit: '高铁2h起步', duration: '5天', category: '5day',
    stayType: '各地民宿', price: '¥200-400/晚',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'杭州',lat:30.274,lng:120.155},{name:'建德',lat:29.476,lng:119.281},{name:'丽水',lat:28.468,lng:119.923},{name:'缙云',lat:28.661,lng:120.091},{name:'仙居',lat:28.847,lng:120.728},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'Day1',activity:'杭州→建德 新安江夜游',photo:'photo-1501785888041-af3ef285b470',weather:{icon:'☀️',temp:'28°'}},
      {label:'Day2',activity:'大慈岩+下涯湿地晨雾',photo:'photo-1470252649378-9c29740c9fa8',weather:{icon:'☀️',temp:'27°'}},
      {label:'Day3',activity:'建德→丽水 古堰画乡',photo:'photo-1500382017468-9049fed747ef',weather:{icon:'🌤️',temp:'26°'}},
      {label:'Day4',activity:'缙云仙都 鼎湖峰+朱潭山',photo:'photo-1464822759023-fed622ff2c3b',weather:{icon:'☀️',temp:'29°'}},
      {label:'Day5',activity:'仙居神仙居+返程',photo:'photo-1464822759023-fed622ff2c3b',weather:{icon:'⛅',temp:'27°'}}
    ],
    legs: ['🚄25min', '🚄40min', '🚗2h', '🚗1h', '🚗1.5h'],
    detail: {
      transitInfo:['苏州→杭州 高铁25min','杭州→建德 高铁40min','建德以后建议租车'],
      fullItinerary:[{label:'Day 1',content:'出发去苏州站→高铁25min到杭州站→换乘高铁40min到建德站→打车到新安江→新安江夜游→入住建德酒店'},{label:'Day 2',content:'打车到大慈岩景区→大慈岩→下涯湿地(晨雾绝美)→入住建德'},{label:'Day 3',content:'租车/自驾2h到丽水→古堰画乡→入住丽水酒店'},{label:'Day 4',content:'自驾1h到缙云仙都景区→鼎湖峰→朱潭山→入住缙云'},{label:'Day 5',content:'自驾1.5h到仙居神仙居景区→神仙居全天→自驾/高铁返回苏州→回家'}],
      accommodation:'各地民宿¥200-400/晚。'
    }
  },
  {
    id: 15, title: '平江路商圈走走', transit: '地铁30min', duration: '半天', category: 'now',
    stayType: '当天往返', price: '人均¥100',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'平江路',lat:31.318,lng:120.632},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'下午',activity:'平江路赶集+独墓湖散步',photo:'photo-1528164344705-47542687000d',weather:{icon:'☀️',temp:'33°'}}
    ],
    legs: ['🚇 30min'],
    detail: {
      transitInfo:['地铁30min 到平江路站'],
      fullItinerary:[{label:'下午',content:'地铁到平江路站→平江路赶集→诚品书店→独墓湖散步→湖边咖啡→地铁回家'}],
      accommodation:'当天往返。'
    }
  },
  {
    id: 16, title: '金鸡湖日落骑行', transit: '骑行/自驾20min', duration: '半天', category: 'now',
    stayType: '当天往返', price: '人均¥50',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'金鸡湖',lat:31.327,lng:120.598},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'傍晚',activity:'环湖骑行+看日落',photo:'photo-1501785888041-af3ef285b470',weather:{icon:'☀️',temp:'33°'}}
    ],
    legs: ['🚲 20min'],
    detail: {
      transitInfo:['骑行/自驾20min到金鸡湖'],
      fullItinerary:[{label:'傍晚',content:'骑行/自驾20min到金鸡湖→环湖绿道骑行→湖边野餐→看日落→骑回家'}],
      accommodation:'当天往返。'
    }
  },
  {
    id: 17, title: '观前街夜市+护城河', transit: '步行/地铁15min', duration: '晚上', category: 'now',
    stayType: '当天往返', price: '人均¥80',
    route: [{name:'苏州',lat:31.299,lng:120.585},{name:'观前街',lat:31.309,lng:120.625},{name:'苏州',lat:31.299,lng:120.585}],
    days: [
      {label:'今晚',activity:'夜市扫街+护城河夜景',photo:'photo-1470004914212-05527e49370b',weather:{icon:'🌙',temp:'28°'}}
    ],
    legs: ['🚶 15min'],
    detail: {
      transitInfo:['步行/地铁15min 到观前街'],
      fullItinerary:[{label:'晚上',content:'步行/地铁到观前街→夜市扫街→护城河游船→河边散步→回家'}],
      accommodation:'当天往返。'
    }
  }
];

const RELATED_CONTENT = {
  "1":[{platform:"小红书",icon:"📕",title:"莫干山两天一夜，竹海里真的能发呆一整天",likes:"2.3w",color:"#FE2C55"},{platform:"抖音",icon:"🎵",title:"莫干山裸心谷徒步vlog｜治愈系周末",likes:"8.6w",color:"#000"},{platform:"马蜂窝",icon:"🐝",title:"莫干山完全攻略：民宿+路线+避坑",likes:"1.2w",color:"#FFD300"}],
  "2":[{platform:"小红书",icon:"📕",title:"西塘晚上10点以后才是真的！夜场攻略",likes:"3.1w",color:"#FE2C55"},{platform:"B站",icon:"📺",title:"【4K】清晨5点的西塘，终于没人了",likes:"12w",color:"#00A1D6"},{platform:"大众点评",icon:"⭐",title:"西塘最好吃的5家店，本地人推荐",likes:"8500",color:"#FF6633"}],
  "3":[{platform:"小红书",icon:"📕",title:"东山杨梅季！果园里吃到饱只要50块",likes:"1.8w",color:"#FE2C55"},{platform:"抖音",icon:"🎵",title:"环太湖骑行15km，风景绝了",likes:"5.2w",color:"#000"}],
  "4":[{platform:"小红书",icon:"📕",title:"径山寺后山有条野路！走40分钟到茶田",likes:"4.5w",color:"#FE2C55"},{platform:"B站",icon:"📺",title:"跟茶农学炒茶，翻车了但很开心",likes:"3.2w",color:"#00A1D6"}],
  "5":[{platform:"小红书",icon:"📕",title:"南浔，比乌镇安静十倍的江南古镇",likes:"5.8w",color:"#FE2C55"},{platform:"抖音",icon:"🎵",title:"百间楼日落太美了",likes:"11w",color:"#000"}],
  "6":[{platform:"小红书",icon:"📕",title:"宏村写生三天，画了8张水彩",likes:"2.7w",color:"#FE2C55"},{platform:"B站",icon:"📺",title:"【皖南vlog】卢村木雕楼，比宏村惊艳",likes:"6.8w",color:"#00A1D6"}],
  "7":[{platform:"小红书",icon:"📕",title:"芹川古村晚上有萤火虫！7月限定",likes:"6.2w",color:"#FE2C55"},{platform:"抖音",icon:"🎵",title:"千岛湖绿道骑行，随手拍都是壁纸",likes:"15w",color:"#000"}],
  "8":[{platform:"小红书",icon:"📕",title:"霞浦滩涂日出，4点半起床值了",likes:"7.3w",color:"#FE2C55"},{platform:"B站",icon:"📺",title:"【自驾vlog】浙闽山海线7天",likes:"22w",color:"#00A1D6"}],
  "9":[{platform:"小红书",icon:"📕",title:"五个古镇对比测评，最喜欢南浔",likes:"8.1w",color:"#FE2C55"},{platform:"抖音",icon:"🎵",title:"乌镇西栅夜景，全网最美角度",likes:"25w",color:"#000"}],
  "10":[{platform:"小红书",icon:"📕",title:"黄山日出住山顶，排云亭最佳机位",likes:"5.5w",color:"#FE2C55"},{platform:"B站",icon:"📺",title:"【徽州7日】粉墙黛瓦水墨画",likes:"18w",color:"#00A1D6"}],
  "11":[{platform:"小红书",icon:"📕",title:"同里比周庄安静十倍，退思园真的美",likes:"1.9w",color:"#FE2C55"}],
  "12":[{platform:"小红书",icon:"📕",title:"苏州人周末爬灵岩山，不要门票",likes:"2.4w",color:"#FE2C55"}],
  "13":[{platform:"小红书",icon:"📕",title:"非蟹季的阳澄湖，骑行超舒服人超少",likes:"1.5w",color:"#FE2C55"}],
  "14":[{platform:"小红书",icon:"📕",title:"浙南秘境！建德下涯湿地晨雾太仙了",likes:"5.2w",color:"#FE2C55"},{platform:"B站",icon:"📺",title:"【自驾vlog】神仙居名字不是吹的",likes:"11w",color:"#00A1D6"}]
};

// Timeline data for each plan (hours from trip start)
// Segments: { type: 'travel'|'play'|'sleep', label: string, start: hours, end: hours }
const TIMELINES = {
  1: [
    {type:'travel',cost:'¥29',label:'🚄高铁',start:0,end:0.8},
    {type:'travel',cost:'¥40',label:'🚗打车',start:0.8,end:1.2},
    {type:'play',label:'竹林徒步+咖啡',start:1.2,end:6},
    {type:'sleep',cost:'¥600',label:'民宿',start:6,end:14},
    {type:'play',label:'骑行环山',start:14,end:18},
    {type:'travel',cost:'',label:'🚗+🚄返程',start:18,end:20}
  ],
  2: [
    {type:'travel',cost:'¥49',label:'🚄高铁',start:0,end:1},
    {type:'travel',cost:'¥30',label:'🚗打车',start:1,end:1.3},
    {type:'play',label:'逛巷子+夜游',start:1.3,end:6},
    {type:'sleep',cost:'¥300',label:'客栈',start:6,end:14},
    {type:'play',label:'清晨拍照+早茶',start:14,end:17},
    {type:'travel',cost:'',label:'🚄返程',start:17,end:18}
  ],
  3: [
    {type:'travel',cost:'¥60',label:'🚗自驾',start:0,end:1},
    {type:'play',label:'采杨梅+骑行',start:1,end:7},
    {type:'sleep',cost:'¥200',label:'农家乐',start:7,end:15},
    {type:'play',label:'古街+茶园',start:15,end:19},
    {type:'travel',cost:'¥60',label:'🚗返程',start:19,end:20}
  ],
  4: [
    {type:'travel',cost:'¥100',label:'🚗自驾',start:0,end:1.5},
    {type:'play',label:'古道徒步+径山寺',start:1.5,end:7},
    {type:'sleep',cost:'¥400',label:'茶宿',start:7,end:15},
    {type:'play',label:'炒茶体验+散步',start:15,end:19},
    {type:'travel',cost:'¥100',label:'🚗返程',start:19,end:20.5}
  ],
  5: [
    {type:'travel',cost:'¥24',label:'🚄+🚗',start:0,end:1.5},
    {type:'play',label:'百间楼日落+故居',start:1.5,end:6},
    {type:'sleep',cost:'¥350',label:'民宿',start:6,end:14},
    {type:'play',label:'小莲庄+博物馆',start:14,end:17.5},
    {type:'travel',cost:'¥30',label:'🚗+🚄返程',start:17.5,end:19}
  ],
  6: [
    {type:'travel',cost:'¥86',label:'🚄高铁',start:0,end:2.5},
    {type:'travel',cost:'¥30',label:'🚌到宏村',start:2.5,end:3.5},
    {type:'play',label:'宏村写生',start:3.5,end:9},
    {type:'sleep',cost:'¥300',label:'民宿',start:9,end:21},
    {type:'play',label:'卢村+塔川',start:21,end:30},
    {type:'sleep',cost:'¥300',label:'民宿',start:30,end:42},
    {type:'play',label:'碧山书局',start:42,end:46},
    {type:'travel',cost:'¥30',label:'🚌+🚄返程',start:46,end:50}
  ],
  7: [
    {type:'travel',cost:'¥65',label:'🚄高铁',start:0,end:2},
    {type:'play',label:'环湖北线骑行',start:2,end:8},
    {type:'sleep',cost:'¥500',label:'湖景酒店',start:8,end:20},
    {type:'play',label:'芹川古村',start:20,end:26},
    {type:'play',label:'看萤火虫🌙',start:26,end:28},
    {type:'sleep',cost:'¥500',label:'酒店',start:28,end:40},
    {type:'play',label:'南线骑行',start:40,end:45},
    {type:'travel',cost:'¥65',label:'🚄返程',start:45,end:47}
  ],
  11: [
    {type:'travel',cost:'¥30',label:'🚗自驾',start:0,end:0.7},
    {type:'play',label:'退思园+三桥+午餐',start:0.7,end:5},
    {type:'travel',cost:'¥30',label:'🚗返程',start:5,end:5.7}
  ],
  12: [
    {type:'travel',cost:'¥8',label:'🚇+🚌',start:0,end:1},
    {type:'play',label:'登山+寺庙+午餐',start:1,end:5.5},
    {type:'travel',cost:'¥8',label:'🚌+🚇返程',start:5.5,end:6.5}
  ],
  13: [
    {type:'travel',cost:'¥20',label:'🚗自驾',start:0,end:0.5},
    {type:'play',label:'骑行+莲花岛+日落',start:0.5,end:7},
    {type:'travel',cost:'¥20',label:'🚗返程',start:7,end:7.5}
  ]
,
  8: [
    {type:'travel',cost:'¥120',label:'🚄高铁',start:0,end:2.5},
    {type:'play',label:'古堰画乡',start:2.5,end:8},
    {type:'sleep',cost:'¥300',label:'住丽水',start:8,end:20},
    {type:'play',label:'缙云仙都',start:20,end:28},
    {type:'sleep',cost:'¥250',label:'住缙云',start:28,end:40},
    {type:'travel',cost:'¥0',label:'🚗自驾',start:40,end:43},
    {type:'play',label:'霞浦滩涂日出',start:43,end:50},
    {type:'sleep',cost:'¥300',label:'住霞浦',start:50,end:62},
    {type:'play',label:'福鼎白茶山',start:62,end:69},
    {type:'sleep',cost:'¥250',label:'住福鼎',start:69,end:81},
    {type:'play',label:'太姥山全天',start:81,end:90},
    {type:'sleep',cost:'¥300',label:'住太姥山',start:90,end:102},
    {type:'travel',cost:'¥120',label:'🚗+🚄返程',start:102,end:108}
  ],
  9: [
    {type:'travel',cost:'¥30',label:'🚗到周庄',start:0,end:0.7},
    {type:'play',label:'周庄',start:0.7,end:7},
    {type:'sleep',cost:'¥200',label:'住周庄',start:7,end:19},
    {type:'travel',cost:'¥25',label:'🚗',start:19,end:19.5},
    {type:'play',label:'同里',start:19.5,end:26},
    {type:'sleep',cost:'¥200',label:'住同里',start:26,end:38},
    {type:'travel',cost:'¥40',label:'🚗',start:38,end:39},
    {type:'play',label:'南浔',start:39,end:46},
    {type:'sleep',cost:'¥300',label:'住南浔',start:46,end:58},
    {type:'travel',cost:'¥30',label:'🚗',start:58,end:58.7},
    {type:'play',label:'乌镇西栅',start:58.7,end:66},
    {type:'sleep',cost:'¥350',label:'住乌镇',start:66,end:78},
    {type:'travel',cost:'¥40',label:'🚗',start:78,end:78.8},
    {type:'play',label:'西塘',start:78.8,end:84},
    {type:'travel',cost:'¥30',label:'🚗返程',start:84,end:85}
  ],
  10: [
    {type:'travel',cost:'¥86',label:'🚄高铁',start:0,end:2.5},
    {type:'play',label:'屯溪老街',start:2.5,end:8},
    {type:'sleep',cost:'¥250',label:'住屯溪',start:8,end:18},
    {type:'play',label:'黄山全天',start:18,end:30},
    {type:'sleep',cost:'¥0',label:'住山顶',start:30,end:40},
    {type:'travel',cost:'¥50',label:'下山+🚗',start:40,end:43},
    {type:'play',label:'西递古村',start:43,end:49},
    {type:'sleep',cost:'¥250',label:'住西递',start:49,end:61},
    {type:'play',label:'宏村',start:61,end:69},
    {type:'sleep',cost:'¥250',label:'住宏村',start:69,end:81},
    {type:'play',label:'呈坎+唐模',start:81,end:89},
    {type:'sleep',cost:'¥250',label:'住呈坎',start:89,end:101},
    {type:'play',label:'新安江游船',start:101,end:107},
    {type:'travel',cost:'¥86',label:'🚗+🚄返程',start:107,end:112}
  ],
  14: [
    {type:'travel',cost:'¥25',label:'🚄高铁',start:0,end:1.5},
    {type:'play',label:'新安江夜游',start:1.5,end:6},
    {type:'sleep',cost:'¥300',label:'住建德',start:6,end:18},
    {type:'play',label:'大慈岩+下涯',start:18,end:27},
    {type:'sleep',cost:'¥300',label:'住建德',start:27,end:39},
    {type:'travel',cost:'¥40',label:'🚗',start:39,end:41},
    {type:'play',label:'古堰画乡',start:41,end:48},
    {type:'sleep',cost:'¥250',label:'住丽水',start:48,end:60},
    {type:'play',label:'缙云仙都',start:60,end:68},
    {type:'sleep',cost:'¥250',label:'住缙云',start:68,end:80},
    {type:'play',label:'神仙居',start:80,end:87},
    {type:'travel',cost:'¥50',label:'🚗+🚄返程',start:87,end:92}
  ]
};

// Tips for each plan
const PLAN_TIPS = {
  1: ["建议穿运动鞋，竹林步道有些滑", "6-8月晚上能看萤火虫", "周末民宿要提前1周订"],
  2: ["下午5点后入场免门票", "清晨6点前拍照人最少", "酒吧街周末才热闹"],
  3: ["杨梅季6月中-7月初，去晚了没果", "环湖骑行带防晒和水", "农家乐可以讲价，非周末更便宜"],
  4: ["径山古道蚊子多，带驱蚊水", "炒茶体验要提前一天预约", "山里早晚温差大，带件外套"],
  5: ["南浔门票包含所有景点，别单买", "百间楼日落6点最美，提前占位", "丝绸博物馆周一闭馆"],
  6: ["宏村写生要买门票进，3日内可反复进", "塔川秋天最美，夏天去卢村更好", "碧山书局咖啡很好喝"],
  7: ["萤火虫7月最多，远离路灯的地方看", "骑行绿道有坡，电动车更轻松", "芹川古村不要门票"],
  8: ["霞浦滩涂日出要4:30到，迟了光线不对", "浙闽沿线加油站少，提前加满", "太姥山爬全程要5小时，量力而行"],
  9: ["联票比单买划算，提前网上订", "乌镇西栅夜景8点后最美", "周庄双桥清晨没人，适合拍照"],
  10: ["黄山山顶住宿要提前1个月订", "日出看排云亭，日落看光明顶", "西递比宏村人少很多，更安静"],
  11: ["退思园早上9点前人少", "状元蹄认准古镇入口第一家", "三桥走完可以在河边坐坐"],
  12: ["灵岩山北坡路好走，南坡陡", "山顶灵岩寺免费，香火自愿", "下山后木渎的鲃肺汤是一绝"],
  13: ["非蟹季人少骑行舒服", "莲花岛末班船5点，别错过", "傍晚6点湖边蚊子多，带驱蚊"],
  14: ["下涯湿地晨雾要6点前到", "神仙居索道排队长，早去", "建德草莓季12-3月，夏天去看荷花"]
};

// Step details: keyword → { desc, duration, cost }
const STEP_DETAILS = {
  '苏州站': {desc:'建议提前30min到站，自助取票机在2楼大厅', duration:'30min', cost:''},
  '德清站': {desc:'出站右手边出租车排队区，或提前叫网约车到莫干山', duration:'', cost:'打车约¥40'},
  '裸心谷': {desc:'从入口进竹林步道，全程遮阴不晒，走到山顶有精品咖啡馆，手冲很好喝', duration:'2-3h', cost:'免费'},
  '莫干山民宿': {desc:'推荐提前1周订，周末涨价。裸心谷附近民宿集中，选山腰的安静', duration:'', cost:'¥400-800/晚'},
  '萤火虫': {desc:'远离路灯的地方效果最好，6-8月晚上8点后出现，别开闪光灯', duration:'1h', cost:'免费'},
  '庾村文创小镇': {desc:'莫干山脚下的文创聚集地，有咖啡店、手作店、独立书店', duration:'1-2h', cost:'人均¥50'},
  '嘉善南站': {desc:'出站后打车或公交到西塘约20min', duration:'', cost:'打车约¥30'},
  '西塘': {desc:'下午5点后入场免门票！晚上人少是精华，清晨6点前拍照最佳', duration:'3-4h', cost:'白天门票¥100'},
  '酒吧街': {desc:'西塘酒吧街周末才热闹，塘东街那排最集中', duration:'1-2h', cost:'人均¥50-100'},
  '烟雨长廊': {desc:'全长1km，廊下看河最有感觉，清晨没人时候拍照绝了', duration:'30min', cost:'免费'},
  '杨梅果园': {desc:'6月中-7月初限定！进园随便吃，带走按斤称', duration:'1-2h', cost:'入园¥50/人'},
  '太湖三白': {desc:'白虾白鱼银鱼，东山当地餐厅比景区便宜一半', duration:'1h', cost:'人均¥80-120'},
  '环太湖骑行': {desc:'东山环湖绿道，平坦好骑，沿途有补给站', duration:'2-3h', cost:'租车¥50/天'},
  '碧螺春茶园': {desc:'可以现场品茶买茶，老板会教你分辨真假碧螺春', duration:'1h', cost:'品茶免费，买茶¥200起'},
  '径山古道': {desc:'全程4km，台阶路为主，蚊子多带驱蚊水，走到顶有茶田', duration:'1.5-2h', cost:'免费'},
  '径山寺': {desc:'千年古刹，可以体验禅茶一味，寺内素面很好吃', duration:'1h', cost:'免费'},
  '炒茶体验': {desc:'跟茶农学手工炒茶，要提前一天预约', duration:'1-2h', cost:'¥100-200/人'},
  '百间楼': {desc:'南浔最美的一段，日落6点最佳，河两岸明清建筑倒映水中', duration:'1h', cost:'含在门票内'},
  '张石铭故居': {desc:'南浔四象之一的宅子，中西合璧建筑，细节很多值得慢看', duration:'30-45min', cost:'含在门票内'},
  '小莲庄': {desc:'刘家的私家花园，荷花池+碑廊，晨光拍照特别美', duration:'1h', cost:'含在门票内'},
  '丝绸博物馆': {desc:'了解南浔丝绸史，周一闭馆！', duration:'30min', cost:'免费'},
  '宏村': {desc:'南湖倒映马头墙，月沼是精华。门票3日内可反复进', duration:'半天-1天', cost:'门票¥104'},
  '月沼': {desc:'宏村精华，半月形池塘倒映古建，傍晚和清晨最美', duration:'30min', cost:'含在门票内'},
  '卢村木雕楼': {desc:'比宏村游客少很多，木雕工艺极其精细，值得细看', duration:'1h', cost:'门票¥50'},
  '塔川': {desc:'秋天红叶最美，夏天来看田园日落也不错', duration:'1-2h', cost:'门票¥40'},
  '碧山书局': {desc:'先锋书店开在徽州古宅里，咖啡好喝，可以泡半天', duration:'1-3h', cost:'人均¥40'},
  '千岛湖': {desc:'环湖绿道分南北线，北线30km较平坦适合休闲骑', duration:'', cost:''},
  '芹川古村': {desc:'不要门票！600年古村，溪水穿村而过，晚上有萤火虫', duration:'2-3h', cost:'免费'},
  '退思园': {desc:'同里最精华的园林，贴水而建，早上9点前人少', duration:'1h', cost:'含在联票内'},
  '三桥': {desc:'太平桥、吉利桥、长庆桥连在一起，走完在河边坐坐', duration:'30min', cost:'免费'},
  '状元蹄': {desc:'同里必吃！认准古镇入口第一家，酱香软烂', duration:'30min', cost:'¥25-35/只'},
  '罗星洲': {desc:'湖中小岛，坐船过去，人少安静', duration:'1h', cost:'船票¥5'},
  '灵岩山': {desc:'北坡好走南坡陡，山不高45min登顶，山顶看太湖全景', duration:'1.5h', cost:'免门票'},
  '灵岩寺': {desc:'山顶千年古刹，免费参观，香火随缘', duration:'30min', cost:'免费'},
  '木渎古镇': {desc:'严家花园+虹饮山房值得看，鲃肺汤是当地一绝', duration:'2h', cost:'联票¥60'},
  '阳澄湖骑行驿站': {desc:'租车¥50/天，非蟹季人很少骑行超舒服', duration:'', cost:'租车¥50'},
  '美人腿半岛': {desc:'阳澄湖伸出的半岛，骑到尽头看湖景', duration:'1h', cost:'免费'},
  '莲花岛': {desc:'码头坐船上岛，末班船5点别错过！傍晚蚊子多带驱蚊', duration:'2h', cost:'船票¥20'},
  '黄山': {desc:'建议云谷寺索道上，前山下。山顶住宿提前1个月订', duration:'全天', cost:'门票¥190+索道¥80'},
  '排云亭': {desc:'看日出最佳位置，需要4:30到占位', duration:'1h', cost:'含在门票内'},
  '光明顶': {desc:'黄山第二高峰，看日落绝佳，也是拍云海的好位置', duration:'30min', cost:'含在门票内'},
  '西递': {desc:'比宏村人少很多更安静，胡文光牌坊和敬爱堂是精华', duration:'2-3h', cost:'门票¥94'},
  '屯溪老街': {desc:'徽州最热闹的老街，夜游最有氛围，各种徽州小吃', duration:'2h', cost:'免费逛'},
  '呈坎': {desc:'八卦布局古村，罗东舒祠是全国重点文保', duration:'2h', cost:'门票¥107'},
  '新安江': {desc:'山水画廊游船约3h，两岸徽派村落+油菜花田', duration:'3h', cost:'游船¥128'},
  '平江路': {desc:'苏州最有味道的老街，诚品书店+文创小店+苏式点心', duration:'2h', cost:'免费逛'},
  '独墅湖': {desc:'湖边绿道散步，看苏州工业园区天际线', duration:'1h', cost:'免费'},
  '金鸡湖': {desc:'环湖绿道骑行，音乐喷泉(周五六晚8点)，日落超美', duration:'2h', cost:'免费'},
  '观前街': {desc:'苏州最热闹的商圈，夜市小吃多，松鹤楼/得月楼在附近', duration:'2h', cost:'人均¥50-100'},
  '护城河': {desc:'夜游护城河游船看城墙灯光，也可以河边散步', duration:'1h', cost:'游船¥80'},
  '古堰画乡': {desc:'瓯江边的画家村，油画写生+古樟树群，下午光线最美', duration:'2-3h', cost:'门票¥50'},
  '缙云仙都': {desc:'鼎湖峰是精华，朱潭山倒影绝美，花1天慢慢逛', duration:'4-5h', cost:'门票¥100'},
  '霞浦滩涂': {desc:'4:30日出点，小皓/北岐/花竹是三大经典机位，去晚了光线不对', duration:'2h', cost:'免费'},
  '东壁': {desc:'霞浦看日落的经典点，紫菜架剪影特别出片', duration:'1.5h', cost:'免费'},
  '福鼎白茶山': {desc:'太姥山脚的茶村，可以现场品白茶买茶饼', duration:'半天', cost:'品茶免费'},
  '太姥山': {desc:'花岗岩峰林地貌，爬全程要5h，量力而行', duration:'5-6h', cost:'门票¥130'},
  '神仙居': {desc:'索道排队长早去！如意桥网红打卡点，全程3-4h', duration:'4h', cost:'门票¥110+索道¥100'},
  '大慈岩': {desc:'悬崖上的寺庙，半山腰俯瞰田园，惊险但好看', duration:'2-3h', cost:'门票¥65'},
  '下涯湿地': {desc:'晨雾要6点前到！新安江边，渔夫撒网+晨雾=仙境', duration:'1.5h', cost:'免费'},
  '周庄': {desc:'最经典也最商业的水乡，双桥+沈厅是必看，清晨人少', duration:'3-4h', cost:'门票¥100'},
  '乌镇西栅': {desc:'夜景全网公认最美，8点以后灯光全开，建议住里面', duration:'3-4h', cost:'门票¥150'}
};
