# 看天出发 — 数据结构设计（终版）

> 基于两天原型迭代的结论。step 是唯一数据源，卡片展示字段从 steps 计算。

## 核心原则

1. **方案 = 可直接执行的旅行计划**，不是景点推荐
2. **按天组织，按步骤执行** — 每天是独立单元，每步是可操作的行动
3. **信息跟着步骤走** — 导航、订票、种草、提醒都挂在具体步骤上
4. **零冗余** — 卡片展示字段全部从 steps 实时计算，不单独存储
5. **静态为主** — 整个数据层全是静态编辑内容，唯一动态的是天气

## 静态 vs 动态

```
静态（编辑存储，不变）
├─ 方案骨架：标题、路线、分类
├─ 每天：照片、活动主题
├─ 每步：text、type、startTime、endTime、place、description
├─ 每步的 bookings：label、参考价、跳转链接
├─ 每步的 tips、relatedContent
└─ 方案属性：可用月份等（给搜索层用）

动态（实时查询）
└─ 天气 → 天气API → 推荐引擎的核心输入
```

## 数据结构

```typescript
interface TravelPlan {
  id: string;                    // "moganshan-weekend"
  title: string;                 // "莫干山竹海发呆"
  origin: string;                // "苏州"
  category: PlanCategory;        // 时间分类
  // route 不单独存，从 steps[].place 推导
  relatedContent?: ContentItem[];// 方案级种草（兜底）
  days: TravelDay[];             // 按天的行程
}

// 卡片展示需要的这些字段全部从 steps 计算：
// - duration → days.length
// - transit 概要 → 第一个 transit step
// - stayType → 第一个 stay step
// - price → stay step 的 booking.cost
// - legs → transit steps 提取

type PlanCategory = 'now' | 'tomorrow' | 'weekend' | 'next-weekend' | '3day' | '5day' | 'week';


interface TravelDay {
  photo: string;                 // 封面图
  activity: string;              // "裸心谷竹林徒步+山顶手冲"
  weather: Weather;              // ← 唯一动态数据（生产环境从API拉）
  steps: TravelStep[];           // 👈 核心：所有信息在这
}

interface Weather {
  icon: string;                  // "☀️"
  temp: string;                  // "28°"
  hourly?: HourlyWeather[];      // 逐小时（可选）
}

interface TravelStep {
  text: string;                  // "高铁到德清站"
  type: StepType;                // transit
  startTime: string;             // "8:30"
  endTime: string;               // "9:17"（duration = endTime - startTime）
  place?: { name: string; lat?: number; lng?: number; };
  description?: string;          // "出站右手边打车排队区"
  bookings?: BookingItem[];      // 操作入口（费用挂在这里）
  tips?: string[];               // "班次每30min一班"
  relatedContent?: ContentItem[];// 步骤级种草
}

type StepType = 'depart' | 'transit' | 'play' | 'eat' | 'stay' | 'home';

interface BookingItem {
  type: 'train' | 'flight' | 'hotel' | 'ticket' | 'car' | 'bike' | 'boat' | 'food';
  label: string;                 // "查高铁票"
  cost?: string;                 // "¥28.5"（参考价，不是实时价）
  url?: string;                  // 跳转链接
}

interface ContentItem {
  platform: string;              // "小红书"
  icon: string;                  // "📕"
  title: string;                 // "莫干山两天一夜..."
  likes: string;                 // "2.3w"
  url?: string;
}
```

## 卡片 vs 详情的数据来源

### 卡片（存储 + 计算）
| 展示内容 | 来源 |
|---|---|
| 标题 | `plan.title` 存储 |
| 每天照片+活动 | `day.photo` + `day.activity` 存储 |
| 天气 | `day.weather` **动态** |
| 天数 | `days.length` 计算 |
| 交通方式 | 第一个 `type=transit` 步骤 计算 |
| 住宿+价格 | 第一个 `type=stay` 步骤的 `booking.cost` 计算 |
| 地图+交通标签 | `route[]` 存储 + transit 步骤 计算 |

### 详情-全览（全部计算）
| 展示内容 | 来源 |
|---|---|
| 时间轴 | 所有步骤的 `startTime/endTime` + `type` 计算 |
| 行程概要 | 每天 `steps[].text` 拼接 计算 |
| 交通信息 | 筛选 `type=transit` 计算 |
| 住宿 | 筛选 `type=stay` 计算 |
| 贴士 | 汇总 `steps[].tips` 计算 |
| 预订入口 | 汇总 `steps[].bookings` 计算 |

### 详情-分天（直接读 step）
| 展示内容 | 来源 |
|---|---|
| 时间轴 | `step.startTime/endTime` 直接读 |
| 步骤文字 | `step.text` 直接读 |
| 步骤描述 | `step.description` 直接读 |
| 导航 | `step.place.name` → 高德URL 直接读 |
| 订票+参考价 | `step.bookings[]{label, cost}` 直接读 |
| 提醒 | `step.tips[]` 直接读 |
| 种草 | `step.relatedContent[]` 直接读 |
| 类型颜色 | `step.type` → depart蓝/transit灰/play绿/eat橙/stay紫/home橙 |
| 日期 | 根据 `category` + 当前日期计算 |

## 数据示例

```json
{
  "id": "moganshan-weekend",
  "title": "莫干山竹海发呆",
  "origin": "苏州",
  "category": "weekend",
  "route": [
    {"name": "苏州站", "lat": 31.299, "lng": 120.585},
    {"name": "德清站", "lat": 30.533, "lng": 119.978},
    {"name": "莫干山", "lat": 30.633, "lng": 119.877}
  ],
  "days": [{
    "photo": "moganshan-bamboo.jpg",
    "activity": "裸心谷竹林徒步+山顶手冲",
    "weather": {"icon": "☀️", "temp": "28°"},
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
        "bookings": [{"type": "train", "label": "查高铁票", "cost": "¥28.5"}]
      },
      {
        "text": "裸心谷竹林徒步",
        "type": "play",
        "startTime": "9:45",
        "endTime": "12:00",
        "place": {"name": "裸心谷"},
        "description": "从入口进竹林步道，全程遮阴不晒，走到山顶有精品咖啡馆",
        "bookings": [{"type": "ticket", "label": "查门票", "cost": "免费"}],
        "tips": ["建议穿运动鞋，竹林步道有些滑"],
        "relatedContent": [{
          "platform": "小红书", "icon": "📕",
          "title": "莫干山两天一夜，竹海里真的能发呆一整天",
          "likes": "2.3w"
        }]
      },
      {
        "text": "入住莫干山民宿",
        "type": "stay",
        "startTime": "14:00",
        "endTime": "20:00",
        "place": {"name": "莫干山民宿"},
        "description": "推荐提前1周订，选山腰的安静",
        "bookings": [{"type": "hotel", "label": "查住宿", "cost": "¥400-800/晚"}]
      }
    ]
  }]
}
```
