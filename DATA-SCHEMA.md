# 看天出发 — 数据结构设计

> 基于两天原型迭代总结的数据模型，描述一个完整的旅行方案。

## 核心原则

1. **方案 = 一个可直接执行的旅行计划**，不是景点推荐
2. **按天组织，按步骤执行** — 每天是一个独立单元，每步是一个可操作的行动
3. **信息跟着步骤走** — 导航、订票、种草、提醒都挂在具体步骤上，不是全局散落
4. **懒人友好** — 用户只看当天，从上往下跟着做

## 数据结构

```typescript
// === 顶层：旅行方案 ===
interface TravelPlan {
  id: string;                    // 唯一标识
  title: string;                 // "莫干山竹海发呆"
  subtitle: string;              // 一句话卖点 "竹林里真的能发呆一整天"
  
  // 基础信息
  origin: string;                // 出发城市 "苏州"
  duration: string;              // "2天" | "半天" | "7天"
  category: PlanCategory;        // 时间分类
  price: PriceRange;             // 费用预估
  
  // 交通概要（卡片展示用）
  transit: {
    mode: string;                // "高铁" | "自驾" | "地铁"
    duration: string;            // "47min"
    destination: string;         // "德清"
  };

  // 天气（动态，按天）
  // → 在 days 里

  // 路线（地图用）
  route: RoutePoint[];

  // 按天的完整行程
  days: TravelDay[];

  // 全局种草内容（不跟具体步骤绑定的）
  relatedContent: ContentItem[];
}

// === 时间分类 ===
type PlanCategory = 
  | 'now'           // 现在就能去
  | 'tomorrow'      // 明天（一日游）
  | 'weekend'       // 这周末
  | 'next-weekend'  // 下周末
  | '3day'          // 请3天假
  | '5day'          // 小长假
  | 'week';         // 7天连晴

// === 费用 ===
interface PriceRange {
  perPerson?: string;            // 人均 "¥200"
  accommodation?: string;        // 住宿 "¥400-800/晚"
  total?: string;                // 总预估 "¥2000-3000"
}

// === 路线点（地图标记用） ===
interface RoutePoint {
  name: string;                  // "德清站"
  lat: number;
  lng: number;
}

// === 每天的行程 ===
interface TravelDay {
  date?: string;                 // 动态计算 "7/24 周四"（前端算）
  
  // 天气
  weather: {
    icon: string;                // "☀️"
    temp: string;                // "28°"
    condition?: string;          // "晴" | "多云"
    hourly?: HourlyWeather[];    // 逐小时（可选）
  };

  // 封面
  photo: string;                 // 封面图 URL/ID
  activity: string;              // 当天主题 "裸心谷竹林徒步+山顶手冲"

  // 核心：按步骤的行程
  steps: TravelStep[];
}

// === 逐小时天气 ===
interface HourlyWeather {
  hour: string;                  // "9:00"
  temp: number;                  // 28
  icon: string;                  // "☀️"
}

// === 每一步行程（核心单元） ===
interface TravelStep {
  // 基本信息
  text: string;                  // 显示文本 "高铁47min到德清站"
  type: StepType;                // 步骤类型
  startTime: string;             // 开始时间 "8:30"
  endTime: string;               // 结束时间 "9:17"
  // duration 从 endTime - startTime 推导，不单独存
  
  // 目的地（导航用）
  place?: {
    name: string;                // "德清站"（导航搜索用）
    lat?: number;                // 可选坐标
    lng?: number;
  };

  // 详细信息（展开显示）
  description?: string;          // "出站右手边出租车排队区，或提前叫网约车"
  
  // 关联操作（cost 挂在具体 item 上）
  bookings?: BookingItem[];      // 订票入口，每个有自己的 cost
  tips?: string[];               // 提醒/贴士
  relatedContent?: ContentItem[];// 种草推荐（跟这一步相关的）
}

// === 步骤类型 ===
type StepType = 
  | 'depart'     // 出发（去车站/机场）
  | 'transit'    // 在路上（高铁/自驾/打车/地铁）
  | 'arrive'     // 到达目的地
  | 'play'       // 游玩/体验
  | 'eat'        // 吃饭
  | 'stay'       // 入住
  | 'home';      // 回家

// === 预订入口 ===
interface BookingItem {
  type: BookingType;             // 'train' | 'ticket' | 'hotel' ...
  label: string;                 // "查高铁票"
  cost?: string;                 // "¥28.5"（费用挂在这里）
  url?: string;                  // 跳转链接
}

type BookingType = 
  | 'train'      // 🚄 火车票
  | 'flight'     // ✈️ 机票
  | 'hotel'      // 🏠 住宿
  | 'ticket'     // 🎫 门票
  | 'car'        // 🚗 租车
  | 'bike'       // 🚲 骑行租车
  | 'boat'       // 🚢 船票
  | 'food';      // 🍽️ 餐厅

// === 种草内容 ===
interface ContentItem {
  platform: string;              // "小红书" | "抖音" | "B站" | "马蜂窝"
  icon: string;                  // "📕"
  title: string;                 // "莫干山两天一夜，竹海里真的能发呆一整天"
  url?: string;                  // 原文链接
  likes: string;                 // "2.3w"
  image?: string;                // 封面图
}
```

