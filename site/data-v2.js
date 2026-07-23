// data-v2.js — Structured travel plan data
// Generated from data.js, schema defined in DATA-SCHEMA.md
// All 17 plans converted to step-based structure

const PLANS_V2 = [
  {
    "id": "moganshan-weekend",
    "title": "莫干山竹海发呆",
    "subtitle": "裸心谷竹林徒步+山顶手冲",
    "origin": "苏州",
    "duration": "2天",
    "category": "weekend",
    "price": {
      "accommodation": "¥400-800/晚"
    },
    "transit": {
      "mode": "高铁",
      "duration": "47min",
      "destination": "德清"
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "德清站",
        "lat": 30.533,
        "lng": 119.978
      },
      {
        "name": "莫干山",
        "lat": 30.633,
        "lng": 119.877
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "photo": "photo-1518335935020-cfd6580c1ab4",
        "activity": "裸心谷竹林徒步+山顶手冲",
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "time": "8:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min"
          },
          {
            "text": "高铁47min到德清站",
            "type": "transit",
            "time": "8:30",
            "place": {
              "name": "德清站"
            },
            "description": "出站右手边出租车排队区，或提前叫网约车到莫干山",
            "cost": "打车约¥40",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车25min到莫干山",
            "type": "transit",
            "time": "9:17",
            "place": {
              "name": "莫干山"
            }
          },
          {
            "text": "裸心谷竹林徒步",
            "type": "play",
            "time": "9:42",
            "place": {
              "name": "裸心谷"
            },
            "description": "从入口进竹林步道，全程遮阴不晒，走到山顶有精品咖啡馆，手冲很好喝",
            "duration": "2-3h",
            "cost": "免费",
            "tips": [
              "建议穿运动鞋，竹林步道有些滑"
            ],
            "relatedContent": [
              {
                "platform": "抖音",
                "icon": "🎵",
                "title": "莫干山裸心谷徒步vlog｜治愈系周末",
                "likes": "8.6w"
              }
            ]
          },
          {
            "text": "山顶精品咖啡馆",
            "type": "eat",
            "time": "11:42",
            "place": {
              "name": "山顶精品"
            }
          },
          {
            "text": "入住莫干山民宿",
            "type": "stay",
            "time": "12:42",
            "place": {
              "name": "莫干山民宿"
            },
            "description": "推荐提前1周订，周末涨价。裸心谷附近民宿集中，选山腰的安静",
            "cost": "¥400-800/晚",
            "tips": [
              "周末民宿要提前1周订"
            ],
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          },
          {
            "text": "晚上萤火虫观赏",
            "type": "play",
            "time": "20:00",
            "place": {
              "name": "萤火虫"
            },
            "description": "远离路灯的地方效果最好，6-8月晚上8点后出现，别开闪光灯",
            "duration": "1h",
            "cost": "免费",
            "tips": [
              "6-8月晚上能看萤火虫"
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "⛅",
          "temp": "26°"
        },
        "photo": "photo-1534787238916-9ba6764efd4f",
        "activity": "骑行环山路+返程",
        "steps": [
          {
            "text": "民宿早餐",
            "type": "eat",
            "time": "8:00"
          },
          {
            "text": "骑行环山路",
            "type": "play",
            "time": "9:00",
            "description": "可租电动车",
            "bookings": [
              {
                "type": "bike",
                "label": "租车"
              }
            ]
          },
          {
            "text": "沿途茶园和竹海",
            "type": "play",
            "time": "10:30"
          },
          {
            "text": "庾村文创小镇午餐",
            "type": "eat",
            "time": "12:00",
            "place": {
              "name": "庾村文创小镇"
            },
            "description": "莫干山脚下的文创聚集地，有咖啡店、手作店、独立书店",
            "duration": "1-2h",
            "cost": "人均¥50"
          },
          {
            "text": "打车到德清站",
            "type": "transit",
            "time": "13:30",
            "place": {
              "name": "德清站"
            },
            "description": "出站右手边出租车排队区，或提前叫网约车到莫干山",
            "cost": "打车约¥40"
          },
          {
            "text": "高铁47min返回苏州站",
            "type": "transit",
            "time": "14:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min",
            "bookings": [
              {
                "type": "train",
                "label": "查回程票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "回家",
            "type": "home",
            "time": "14:47"
          }
        ]
      }
    ],
    "relatedContent": [
      {
        "platform": "小红书",
        "icon": "📕",
        "title": "莫干山两天一夜，竹海里真的能发呆一整天",
        "likes": "2.3w"
      },
      {
        "platform": "马蜂窝",
        "icon": "🐝",
        "title": "莫干山完全攻略：民宿+路线+避坑",
        "likes": "1.2w"
      }
    ]
  },
  {
    "id": "xitang-night",
    "title": "西塘深夜场",
    "subtitle": "夜游西塘(人超少)+酒吧街",
    "origin": "苏州",
    "duration": "2天",
    "category": "weekend",
    "price": {
      "accommodation": "¥200-400/晚"
    },
    "transit": {
      "mode": "高铁",
      "duration": "1h",
      "destination": "嘉善"
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "嘉善站",
        "lat": 30.841,
        "lng": 120.926
      },
      {
        "name": "西塘",
        "lat": 30.893,
        "lng": 120.893
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "🌙",
          "temp": "25°"
        },
        "photo": "photo-1470004914212-05527e49370b",
        "activity": "夜游西塘(人超少)+酒吧街",
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "time": "15:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min"
          },
          {
            "text": "高铁1h到嘉善南站",
            "type": "transit",
            "time": "15:30",
            "place": {
              "name": "嘉善南站"
            },
            "description": "出站后打车或公交到西塘约20min",
            "cost": "打车约¥30",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车20min到西塘古镇",
            "type": "transit",
            "time": "16:30",
            "place": {
              "name": "西塘古镇"
            },
            "description": "下午5点后入场免门票！晚上人少是精华，清晨6点前拍照最佳",
            "duration": "3-4h",
            "cost": "白天门票¥100",
            "tips": [
              "下午5点后入场免门票"
            ]
          },
          {
            "text": "入住临水客栈",
            "type": "stay",
            "time": "16:50",
            "place": {
              "name": "临水客栈"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          },
          {
            "text": "黄昏逛巷子",
            "type": "play",
            "time": "17:20"
          },
          {
            "text": "夜游西塘",
            "type": "play",
            "time": "19:00",
            "place": {
              "name": "西塘"
            },
            "description": "下午5点后入场免门票！晚上人少是精华，清晨6点前拍照最佳",
            "duration": "3-4h",
            "cost": "白天门票¥100",
            "tips": [
              "人超少!"
            ],
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "西塘晚上10点以后才是真的！夜场攻略",
                "likes": "3.1w"
              },
              {
                "platform": "B站",
                "icon": "📺",
                "title": "【4K】清晨5点的西塘，终于没人了",
                "likes": "12w"
              },
              {
                "platform": "大众点评",
                "icon": "⭐",
                "title": "西塘最好吃的5家店，本地人推荐",
                "likes": "8500"
              }
            ],
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "酒吧街",
            "type": "play",
            "time": "22:30",
            "place": {
              "name": "酒吧街"
            },
            "description": "西塘酒吧街周末才热闹，塘东街那排最集中",
            "duration": "1-2h",
            "cost": "人均¥50-100",
            "tips": [
              "酒吧街周末才热闹"
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "photo": "photo-1528164344705-47542687000d",
        "activity": "清晨空巷拍照+烟雨长廊",
        "steps": [
          {
            "text": "6点起床拍空巷",
            "type": "play",
            "time": "8:00"
          },
          {
            "text": "烟雨长廊",
            "type": "play",
            "time": "9:30",
            "place": {
              "name": "烟雨长廊"
            },
            "description": "全长1km，廊下看河最有感觉，清晨没人时候拍照绝了",
            "duration": "30min",
            "cost": "免费"
          },
          {
            "text": "早茶",
            "type": "eat",
            "time": "10:00"
          },
          {
            "text": "打车20min到嘉善南站",
            "type": "transit",
            "time": "11:00",
            "place": {
              "name": "嘉善南站"
            },
            "description": "出站后打车或公交到西塘约20min",
            "cost": "打车约¥30"
          },
          {
            "text": "高铁1h返回苏州站",
            "type": "transit",
            "time": "11:20",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min",
            "bookings": [
              {
                "type": "train",
                "label": "查回程票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "回家",
            "type": "home",
            "time": "12:20"
          }
        ]
      }
    ],
    "relatedContent": [],
    "tips": [
      "清晨6点前拍照人最少"
    ]
  },
  {
    "id": "taihu-dongshan-yangmei",
    "title": "太湖东山杨梅季",
    "subtitle": "果园采杨梅+环太湖骑行",
    "origin": "苏州",
    "duration": "2天",
    "category": "weekend",
    "price": {
      "accommodation": "¥150-300/晚"
    },
    "transit": {
      "mode": "自驾",
      "duration": "1h",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "太湖东山",
        "lat": 31.067,
        "lng": 120.425
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "31°"
        },
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "果园采杨梅+环太湖骑行",
        "steps": [
          {
            "text": "自驾1h到东山",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "东山"
            }
          },
          {
            "text": "杨梅果园采杨梅",
            "type": "play",
            "time": "9:00",
            "place": {
              "name": "杨梅果园"
            },
            "description": "6月中-7月初限定！进园随便吃，带走按斤称",
            "duration": "1-2h",
            "cost": "入园¥50/人",
            "tips": [
              "6月限定!",
              "杨梅季6月中-7月初，去晚了没果"
            ],
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "东山杨梅季！果园里吃到饱只要50块",
                "likes": "1.8w"
              }
            ]
          },
          {
            "text": "太湖三白午餐",
            "type": "eat",
            "time": "10:30",
            "place": {
              "name": "太湖三白"
            },
            "description": "白虾白鱼银鱼，东山当地餐厅比景区便宜一半",
            "duration": "1h",
            "cost": "人均¥80-120"
          },
          {
            "text": "环太湖骑行15km",
            "type": "play",
            "time": "11:30",
            "place": {
              "name": "环太湖骑行"
            },
            "description": "东山环湖绿道，平坦好骑，沿途有补给站",
            "duration": "2-3h",
            "cost": "租车¥50/天",
            "tips": [
              "环湖骑行带防晒和水"
            ],
            "relatedContent": [
              {
                "platform": "抖音",
                "icon": "🎵",
                "title": "环太湖骑行15km，风景绝了",
                "likes": "5.2w"
              }
            ]
          },
          {
            "text": "太湖边看日落",
            "type": "play",
            "time": "14:00"
          },
          {
            "text": "入住东山农家乐",
            "type": "stay",
            "time": "15:30",
            "place": {
              "name": "东山农家乐"
            },
            "tips": [
              "农家乐可以讲价，非周末更便宜"
            ],
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "⛅",
          "temp": "29°"
        },
        "photo": "photo-1587162146766-e06b1189b907",
        "activity": "东山古街+碧螺春茶园",
        "steps": [
          {
            "text": "东山古街",
            "type": "play",
            "time": "8:00"
          },
          {
            "text": "碧螺春茶园",
            "type": "play",
            "time": "9:30",
            "place": {
              "name": "碧螺春茶园"
            },
            "description": "可以现场品茶买茶，老板会教你分辨真假碧螺春",
            "duration": "1h",
            "cost": "品茶免费，买茶¥200起"
          },
          {
            "text": "买茶手信",
            "type": "play",
            "time": "10:30"
          },
          {
            "text": "自驾1h返回苏州",
            "type": "transit",
            "time": "12:00",
            "place": {
              "name": "苏州"
            }
          },
          {
            "text": "回家",
            "type": "home",
            "time": "13:00"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "jingshan-tea",
    "title": "径山问茶",
    "subtitle": "径山古道徒步到茶田+径山寺",
    "origin": "苏州",
    "duration": "2天",
    "category": "weekend",
    "price": {
      "accommodation": "¥300-500/晚"
    },
    "transit": {
      "mode": "自驾",
      "duration": "1.5h",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "径山",
        "lat": 30.397,
        "lng": 119.847
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "🌤️",
          "temp": "27°"
        },
        "photo": "photo-1448375240586-882707db888b",
        "activity": "径山古道徒步到茶田+径山寺",
        "steps": [
          {
            "text": "自驾1.5h到径山",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "径山"
            },
            "tips": [
              "径山古道蚊子多，带驱蚊水"
            ]
          },
          {
            "text": "径山古道入口",
            "type": "play",
            "time": "9:30",
            "place": {
              "name": "径山古道"
            },
            "description": "全程4km，台阶路为主，蚊子多带驱蚊水，走到顶有茶田",
            "duration": "1.5-2h",
            "cost": "免费"
          },
          {
            "text": "徒步4km到茶田观景",
            "type": "play",
            "time": "11:15"
          },
          {
            "text": "径山寺禅茶",
            "type": "play",
            "time": "12:45",
            "place": {
              "name": "径山寺"
            },
            "description": "千年古刹，可以体验禅茶一味，寺内素面很好吃",
            "duration": "1h",
            "cost": "免费",
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "径山寺后山有条野路！走40分钟到茶田",
                "likes": "4.5w"
              }
            ]
          },
          {
            "text": "入住山中茶宿",
            "type": "stay",
            "time": "13:45",
            "place": {
              "name": "山中茶宿"
            },
            "tips": [
              "炒茶体验要提前一天预约",
              "山里早晚温差大，带件外套"
            ],
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "photo": "photo-1587162146766-e06b1189b907",
        "activity": "手工炒茶体验+竹林散步",
        "steps": [
          {
            "text": "径山村手工炒茶体验",
            "type": "play",
            "time": "8:00",
            "place": {
              "name": "炒茶体验"
            },
            "description": "跟茶农学手工炒茶，要提前一天预约",
            "duration": "1-2h",
            "cost": "¥100-200/人",
            "relatedContent": [
              {
                "platform": "B站",
                "icon": "📺",
                "title": "跟茶农学炒茶，翻车了但很开心",
                "likes": "3.2w"
              }
            ]
          },
          {
            "text": "竹林",
            "type": "play",
            "time": "9:30"
          },
          {
            "text": "山下农家午餐",
            "type": "eat",
            "time": "11:00",
            "place": {
              "name": "山下农家"
            }
          },
          {
            "text": "自驾1.5h返回苏州",
            "type": "transit",
            "time": "12:00",
            "place": {
              "name": "苏州"
            }
          },
          {
            "text": "回家",
            "type": "home",
            "time": "13:30"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "nanxun-quiet",
    "title": "南浔静巷",
    "subtitle": "百间楼日落+张石铭故居",
    "origin": "苏州",
    "duration": "2天",
    "category": "weekend",
    "price": {
      "accommodation": "¥250-450/晚"
    },
    "transit": {
      "mode": "高铁",
      "duration": "40min",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "湖州站",
        "lat": 30.868,
        "lng": 120.089
      },
      {
        "name": "南浔",
        "lat": 30.878,
        "lng": 120.418
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "⛅",
          "temp": "27°"
        },
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "百间楼日落+张石铭故居",
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "time": "14:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min"
          },
          {
            "text": "高铁40min到湖州站",
            "type": "transit",
            "time": "14:30",
            "place": {
              "name": "湖州站"
            },
            "cost": "¥24",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车30min到南浔古镇",
            "type": "transit",
            "time": "15:10",
            "place": {
              "name": "南浔古镇"
            }
          },
          {
            "text": "百间楼看日落",
            "type": "play",
            "time": "15:40",
            "place": {
              "name": "百间楼"
            },
            "description": "南浔最美的一段，日落6点最佳，河两岸明清建筑倒映水中",
            "duration": "1h",
            "cost": "含在门票内",
            "tips": [
              "百间楼日落6点最美，提前占位"
            ],
            "relatedContent": [
              {
                "platform": "抖音",
                "icon": "🎵",
                "title": "百间楼日落太美了",
                "likes": "11w"
              }
            ],
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "张石铭故居",
            "type": "play",
            "time": "16:40",
            "place": {
              "name": "张石铭故居"
            },
            "description": "南浔四象之一的宅子，中西合璧建筑，细节很多值得慢看",
            "duration": "30-45min",
            "cost": "含在门票内",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "河边晚餐",
            "type": "eat",
            "time": "17:25"
          },
          {
            "text": "入住南浔水边民宿",
            "type": "stay",
            "time": "18:25",
            "place": {
              "name": "南浔水边民宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "30°"
        },
        "photo": "photo-1533929736458-ca588d08c8be",
        "activity": "小莲庄晨光+丝绸博物馆",
        "steps": [
          {
            "text": "小莲庄晨光拍照",
            "type": "play",
            "time": "8:00",
            "place": {
              "name": "小莲庄"
            },
            "description": "刘家的私家花园，荷花池+碑廊，晨光拍照特别美",
            "duration": "1h",
            "cost": "含在门票内",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "丝绸博物馆",
            "type": "play",
            "time": "9:00",
            "place": {
              "name": "丝绸博物馆"
            },
            "description": "了解南浔丝绸史，周一闭馆！",
            "duration": "30min",
            "cost": "免费",
            "tips": [
              "丝绸博物馆周一闭馆"
            ]
          },
          {
            "text": "午餐",
            "type": "eat",
            "time": "9:30"
          },
          {
            "text": "打车30min到湖州站",
            "type": "transit",
            "time": "10:30",
            "place": {
              "name": "湖州站"
            }
          },
          {
            "text": "高铁40min返回苏州站",
            "type": "transit",
            "time": "11:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min",
            "bookings": [
              {
                "type": "train",
                "label": "查回程票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "回家",
            "type": "home",
            "time": "11:40"
          }
        ]
      }
    ],
    "relatedContent": [
      {
        "platform": "小红书",
        "icon": "📕",
        "title": "南浔，比乌镇安静十倍的江南古镇",
        "likes": "5.8w"
      }
    ],
    "tips": [
      "南浔门票包含所有景点，别单买"
    ]
  },
  {
    "id": "wannan-sketch-3d",
    "title": "皖南写生三日",
    "subtitle": "宏村南湖写生+月沼夜景",
    "origin": "苏州",
    "duration": "3天",
    "category": "3day",
    "price": {
      "accommodation": "¥200-400/晚"
    },
    "transit": {
      "mode": "高铁",
      "duration": "2.5h",
      "destination": "黄山北"
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "黄山北",
        "lat": 30.314,
        "lng": 118.31
      },
      {
        "name": "宏村",
        "lat": 30.055,
        "lng": 117.977
      },
      {
        "name": "塔川",
        "lat": 30.042,
        "lng": 117.962
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "26°"
        },
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "宏村南湖写生+月沼夜景",
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "time": "15:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min"
          },
          {
            "text": "高铁2.5h到黄山北站",
            "type": "transit",
            "time": "15:30",
            "place": {
              "name": "黄山北站"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "duration": "全天",
            "cost": "门票¥190+索道¥80",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "公交/包车到宏村",
            "type": "transit",
            "time": "18:00",
            "place": {
              "name": "宏村"
            },
            "description": "南湖倒映马头墙，月沼是精华。门票3日内可反复进",
            "duration": "半天-1天",
            "cost": "门票¥104",
            "tips": [
              "宏村写生要买门票进，3日内可反复进"
            ]
          },
          {
            "text": "南湖写生",
            "type": "play",
            "time": "18:30",
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "宏村写生三天，画了8张水彩",
                "likes": "2.7w"
              }
            ]
          },
          {
            "text": "月沼夜景",
            "type": "play",
            "time": "20:00",
            "place": {
              "name": "月沼"
            },
            "description": "宏村精华，半月形池塘倒映古建，傍晚和清晨最美",
            "duration": "30min",
            "cost": "含在门票内",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "入住宏村民宿",
            "type": "stay",
            "time": "20:30",
            "place": {
              "name": "宏村民宿"
            },
            "description": "南湖倒映马头墙，月沼是精华。门票3日内可反复进",
            "duration": "半天-1天",
            "cost": "门票¥104",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "⛅",
          "temp": "25°"
        },
        "photo": "photo-1500382017468-9049fed747ef",
        "activity": "卢村木雕楼+塔川日落",
        "steps": [
          {
            "text": "卢村木雕楼",
            "type": "play",
            "time": "8:00",
            "place": {
              "name": "卢村木雕楼"
            },
            "description": "比宏村游客少很多，木雕工艺极其精细，值得细看",
            "duration": "1h",
            "cost": "门票¥50",
            "relatedContent": [
              {
                "platform": "B站",
                "icon": "📺",
                "title": "【皖南vlog】卢村木雕楼，比宏村惊艳",
                "likes": "6.8w"
              }
            ],
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "农家菜午餐",
            "type": "eat",
            "time": "9:00"
          },
          {
            "text": "塔川骑行",
            "type": "play",
            "time": "10:00",
            "place": {
              "name": "塔川"
            },
            "description": "秋天红叶最美，夏天来看田园日落也不错",
            "duration": "1-2h",
            "cost": "门票¥40",
            "tips": [
              "塔川秋天最美，夏天去卢村更好"
            ],
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "塔川看日落",
            "type": "play",
            "time": "11:30",
            "place": {
              "name": "塔川"
            },
            "description": "秋天红叶最美，夏天来看田园日落也不错",
            "duration": "1-2h",
            "cost": "门票¥40",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "入住塔川民宿",
            "type": "stay",
            "time": "13:00",
            "place": {
              "name": "塔川民宿"
            },
            "description": "秋天红叶最美，夏天来看田园日落也不错",
            "duration": "1-2h",
            "cost": "门票¥40",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "🌤️",
          "temp": "27°"
        },
        "photo": "photo-1448375240586-882707db888b",
        "activity": "碧山书局+返程",
        "steps": [
          {
            "text": "碧山书局",
            "type": "play",
            "time": "8:00",
            "place": {
              "name": "碧山书局"
            },
            "description": "先锋书店开在徽州古宅里，咖啡好喝，可以泡半天",
            "duration": "1-3h",
            "cost": "人均¥40",
            "tips": [
              "碧山书局咖啡很好喝"
            ]
          },
          {
            "text": "午餐",
            "type": "eat",
            "time": "10:00"
          },
          {
            "text": "包车到黄山北站",
            "type": "transit",
            "time": "11:00",
            "place": {
              "name": "黄山北站"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "duration": "全天",
            "cost": "门票¥190+索道¥80"
          },
          {
            "text": "高铁2.5h返回苏州站",
            "type": "transit",
            "time": "11:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min",
            "bookings": [
              {
                "type": "train",
                "label": "查回程票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "回家",
            "type": "home",
            "time": "14:00"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "qiandaohu-cycling-3d",
    "title": "千岛湖骑行+萤火虫",
    "subtitle": "环湖绿道北线30km",
    "origin": "苏州",
    "duration": "3天",
    "category": "3day",
    "price": {
      "accommodation": "¥400-600/晚"
    },
    "transit": {
      "mode": "高铁",
      "duration": "2h",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "千岛湖站",
        "lat": 29.604,
        "lng": 118.93
      },
      {
        "name": "芹川古村",
        "lat": 29.56,
        "lng": 118.87
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "30°"
        },
        "photo": "photo-1534787238916-9ba6764efd4f",
        "activity": "环湖绿道北线30km",
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "time": "8:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min"
          },
          {
            "text": "高铁2h到千岛湖站",
            "type": "transit",
            "time": "8:30",
            "place": {
              "name": "千岛湖站"
            },
            "description": "环湖绿道分南北线，北线30km较平坦适合休闲骑",
            "cost": "¥65",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "租自行车",
            "type": "transit",
            "time": "10:30"
          },
          {
            "text": "环湖绿道北线骑行30km",
            "type": "play",
            "time": "11:00",
            "tips": [
              "骑行绿道有坡，电动车更轻松"
            ],
            "relatedContent": [
              {
                "platform": "抖音",
                "icon": "🎵",
                "title": "千岛湖绿道骑行，随手拍都是壁纸",
                "likes": "15w"
              }
            ]
          },
          {
            "text": "湖景晚餐",
            "type": "eat",
            "time": "12:30"
          },
          {
            "text": "入住湖景酒店",
            "type": "stay",
            "time": "13:30",
            "place": {
              "name": "湖景酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "🌤️",
          "temp": "28°"
        },
        "photo": "photo-1448375240586-882707db888b",
        "activity": "芹川古村+晚上看萤火虫!",
        "steps": [
          {
            "text": "芹川古村",
            "type": "play",
            "time": "8:00",
            "place": {
              "name": "芹川古村"
            },
            "description": "不要门票！600年古村，溪水穿村而过，晚上有萤火虫",
            "duration": "2-3h",
            "cost": "免费",
            "tips": [
              "芹川古村不要门票"
            ],
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "芹川古村晚上有萤火虫！7月限定",
                "likes": "6.2w"
              }
            ]
          },
          {
            "text": "溪边午餐",
            "type": "eat",
            "time": "10:30"
          },
          {
            "text": "下午休整",
            "type": "play",
            "time": "11:30"
          },
          {
            "text": "晚上看萤火虫",
            "type": "play",
            "time": "20:00",
            "place": {
              "name": "萤火虫"
            },
            "description": "远离路灯的地方效果最好，6-8月晚上8点后出现，别开闪光灯",
            "duration": "1h",
            "cost": "免费",
            "tips": [
              "6-8月限定!",
              "萤火虫7月最多，远离路灯的地方看"
            ]
          },
          {
            "text": "回酒店",
            "type": "transit",
            "time": "21:00",
            "place": {
              "name": "酒店"
            }
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "31°"
        },
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "南线骑行20km+返程",
        "steps": [
          {
            "text": "南线骑行20km",
            "type": "play",
            "time": "8:00"
          },
          {
            "text": "午餐千岛湖鱼头",
            "type": "eat",
            "time": "9:30",
            "description": "环湖绿道分南北线，北线30km较平坦适合休闲骑"
          },
          {
            "text": "还车",
            "type": "transit",
            "time": "10:30"
          },
          {
            "text": "千岛湖站高铁2h返回苏州站",
            "type": "transit",
            "time": "11:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min",
            "bookings": [
              {
                "type": "train",
                "label": "查回程票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "回家",
            "type": "home",
            "time": "13:00"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "zhemin-shanhai-7d",
    "title": "浙闽山海七日",
    "subtitle": "杭州→丽水 古堰画乡",
    "origin": "苏州",
    "duration": "7天",
    "category": "week",
    "price": {
      "accommodation": "¥200-500/晚"
    },
    "transit": {
      "mode": "高",
      "duration": "",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "丽水",
        "lat": 28.468,
        "lng": 119.923
      },
      {
        "name": "缙云",
        "lat": 28.661,
        "lng": 120.091
      },
      {
        "name": "霞浦",
        "lat": 26.885,
        "lng": 120.005
      },
      {
        "name": "福鼎",
        "lat": 27.324,
        "lng": 120.216
      },
      {
        "name": "太姥山",
        "lat": 27.175,
        "lng": 120.185
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "杭州→丽水 古堰画乡",
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "time": "8:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min"
          },
          {
            "text": "高铁2.5h到丽水站",
            "type": "transit",
            "time": "8:30",
            "place": {
              "name": "丽水站"
            },
            "cost": "¥120",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车到古堰画乡",
            "type": "transit",
            "time": "11:00",
            "place": {
              "name": "古堰画乡"
            },
            "description": "瓯江边的画家村，油画写生+古樟树群，下午光线最美",
            "duration": "2-3h",
            "cost": "门票¥50"
          },
          {
            "text": "古堰画乡游览",
            "type": "play",
            "time": "11:30",
            "place": {
              "name": "古堰画乡"
            },
            "description": "瓯江边的画家村，油画写生+古樟树群，下午光线最美",
            "duration": "2-3h",
            "cost": "门票¥50",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "入住丽水酒店",
            "type": "stay",
            "time": "14:00",
            "place": {
              "name": "丽水酒店"
            },
            "tips": [
              "浙闽沿线加油站少，提前加满"
            ],
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "🌤️",
          "temp": "27°"
        },
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "缙云仙都 鼎湖峰",
        "steps": [
          {
            "text": "缙云仙都景区",
            "type": "play",
            "time": "8:00",
            "place": {
              "name": "缙云仙都"
            },
            "description": "鼎湖峰是精华，朱潭山倒影绝美，花1天慢慢逛",
            "duration": "4-5h",
            "cost": "门票¥100",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "午餐",
            "type": "eat",
            "time": "12:30"
          },
          {
            "text": "入住缙云酒店",
            "type": "stay",
            "time": "13:30",
            "place": {
              "name": "缙云酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "⛅",
          "temp": "26°"
        },
        "photo": "photo-1507525428034-b723cf961d3e",
        "activity": "丽水→霞浦",
        "steps": [
          {
            "text": "租车/自驾3h到霞浦",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "霞浦"
            },
            "tips": [
              "霞浦滩涂日出要4:30到，迟了光线不对"
            ],
            "relatedContent": [
              {
                "platform": "B站",
                "icon": "📺",
                "title": "【自驾vlog】浙闽山海线7天",
                "likes": "22w"
              }
            ],
            "bookings": [
              {
                "type": "car",
                "label": "租车"
              }
            ]
          },
          {
            "text": "入住霞浦民宿",
            "type": "stay",
            "time": "11:00",
            "place": {
              "name": "霞浦民宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "photo": "photo-1470252649378-9c29740c9fa8",
        "activity": "霞浦滩涂日出(4:30起!)",
        "steps": [
          {
            "text": "霞浦滩涂日出点",
            "type": "play",
            "time": "4:30",
            "place": {
              "name": "霞浦滩涂"
            },
            "description": "4:30日出点，小皓/北岐/花竹是三大经典机位，去晚了光线不对",
            "duration": "2h",
            "cost": "免费",
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "霞浦滩涂日出，4点半起床值了",
                "likes": "7.3w"
              }
            ]
          },
          {
            "text": "上午休息",
            "type": "play",
            "time": "6:30"
          },
          {
            "text": "东壁日落",
            "type": "play",
            "time": "8:00",
            "place": {
              "name": "东壁"
            },
            "description": "霞浦看日落的经典点，紫菜架剪影特别出片",
            "duration": "1.5h",
            "cost": "免费"
          },
          {
            "text": "回民宿",
            "type": "transit",
            "time": "9:30",
            "place": {
              "name": "民宿"
            }
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "27°"
        },
        "photo": "photo-1587162146766-e06b1189b907",
        "activity": "福鼎白茶山",
        "steps": [
          {
            "text": "自驾1h到福鼎",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "福鼎"
            }
          },
          {
            "text": "福鼎白茶山",
            "type": "play",
            "time": "9:00",
            "place": {
              "name": "福鼎白茶山"
            },
            "description": "太姥山脚的茶村，可以现场品白茶买茶饼",
            "duration": "半天",
            "cost": "品茶免费"
          },
          {
            "text": "入住福鼎酒店",
            "type": "stay",
            "time": "13:00",
            "place": {
              "name": "福鼎酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "🌤️",
          "temp": "25°"
        },
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "太姥山全天",
        "steps": [
          {
            "text": "自驾30min到太姥山景区",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "太姥山景区"
            },
            "description": "花岗岩峰林地貌，爬全程要5h，量力而行",
            "duration": "5-6h",
            "cost": "门票¥130",
            "tips": [
              "太姥山爬全程要5小时，量力而行"
            ]
          },
          {
            "text": "太姥山全天",
            "type": "play",
            "time": "8:30",
            "place": {
              "name": "太姥山"
            },
            "description": "花岗岩峰林地貌，爬全程要5h，量力而行",
            "duration": "5-6h",
            "cost": "门票¥130",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "入住太姥山附近",
            "type": "stay",
            "time": "13:30",
            "place": {
              "name": "太姥山附近"
            },
            "description": "花岗岩峰林地貌，爬全程要5h，量力而行",
            "duration": "5-6h",
            "cost": "门票¥130",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "⛅",
          "temp": "26°"
        },
        "photo": "photo-1507525428034-b723cf961d3e",
        "activity": "返程",
        "steps": [
          {
            "text": "自驾到福鼎站",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "福鼎站"
            }
          },
          {
            "text": "还车",
            "type": "transit",
            "time": "8:30"
          },
          {
            "text": "高铁返回苏州",
            "type": "transit",
            "time": "9:00",
            "place": {
              "name": "苏州"
            },
            "bookings": [
              {
                "type": "train",
                "label": "查回程票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "回家",
            "type": "home",
            "time": "9:30"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "jiangnan-watertown-5d",
    "title": "江南水乡慢收集",
    "subtitle": "周庄 双桥+沈厅",
    "origin": "苏州",
    "duration": "5天",
    "category": "5day",
    "price": {
      "accommodation": "¥150-350/晚"
    },
    "transit": {
      "mode": "高",
      "duration": "",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "周庄",
        "lat": 31.113,
        "lng": 120.845
      },
      {
        "name": "同里",
        "lat": 31.128,
        "lng": 120.737
      },
      {
        "name": "南浔",
        "lat": 30.878,
        "lng": 120.418
      },
      {
        "name": "乌镇",
        "lat": 30.745,
        "lng": 120.487
      },
      {
        "name": "西塘",
        "lat": 30.893,
        "lng": 120.893
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "photo": "photo-1528164344705-47542687000d",
        "activity": "周庄 双桥+沈厅",
        "steps": [
          {
            "text": "自驾/打车40min到周庄古镇",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "周庄古镇"
            },
            "description": "最经典也最商业的水乡，双桥+沈厅是必看，清晨人少",
            "duration": "3-4h",
            "cost": "门票¥100",
            "tips": [
              "联票比单买划算，提前网上订",
              "周庄双桥清晨没人，适合拍照"
            ]
          },
          {
            "text": "双桥",
            "type": "play",
            "time": "8:40"
          },
          {
            "text": "沈厅",
            "type": "play",
            "time": "10:10"
          },
          {
            "text": "入住周庄客栈",
            "type": "stay",
            "time": "11:40",
            "place": {
              "name": "周庄客栈"
            },
            "description": "最经典也最商业的水乡，双桥+沈厅是必看，清晨人少",
            "duration": "3-4h",
            "cost": "门票¥100",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "🌤️",
          "temp": "27°"
        },
        "photo": "photo-1533929736458-ca588d08c8be",
        "activity": "同里 退思园+走三桥",
        "steps": [
          {
            "text": "打车30min到同里古镇",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "同里古镇"
            }
          },
          {
            "text": "退思园",
            "type": "play",
            "time": "8:30",
            "place": {
              "name": "退思园"
            },
            "description": "同里最精华的园林，贴水而建，早上9点前人少",
            "duration": "1h",
            "cost": "含在联票内"
          },
          {
            "text": "走三桥",
            "type": "play",
            "time": "9:30",
            "place": {
              "name": "三桥"
            },
            "description": "太平桥、吉利桥、长庆桥连在一起，走完在河边坐坐",
            "duration": "30min",
            "cost": "免费"
          },
          {
            "text": "入住同里客栈",
            "type": "stay",
            "time": "10:00",
            "place": {
              "name": "同里客栈"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "南浔 百间楼+小莲庄",
        "steps": [
          {
            "text": "打车1h到南浔古镇",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "南浔古镇"
            }
          },
          {
            "text": "百间楼",
            "type": "play",
            "time": "9:00",
            "place": {
              "name": "百间楼"
            },
            "description": "南浔最美的一段，日落6点最佳，河两岸明清建筑倒映水中",
            "duration": "1h",
            "cost": "含在门票内",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "小莲庄",
            "type": "play",
            "time": "10:00",
            "place": {
              "name": "小莲庄"
            },
            "description": "刘家的私家花园，荷花池+碑廊，晨光拍照特别美",
            "duration": "1h",
            "cost": "含在门票内",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "入住南浔民宿",
            "type": "stay",
            "time": "11:00",
            "place": {
              "name": "南浔民宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "⛅",
          "temp": "26°"
        },
        "photo": "photo-1470004914212-05527e49370b",
        "activity": "乌镇西栅 夜景绝杀",
        "steps": [
          {
            "text": "打车40min到乌镇西栅",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "乌镇西栅"
            },
            "description": "夜景全网公认最美，8点以后灯光全开，建议住里面",
            "duration": "3-4h",
            "cost": "门票¥150",
            "tips": [
              "乌镇西栅夜景8点后最美"
            ]
          },
          {
            "text": "西栅游览",
            "type": "play",
            "time": "8:40"
          },
          {
            "text": "夜景",
            "type": "play",
            "time": "20:00",
            "tips": [
              "8点后最美"
            ],
            "relatedContent": [
              {
                "platform": "抖音",
                "icon": "🎵",
                "title": "乌镇西栅夜景，全网最美角度",
                "likes": "25w"
              }
            ]
          },
          {
            "text": "入住乌镇民宿",
            "type": "stay",
            "time": "21:30",
            "place": {
              "name": "乌镇民宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "photo": "photo-1528164344705-47542687000d",
        "activity": "西塘 烟雨长廊+清晨",
        "steps": [
          {
            "text": "打车50min到西塘古镇",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "西塘古镇"
            },
            "description": "下午5点后入场免门票！晚上人少是精华，清晨6点前拍照最佳",
            "duration": "3-4h",
            "cost": "白天门票¥100"
          },
          {
            "text": "烟雨长廊",
            "type": "play",
            "time": "8:50",
            "place": {
              "name": "烟雨长廊"
            },
            "description": "全长1km，廊下看河最有感觉，清晨没人时候拍照绝了",
            "duration": "30min",
            "cost": "免费"
          },
          {
            "text": "午餐",
            "type": "eat",
            "time": "9:20"
          },
          {
            "text": "打车50min返回苏州",
            "type": "transit",
            "time": "10:20",
            "place": {
              "name": "苏州"
            }
          },
          {
            "text": "回家",
            "type": "home",
            "time": "11:10"
          }
        ]
      }
    ],
    "relatedContent": [
      {
        "platform": "小红书",
        "icon": "📕",
        "title": "五个古镇对比测评，最喜欢南浔",
        "likes": "8.1w"
      }
    ]
  },
  {
    "id": "huizhou-deep-7d",
    "title": "徽州深度一周",
    "subtitle": "屯溪老街夜游",
    "origin": "苏州",
    "duration": "7天",
    "category": "week",
    "price": {
      "accommodation": "¥200-500/晚"
    },
    "transit": {
      "mode": "高铁",
      "duration": "2.5h",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "黄山北",
        "lat": 30.314,
        "lng": 118.31
      },
      {
        "name": "黄山",
        "lat": 30.137,
        "lng": 118.167
      },
      {
        "name": "西递",
        "lat": 30.058,
        "lng": 117.934
      },
      {
        "name": "宏村",
        "lat": 30.055,
        "lng": 117.977
      },
      {
        "name": "呈坎",
        "lat": 30.006,
        "lng": 118.185
      },
      {
        "name": "新安江",
        "lat": 29.856,
        "lng": 118.55
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "26°"
        },
        "photo": "photo-1533929736458-ca588d08c8be",
        "activity": "屯溪老街夜游",
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "time": "15:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min"
          },
          {
            "text": "高铁2.5h到黄山北站",
            "type": "transit",
            "time": "15:30",
            "place": {
              "name": "黄山北站"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "duration": "全天",
            "cost": "门票¥190+索道¥80",
            "tips": [
              "黄山山顶住宿要提前1个月订"
            ],
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车到屯溪老街",
            "type": "transit",
            "time": "18:00",
            "place": {
              "name": "屯溪老街"
            },
            "description": "徽州最热闹的老街，夜游最有氛围，各种徽州小吃",
            "duration": "2h",
            "cost": "免费逛"
          },
          {
            "text": "屯溪老街夜游",
            "type": "play",
            "time": "19:00",
            "place": {
              "name": "屯溪老街"
            },
            "description": "徽州最热闹的老街，夜游最有氛围，各种徽州小吃",
            "duration": "2h",
            "cost": "免费逛"
          },
          {
            "text": "入住屯溪酒店",
            "type": "stay",
            "time": "21:00",
            "place": {
              "name": "屯溪酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "18°"
        },
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "黄山全天(住山顶!)",
        "steps": [
          {
            "text": "打车到黄山南大门/北大门",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "黄山南大门/北大门"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "duration": "全天",
            "cost": "门票¥190+索道¥80"
          },
          {
            "text": "索道上山",
            "type": "transit",
            "time": "8:30"
          },
          {
            "text": "黄山全天",
            "type": "play",
            "time": "9:00",
            "place": {
              "name": "黄山"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "duration": "全天",
            "cost": "门票¥190+索道¥80",
            "tips": [
              "日出看排云亭，日落看光明顶"
            ],
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "黄山日出住山顶，排云亭最佳机位",
                "likes": "5.5w"
              }
            ],
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "住山顶看日出!",
            "type": "stay",
            "time": "8:00",
            "place": {
              "name": "黄山山顶"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "🌤️",
          "temp": "25°"
        },
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "下山→西递古村",
        "steps": [
          {
            "text": "下山",
            "type": "transit",
            "time": "8:00"
          },
          {
            "text": "打车到西递古村",
            "type": "transit",
            "time": "8:30",
            "place": {
              "name": "西递古村"
            },
            "description": "比宏村人少很多更安静，胡文光牌坊和敬爱堂是精华",
            "duration": "2-3h",
            "cost": "门票¥94",
            "tips": [
              "西递比宏村人少很多，更安静"
            ]
          },
          {
            "text": "西递游览",
            "type": "play",
            "time": "9:00",
            "place": {
              "name": "西递"
            },
            "description": "比宏村人少很多更安静，胡文光牌坊和敬爱堂是精华",
            "duration": "2-3h",
            "cost": "门票¥94",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "入住西递民宿",
            "type": "stay",
            "time": "11:30",
            "place": {
              "name": "西递民宿"
            },
            "description": "比宏村人少很多更安静，胡文光牌坊和敬爱堂是精华",
            "duration": "2-3h",
            "cost": "门票¥94",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "26°"
        },
        "photo": "photo-1500382017468-9049fed747ef",
        "activity": "宏村 南湖+月沼",
        "steps": [
          {
            "text": "打车15min到宏村",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "宏村"
            },
            "description": "南湖倒映马头墙，月沼是精华。门票3日内可反复进",
            "duration": "半天-1天",
            "cost": "门票¥104"
          },
          {
            "text": "南湖",
            "type": "play",
            "time": "8:15"
          },
          {
            "text": "月沼",
            "type": "play",
            "time": "9:45",
            "place": {
              "name": "月沼"
            },
            "description": "宏村精华，半月形池塘倒映古建，傍晚和清晨最美",
            "duration": "30min",
            "cost": "含在门票内",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "写生",
            "type": "play",
            "time": "10:15"
          },
          {
            "text": "入住宏村民宿",
            "type": "stay",
            "time": "11:45",
            "place": {
              "name": "宏村民宿"
            },
            "description": "南湖倒映马头墙，月沼是精华。门票3日内可反复进",
            "duration": "半天-1天",
            "cost": "门票¥104",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "⛅",
          "temp": "24°"
        },
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "呈坎八卦村+唐模",
        "steps": [
          {
            "text": "打车40min到呈坎",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "呈坎"
            },
            "description": "八卦布局古村，罗东舒祠是全国重点文保",
            "duration": "2h",
            "cost": "门票¥107"
          },
          {
            "text": "呈坎八卦村",
            "type": "play",
            "time": "8:40",
            "place": {
              "name": "呈坎"
            },
            "description": "八卦布局古村，罗东舒祠是全国重点文保",
            "duration": "2h",
            "cost": "门票¥107",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "唐模",
            "type": "play",
            "time": "10:40"
          },
          {
            "text": "入住呈坎附近",
            "type": "stay",
            "time": "12:10",
            "place": {
              "name": "呈坎附近"
            },
            "description": "八卦布局古村，罗东舒祠是全国重点文保",
            "duration": "2h",
            "cost": "门票¥107",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "27°"
        },
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "新安江山水画廊游船",
        "steps": [
          {
            "text": "打车1h到新安江码头",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "新安江码头"
            },
            "description": "山水画廊游船约3h，两岸徽派村落+油菜花田",
            "duration": "3h",
            "cost": "游船¥128"
          },
          {
            "text": "新安江山水画廊游船",
            "type": "play",
            "time": "9:00",
            "place": {
              "name": "新安江"
            },
            "description": "山水画廊游船约3h，两岸徽派村落+油菜花田",
            "duration": "3h",
            "cost": "游船¥128",
            "bookings": [
              {
                "type": "boat",
                "label": "查船票"
              }
            ]
          },
          {
            "text": "入住屯溪",
            "type": "stay",
            "time": "12:00",
            "place": {
              "name": "屯溪"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "🌤️",
          "temp": "26°"
        },
        "photo": "photo-1533929736458-ca588d08c8be",
        "activity": "屯溪采购+返程",
        "steps": [
          {
            "text": "屯溪采购伴手礼",
            "type": "play",
            "time": "8:00"
          },
          {
            "text": "打车到黄山北站",
            "type": "transit",
            "time": "9:30",
            "place": {
              "name": "黄山北站"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "duration": "全天",
            "cost": "门票¥190+索道¥80"
          },
          {
            "text": "高铁2.5h返回苏州站",
            "type": "transit",
            "time": "10:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min",
            "bookings": [
              {
                "type": "train",
                "label": "查回程票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "回家",
            "type": "home",
            "time": "12:30"
          }
        ]
      }
    ],
    "relatedContent": [
      {
        "platform": "B站",
        "icon": "📺",
        "title": "【徽州7日】粉墙黛瓦水墨画",
        "likes": "18w"
      }
    ]
  },
  {
    "id": "tongli-halfday",
    "title": "同里古镇半日闲",
    "subtitle": "退思园+走三桥+状元蹄",
    "origin": "苏州",
    "duration": "1天",
    "category": "tomorrow",
    "price": {
      "perPerson": "人均¥200"
    },
    "transit": {
      "mode": "自驾",
      "duration": "40min",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "同里",
        "lat": 31.128,
        "lng": 120.737
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "32°"
        },
        "photo": "photo-1528164344705-47542687000d",
        "activity": "退思园+走三桥+状元蹄",
        "steps": [
          {
            "text": "自驾40min到同里古镇",
            "type": "transit",
            "time": "9:00",
            "place": {
              "name": "同里古镇"
            }
          },
          {
            "text": "退思园",
            "type": "play",
            "time": "9:40",
            "place": {
              "name": "退思园"
            },
            "description": "同里最精华的园林，贴水而建，早上9点前人少",
            "duration": "1h",
            "cost": "含在联票内",
            "tips": [
              "退思园早上9点前人少"
            ],
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "同里比周庄安静十倍，退思园真的美",
                "likes": "1.9w"
              }
            ]
          },
          {
            "text": "走三桥",
            "type": "play",
            "time": "10:40",
            "place": {
              "name": "三桥"
            },
            "description": "太平桥、吉利桥、长庆桥连在一起，走完在河边坐坐",
            "duration": "30min",
            "cost": "免费",
            "tips": [
              "三桥走完可以在河边坐坐"
            ]
          },
          {
            "text": "穿堂街买芡实糕",
            "type": "play",
            "time": "11:10"
          },
          {
            "text": "明清街午餐",
            "type": "eat",
            "time": "12:40",
            "place": {
              "name": "明清街"
            },
            "tips": [
              "状元蹄必吃",
              "状元蹄认准古镇入口第一家"
            ]
          },
          {
            "text": "罗星洲坐船",
            "type": "play",
            "time": "13:40",
            "place": {
              "name": "罗星洲"
            },
            "description": "湖中小岛，坐船过去，人少安静",
            "duration": "1h",
            "cost": "船票¥5",
            "bookings": [
              {
                "type": "boat",
                "label": "查船票"
              }
            ]
          },
          {
            "text": "日落",
            "type": "play",
            "time": "14:40"
          },
          {
            "text": "自驾40min返回苏州",
            "type": "transit",
            "time": "16:10",
            "place": {
              "name": "苏州"
            }
          },
          {
            "text": "回家",
            "type": "home",
            "time": "16:50"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "lingyanshan-hike",
    "title": "灵岩山徒步",
    "subtitle": "灵岩山步道+山顶寺+木渎午餐",
    "origin": "苏州",
    "duration": "1天",
    "category": "tomorrow",
    "price": {
      "perPerson": "人均¥80"
    },
    "transit": {
      "mode": "地铁+公交",
      "duration": "1h",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "灵岩山",
        "lat": 31.237,
        "lng": 120.517
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "⛅",
          "temp": "30°"
        },
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "灵岩山步道+山顶寺+木渎午餐",
        "steps": [
          {
            "text": "地铁1号线到木渎站",
            "type": "transit",
            "time": "9:00",
            "place": {
              "name": "木渎站"
            },
            "tips": [
              "下山后木渎的鲃肺汤是一绝"
            ]
          },
          {
            "text": "公交15min到灵岩山",
            "type": "transit",
            "time": "9:30",
            "place": {
              "name": "灵岩山"
            },
            "description": "北坡好走南坡陡，山不高45min登顶，山顶看太湖全景",
            "duration": "1.5h",
            "cost": "免门票",
            "tips": [
              "灵岩山北坡路好走，南坡陡"
            ]
          },
          {
            "text": "灵岩山步道登山",
            "type": "play",
            "time": "9:45",
            "place": {
              "name": "灵岩山"
            },
            "description": "北坡好走南坡陡，山不高45min登顶，山顶看太湖全景",
            "duration": "1.5h",
            "cost": "免门票",
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "苏州人周末爬灵岩山，不要门票",
                "likes": "2.4w"
              }
            ],
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "灵岩寺",
            "type": "play",
            "time": "10:30",
            "place": {
              "name": "灵岩寺"
            },
            "description": "山顶千年古刹，免费参观，香火随缘",
            "duration": "30min",
            "cost": "免费",
            "tips": [
              "山顶灵岩寺免费，香火自愿"
            ]
          },
          {
            "text": "山顶俯瞰太湖",
            "type": "play",
            "time": "11:00"
          },
          {
            "text": "下山",
            "type": "transit",
            "time": "12:30"
          },
          {
            "text": "木渎古镇午餐",
            "type": "eat",
            "time": "13:00",
            "place": {
              "name": "木渎古镇"
            },
            "description": "严家花园+虹饮山房值得看，鲃肺汤是当地一绝",
            "duration": "2h",
            "cost": "联票¥60"
          },
          {
            "text": "严家花园",
            "type": "play",
            "time": "15:00"
          },
          {
            "text": "地铁返回苏州",
            "type": "transit",
            "time": "16:30",
            "place": {
              "name": "苏州"
            }
          },
          {
            "text": "回家",
            "type": "home",
            "time": "17:00"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "yangchenghu-cycling",
    "title": "阳澄湖骑行",
    "subtitle": "环湖骑行20km+莲花岛+日落",
    "origin": "苏州",
    "duration": "1天",
    "category": "tomorrow",
    "price": {
      "perPerson": "人均¥150"
    },
    "transit": {
      "mode": "自驾",
      "duration": "30min",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "阳澄湖",
        "lat": 31.411,
        "lng": 120.755
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "33°"
        },
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "环湖骑行20km+莲花岛+日落",
        "steps": [
          {
            "text": "自驾30min到阳澄湖骑行驿站",
            "type": "transit",
            "time": "9:00",
            "place": {
              "name": "阳澄湖骑行驿站"
            },
            "description": "租车¥50/天，非蟹季人很少骑行超舒服",
            "cost": "租车¥50",
            "tips": [
              "非蟹季人少骑行舒服"
            ],
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "非蟹季的阳澄湖，骑行超舒服人超少",
                "likes": "1.5w"
              }
            ]
          },
          {
            "text": "租车",
            "type": "transit",
            "time": "9:30",
            "bookings": [
              {
                "type": "car",
                "label": "租车"
              }
            ]
          },
          {
            "text": "环湖骑行绿道20km",
            "type": "play",
            "time": "10:00"
          },
          {
            "text": "美人腿半岛",
            "type": "play",
            "time": "11:30",
            "place": {
              "name": "美人腿半岛"
            },
            "description": "阳澄湖伸出的半岛，骑到尽头看湖景",
            "duration": "1h",
            "cost": "免费"
          },
          {
            "text": "莲花岛码头坐船上岛",
            "type": "play",
            "time": "12:30",
            "place": {
              "name": "莲花岛"
            },
            "description": "码头坐船上岛，末班船5点别错过！傍晚蚊子多带驱蚊",
            "duration": "2h",
            "cost": "船票¥20",
            "tips": [
              "莲花岛末班船5点，别错过",
              "傍晚6点湖边蚊子多，带驱蚊"
            ],
            "bookings": [
              {
                "type": "boat",
                "label": "查船票"
              }
            ]
          },
          {
            "text": "湖边咖啡馆",
            "type": "eat",
            "time": "14:30"
          },
          {
            "text": "看日落",
            "type": "play",
            "time": "15:30"
          },
          {
            "text": "自驾30min返回苏州",
            "type": "transit",
            "time": "17:00",
            "place": {
              "name": "苏州"
            }
          },
          {
            "text": "回家",
            "type": "home",
            "time": "17:30"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "zhenan-shanshui-5d",
    "title": "浙南山水5日",
    "subtitle": "杭州→建德 新安江夜游",
    "origin": "苏州",
    "duration": "5天",
    "category": "5day",
    "price": {
      "accommodation": "¥200-400/晚"
    },
    "transit": {
      "mode": "高铁",
      "duration": "2h",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "杭州",
        "lat": 30.274,
        "lng": 120.155
      },
      {
        "name": "建德",
        "lat": 29.476,
        "lng": 119.281
      },
      {
        "name": "丽水",
        "lat": 28.468,
        "lng": 119.923
      },
      {
        "name": "缙云",
        "lat": 28.661,
        "lng": 120.091
      },
      {
        "name": "仙居",
        "lat": 28.847,
        "lng": 120.728
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "杭州→建德 新安江夜游",
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "time": "15:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
            "duration": "30min"
          },
          {
            "text": "高铁25min到杭州站",
            "type": "transit",
            "time": "15:30",
            "place": {
              "name": "杭州站"
            },
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "换乘高铁40min到建德站",
            "type": "transit",
            "time": "15:55",
            "place": {
              "name": "建德站"
            },
            "tips": [
              "建德草莓季12-3月，夏天去看荷花"
            ],
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车到新安江",
            "type": "transit",
            "time": "16:35",
            "place": {
              "name": "新安江"
            },
            "description": "山水画廊游船约3h，两岸徽派村落+油菜花田",
            "duration": "3h",
            "cost": "游船¥128"
          },
          {
            "text": "新安江夜游",
            "type": "play",
            "time": "19:00",
            "place": {
              "name": "新安江"
            },
            "description": "山水画廊游船约3h，两岸徽派村落+油菜花田",
            "duration": "3h",
            "cost": "游船¥128"
          },
          {
            "text": "入住建德酒店",
            "type": "stay",
            "time": "22:00",
            "place": {
              "name": "建德酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "27°"
        },
        "photo": "photo-1470252649378-9c29740c9fa8",
        "activity": "大慈岩+下涯湿地晨雾",
        "steps": [
          {
            "text": "打车到大慈岩景区",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "大慈岩景区"
            },
            "description": "悬崖上的寺庙，半山腰俯瞰田园，惊险但好看",
            "duration": "2-3h",
            "cost": "门票¥65"
          },
          {
            "text": "大慈岩",
            "type": "play",
            "time": "8:30",
            "place": {
              "name": "大慈岩"
            },
            "description": "悬崖上的寺庙，半山腰俯瞰田园，惊险但好看",
            "duration": "2-3h",
            "cost": "门票¥65",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "下涯湿地",
            "type": "play",
            "time": "8:00",
            "place": {
              "name": "下涯湿地"
            },
            "description": "晨雾要6点前到！新安江边，渔夫撒网+晨雾=仙境",
            "duration": "1.5h",
            "cost": "免费",
            "tips": [
              "下涯湿地晨雾要6点前到"
            ],
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "浙南秘境！建德下涯湿地晨雾太仙了",
                "likes": "5.2w"
              }
            ]
          },
          {
            "text": "入住建德",
            "type": "stay",
            "time": "9:30",
            "place": {
              "name": "建德"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "🌤️",
          "temp": "26°"
        },
        "photo": "photo-1500382017468-9049fed747ef",
        "activity": "建德→丽水 古堰画乡",
        "steps": [
          {
            "text": "租车/自驾2h到丽水",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "丽水"
            },
            "relatedContent": [
              {
                "platform": "B站",
                "icon": "📺",
                "title": "【自驾vlog】神仙居名字不是吹的",
                "likes": "11w"
              }
            ],
            "bookings": [
              {
                "type": "car",
                "label": "租车"
              }
            ]
          },
          {
            "text": "古堰画乡",
            "type": "play",
            "time": "10:00",
            "place": {
              "name": "古堰画乡"
            },
            "description": "瓯江边的画家村，油画写生+古樟树群，下午光线最美",
            "duration": "2-3h",
            "cost": "门票¥50",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "入住丽水酒店",
            "type": "stay",
            "time": "12:30",
            "place": {
              "name": "丽水酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "缙云仙都 鼎湖峰+朱潭山",
        "steps": [
          {
            "text": "自驾1h到缙云仙都景区",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "缙云仙都景区"
            },
            "description": "鼎湖峰是精华，朱潭山倒影绝美，花1天慢慢逛",
            "duration": "4-5h",
            "cost": "门票¥100"
          },
          {
            "text": "鼎湖峰",
            "type": "play",
            "time": "9:00"
          },
          {
            "text": "朱潭山",
            "type": "play",
            "time": "10:30"
          },
          {
            "text": "入住缙云",
            "type": "stay",
            "time": "12:00",
            "place": {
              "name": "缙云"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿"
              }
            ]
          }
        ]
      },
      {
        "weather": {
          "icon": "⛅",
          "temp": "27°"
        },
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "仙居神仙居+返程",
        "steps": [
          {
            "text": "自驾1.5h到仙居神仙居景区",
            "type": "transit",
            "time": "8:00",
            "place": {
              "name": "仙居神仙居景区"
            },
            "description": "索道排队长早去！如意桥网红打卡点，全程3-4h",
            "duration": "4h",
            "cost": "门票¥110+索道¥100",
            "tips": [
              "神仙居索道排队长，早去"
            ]
          },
          {
            "text": "神仙居全天",
            "type": "play",
            "time": "9:30",
            "place": {
              "name": "神仙居"
            },
            "description": "索道排队长早去！如意桥网红打卡点，全程3-4h",
            "duration": "4h",
            "cost": "门票¥110+索道¥100",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票"
              }
            ]
          },
          {
            "text": "自驾/高铁返回苏州",
            "type": "transit",
            "time": "13:30",
            "place": {
              "name": "苏州"
            },
            "bookings": [
              {
                "type": "train",
                "label": "查回程票",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "回家",
            "type": "home",
            "time": "14:00"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "pingjianglu-walk",
    "title": "平江路商圈走走",
    "subtitle": "平江路赶集+独墓湖散步",
    "origin": "苏州",
    "duration": "半天",
    "category": "now",
    "price": {
      "perPerson": "人均¥100"
    },
    "transit": {
      "mode": "地铁",
      "duration": "30min",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "平江路",
        "lat": 31.318,
        "lng": 120.632
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "33°"
        },
        "photo": "photo-1528164344705-47542687000d",
        "activity": "平江路赶集+独墓湖散步",
        "steps": [
          {
            "text": "地铁到平江路站",
            "type": "transit",
            "time": "14:00",
            "place": {
              "name": "平江路站"
            },
            "description": "苏州最有味道的老街，诚品书店+文创小店+苏式点心",
            "duration": "2h",
            "cost": "免费逛"
          },
          {
            "text": "平江路赶集",
            "type": "play",
            "time": "14:30",
            "place": {
              "name": "平江路"
            },
            "description": "苏州最有味道的老街，诚品书店+文创小店+苏式点心",
            "duration": "2h",
            "cost": "免费逛"
          },
          {
            "text": "诚品书店",
            "type": "play",
            "time": "16:30"
          },
          {
            "text": "独墓湖散步",
            "type": "play",
            "time": "18:00"
          },
          {
            "text": "湖边咖啡",
            "type": "eat",
            "time": "19:30"
          },
          {
            "text": "地铁回家",
            "type": "transit",
            "time": "20:30"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "jinjihu-sunset",
    "title": "金鸡湖日落骑行",
    "subtitle": "环湖骑行+看日落",
    "origin": "苏州",
    "duration": "半天",
    "category": "now",
    "price": {
      "perPerson": "人均¥50"
    },
    "transit": {
      "mode": "骑行/自驾",
      "duration": "20min",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "金鸡湖",
        "lat": 31.327,
        "lng": 120.598
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "☀️",
          "temp": "33°"
        },
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "环湖骑行+看日落",
        "steps": [
          {
            "text": "骑行/自驾20min到金鸡湖",
            "type": "transit",
            "time": "16:00",
            "place": {
              "name": "金鸡湖"
            },
            "description": "环湖绿道骑行，音乐喷泉(周五六晚8点)，日落超美",
            "duration": "2h",
            "cost": "免费"
          },
          {
            "text": "环湖绿道骑行",
            "type": "play",
            "time": "16:20"
          },
          {
            "text": "湖边野餐",
            "type": "play",
            "time": "17:50"
          },
          {
            "text": "看日落",
            "type": "play",
            "time": "19:20"
          },
          {
            "text": "骑回家",
            "type": "play",
            "time": "20:50"
          }
        ]
      }
    ],
    "relatedContent": []
  },
  {
    "id": "guanqianjie-night",
    "title": "观前街夜市+护城河",
    "subtitle": "夜市扫街+护城河夜景",
    "origin": "苏州",
    "duration": "晚上",
    "category": "now",
    "price": {
      "perPerson": "人均¥80"
    },
    "transit": {
      "mode": "步行/地铁",
      "duration": "15min",
      "destination": ""
    },
    "route": [
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      },
      {
        "name": "观前街",
        "lat": 31.309,
        "lng": 120.625
      },
      {
        "name": "苏州",
        "lat": 31.299,
        "lng": 120.585
      }
    ],
    "days": [
      {
        "weather": {
          "icon": "🌙",
          "temp": "28°"
        },
        "photo": "photo-1470004914212-05527e49370b",
        "activity": "夜市扫街+护城河夜景",
        "steps": [
          {
            "text": "步行/地铁到观前街",
            "type": "transit",
            "time": "19:00",
            "place": {
              "name": "观前街"
            },
            "description": "苏州最热闹的商圈，夜市小吃多，松鹤楼/得月楼在附近",
            "duration": "2h",
            "cost": "人均¥50-100"
          },
          {
            "text": "夜市扫街",
            "type": "eat",
            "time": "19:30"
          },
          {
            "text": "护城河游船",
            "type": "play",
            "time": "20:30",
            "place": {
              "name": "护城河"
            },
            "description": "夜游护城河游船看城墙灯光，也可以河边散步",
            "duration": "1h",
            "cost": "游船¥80",
            "bookings": [
              {
                "type": "boat",
                "label": "查船票"
              }
            ]
          },
          {
            "text": "河边散步",
            "type": "play",
            "time": "21:30"
          },
          {
            "text": "回家",
            "type": "home",
            "time": "23:00"
          }
        ]
      }
    ],
    "relatedContent": []
  }
];

// Plan-level related content fallback (for content not matched to specific steps)
// Already included in each plan's relatedContent field above.
// This export keeps the original RELATED_CONTENT for backward compatibility.
const RELATED_CONTENT_V2 = {
  "1": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "莫干山两天一夜，竹海里真的能发呆一整天",
      "likes": "2.3w"
    },
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
  ],
  "2": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "西塘晚上10点以后才是真的！夜场攻略",
      "likes": "3.1w"
    },
    {
      "platform": "B站",
      "icon": "📺",
      "title": "【4K】清晨5点的西塘，终于没人了",
      "likes": "12w"
    },
    {
      "platform": "大众点评",
      "icon": "⭐",
      "title": "西塘最好吃的5家店，本地人推荐",
      "likes": "8500"
    }
  ],
  "3": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "东山杨梅季！果园里吃到饱只要50块",
      "likes": "1.8w"
    },
    {
      "platform": "抖音",
      "icon": "🎵",
      "title": "环太湖骑行15km，风景绝了",
      "likes": "5.2w"
    }
  ],
  "4": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "径山寺后山有条野路！走40分钟到茶田",
      "likes": "4.5w"
    },
    {
      "platform": "B站",
      "icon": "📺",
      "title": "跟茶农学炒茶，翻车了但很开心",
      "likes": "3.2w"
    }
  ],
  "5": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "南浔，比乌镇安静十倍的江南古镇",
      "likes": "5.8w"
    },
    {
      "platform": "抖音",
      "icon": "🎵",
      "title": "百间楼日落太美了",
      "likes": "11w"
    }
  ],
  "6": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "宏村写生三天，画了8张水彩",
      "likes": "2.7w"
    },
    {
      "platform": "B站",
      "icon": "📺",
      "title": "【皖南vlog】卢村木雕楼，比宏村惊艳",
      "likes": "6.8w"
    }
  ],
  "7": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "芹川古村晚上有萤火虫！7月限定",
      "likes": "6.2w"
    },
    {
      "platform": "抖音",
      "icon": "🎵",
      "title": "千岛湖绿道骑行，随手拍都是壁纸",
      "likes": "15w"
    }
  ],
  "8": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "霞浦滩涂日出，4点半起床值了",
      "likes": "7.3w"
    },
    {
      "platform": "B站",
      "icon": "📺",
      "title": "【自驾vlog】浙闽山海线7天",
      "likes": "22w"
    }
  ],
  "9": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "五个古镇对比测评，最喜欢南浔",
      "likes": "8.1w"
    },
    {
      "platform": "抖音",
      "icon": "🎵",
      "title": "乌镇西栅夜景，全网最美角度",
      "likes": "25w"
    }
  ],
  "10": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "黄山日出住山顶，排云亭最佳机位",
      "likes": "5.5w"
    },
    {
      "platform": "B站",
      "icon": "📺",
      "title": "【徽州7日】粉墙黛瓦水墨画",
      "likes": "18w"
    }
  ],
  "11": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "同里比周庄安静十倍，退思园真的美",
      "likes": "1.9w"
    }
  ],
  "12": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "苏州人周末爬灵岩山，不要门票",
      "likes": "2.4w"
    }
  ],
  "13": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "非蟹季的阳澄湖，骑行超舒服人超少",
      "likes": "1.5w"
    }
  ],
  "14": [
    {
      "platform": "小红书",
      "icon": "📕",
      "title": "浙南秘境！建德下涯湿地晨雾太仙了",
      "likes": "5.2w"
    },
    {
      "platform": "B站",
      "icon": "📺",
      "title": "【自驾vlog】神仙居名字不是吹的",
      "likes": "11w"
    }
  ]
};
