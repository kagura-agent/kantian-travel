// data-final.js — Clean schema, zero redundancy
// Card-level display fields are computed from steps at render time

const PLANS = [
  {
    "id": "moganshan-weekend",
    "title": "莫干山竹海发呆",
    "origin": "苏州",
    "category": "weekend",
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
    ],
    "days": [
      {
        "photo": "photo-1518335935020-cfd6580c1ab4",
        "activity": "裸心谷竹林徒步+山顶手冲",
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "startTime": "8:00",
            "endTime": "8:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅"
          },
          {
            "text": "高铁47min到德清站",
            "type": "transit",
            "startTime": "8:30",
            "endTime": "9:17",
            "place": {
              "name": "德清站"
            },
            "description": "出站右手边出租车排队区，或提前叫网约车到莫干山",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "cost": "打车约¥40",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车25min到莫干山",
            "type": "transit",
            "startTime": "9:17",
            "endTime": "9:42",
            "place": {
              "name": "莫干山"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "裸心谷竹林徒步",
            "type": "play",
            "startTime": "9:42",
            "endTime": "11:42",
            "place": {
              "name": "裸心谷"
            },
            "description": "从入口进竹林步道，全程遮阴不晒，走到山顶有精品咖啡馆，手冲很好喝",
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
            "startTime": "11:42",
            "endTime": "12:42",
            "place": {
              "name": "山顶精品"
            },
            "description": "竹林顶上的精品咖啡馆，手冲单品很棒，坐窗边能看到整片竹海",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥40-60"
              }
            ]
          },
          {
            "text": "入住莫干山民宿",
            "type": "stay",
            "startTime": "12:42",
            "endTime": "20:00",
            "place": {
              "name": "莫干山民宿"
            },
            "description": "推荐提前1周订，周末涨价。裸心谷附近民宿集中，选山腰的安静",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥400-800/晚"
              }
            ],
            "tips": [
              "周末民宿要提前1周订"
            ]
          },
          {
            "text": "晚上萤火虫观赏",
            "type": "play",
            "startTime": "20:00",
            "endTime": "21:00",
            "place": {
              "name": "萤火虫"
            },
            "description": "远离路灯的地方效果最好，6-8月晚上8点后出现，别开闪光灯",
            "tips": [
              "6-8月晚上能看萤火虫"
            ]
          }
        ]
      },
      {
        "photo": "photo-1534787238916-9ba6764efd4f",
        "activity": "骑行环山路+返程",
        "weather": {
          "icon": "⛅",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "民宿早餐",
            "type": "eat",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "民宿"
            },
            "description": "民宿含早，一般有本地土鸡蛋、自制酱菜和粥，不用外出",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "含在房费内"
              }
            ]
          },
          {
            "text": "骑行环山路",
            "type": "play",
            "startTime": "9:00",
            "endTime": "10:30",
            "description": "可租电动车",
            "bookings": [
              {
                "type": "bike",
                "label": "租车"
              }
            ],
            "place": {
              "name": "莫干山环山路"
            }
          },
          {
            "text": "沿途茶园和竹海",
            "type": "play",
            "startTime": "10:30",
            "endTime": "12:00",
            "place": {
              "name": "沿途茶园和竹海"
            },
            "description": "骑行沿途经过大片茶园和竹海，路边有凉亭可以停下来拍照休息"
          },
          {
            "text": "庾村文创小镇午餐",
            "type": "eat",
            "startTime": "12:00",
            "endTime": "13:30",
            "place": {
              "name": "庾村文创小镇"
            },
            "description": "莫干山脚下的文创聚集地，有咖啡店、手作店、独立书店",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥50"
              }
            ]
          },
          {
            "text": "打车到德清站",
            "type": "transit",
            "startTime": "13:30",
            "endTime": "14:00",
            "place": {
              "name": "德清站"
            },
            "description": "出站右手边出租车排队区，或提前叫网约车到莫干山",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "打车约¥40"
              }
            ]
          },
          {
            "text": "高铁47min返回苏州站",
            "type": "transit",
            "startTime": "14:00",
            "endTime": "14:47",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
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
            "startTime": "14:47",
            "endTime": "14:47"
          }
        ]
      }
    ]
  },
  {
    "id": "xitang-night",
    "title": "西塘深夜场",
    "origin": "苏州",
    "category": "weekend",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1470004914212-05527e49370b",
        "activity": "夜游西塘(人超少)+酒吧街",
        "weather": {
          "icon": "🌙",
          "temp": "25°"
        },
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "startTime": "15:00",
            "endTime": "15:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅"
          },
          {
            "text": "高铁1h到嘉善南站",
            "type": "transit",
            "startTime": "15:30",
            "endTime": "16:30",
            "place": {
              "name": "嘉善南站"
            },
            "description": "出站后打车或公交到西塘约20min",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "cost": "打车约¥30",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车20min到西塘古镇",
            "type": "transit",
            "startTime": "16:30",
            "endTime": "16:50",
            "place": {
              "name": "西塘古镇"
            },
            "description": "下午5点后入场免门票！晚上人少是精华，清晨6点前拍照最佳",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "白天门票¥100"
              }
            ],
            "tips": [
              "下午5点后入场免门票"
            ]
          },
          {
            "text": "入住临水客栈",
            "type": "stay",
            "startTime": "16:50",
            "endTime": "17:20",
            "place": {
              "name": "临水客栈"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-400/晚"
              }
            ],
            "description": "选临河的房间夜景好，推窗就是水巷灯笼，提前1周订周末房"
          },
          {
            "text": "黄昏逛巷子",
            "type": "play",
            "startTime": "17:20",
            "endTime": "19:00",
            "place": {
              "name": "黄昏"
            },
            "description": "黄昏游客散了大半，穿小巷子拍照最好，石皮弄和计家弄必逛"
          },
          {
            "text": "夜游西塘",
            "type": "play",
            "startTime": "19:00",
            "endTime": "22:30",
            "place": {
              "name": "西塘"
            },
            "description": "下午5点后入场免门票！晚上人少是精华，清晨6点前拍照最佳",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "白天门票¥100"
              }
            ],
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
            ]
          },
          {
            "text": "酒吧街",
            "type": "play",
            "startTime": "22:30",
            "endTime": "23:30",
            "place": {
              "name": "酒吧街"
            },
            "description": "西塘酒吧街周末才热闹，塘东街那排最集中",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "人均¥50-100"
              }
            ],
            "tips": [
              "酒吧街周末才热闹"
            ]
          }
        ]
      },
      {
        "photo": "photo-1528164344705-47542687000d",
        "activity": "清晨空巷拍照+烟雨长廊",
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "steps": [
          {
            "text": "6点起床拍空巷",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "6点起床"
            },
            "description": "清晨6点前古镇几乎没人，拍空巷、水面倒影的最佳时间"
          },
          {
            "text": "烟雨长廊",
            "type": "play",
            "startTime": "9:30",
            "endTime": "10:00",
            "place": {
              "name": "烟雨长廊"
            },
            "description": "全长1km，廊下看河最有感觉，清晨没人时候拍照绝了"
          },
          {
            "text": "早茶",
            "type": "eat",
            "startTime": "10:00",
            "endTime": "11:00",
            "description": "古镇里的茶馆吃早茶，馄饨、豆腐花、粽子都是本地特色",
            "place": {
              "name": "西塘古镇"
            },
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥15-30"
              }
            ]
          },
          {
            "text": "打车20min到嘉善南站",
            "type": "transit",
            "startTime": "11:00",
            "endTime": "11:20",
            "place": {
              "name": "嘉善南站"
            },
            "description": "出站后打车或公交到西塘约20min",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "打车约¥30"
              }
            ]
          },
          {
            "text": "高铁1h返回苏州站",
            "type": "transit",
            "startTime": "11:20",
            "endTime": "12:20",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
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
            "startTime": "12:20",
            "endTime": "12:20"
          }
        ]
      }
    ]
  },
  {
    "id": "taihu-dongshan-yangmei",
    "title": "太湖东山杨梅季",
    "origin": "苏州",
    "category": "weekend",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "果园采杨梅+环太湖骑行",
        "weather": {
          "icon": "☀️",
          "temp": "31°"
        },
        "steps": [
          {
            "text": "自驾1h到东山",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "东山"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "杨梅果园采杨梅",
            "type": "play",
            "startTime": "9:00",
            "endTime": "10:30",
            "place": {
              "name": "杨梅果园"
            },
            "description": "6月中-7月初限定！进园随便吃，带走按斤称",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "入园¥50/人"
              }
            ],
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
            "startTime": "10:30",
            "endTime": "11:30",
            "place": {
              "name": "太湖三白"
            },
            "description": "白虾白鱼银鱼，东山当地餐厅比景区便宜一半",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥80-120"
              }
            ]
          },
          {
            "text": "环太湖骑行15km",
            "type": "play",
            "startTime": "11:30",
            "endTime": "14:00",
            "place": {
              "name": "环太湖骑行"
            },
            "description": "东山环湖绿道，平坦好骑，沿途有补给站",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "租车¥50/天"
              }
            ],
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
            "startTime": "14:00",
            "endTime": "15:30",
            "place": {
              "name": "太湖边"
            },
            "description": "骑行到太湖边刚好赶上日落，湖面金光铺满，找个堤坝坐下看"
          },
          {
            "text": "入住东山农家乐",
            "type": "stay",
            "startTime": "15:30",
            "endTime": "16:30",
            "place": {
              "name": "东山农家乐"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥150-300/晚"
              }
            ],
            "tips": [
              "农家乐可以讲价，非周末更便宜"
            ],
            "description": "东山农家乐含晚餐，房间朴素但干净，非周末可以讲价"
          }
        ]
      },
      {
        "photo": "photo-1587162146766-e06b1189b907",
        "activity": "东山古街+碧螺春茶园",
        "weather": {
          "icon": "⛅",
          "temp": "29°"
        },
        "steps": [
          {
            "text": "东山古街",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "东山古街"
            },
            "description": "明清老街不长但安静，早上散步看当地人生活，有几家手工艺店"
          },
          {
            "text": "碧螺春茶园",
            "type": "play",
            "startTime": "9:30",
            "endTime": "10:30",
            "place": {
              "name": "碧螺春茶园"
            },
            "description": "可以现场品茶买茶，老板会教你分辨真假碧螺春",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "品茶免费，买茶¥200起"
              }
            ]
          },
          {
            "text": "买茶手信",
            "type": "play",
            "startTime": "10:30",
            "endTime": "12:00",
            "description": "东山是碧螺春原产地，路边茶农直接买散装茶叶比市区便宜很多",
            "place": {
              "name": "东山古街"
            }
          },
          {
            "text": "自驾1h返回苏州",
            "type": "transit",
            "startTime": "12:00",
            "endTime": "13:00",
            "place": {
              "name": "苏州"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "回家",
            "type": "home",
            "startTime": "13:00",
            "endTime": "13:00"
          }
        ]
      }
    ]
  },
  {
    "id": "jingshan-tea",
    "title": "径山问茶",
    "origin": "苏州",
    "category": "weekend",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1448375240586-882707db888b",
        "activity": "径山古道徒步到茶田+径山寺",
        "weather": {
          "icon": "🌤️",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "自驾1.5h到径山",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "径山"
            },
            "description": "按导航路线前往",
            "tips": [
              "径山古道蚊子多，带驱蚊水"
            ]
          },
          {
            "text": "径山古道入口",
            "type": "play",
            "startTime": "9:30",
            "endTime": "11:15",
            "place": {
              "name": "径山古道"
            },
            "description": "全程4km，台阶路为主，蚊子多带驱蚊水，走到顶有茶田"
          },
          {
            "text": "徒步4km到茶田观景",
            "type": "play",
            "startTime": "11:15",
            "endTime": "12:45",
            "place": {
              "name": "茶田观景"
            },
            "description": "从古道顶端继续走到茶田观景台，整片梯田茶园尽收眼底，值得多停一会"
          },
          {
            "text": "径山寺禅茶",
            "type": "play",
            "startTime": "12:45",
            "endTime": "13:45",
            "place": {
              "name": "径山寺"
            },
            "description": "千年古刹，可以体验禅茶一味，寺内素面很好吃",
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
            "startTime": "13:45",
            "endTime": "14:45",
            "place": {
              "name": "山中茶宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥300-600/晚"
              }
            ],
            "tips": [
              "炒茶体验要提前一天预约",
              "山里早晚温差大，带件外套"
            ],
            "description": "径山村里的茶宿环境清幽，推窗就是竹林，早晚温差大带件外套"
          }
        ]
      },
      {
        "photo": "photo-1587162146766-e06b1189b907",
        "activity": "手工炒茶体验+竹林散步",
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "steps": [
          {
            "text": "径山村手工炒茶体验",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "炒茶体验"
            },
            "description": "跟茶农学手工炒茶，要提前一天预约",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "¥100-200/人"
              }
            ],
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
            "startTime": "9:30",
            "endTime": "11:00",
            "place": {
              "name": "竹林"
            },
            "description": "茶宿旁边就是竹林小径，散步半小时很舒服，空气里全是竹子清香"
          },
          {
            "text": "山下农家午餐",
            "type": "eat",
            "startTime": "11:00",
            "endTime": "12:00",
            "place": {
              "name": "山下农家"
            },
            "description": "山脚农家菜馆，笋干烧肉和土鸡汤是招牌，食材都是当天现摘现杀",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥40-60"
              }
            ]
          },
          {
            "text": "自驾1.5h返回苏州",
            "type": "transit",
            "startTime": "12:00",
            "endTime": "13:30",
            "place": {
              "name": "苏州"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "回家",
            "type": "home",
            "startTime": "13:30",
            "endTime": "13:30"
          }
        ]
      }
    ]
  },
  {
    "id": "nanxun-quiet",
    "title": "南浔静巷",
    "origin": "苏州",
    "category": "weekend",
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
    "relatedContent": [
      {
        "platform": "小红书",
        "icon": "📕",
        "title": "南浔，比乌镇安静十倍的江南古镇",
        "likes": "5.8w"
      }
    ],
    "days": [
      {
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "百间楼日落+张石铭故居",
        "weather": {
          "icon": "⛅",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "startTime": "14:00",
            "endTime": "14:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅"
          },
          {
            "text": "高铁40min到湖州站",
            "type": "transit",
            "startTime": "14:30",
            "endTime": "15:10",
            "place": {
              "name": "湖州站"
            },
            "description": "按导航路线前往",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "cost": "¥24",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车30min到南浔古镇",
            "type": "transit",
            "startTime": "15:10",
            "endTime": "15:40",
            "place": {
              "name": "南浔古镇"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "百间楼看日落",
            "type": "play",
            "startTime": "15:40",
            "endTime": "16:40",
            "place": {
              "name": "百间楼"
            },
            "description": "南浔最美的一段，日落6点最佳，河两岸明清建筑倒映水中",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在门票内"
              }
            ],
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
            ]
          },
          {
            "text": "张石铭故居",
            "type": "play",
            "startTime": "16:40",
            "endTime": "17:25",
            "place": {
              "name": "张石铭故居"
            },
            "description": "南浔四象之一的宅子，中西合璧建筑，细节很多值得慢看",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在门票内"
              }
            ]
          },
          {
            "text": "河边晚餐",
            "type": "eat",
            "startTime": "17:25",
            "endTime": "18:25",
            "place": {
              "name": "河边"
            },
            "description": "百间楼附近的河边餐馆，桑果鱼和双交面是南浔特色，临河座位有氛围",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥60-100"
              }
            ]
          },
          {
            "text": "入住南浔水边民宿",
            "type": "stay",
            "startTime": "18:25",
            "endTime": "19:25",
            "place": {
              "name": "南浔水边民宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-400/晚"
              }
            ],
            "description": "选百间楼附近的水边民宿，推窗就是河景，夜晚很安静"
          }
        ]
      },
      {
        "photo": "photo-1533929736458-ca588d08c8be",
        "activity": "小莲庄晨光+丝绸博物馆",
        "weather": {
          "icon": "☀️",
          "temp": "30°"
        },
        "steps": [
          {
            "text": "小莲庄晨光拍照",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "小莲庄"
            },
            "description": "刘家的私家花园，荷花池+碑廊，晨光拍照特别美",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在门票内"
              }
            ]
          },
          {
            "text": "丝绸博物馆",
            "type": "play",
            "startTime": "9:00",
            "endTime": "9:30",
            "place": {
              "name": "丝绸博物馆"
            },
            "description": "了解南浔丝绸史，周一闭馆！",
            "tips": [
              "丝绸博物馆周一闭馆"
            ]
          },
          {
            "text": "午餐",
            "type": "eat",
            "startTime": "9:30",
            "endTime": "10:30",
            "description": "古镇里的面馆吃碗双交面，浇头是酥肉+爆鱼，南浔传统早午餐",
            "place": {
              "name": "南浔古镇"
            },
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥20-40"
              }
            ]
          },
          {
            "text": "打车30min到湖州站",
            "type": "transit",
            "startTime": "10:30",
            "endTime": "11:00",
            "place": {
              "name": "湖州站"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "高铁40min返回苏州站",
            "type": "transit",
            "startTime": "11:00",
            "endTime": "11:40",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
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
            "startTime": "11:40",
            "endTime": "11:40"
          }
        ]
      }
    ]
  },
  {
    "id": "wannan-sketch-3d",
    "title": "皖南写生三日",
    "origin": "苏州",
    "category": "3day",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "宏村南湖写生+月沼夜景",
        "weather": {
          "icon": "☀️",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "startTime": "15:00",
            "endTime": "15:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅"
          },
          {
            "text": "高铁2.5h到黄山北站",
            "type": "transit",
            "startTime": "15:30",
            "endTime": "18:00",
            "place": {
              "name": "黄山北站"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "cost": "门票¥190+索道¥80",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "公交/包车到宏村",
            "type": "transit",
            "startTime": "18:00",
            "endTime": "18:30",
            "place": {
              "name": "宏村"
            },
            "description": "南湖倒映马头墙，月沼是精华。门票3日内可反复进",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥104"
              }
            ],
            "tips": [
              "宏村写生要买门票进，3日内可反复进"
            ]
          },
          {
            "text": "南湖写生",
            "type": "play",
            "startTime": "18:30",
            "endTime": "20:00",
            "place": {
              "name": "南湖"
            },
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "宏村写生三天，画了8张水彩",
                "likes": "2.7w"
              }
            ],
            "description": "南湖是宏村最经典的写生点，马头墙倒映水中，傍晚光线最柔和"
          },
          {
            "text": "月沼夜景",
            "type": "play",
            "startTime": "20:00",
            "endTime": "20:30",
            "place": {
              "name": "月沼"
            },
            "description": "宏村精华，半月形池塘倒映古建，傍晚和清晨最美",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在门票内"
              }
            ]
          },
          {
            "text": "入住宏村民宿",
            "type": "stay",
            "startTime": "20:30",
            "endTime": "20:31",
            "place": {
              "name": "宏村民宿"
            },
            "description": "南湖倒映马头墙，月沼是精华。门票3日内可反复进",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "门票¥104"
              }
            ]
          }
        ]
      },
      {
        "photo": "photo-1500382017468-9049fed747ef",
        "activity": "卢村木雕楼+塔川日落",
        "weather": {
          "icon": "⛅",
          "temp": "25°"
        },
        "steps": [
          {
            "text": "卢村木雕楼",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "卢村木雕楼"
            },
            "description": "比宏村游客少很多，木雕工艺极其精细，值得细看",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥50"
              }
            ],
            "relatedContent": [
              {
                "platform": "B站",
                "icon": "📺",
                "title": "【皖南vlog】卢村木雕楼，比宏村惊艳",
                "likes": "6.8w"
              }
            ]
          },
          {
            "text": "农家菜午餐",
            "type": "eat",
            "startTime": "9:00",
            "endTime": "10:00",
            "place": {
              "name": "农家菜"
            },
            "description": "宏村/卢村附近农家菜馆，臭鳜鱼和毛豆腐必点，正宗徽菜味道",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥40-60"
              }
            ]
          },
          {
            "text": "塔川骑行",
            "type": "play",
            "startTime": "10:00",
            "endTime": "11:30",
            "place": {
              "name": "塔川"
            },
            "description": "秋天红叶最美，夏天来看田园日落也不错",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥40"
              }
            ],
            "tips": [
              "塔川秋天最美，夏天去卢村更好"
            ]
          },
          {
            "text": "塔川看日落",
            "type": "play",
            "startTime": "11:30",
            "endTime": "13:00",
            "place": {
              "name": "塔川"
            },
            "description": "秋天红叶最美，夏天来看田园日落也不错",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥40"
              }
            ]
          },
          {
            "text": "入住塔川民宿",
            "type": "stay",
            "startTime": "13:00",
            "endTime": "14:00",
            "place": {
              "name": "塔川民宿"
            },
            "description": "秋天红叶最美，夏天来看田园日落也不错",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "门票¥40"
              }
            ]
          }
        ]
      },
      {
        "photo": "photo-1448375240586-882707db888b",
        "activity": "碧山书局+返程",
        "weather": {
          "icon": "🌤️",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "碧山书局",
            "type": "play",
            "startTime": "8:00",
            "endTime": "10:00",
            "place": {
              "name": "碧山书局"
            },
            "description": "先锋书店开在徽州古宅里，咖啡好喝，可以泡半天",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "人均¥40"
              }
            ],
            "tips": [
              "碧山书局咖啡很好喝"
            ]
          },
          {
            "text": "午餐",
            "type": "eat",
            "startTime": "10:00",
            "endTime": "11:00",
            "description": "碧山村附近的农家菜馆，笋干烧肉、徽州炒面都不错",
            "place": {
              "name": "碧山村"
            },
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥30-50"
              }
            ]
          },
          {
            "text": "包车到黄山北站",
            "type": "transit",
            "startTime": "11:00",
            "endTime": "11:30",
            "place": {
              "name": "黄山北站"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥190+索道¥80"
              }
            ]
          },
          {
            "text": "高铁2.5h返回苏州站",
            "type": "transit",
            "startTime": "11:30",
            "endTime": "14:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
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
            "startTime": "14:00",
            "endTime": "14:00"
          }
        ]
      }
    ]
  },
  {
    "id": "qiandaohu-cycling-3d",
    "title": "千岛湖骑行+萤火虫",
    "origin": "苏州",
    "category": "3day",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1534787238916-9ba6764efd4f",
        "activity": "环湖绿道北线30km",
        "weather": {
          "icon": "☀️",
          "temp": "30°"
        },
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "startTime": "8:00",
            "endTime": "8:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅"
          },
          {
            "text": "高铁2h到千岛湖站",
            "type": "transit",
            "startTime": "8:30",
            "endTime": "10:30",
            "place": {
              "name": "千岛湖站"
            },
            "description": "环湖绿道分南北线，北线30km较平坦适合休闲骑",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "cost": "¥65",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "租自行车",
            "type": "transit",
            "startTime": "10:30",
            "endTime": "11:00",
            "place": {
              "name": "租自行车"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "环湖绿道北线骑行30km",
            "type": "play",
            "startTime": "11:00",
            "endTime": "12:30",
            "place": {
              "name": "环湖绿道北线"
            },
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
            ],
            "description": "北线30km较平坦适合休闲骑，沿途湖景不断，有多个观景台可以停下拍照"
          },
          {
            "text": "湖景晚餐",
            "type": "eat",
            "startTime": "12:30",
            "endTime": "13:30",
            "place": {
              "name": "湖景"
            },
            "description": "千岛湖鱼头是必吃招牌，湖边餐厅看着湖景吃，新鲜现杀",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥80-120"
              }
            ]
          },
          {
            "text": "入住湖景酒店",
            "type": "stay",
            "startTime": "13:30",
            "endTime": "14:30",
            "place": {
              "name": "湖景酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥300-600/晚"
              }
            ],
            "description": "选湖景房能直接看到千岛湖，提前1周订周末房，旺季涨价明显"
          }
        ]
      },
      {
        "photo": "photo-1448375240586-882707db888b",
        "activity": "芹川古村+晚上看萤火虫!",
        "weather": {
          "icon": "🌤️",
          "temp": "28°"
        },
        "steps": [
          {
            "text": "芹川古村",
            "type": "play",
            "startTime": "8:00",
            "endTime": "10:30",
            "place": {
              "name": "芹川古村"
            },
            "description": "不要门票！600年古村，溪水穿村而过，晚上有萤火虫",
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
            "startTime": "10:30",
            "endTime": "11:30",
            "place": {
              "name": "溪边"
            },
            "description": "芹川古村溪边的农家菜馆，溪鱼和土鸡煲味道好，环境也舒服",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥40-60"
              }
            ]
          },
          {
            "text": "下午休整",
            "type": "play",
            "startTime": "11:30",
            "endTime": "20:00",
            "place": {
              "name": "下午"
            },
            "description": "回酒店午休或在古村溪边发呆，为晚上看萤火虫养精蓄锐"
          },
          {
            "text": "晚上看萤火虫",
            "type": "play",
            "startTime": "20:00",
            "endTime": "21:00",
            "place": {
              "name": "萤火虫"
            },
            "description": "远离路灯的地方效果最好，6-8月晚上8点后出现，别开闪光灯",
            "tips": [
              "6-8月限定!",
              "萤火虫7月最多，远离路灯的地方看"
            ]
          },
          {
            "text": "回酒店",
            "type": "transit",
            "startTime": "21:00",
            "endTime": "21:30",
            "place": {
              "name": "酒店"
            },
            "description": "按导航路线前往"
          }
        ]
      },
      {
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "南线骑行20km+返程",
        "weather": {
          "icon": "☀️",
          "temp": "31°"
        },
        "steps": [
          {
            "text": "南线骑行20km",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "南线"
            },
            "description": "南线20km坡多一些但风景更野，途经几个安静的湖湾，人比北线少"
          },
          {
            "text": "午餐千岛湖鱼头",
            "type": "eat",
            "startTime": "9:30",
            "endTime": "10:30",
            "description": "环湖绿道分南北线，北线30km较平坦适合休闲骑",
            "place": {
              "name": "千岛湖镇"
            },
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥80-120"
              }
            ]
          },
          {
            "text": "还车",
            "type": "transit",
            "startTime": "10:30",
            "endTime": "11:00",
            "description": "按导航路线前往",
            "place": {
              "name": "千岛湖站"
            }
          },
          {
            "text": "千岛湖站高铁2h返回苏州站",
            "type": "transit",
            "startTime": "11:00",
            "endTime": "13:00",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
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
            "startTime": "13:00",
            "endTime": "13:00"
          }
        ]
      }
    ]
  },
  {
    "id": "zhemin-shanhai-7d",
    "title": "浙闽山海七日",
    "origin": "苏州",
    "category": "week",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "杭州→丽水 古堰画乡",
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "startTime": "8:00",
            "endTime": "8:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅"
          },
          {
            "text": "高铁2.5h到丽水站",
            "type": "transit",
            "startTime": "8:30",
            "endTime": "11:00",
            "place": {
              "name": "丽水站"
            },
            "description": "按导航路线前往",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "cost": "¥120",
                "url": "https://www.12306.cn"
              }
            ]
          },
          {
            "text": "打车到古堰画乡",
            "type": "transit",
            "startTime": "11:00",
            "endTime": "11:30",
            "place": {
              "name": "古堰画乡"
            },
            "description": "瓯江边的画家村，油画写生+古樟树群，下午光线最美",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥50"
              }
            ]
          },
          {
            "text": "古堰画乡游览",
            "type": "play",
            "startTime": "11:30",
            "endTime": "14:00",
            "place": {
              "name": "古堰画乡"
            },
            "description": "瓯江边的画家村，油画写生+古樟树群，下午光线最美",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥50"
              }
            ]
          },
          {
            "text": "入住丽水酒店",
            "type": "stay",
            "startTime": "14:00",
            "endTime": "15:00",
            "place": {
              "name": "丽水酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-350/晚"
              }
            ],
            "tips": [
              "浙闽沿线加油站少，提前加满"
            ],
            "description": "丽水市区商务酒店即可，干净便宜，第二天早起方便出发"
          }
        ]
      },
      {
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "缙云仙都 鼎湖峰",
        "weather": {
          "icon": "🌤️",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "缙云仙都景区",
            "type": "play",
            "startTime": "8:00",
            "endTime": "12:30",
            "place": {
              "name": "缙云仙都"
            },
            "description": "鼎湖峰是精华，朱潭山倒影绝美，花1天慢慢逛",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥100"
              }
            ]
          },
          {
            "text": "午餐",
            "type": "eat",
            "startTime": "12:30",
            "endTime": "13:30",
            "description": "缙云烧饼是当地名片，梅干菜肉馅酥脆焦香，配一碗馄饨绝了",
            "place": {
              "name": "缙云仙都"
            },
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥20-40"
              }
            ]
          },
          {
            "text": "入住缙云酒店",
            "type": "stay",
            "startTime": "13:30",
            "endTime": "14:30",
            "place": {
              "name": "缙云酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥150-300/晚"
              }
            ],
            "description": "缙云县城商务酒店，干净实惠，靠近仙都景区方便第二天出发"
          }
        ]
      },
      {
        "photo": "photo-1507525428034-b723cf961d3e",
        "activity": "丽水→霞浦",
        "weather": {
          "icon": "⛅",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "租车/自驾3h到霞浦",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "11:00",
            "place": {
              "name": "霞浦"
            },
            "description": "按导航路线前往",
            "bookings": [
              {
                "type": "car",
                "label": "租车"
              }
            ],
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
            ]
          },
          {
            "text": "入住霞浦民宿",
            "type": "stay",
            "startTime": "11:00",
            "endTime": "12:00",
            "place": {
              "name": "霞浦民宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥150-300/晚"
              }
            ],
            "description": "选靠近北岐滩涂的民宿，方便凌晨4点出发拍日出，老板一般能帮叫车"
          }
        ]
      },
      {
        "photo": "photo-1470252649378-9c29740c9fa8",
        "activity": "霞浦滩涂日出(4:30起!)",
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "steps": [
          {
            "text": "霞浦滩涂日出点",
            "type": "play",
            "startTime": "4:30",
            "endTime": "6:30",
            "place": {
              "name": "霞浦滩涂"
            },
            "description": "4:30日出点，小皓/北岐/花竹是三大经典机位，去晚了光线不对",
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
            "startTime": "6:30",
            "endTime": "8:00",
            "place": {
              "name": "上午"
            },
            "description": "4点半起太早了，回民宿补个觉，养精蓄锐下午看日落"
          },
          {
            "text": "东壁日落",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "东壁"
            },
            "description": "霞浦看日落的经典点，紫菜架剪影特别出片"
          },
          {
            "text": "回民宿",
            "type": "transit",
            "startTime": "9:30",
            "endTime": "10:00",
            "place": {
              "name": "民宿"
            },
            "description": "按导航路线前往"
          }
        ]
      },
      {
        "photo": "photo-1587162146766-e06b1189b907",
        "activity": "福鼎白茶山",
        "weather": {
          "icon": "☀️",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "自驾1h到福鼎",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "福鼎"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "福鼎白茶山",
            "type": "play",
            "startTime": "9:00",
            "endTime": "13:00",
            "place": {
              "name": "福鼎白茶山"
            },
            "description": "太姥山脚的茶村，可以现场品白茶买茶饼",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "品茶免费"
              }
            ]
          },
          {
            "text": "入住福鼎酒店",
            "type": "stay",
            "startTime": "13:00",
            "endTime": "14:00",
            "place": {
              "name": "福鼎酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥150-300/晚"
              }
            ],
            "description": "福鼎市区酒店，干净便宜，离太姥山约30min车程"
          }
        ]
      },
      {
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "太姥山全天",
        "weather": {
          "icon": "🌤️",
          "temp": "25°"
        },
        "steps": [
          {
            "text": "自驾30min到太姥山景区",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:30",
            "place": {
              "name": "太姥山景区"
            },
            "description": "花岗岩峰林地貌，爬全程要5h，量力而行",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥130"
              }
            ],
            "tips": [
              "太姥山爬全程要5小时，量力而行"
            ]
          },
          {
            "text": "太姥山全天",
            "type": "play",
            "startTime": "8:30",
            "endTime": "13:30",
            "place": {
              "name": "太姥山"
            },
            "description": "花岗岩峰林地貌，爬全程要5h，量力而行",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥130"
              }
            ]
          },
          {
            "text": "入住太姥山附近",
            "type": "stay",
            "startTime": "13:30",
            "endTime": "18:30",
            "place": {
              "name": "太姥山附近"
            },
            "description": "花岗岩峰林地貌，爬全程要5h，量力而行",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "门票¥130"
              }
            ]
          }
        ]
      },
      {
        "photo": "photo-1507525428034-b723cf961d3e",
        "activity": "返程",
        "weather": {
          "icon": "⛅",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "自驾到福鼎站",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:30",
            "place": {
              "name": "福鼎站"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "还车",
            "type": "transit",
            "startTime": "8:30",
            "endTime": "9:00",
            "description": "按导航路线前往",
            "place": {
              "name": "福鼎站"
            }
          },
          {
            "text": "高铁返回苏州",
            "type": "transit",
            "startTime": "9:00",
            "endTime": "9:30",
            "place": {
              "name": "苏州"
            },
            "description": "按导航路线前往",
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
            "startTime": "9:30",
            "endTime": "9:30"
          }
        ]
      }
    ]
  },
  {
    "id": "jiangnan-watertown-5d",
    "title": "江南水乡慢收集",
    "origin": "苏州",
    "category": "5day",
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
    "relatedContent": [
      {
        "platform": "小红书",
        "icon": "📕",
        "title": "五个古镇对比测评，最喜欢南浔",
        "likes": "8.1w"
      }
    ],
    "days": [
      {
        "photo": "photo-1528164344705-47542687000d",
        "activity": "周庄 双桥+沈厅",
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "steps": [
          {
            "text": "自驾/打车40min到周庄古镇",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:40",
            "place": {
              "name": "周庄古镇"
            },
            "description": "最经典也最商业的水乡，双桥+沈厅是必看，清晨人少",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥100"
              }
            ],
            "tips": [
              "联票比单买划算，提前网上订",
              "周庄双桥清晨没人，适合拍照"
            ]
          },
          {
            "text": "双桥",
            "type": "play",
            "startTime": "8:40",
            "endTime": "10:10",
            "place": {
              "name": "双桥"
            },
            "description": "周庄标志性景点，世德桥和永安桥呈十字相连，陈逸飞画作原型"
          },
          {
            "text": "沈厅",
            "type": "play",
            "startTime": "10:10",
            "endTime": "11:40",
            "place": {
              "name": "沈厅"
            },
            "description": "沈万三故居，江南首富的宅子，里面展示明代商贾文化和万三蹄做法"
          },
          {
            "text": "入住周庄客栈",
            "type": "stay",
            "startTime": "11:40",
            "endTime": "14:40",
            "place": {
              "name": "周庄客栈"
            },
            "description": "最经典也最商业的水乡，双桥+沈厅是必看，清晨人少",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "门票¥100"
              }
            ]
          }
        ]
      },
      {
        "photo": "photo-1533929736458-ca588d08c8be",
        "activity": "同里 退思园+走三桥",
        "weather": {
          "icon": "🌤️",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "打车30min到同里古镇",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:30",
            "place": {
              "name": "同里古镇"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "退思园",
            "type": "play",
            "startTime": "8:30",
            "endTime": "9:30",
            "place": {
              "name": "退思园"
            },
            "description": "同里最精华的园林，贴水而建，早上9点前人少",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在联票内"
              }
            ]
          },
          {
            "text": "走三桥",
            "type": "play",
            "startTime": "9:30",
            "endTime": "10:00",
            "place": {
              "name": "三桥"
            },
            "description": "太平桥、吉利桥、长庆桥连在一起，走完在河边坐坐"
          },
          {
            "text": "入住同里客栈",
            "type": "stay",
            "startTime": "10:00",
            "endTime": "11:00",
            "place": {
              "name": "同里客栈"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-400/晚"
              }
            ],
            "description": "同里古镇内的河边客栈，推窗看小桥流水，晚上很安静"
          }
        ]
      },
      {
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "南浔 百间楼+小莲庄",
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "steps": [
          {
            "text": "打车1h到南浔古镇",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "南浔古镇"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "百间楼",
            "type": "play",
            "startTime": "9:00",
            "endTime": "10:00",
            "place": {
              "name": "百间楼"
            },
            "description": "南浔最美的一段，日落6点最佳，河两岸明清建筑倒映水中",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在门票内"
              }
            ]
          },
          {
            "text": "小莲庄",
            "type": "play",
            "startTime": "10:00",
            "endTime": "11:00",
            "place": {
              "name": "小莲庄"
            },
            "description": "刘家的私家花园，荷花池+碑廊，晨光拍照特别美",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在门票内"
              }
            ]
          },
          {
            "text": "入住南浔民宿",
            "type": "stay",
            "startTime": "11:00",
            "endTime": "12:00",
            "place": {
              "name": "南浔民宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-350/晚"
              }
            ],
            "description": "百间楼附近的水边民宿，南浔游客少住着舒服，性价比高"
          }
        ]
      },
      {
        "photo": "photo-1470004914212-05527e49370b",
        "activity": "乌镇西栅 夜景绝杀",
        "weather": {
          "icon": "⛅",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "打车40min到乌镇西栅",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:40",
            "place": {
              "name": "乌镇西栅"
            },
            "description": "夜景全网公认最美，8点以后灯光全开，建议住里面",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥150"
              }
            ],
            "tips": [
              "乌镇西栅夜景8点后最美"
            ]
          },
          {
            "text": "西栅游览",
            "type": "play",
            "startTime": "8:40",
            "endTime": "20:00",
            "place": {
              "name": "西栅"
            },
            "description": "西栅比东栅大很多，可以慢慢逛一整天，染坊、酒坊、邮局都值得看"
          },
          {
            "text": "夜景",
            "type": "play",
            "startTime": "20:00",
            "endTime": "21:30",
            "place": {
              "name": "夜景"
            },
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
            ],
            "description": "西栅夜景是乌镇精华，8点后灯光全开，水面倒影像油画一样"
          },
          {
            "text": "入住乌镇民宿",
            "type": "stay",
            "startTime": "21:30",
            "endTime": "22:30",
            "place": {
              "name": "乌镇民宿"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥400-800/晚"
              }
            ],
            "description": "住在西栅景区里面体验最好，夜游不用二次买票，早起看空巷"
          }
        ]
      },
      {
        "photo": "photo-1528164344705-47542687000d",
        "activity": "西塘 烟雨长廊+清晨",
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "steps": [
          {
            "text": "打车50min到西塘古镇",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:50",
            "place": {
              "name": "西塘古镇"
            },
            "description": "下午5点后入场免门票！晚上人少是精华，清晨6点前拍照最佳",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "白天门票¥100"
              }
            ]
          },
          {
            "text": "烟雨长廊",
            "type": "play",
            "startTime": "8:50",
            "endTime": "9:20",
            "place": {
              "name": "烟雨长廊"
            },
            "description": "全长1km，廊下看河最有感觉，清晨没人时候拍照绝了"
          },
          {
            "text": "午餐",
            "type": "eat",
            "startTime": "9:20",
            "endTime": "10:20",
            "description": "西塘古镇里的面馆或小餐馆，馄饨和荷叶粉蒸肉是特色",
            "place": {
              "name": "西塘古镇"
            },
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥30-60"
              }
            ]
          },
          {
            "text": "打车50min返回苏州",
            "type": "transit",
            "startTime": "10:20",
            "endTime": "11:10",
            "place": {
              "name": "苏州"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "回家",
            "type": "home",
            "startTime": "11:10",
            "endTime": "11:10"
          }
        ]
      }
    ]
  },
  {
    "id": "huizhou-deep-7d",
    "title": "徽州深度一周",
    "origin": "苏州",
    "category": "week",
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
    "relatedContent": [
      {
        "platform": "B站",
        "icon": "📺",
        "title": "【徽州7日】粉墙黛瓦水墨画",
        "likes": "18w"
      }
    ],
    "days": [
      {
        "photo": "photo-1533929736458-ca588d08c8be",
        "activity": "屯溪老街夜游",
        "weather": {
          "icon": "☀️",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "startTime": "15:00",
            "endTime": "15:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅"
          },
          {
            "text": "高铁2.5h到黄山北站",
            "type": "transit",
            "startTime": "15:30",
            "endTime": "18:00",
            "place": {
              "name": "黄山北站"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "cost": "门票¥190+索道¥80",
                "url": "https://www.12306.cn"
              }
            ],
            "tips": [
              "黄山山顶住宿要提前1个月订"
            ]
          },
          {
            "text": "打车到屯溪老街",
            "type": "transit",
            "startTime": "18:00",
            "endTime": "19:00",
            "place": {
              "name": "屯溪老街"
            },
            "description": "徽州最热闹的老街，夜游最有氛围，各种徽州小吃",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "免费逛"
              }
            ]
          },
          {
            "text": "屯溪老街夜游",
            "type": "play",
            "startTime": "19:00",
            "endTime": "21:00",
            "place": {
              "name": "屯溪老街"
            },
            "description": "徽州最热闹的老街，夜游最有氛围，各种徽州小吃",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "免费逛"
              }
            ]
          },
          {
            "text": "入住屯溪酒店",
            "type": "stay",
            "startTime": "21:00",
            "endTime": "22:00",
            "place": {
              "name": "屯溪酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-400/晚"
              }
            ],
            "description": "屯溪老街附近的酒店，走路能到老街吃宵夜，方便第二天出发"
          }
        ]
      },
      {
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "黄山全天(住山顶!)",
        "weather": {
          "icon": "☀️",
          "temp": "18°"
        },
        "steps": [
          {
            "text": "打车到黄山南大门/北大门",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:30",
            "place": {
              "name": "黄山南大门/北大门"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥190+索道¥80"
              }
            ]
          },
          {
            "text": "索道上山",
            "type": "transit",
            "startTime": "8:30",
            "endTime": "9:00",
            "place": {
              "name": "索道"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "黄山全天",
            "type": "play",
            "startTime": "9:00",
            "endTime": "8:00",
            "place": {
              "name": "黄山"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥190+索道¥80"
              }
            ],
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
            ]
          },
          {
            "text": "住山顶看日出!",
            "type": "stay",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "黄山山顶"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥500-1200/晚"
              }
            ],
            "description": "山顶住宿条件一般但为了看日出值得，白云宾馆或排云楼宾馆提前1个月订"
          }
        ]
      },
      {
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "下山→西递古村",
        "weather": {
          "icon": "🌤️",
          "temp": "25°"
        },
        "steps": [
          {
            "text": "下山",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:30",
            "description": "按导航路线前往",
            "place": {
              "name": "黄山"
            }
          },
          {
            "text": "打车到西递古村",
            "type": "transit",
            "startTime": "8:30",
            "endTime": "9:00",
            "place": {
              "name": "西递古村"
            },
            "description": "比宏村人少很多更安静，胡文光牌坊和敬爱堂是精华",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥94"
              }
            ],
            "tips": [
              "西递比宏村人少很多，更安静"
            ]
          },
          {
            "text": "西递游览",
            "type": "play",
            "startTime": "9:00",
            "endTime": "11:30",
            "place": {
              "name": "西递"
            },
            "description": "比宏村人少很多更安静，胡文光牌坊和敬爱堂是精华",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥94"
              }
            ]
          },
          {
            "text": "入住西递民宿",
            "type": "stay",
            "startTime": "11:30",
            "endTime": "13:30",
            "place": {
              "name": "西递民宿"
            },
            "description": "比宏村人少很多更安静，胡文光牌坊和敬爱堂是精华",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "门票¥94"
              }
            ]
          }
        ]
      },
      {
        "photo": "photo-1500382017468-9049fed747ef",
        "activity": "宏村 南湖+月沼",
        "weather": {
          "icon": "☀️",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "打车15min到宏村",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:15",
            "place": {
              "name": "宏村"
            },
            "description": "南湖倒映马头墙，月沼是精华。门票3日内可反复进",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥104"
              }
            ]
          },
          {
            "text": "南湖",
            "type": "play",
            "startTime": "8:15",
            "endTime": "9:45",
            "place": {
              "name": "南湖"
            },
            "description": "宏村南湖是最经典的写生点，马头墙倒映水中如水墨画，清晨最美"
          },
          {
            "text": "月沼",
            "type": "play",
            "startTime": "9:45",
            "endTime": "10:15",
            "place": {
              "name": "月沼"
            },
            "description": "宏村精华，半月形池塘倒映古建，傍晚和清晨最美",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在门票内"
              }
            ]
          },
          {
            "text": "写生",
            "type": "play",
            "startTime": "10:15",
            "endTime": "11:45",
            "description": "找个安静角落支起画架，月沼和南湖都是好位置，下午光线柔和",
            "place": {
              "name": "宏村"
            }
          },
          {
            "text": "入住宏村民宿",
            "type": "stay",
            "startTime": "11:45",
            "endTime": "11:46",
            "place": {
              "name": "宏村民宿"
            },
            "description": "南湖倒映马头墙，月沼是精华。门票3日内可反复进",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "门票¥104"
              }
            ]
          }
        ]
      },
      {
        "photo": "photo-1551524559-8af4e6624178",
        "activity": "呈坎八卦村+唐模",
        "weather": {
          "icon": "⛅",
          "temp": "24°"
        },
        "steps": [
          {
            "text": "打车40min到呈坎",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:40",
            "place": {
              "name": "呈坎"
            },
            "description": "八卦布局古村，罗东舒祠是全国重点文保",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥107"
              }
            ]
          },
          {
            "text": "呈坎八卦村",
            "type": "play",
            "startTime": "8:40",
            "endTime": "10:40",
            "place": {
              "name": "呈坎"
            },
            "description": "八卦布局古村，罗东舒祠是全国重点文保",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥107"
              }
            ]
          },
          {
            "text": "唐模",
            "type": "play",
            "startTime": "10:40",
            "endTime": "12:10",
            "place": {
              "name": "唐模"
            },
            "description": "徽州古村，檀干园是精华，比呈坎人少很多，水口园林值得细看"
          },
          {
            "text": "入住呈坎附近",
            "type": "stay",
            "startTime": "12:10",
            "endTime": "14:10",
            "place": {
              "name": "呈坎附近"
            },
            "description": "八卦布局古村，罗东舒祠是全国重点文保",
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "门票¥107"
              }
            ]
          }
        ]
      },
      {
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "新安江山水画廊游船",
        "weather": {
          "icon": "☀️",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "打车1h到新安江码头",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "新安江码头"
            },
            "description": "山水画廊游船约3h，两岸徽派村落+油菜花田",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "游船¥128"
              }
            ]
          },
          {
            "text": "新安江山水画廊游船",
            "type": "play",
            "startTime": "9:00",
            "endTime": "12:00",
            "place": {
              "name": "新安江"
            },
            "description": "山水画廊游船约3h，两岸徽派村落+油菜花田",
            "bookings": [
              {
                "type": "boat",
                "label": "查船票",
                "cost": "游船¥128"
              }
            ]
          },
          {
            "text": "入住屯溪",
            "type": "stay",
            "startTime": "12:00",
            "endTime": "13:00",
            "place": {
              "name": "屯溪"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-400/晚"
              }
            ],
            "description": "回屯溪住方便最后一天采购和赶火车，选老街附近的酒店"
          }
        ]
      },
      {
        "photo": "photo-1533929736458-ca588d08c8be",
        "activity": "屯溪采购+返程",
        "weather": {
          "icon": "🌤️",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "屯溪采购伴手礼",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "屯溪"
            },
            "description": "屯溪老街买黄山毛峰、徽墨、歙砚等伴手礼，认准老字号店铺"
          },
          {
            "text": "打车到黄山北站",
            "type": "transit",
            "startTime": "9:30",
            "endTime": "10:00",
            "place": {
              "name": "黄山北站"
            },
            "description": "建议云谷寺索道上，前山下。山顶住宿提前1个月订",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥190+索道¥80"
              }
            ]
          },
          {
            "text": "高铁2.5h返回苏州站",
            "type": "transit",
            "startTime": "10:00",
            "endTime": "12:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅",
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
            "startTime": "12:30",
            "endTime": "12:30"
          }
        ]
      }
    ]
  },
  {
    "id": "tongli-halfday",
    "title": "同里古镇半日闲",
    "origin": "苏州",
    "category": "tomorrow",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1528164344705-47542687000d",
        "activity": "退思园+走三桥+状元蹄",
        "weather": {
          "icon": "☀️",
          "temp": "32°"
        },
        "steps": [
          {
            "text": "自驾40min到同里古镇",
            "type": "transit",
            "startTime": "9:00",
            "endTime": "9:40",
            "place": {
              "name": "同里古镇"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "退思园",
            "type": "play",
            "startTime": "9:40",
            "endTime": "10:40",
            "place": {
              "name": "退思园"
            },
            "description": "同里最精华的园林，贴水而建，早上9点前人少",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "含在联票内"
              }
            ],
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
            "startTime": "10:40",
            "endTime": "11:10",
            "place": {
              "name": "三桥"
            },
            "description": "太平桥、吉利桥、长庆桥连在一起，走完在河边坐坐",
            "tips": [
              "三桥走完可以在河边坐坐"
            ]
          },
          {
            "text": "穿堂街买芡实糕",
            "type": "play",
            "startTime": "11:10",
            "endTime": "12:40",
            "place": {
              "name": "穿堂街"
            },
            "description": "穿堂街是古镇小吃一条街，芡实糕软糯不粘牙，袁氏最出名"
          },
          {
            "text": "明清街午餐",
            "type": "eat",
            "startTime": "12:40",
            "endTime": "13:40",
            "place": {
              "name": "明清街"
            },
            "tips": [
              "状元蹄必吃",
              "状元蹄认准古镇入口第一家"
            ],
            "description": "状元蹄必吃，酱香软烂入味，¥25/只，认准古镇入口第一家",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥30-50"
              }
            ]
          },
          {
            "text": "罗星洲坐船",
            "type": "play",
            "startTime": "13:40",
            "endTime": "14:40",
            "place": {
              "name": "罗星洲"
            },
            "description": "湖中小岛，坐船过去，人少安静",
            "bookings": [
              {
                "type": "boat",
                "label": "查船票",
                "cost": "船票¥5"
              }
            ]
          },
          {
            "text": "日落",
            "type": "play",
            "startTime": "14:40",
            "endTime": "16:10",
            "place": {
              "name": "日落"
            },
            "description": "找个三桥附近的茶座坐下来看日落，河面金光配古桥剪影特别美"
          },
          {
            "text": "自驾40min返回苏州",
            "type": "transit",
            "startTime": "16:10",
            "endTime": "16:50",
            "place": {
              "name": "苏州"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "回家",
            "type": "home",
            "startTime": "16:50",
            "endTime": "16:50"
          }
        ]
      }
    ]
  },
  {
    "id": "lingyanshan-hike",
    "title": "灵岩山徒步",
    "origin": "苏州",
    "category": "tomorrow",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "灵岩山步道+山顶寺+木渎午餐",
        "weather": {
          "icon": "⛅",
          "temp": "30°"
        },
        "steps": [
          {
            "text": "地铁1号线到木渎站",
            "type": "transit",
            "startTime": "9:00",
            "endTime": "9:30",
            "place": {
              "name": "木渎站"
            },
            "description": "按导航路线前往",
            "tips": [
              "下山后木渎的鲃肺汤是一绝"
            ]
          },
          {
            "text": "公交15min到灵岩山",
            "type": "transit",
            "startTime": "9:30",
            "endTime": "9:45",
            "place": {
              "name": "灵岩山"
            },
            "description": "北坡好走南坡陡，山不高45min登顶，山顶看太湖全景",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "免门票"
              }
            ],
            "tips": [
              "灵岩山北坡路好走，南坡陡"
            ]
          },
          {
            "text": "灵岩山步道登山",
            "type": "play",
            "startTime": "9:45",
            "endTime": "10:30",
            "place": {
              "name": "灵岩山"
            },
            "description": "北坡好走南坡陡，山不高45min登顶，山顶看太湖全景",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "免门票"
              }
            ],
            "relatedContent": [
              {
                "platform": "小红书",
                "icon": "📕",
                "title": "苏州人周末爬灵岩山，不要门票",
                "likes": "2.4w"
              }
            ]
          },
          {
            "text": "灵岩寺",
            "type": "play",
            "startTime": "10:30",
            "endTime": "11:00",
            "place": {
              "name": "灵岩寺"
            },
            "description": "山顶千年古刹，免费参观，香火随缘",
            "tips": [
              "山顶灵岩寺免费，香火自愿"
            ]
          },
          {
            "text": "山顶俯瞰太湖",
            "type": "play",
            "startTime": "11:00",
            "endTime": "12:30",
            "place": {
              "name": "山顶俯瞰太湖"
            },
            "description": "山顶有观景平台可以俯瞰太湖和木渎全景，天气好能看到对面的光福"
          },
          {
            "text": "下山",
            "type": "transit",
            "startTime": "12:30",
            "endTime": "13:00",
            "description": "按导航路线前往",
            "place": {
              "name": "灵岩山"
            }
          },
          {
            "text": "木渎古镇午餐",
            "type": "eat",
            "startTime": "13:00",
            "endTime": "15:00",
            "place": {
              "name": "木渎古镇"
            },
            "description": "严家花园+虹饮山房值得看，鲃肺汤是当地一绝",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "联票¥60"
              }
            ]
          },
          {
            "text": "严家花园",
            "type": "play",
            "startTime": "15:00",
            "endTime": "16:30",
            "place": {
              "name": "严家花园"
            },
            "description": "苏州四大园林之一，布局精巧层次丰富，春天紫藤花开的时候最美"
          },
          {
            "text": "地铁返回苏州",
            "type": "transit",
            "startTime": "16:30",
            "endTime": "17:00",
            "place": {
              "name": "苏州"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "回家",
            "type": "home",
            "startTime": "17:00",
            "endTime": "17:00"
          }
        ]
      }
    ]
  },
  {
    "id": "yangchenghu-cycling",
    "title": "阳澄湖骑行",
    "origin": "苏州",
    "category": "tomorrow",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "环湖骑行20km+莲花岛+日落",
        "weather": {
          "icon": "☀️",
          "temp": "33°"
        },
        "steps": [
          {
            "text": "自驾30min到阳澄湖骑行驿站",
            "type": "transit",
            "startTime": "9:00",
            "endTime": "9:30",
            "place": {
              "name": "阳澄湖骑行驿站"
            },
            "description": "租车¥50/天，非蟹季人很少骑行超舒服",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "租车¥50"
              }
            ],
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
            "startTime": "9:30",
            "endTime": "10:00",
            "description": "按导航路线前往",
            "bookings": [
              {
                "type": "car",
                "label": "租车"
              }
            ],
            "place": {
              "name": "阳澄湖骑行驿站"
            }
          },
          {
            "text": "环湖骑行绿道20km",
            "type": "play",
            "startTime": "10:00",
            "endTime": "11:30",
            "place": {
              "name": "环湖"
            },
            "description": "环湖绿道平坦宽敞，非蟹季几乎没人，一路湖景开阔心情好"
          },
          {
            "text": "美人腿半岛",
            "type": "play",
            "startTime": "11:30",
            "endTime": "12:30",
            "place": {
              "name": "美人腿半岛"
            },
            "description": "阳澄湖伸出的半岛，骑到尽头看湖景"
          },
          {
            "text": "莲花岛码头坐船上岛",
            "type": "play",
            "startTime": "12:30",
            "endTime": "14:30",
            "place": {
              "name": "莲花岛"
            },
            "description": "码头坐船上岛，末班船5点别错过！傍晚蚊子多带驱蚊",
            "bookings": [
              {
                "type": "boat",
                "label": "查船票",
                "cost": "船票¥20"
              }
            ],
            "tips": [
              "莲花岛末班船5点，别错过",
              "傍晚6点湖边蚊子多，带驱蚊"
            ]
          },
          {
            "text": "湖边咖啡馆",
            "type": "eat",
            "startTime": "14:30",
            "endTime": "15:30",
            "place": {
              "name": "湖边咖啡馆"
            },
            "description": "湖边文艺咖啡馆，坐露台看湖景喝下午茶，骑行后歇歇脚",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥30-50"
              }
            ]
          },
          {
            "text": "看日落",
            "type": "play",
            "startTime": "15:30",
            "endTime": "17:00",
            "description": "骑到湖边开阔处找个好位置等日落，阳澄湖日落湖面金黄很出片",
            "place": {
              "name": "阳澄湖"
            }
          },
          {
            "text": "自驾30min返回苏州",
            "type": "transit",
            "startTime": "17:00",
            "endTime": "17:30",
            "place": {
              "name": "苏州"
            },
            "description": "按导航路线前往"
          },
          {
            "text": "回家",
            "type": "home",
            "startTime": "17:30",
            "endTime": "17:30"
          }
        ]
      }
    ]
  },
  {
    "id": "zhenan-shanshui-5d",
    "title": "浙南山水5日",
    "origin": "苏州",
    "category": "5day",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "杭州→建德 新安江夜游",
        "weather": {
          "icon": "☀️",
          "temp": "28°"
        },
        "steps": [
          {
            "text": "出发去苏州站",
            "type": "depart",
            "startTime": "15:00",
            "endTime": "15:30",
            "place": {
              "name": "苏州站"
            },
            "description": "建议提前30min到站，自助取票机在2楼大厅"
          },
          {
            "text": "高铁25min到杭州站",
            "type": "transit",
            "startTime": "15:30",
            "endTime": "15:55",
            "place": {
              "name": "杭州站"
            },
            "description": "按导航路线前往",
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
            "startTime": "15:55",
            "endTime": "16:35",
            "place": {
              "name": "建德站"
            },
            "description": "按导航路线前往",
            "bookings": [
              {
                "type": "train",
                "label": "查高铁票",
                "url": "https://www.12306.cn"
              }
            ],
            "tips": [
              "建德草莓季12-3月，夏天去看荷花"
            ]
          },
          {
            "text": "打车到新安江",
            "type": "transit",
            "startTime": "16:35",
            "endTime": "19:00",
            "place": {
              "name": "新安江"
            },
            "description": "山水画廊游船约3h，两岸徽派村落+油菜花田",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "游船¥128"
              }
            ]
          },
          {
            "text": "新安江夜游",
            "type": "play",
            "startTime": "19:00",
            "endTime": "22:00",
            "place": {
              "name": "新安江"
            },
            "description": "山水画廊游船约3h，两岸徽派村落+油菜花田",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "游船¥128"
              }
            ]
          },
          {
            "text": "入住建德酒店",
            "type": "stay",
            "startTime": "22:00",
            "endTime": "23:00",
            "place": {
              "name": "建德酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-350/晚"
              }
            ],
            "description": "建德市区酒店，干净实惠，离新安江近方便夜游"
          }
        ]
      },
      {
        "photo": "photo-1470252649378-9c29740c9fa8",
        "activity": "大慈岩+下涯湿地晨雾",
        "weather": {
          "icon": "☀️",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "打车到大慈岩景区",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "8:30",
            "place": {
              "name": "大慈岩景区"
            },
            "description": "悬崖上的寺庙，半山腰俯瞰田园，惊险但好看",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥65"
              }
            ]
          },
          {
            "text": "大慈岩",
            "type": "play",
            "startTime": "8:30",
            "endTime": "8:00",
            "place": {
              "name": "大慈岩"
            },
            "description": "悬崖上的寺庙，半山腰俯瞰田园，惊险但好看",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥65"
              }
            ]
          },
          {
            "text": "下涯湿地",
            "type": "play",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "下涯湿地"
            },
            "description": "晨雾要6点前到！新安江边，渔夫撒网+晨雾=仙境",
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
            "startTime": "9:30",
            "endTime": "10:30",
            "place": {
              "name": "建德"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-350/晚"
              }
            ],
            "description": "建德市区酒店，方便第二天出发去丽水"
          }
        ]
      },
      {
        "photo": "photo-1500382017468-9049fed747ef",
        "activity": "建德→丽水 古堰画乡",
        "weather": {
          "icon": "🌤️",
          "temp": "26°"
        },
        "steps": [
          {
            "text": "租车/自驾2h到丽水",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "10:00",
            "place": {
              "name": "丽水"
            },
            "description": "按导航路线前往",
            "bookings": [
              {
                "type": "car",
                "label": "租车"
              }
            ],
            "relatedContent": [
              {
                "platform": "B站",
                "icon": "📺",
                "title": "【自驾vlog】神仙居名字不是吹的",
                "likes": "11w"
              }
            ]
          },
          {
            "text": "古堰画乡",
            "type": "play",
            "startTime": "10:00",
            "endTime": "12:30",
            "place": {
              "name": "古堰画乡"
            },
            "description": "瓯江边的画家村，油画写生+古樟树群，下午光线最美",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥50"
              }
            ]
          },
          {
            "text": "入住丽水酒店",
            "type": "stay",
            "startTime": "12:30",
            "endTime": "13:30",
            "place": {
              "name": "丽水酒店"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥200-350/晚"
              }
            ],
            "description": "丽水市区商务酒店，干净便宜，靠近古堰画乡方便游览"
          }
        ]
      },
      {
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "缙云仙都 鼎湖峰+朱潭山",
        "weather": {
          "icon": "☀️",
          "temp": "29°"
        },
        "steps": [
          {
            "text": "自驾1h到缙云仙都景区",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "9:00",
            "place": {
              "name": "缙云仙都景区"
            },
            "description": "鼎湖峰是精华，朱潭山倒影绝美，花1天慢慢逛",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥100"
              }
            ]
          },
          {
            "text": "鼎湖峰",
            "type": "play",
            "startTime": "9:00",
            "endTime": "10:30",
            "place": {
              "name": "鼎湖峰"
            },
            "description": "170米高的石柱拔地而起，中国南方最高石柱，早上有雾时仙气十足"
          },
          {
            "text": "朱潭山",
            "type": "play",
            "startTime": "10:30",
            "endTime": "12:00",
            "place": {
              "name": "朱潭山"
            },
            "description": "好溪穿过山谷，水面倒映鼎湖峰，清晨有牧牛人赶牛过桥的经典画面"
          },
          {
            "text": "入住缙云",
            "type": "stay",
            "startTime": "12:00",
            "endTime": "13:00",
            "place": {
              "name": "缙云"
            },
            "bookings": [
              {
                "type": "hotel",
                "label": "查住宿",
                "cost": "¥150-300/晚"
              }
            ],
            "description": "缙云县城或仙都景区附近住宿，方便第二天出发去仙居"
          }
        ]
      },
      {
        "photo": "photo-1464822759023-fed622ff2c3b",
        "activity": "仙居神仙居+返程",
        "weather": {
          "icon": "⛅",
          "temp": "27°"
        },
        "steps": [
          {
            "text": "自驾1.5h到仙居神仙居景区",
            "type": "transit",
            "startTime": "8:00",
            "endTime": "9:30",
            "place": {
              "name": "仙居神仙居景区"
            },
            "description": "索道排队长早去！如意桥网红打卡点，全程3-4h",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "门票¥110+索道¥100"
              }
            ],
            "tips": [
              "神仙居索道排队长，早去"
            ]
          },
          {
            "text": "神仙居全天",
            "type": "play",
            "startTime": "9:30",
            "endTime": "13:30",
            "place": {
              "name": "神仙居"
            },
            "description": "索道排队长早去！如意桥网红打卡点，全程3-4h",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "门票¥110+索道¥100"
              }
            ]
          },
          {
            "text": "自驾/高铁返回苏州",
            "type": "transit",
            "startTime": "13:30",
            "endTime": "14:00",
            "place": {
              "name": "苏州"
            },
            "description": "按导航路线前往",
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
            "startTime": "14:00",
            "endTime": "14:00"
          }
        ]
      }
    ]
  },
  {
    "id": "pingjianglu-walk",
    "title": "平江路商圈走走",
    "origin": "苏州",
    "category": "now",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1528164344705-47542687000d",
        "activity": "平江路赶集+独墓湖散步",
        "weather": {
          "icon": "☀️",
          "temp": "33°"
        },
        "steps": [
          {
            "text": "地铁到平江路站",
            "type": "transit",
            "startTime": "14:00",
            "endTime": "14:30",
            "place": {
              "name": "平江路站"
            },
            "description": "苏州最有味道的老街，诚品书店+文创小店+苏式点心",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "免费逛"
              }
            ]
          },
          {
            "text": "平江路赶集",
            "type": "play",
            "startTime": "14:30",
            "endTime": "16:30",
            "place": {
              "name": "平江路"
            },
            "description": "苏州最有味道的老街，诚品书店+文创小店+苏式点心",
            "bookings": [
              {
                "type": "ticket",
                "label": "查门票",
                "cost": "免费逛"
              }
            ]
          },
          {
            "text": "诚品书店",
            "type": "play",
            "startTime": "16:30",
            "endTime": "18:00",
            "place": {
              "name": "诚品书店"
            },
            "description": "苏州诚品书店，不只是书店还有文创市集和展览，可以泡一两个小时"
          },
          {
            "text": "独墓湖散步",
            "type": "play",
            "startTime": "18:00",
            "endTime": "19:30",
            "place": {
              "name": "独墓湖"
            },
            "description": "金鸡湖旁的小湖，傍晚散步人少安静，湖边有长椅可以坐着发呆"
          },
          {
            "text": "湖边咖啡",
            "type": "eat",
            "startTime": "19:30",
            "endTime": "20:30",
            "place": {
              "name": "湖边咖啡"
            },
            "description": "湖边独立咖啡馆，环境安静适合坐下来休息，冰美式和手冲都不错",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥30-50"
              }
            ]
          },
          {
            "text": "地铁回家",
            "type": "transit",
            "startTime": "20:30",
            "endTime": "21:00",
            "place": {
              "name": "地铁回家"
            },
            "description": "按导航路线前往"
          }
        ]
      }
    ]
  },
  {
    "id": "jinjihu-sunset",
    "title": "金鸡湖日落骑行",
    "origin": "苏州",
    "category": "now",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1501785888041-af3ef285b470",
        "activity": "环湖骑行+看日落",
        "weather": {
          "icon": "☀️",
          "temp": "33°"
        },
        "steps": [
          {
            "text": "骑行/自驾20min到金鸡湖",
            "type": "transit",
            "startTime": "16:00",
            "endTime": "16:20",
            "place": {
              "name": "金鸡湖"
            },
            "description": "环湖绿道骑行，音乐喷泉(周五六晚8点)，日落超美"
          },
          {
            "text": "环湖绿道骑行",
            "type": "play",
            "startTime": "16:20",
            "endTime": "17:50",
            "place": {
              "name": "环湖绿道"
            },
            "description": "环湖绿道约15km一圈，平坦好骑，沿途可以看到摩天轮和东方之门"
          },
          {
            "text": "湖边野餐",
            "type": "play",
            "startTime": "17:50",
            "endTime": "19:20",
            "place": {
              "name": "湖边野餐"
            },
            "description": "李公堤或湖心岛附近草坪铺个垫子，带点水果零食，看着湖面等日落"
          },
          {
            "text": "看日落",
            "type": "play",
            "startTime": "19:20",
            "endTime": "20:50",
            "description": "日落时分湖面金光灿烂，东方之门方向最出片，周五六还有音乐喷泉",
            "place": {
              "name": "金鸡湖"
            }
          },
          {
            "text": "骑回家",
            "type": "play",
            "startTime": "20:50",
            "endTime": "21:50",
            "place": {
              "name": "骑回家"
            },
            "description": "沿绿道原路骑回，夜风凉快，湖边灯光亮起来也好看"
          }
        ]
      }
    ]
  },
  {
    "id": "guanqianjie-night",
    "title": "观前街夜市+护城河",
    "origin": "苏州",
    "category": "now",
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
    "relatedContent": [],
    "days": [
      {
        "photo": "photo-1470004914212-05527e49370b",
        "activity": "夜市扫街+护城河夜景",
        "weather": {
          "icon": "🌙",
          "temp": "28°"
        },
        "steps": [
          {
            "text": "步行/地铁到观前街",
            "type": "transit",
            "startTime": "19:00",
            "endTime": "19:30",
            "place": {
              "name": "观前街"
            },
            "description": "苏州最热闹的商圈，夜市小吃多，松鹤楼/得月楼在附近",
            "bookings": [
              {
                "type": "car",
                "label": "交通",
                "cost": "人均¥50-100"
              }
            ]
          },
          {
            "text": "夜市扫街",
            "type": "eat",
            "startTime": "19:30",
            "endTime": "20:30",
            "place": {
              "name": "夜市扫街"
            },
            "description": "观前街夜市小吃多，糖粥、生煎、鲜肉月饼轮着吃，边走边逛",
            "bookings": [
              {
                "type": "food",
                "label": "查餐厅",
                "cost": "人均¥30-60"
              }
            ]
          },
          {
            "text": "护城河游船",
            "type": "play",
            "startTime": "20:30",
            "endTime": "21:30",
            "place": {
              "name": "护城河"
            },
            "description": "夜游护城河游船看城墙灯光，也可以河边散步",
            "bookings": [
              {
                "type": "boat",
                "label": "查船票",
                "cost": "游船¥80"
              }
            ]
          },
          {
            "text": "河边散步",
            "type": "play",
            "startTime": "21:30",
            "endTime": "23:00",
            "place": {
              "name": "河边"
            },
            "description": "护城河边步道灯光柔和，夜风凉快，从相门到盘门这段最有感觉"
          },
          {
            "text": "回家",
            "type": "home",
            "startTime": "23:00",
            "endTime": "23:00"
          }
        ]
      }
    ]
  }
];