## 数据示例

```json
{
  "id": "moganshan-weekend",
  "title": "莫干山竹海发呆",
  "subtitle": "竹林里真的能发呆一整天",
  "origin": "苏州",
  "duration": "2天",
  "category": "weekend",
  "price": {
    "accommodation": "¥400-800/晚",
    "total": "¥1000-1500/人"
  },
  "transit": {
    "mode": "高铁",
    "duration": "47min",
    "destination": "德清"
  },
  "route": [
    {"name": "苏州站", "lat": 31.299, "lng": 120.585},
    {"name": "德清站", "lat": 30.533, "lng": 119.978},
    {"name": "莫干山", "lat": 30.633, "lng": 119.877}
  ],
  "days": [
    {
      "weather": {"icon": "☀️", "temp": "28°"},
      "photo": "moganshan-bamboo.jpg",
      "activity": "裸心谷竹林徒步+山顶手冲",
      "steps": [
        {
          "text": "出发去苏州站",
          "type": "depart",
          "startTime": "8:00",
          "endTime": "8:30",
          "place": {"name": "苏州站"},
          "description": "建议提前30min到站，自助取票机在2楼大厅"
        },
        {
          "text": "高铁到德清站",
          "type": "transit",
          "startTime": "8:30",
          "endTime": "9:17",
          "place": {"name": "德清站"},
          "description": "二等座，班次密集每30min一班",
          "bookings": [
            {"type": "train", "label": "查高铁票", "cost": "¥28.5", "url": "https://www.12306.cn"}
          ]
        },
        {
          "text": "打车到莫干山",
          "type": "transit",
          "startTime": "9:17",
          "endTime": "9:42",
          "place": {"name": "莫干山"},
          "description": "出站右手边出租车排队区，或提前叫网约车",
          "bookings": [
            {"type": "car", "label": "打车", "cost": "¥40"}
          ]
        },
        {
          "text": "裸心谷竹林徒步",
          "type": "play",
          "startTime": "9:45",
          "endTime": "12:00",
          "place": {"name": "裸心谷"},
          "description": "从入口进竹林步道，全程遮阴不晒，走到山顶有精品咖啡馆，手冲很好喝",
          "bookings": [
            {"type": "ticket", "label": "查门票", "cost": "免费"}
          ],
          "tips": ["建议穿运动鞋，竹林步道有些滑"],
          "relatedContent": [
            {
              "platform": "小红书",
              "icon": "📕",
              "title": "莫干山两天一夜，竹海里真的能发呆一整天",
              "likes": "2.3w"
            }
          ]
        },
        {
          "text": "山顶精品咖啡馆",
          "type": "eat",
          "startTime": "12:00",
          "endTime": "13:00",
          "place": {"name": "莫干山山顶咖啡馆"},
          "description": "手冲咖啡很好喝，可以歇脚看风景",
          "bookings": [
            {"type": "food", "label": "查餐厅", "cost": "人均¥50"}
          ]
        },
        {
          "text": "入住莫干山民宿",
          "type": "stay",
          "startTime": "14:00",
          "endTime": "20:00",
          "place": {"name": "莫干山民宿"},
          "description": "推荐提前1周订，周末涨价。裸心谷附近民宿集中，选山腰的安静",
          "bookings": [
            {"type": "hotel", "label": "查住宿", "cost": "¥400-800/晚"}
          ],
          "tips": ["周末民宿要提前1周订"]
        },
        {
          "text": "萤火虫观赏",
          "type": "play",
          "startTime": "20:00",
          "endTime": "21:00",
          "place": {"name": "莫干山萤火虫观赏点"},
          "description": "远离路灯的地方效果最好，6-8月晚上8点后出现，别开闪光灯",
          "tips": ["6-8月晚上能看萤火虫"]
        }
      ]
    },
    {
      "weather": {"icon": "⛅", "temp": "26°"},
      "photo": "moganshan-cycling.jpg",
      "activity": "骑行环山路+返程",
      "steps": [
        {
          "text": "民宿早餐",
          "type": "eat",
          "time": "8:00",
          "duration": "1h"
        },
        {
          "text": "骑行环山路",
          "type": "play",
          "time": "9:00",
          "place": {"name": "莫干山骑行环山路"},
          "description": "可租电动车，沿途茶园和竹海，风景绝美",
          "duration": "2-3h",
          "cost": "租电动车¥100",
          "bookings": [
            {"type": "bike", "label": "租车"}
          ]
        },
        {
          "text": "庾村文创小镇午餐",
          "type": "eat",
          "time": "12:00",
          "place": {"name": "庾村文创小镇"},
          "description": "莫干山脚下的文创聚集地，有咖啡店、手作店、独立书店",
          "duration": "1-2h",
          "cost": "人均¥50"
        },
        {
          "text": "打车到德清站",
          "type": "transit",
          "time": "14:00",
          "place": {"name": "德清站"},
          "duration": "25min",
          "cost": "¥40"
        },
        {
          "text": "高铁返回苏州站",
          "type": "transit",
          "time": "14:30",
          "place": {"name": "苏州站"},
          "duration": "47min",
          "cost": "¥28.5",
          "bookings": [
            {"type": "train", "label": "查回程票"}
          ]
        },
        {
          "text": "回家",
          "type": "home",
          "time": "15:17"
        }
      ]
    }
  ],
  "relatedContent": [
    {
      "platform": "抖音",
      "icon": "🎵",
      "title": "莫干山裸心谷徒步vlog｜治愈系周末",
      "likes": "8.6w"
    },
    {
      "platform": "马蜂窝",
      "icon": "🐝",
      "title": "莫干山完全攻略：民宿+路线+避坑",
      "likes": "1.2w"
    }
  ]
}
```

## 对比现状

| 维度 | 现在的原型 | 新数据结构 |
|---|---|---|
| 行程 | 一个字符串用→分割 | 结构化 steps 数组 |
| 地点信息 | 正则提取+STEP_DETAILS 查表 | 直接在 step.place 里 |
| 导航 | 从文本猜地名 | step.place.name 精确 |
| 时间 | 从 TIMELINES 反算 | step.time 直接标注 |
| 订票 | 关键词匹配猜 | step.bookings 精确绑定 |
| 提醒 | PLAN_TIPS 全局匹配 | step.tips 精确到步骤 |
| 种草 | RELATED_CONTENT 模糊匹配 | 精确绑定到步骤+方案级兜底 |
| 步骤类型 | 正则猜 transit/play | step.type 明确标注 |
| 费用 | STEP_DETAILS 查表 | step.cost 直接标注 |
| 时长 | STEP_DETAILS 查表 | step.duration 直接标注 |

## 设计要点

1. **step 是最小单元** — 所有可操作信息（导航、订票、种草、提醒）都挂在 step 上
2. **type 决定展示** — depart/transit 灰色路上，play 绿色玩，eat 橙色吃，stay 紫色住，home 回家
3. **place.name 是导航关键** — 高德用名字搜索，不需要精确坐标
4. **time 是预计时间** — 前端可以根据实际出发时间动态偏移
5. **bookings 是操作入口** — 未来对接真实订票平台
6. **relatedContent 两级** — 步骤级精确匹配 + 方案级兜底
7. **weather 从 API 拉** — 现在是 mock，未来接真实天气
