const PLANS = [
  {
    "id": "guizhou-national-day-2026",
    "title": "2026 贵州干饭行",
    "origin": "北京/苏州",
    "category": "weekend",
    "reason": "基于你们收集的小红书攻略整理。国庆 6 天 5 夜，贵阳干饭 + 兴义山水，高铁 + 租车方案。",
    "tags": ["国庆", "4人", "干饭", "峡谷", "喀斯特"],
    "startDate": "2026-10-01",
    "weatherSource": "Open-Meteo Archive API (2024+2025 同期历史数据, 贵阳 26.538/106.805, 兴义 25.010/104.925)",
    "weatherNote": "基于历史数据预估，9月中旬更新为精确预报",
    "relatedContent": [
      {"platform": "腾讯文档", "icon": "📄", "title": "2026贵州干饭行！完整攻略", "likes": "原始素材"}
    ],
    "days": [
      {
        "photo": "https://images.unsplash.com/photo-1555217851-6141535bd771?w=800&h=500&fit=crop",
        "activity": "两路汇合 · 民生路夜市开干",
        "weather": {"icon": "🌦️", "temp": "22°"},
        "steps": [
          {
            "type": "depart",
            "text": "北京组：飞贵阳",
            "startTime": "09:00",
            "endTime": "12:00",
            "description": "北京首都/大兴→贵阳龙洞堡，约 3 小时。国庆机票提前买，早买差价大。",
            "place": {"name": "贵阳龙洞堡机场", "lat": 26.537812, "lng": 106.805223},
            "bookings": [{"type": "flight", "label": "查机票", "cost": "¥800-1500"}]
          },
          {
            "type": "depart",
            "text": "苏州组：飞贵阳",
            "startTime": "09:30",
            "endTime": "12:00",
            "description": "上海虹桥/浦东→贵阳龙洞堡，约 2.5 小时。苏州到虹桥高铁 30min，可当天赶。",
            "place": {"name": "贵阳龙洞堡机场", "lat": 26.537812, "lng": 106.805223},
            "bookings": [{"type": "flight", "label": "查机票", "cost": "¥600-1200"}]
          },
          {
            "type": "transit",
            "text": "机场汇合 · 取租车",
            "startTime": "12:30",
            "endTime": "13:00",
            "description": "两路在贵阳龙洞堡机场汇合，机场取租车（提前预订 SUV，4 人 + 行李）。国庆租车紧俏，建议提前 2 周订。",
            "place": {"name": "贵阳龙洞堡机场", "lat": 26.537812, "lng": 106.805223},
            "bookings": [{"type": "car", "label": "租车预订", "cost": "¥200-400/天"}]
          },
          {
            "type": "eat",
            "text": "民生路夜市干饭",
            "startTime": "18:00",
            "endTime": "21:00",
            "description": "贵阳本地人推荐的夜市一条街，烤小豆腐、丝娃娃、酸汤鱼、恋爱豆腐果都要试。人多热闹，早去占位。",
            "place": {"name": "民生路", "lat": 26.579231, "lng": 106.715828},
            "tips": ["人均 50-100 就能吃很好", "现金+微信都收"],
            "relatedContent": [
              {"platform": "小红书", "icon": "📕", "title": "贵阳三天两夜纯吃攻略4人版", "likes": "36赞", "url": "https://www.xiaohongshu.com/discovery/item/69b967ac0000000023012c87"},
              {"platform": "小红书", "icon": "📕", "title": "贵阳民生路·对不起之前是我说话大声了", "likes": "47赞", "url": "https://www.xiaohongshu.com/discovery/item/6a33e80a000000000f01d838"}
            ]
          },
          {
            "type": "stay",
            "text": "入住贵阳酒店",
            "startTime": "21:30",
            "endTime": "23:00",
            "description": "建议住市中心或贵阳北站附近，方便第二天出发。",
            "place": {"name": "贵阳市区", "lat": 26.583, "lng": 106.717},
            "bookings": [{"type": "hotel", "label": "查住宿", "cost": "¥300-500/晚"}]
          }
        ]
      },
      {
        "photo": "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&h=500&fit=crop",
        "activity": "贵阳继续干饭 · 下午自驾去兴义",
        "weather": {"icon": "⛅", "temp": "25°"},
        "steps": [
          {
            "type": "eat",
            "text": "贵阳早午饭",
            "startTime": "09:00",
            "endTime": "12:00",
            "description": "把昨晚没吃到的补上。肠旺面、花溪牛肉粉、酸汤鱼，贵阳的早饭可以吃到中午。",
            "place": {"name": "贵阳市区", "lat": 26.583, "lng": 106.717},
            "tips": ["肠旺面推荐老字号，排队正常"]
          },
          {
            "type": "transit",
            "text": "自驾前往兴义",
            "startTime": "13:00",
            "endTime": "17:11",
            "description": "贵阳→银百高速→惠兴高速→兴义，全程 321km，约 4 小时 11 分钟。国庆高速免费但可能堵车，建议 13:00 前出发。沿途风景好，可在服务区休息。",
            "place": {"name": "兴义市区", "lat": 25.092, "lng": 104.895},
            "tips": ["国庆高速免费", "沿途有服务区可休息", "导航避开拥堵路段"]
          },
          {
            "type": "eat",
            "text": "兴义晚饭",
            "startTime": "18:00",
            "endTime": "19:30",
            "description": "到了先吃一碗兴义羊肉汤粉，粉是兴义一绝。",
            "place": {"name": "兴义市区", "lat": 25.092, "lng": 104.895},
            "relatedContent": [
              {"platform": "小红书", "icon": "📕", "title": "关于我在兴义吃了些什么😋", "likes": "13赞", "url": "https://www.xiaohongshu.com/discovery/item/68da0920000000001301a0fe"}
            ]
          },
          {
            "type": "stay",
            "text": "入住兴义酒店",
            "startTime": "20:00",
            "endTime": "22:00",
            "description": "住兴义市区，方便第二天去马岭河。",
            "place": {"name": "兴义市区", "lat": 25.092, "lng": 104.895},
            "bookings": [{"type": "hotel", "label": "查住宿", "cost": "¥200-400/晚"}]
          }
        ]
      },
      {
        "photo": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&h=500&fit=crop",
        "activity": "马岭河峡谷看瀑布 · 夺夺粉火锅",
        "weather": {"icon": "☀️", "temp": "25°"},
        "steps": [
          {
            "type": "transit",
            "text": "自驾前往马岭河峡谷",
            "startTime": "08:00",
            "endTime": "08:30",
            "description": "从兴义市区到马岭河峡谷约 15 分钟车程。",
            "place": {"name": "马岭河峡谷风景区", "lat": 25.125292, "lng": 104.966064}
          },
          {
            "type": "play",
            "text": "马岭河峡谷徒步",
            "startTime": "08:30",
            "endTime": "12:30",
            "description": "国家地理上榜景点，非丰水期也很漂亮。强推路线：打柴窝入口进 → 马岭河大桥俯瞰全景 → 万马奔腾瀑布 → 沿栈道逛峡谷 → 小青山入口坐观光电梯出。全程 2-4 小时。",
            "place": {"name": "马岭河峡谷风景区", "lat": 25.125292, "lng": 104.966064},
            "bookings": [{"type": "ticket", "label": "查门票", "cost": "¥70"}],
            "tips": [
              "必带：防滑登山鞋、雨衣、零食和水",
              "厕所只有入口和万马奔腾瀑布处有",
              "建议从打柴窝入口进（人少不排队）",
              "走完全程体力消耗大，备好干粮"
            ],
            "relatedContent": [
              {"platform": "小红书", "icon": "📕", "title": "马岭河峡谷保姆级攻略", "likes": "收藏"}
            ]
          },
          {
            "type": "eat",
            "text": "夺夺粉火锅",
            "startTime": "13:00",
            "endTime": "14:30",
            "description": "走完马岭河一定要去吃夺夺粉火锅！兴义特色，类似小火锅涮粉，走完峡谷正好补充体力。",
            "place": {"name": "兴义市区", "lat": 25.092, "lng": 104.895},
            "relatedContent": [
              {"platform": "小红书", "icon": "📕", "title": "兴义夺夺粉火锅推荐", "likes": "收藏"}
            ]
          },
          {
            "type": "transit",
            "text": "自驾前往万峰林",
            "startTime": "15:00",
            "endTime": "15:36",
            "description": "马岭河→万峰林 19km，约 36 分钟车程。",
            "place": {"name": "万峰林景区", "lat": 25.00961, "lng": 104.924648}
          },
          {
            "type": "stay",
            "text": "入住万峰林民宿",
            "startTime": "16:00",
            "endTime": "22:00",
            "description": "住万峰林景区内或附近，推荐山脚下的民宿，推窗见峰。",
            "place": {"name": "万峰林景区", "lat": 25.00961, "lng": 104.924648},
            "bookings": [{"type": "hotel", "label": "查住宿", "cost": "¥300-600/晚"}]
          }
        ]
      },
      {
        "photo": "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=500&fit=crop",
        "activity": "万峰林慢游 · 稻田咖啡发呆",
        "weather": {"icon": "☀️", "temp": "26°"},
        "steps": [
          {
            "type": "play",
            "text": "观光车看山",
            "startTime": "08:30",
            "endTime": "11:00",
            "description": "万峰林景区观光车 + 小电驴组合。山上多个观景台：八卦田、福字田、将军峰。喀斯特地貌 + 金色稻田，10 月正是好时候。",
            "place": {"name": "万峰林景区", "lat": 25.00961, "lng": 104.924648},
            "bookings": [{"type": "ticket", "label": "查门票+观光车", "cost": "¥70+50"}],
            "tips": ["建议先坐观光车上山看全景，再下来骑电驴"],
            "relatedContent": [
              {"platform": "小红书", "icon": "📕", "title": "万峰林最佳游览路线", "likes": "收藏"}
            ]
          },
          {
            "type": "play",
            "text": "小电驴逛村子",
            "startTime": "11:00",
            "endTime": "12:30",
            "description": "山下骑小电驴穿梭村落，纳灰村、双生村，稻田间的小路很出片。",
            "place": {"name": "万峰林景区", "lat": 25.00961, "lng": 104.924648},
            "bookings": [{"type": "bike", "label": "租电驴", "cost": "¥50-80"}]
          },
          {
            "type": "eat",
            "text": "午饭",
            "startTime": "12:30",
            "endTime": "13:30",
            "description": "万峰林脚下有不少农家乐和小餐馆。",
            "place": {"name": "万峰林景区", "lat": 25.00961, "lng": 104.924648}
          },
          {
            "type": "play",
            "text": "咖啡厅看山发呆",
            "startTime": "14:00",
            "endTime": "17:00",
            "description": "找一家有露台的咖啡厅，对着万峰林发呆。这是整趟行程最奢侈的时间。",
            "place": {"name": "万峰林景区", "lat": 25.00961, "lng": 104.924648},
            "tips": ["推荐下午去，光线最好"]
          },
          {
            "type": "stay",
            "text": "继续住万峰林",
            "startTime": "18:00",
            "endTime": "22:00",
            "place": {"name": "万峰林景区", "lat": 25.00961, "lng": 104.924648}
          }
        ]
      },
      {
        "photo": "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=800&h=500&fit=crop",
        "activity": "返回贵阳 · 收官干饭",
        "weather": {"icon": "⛅", "temp": "24°"},
        "steps": [
          {
            "type": "transit",
            "text": "自驾返回贵阳",
            "startTime": "09:00",
            "endTime": "12:58",
            "description": "万峰林→贵阳 327km，约 3 小时 58 分钟。趁上午出发避开返程高峰。",
            "place": {"name": "贵阳市区", "lat": 26.583, "lng": 106.717},
            "tips": ["10.5 返程车流大，尽量早走"]
          },
          {
            "type": "eat",
            "text": "贵阳收官饭",
            "startTime": "13:30",
            "endTime": "15:00",
            "description": "最后一顿贵阳饭，把前两天没吃到的补上。酸汤牛肉、糯米饭、豆腐圆子。",
            "place": {"name": "贵阳市区", "lat": 26.583, "lng": 106.717}
          },
          {
            "type": "play",
            "text": "市区逛逛",
            "startTime": "15:30",
            "endTime": "18:00",
            "description": "甲秀楼、文昌阁、大十字广场，市区景点走走消食。",
            "place": {"name": "贵阳市区", "lat": 26.583, "lng": 106.717}
          },
          {
            "type": "eat",
            "text": "晚饭",
            "startTime": "18:30",
            "endTime": "20:00",
            "description": "最后的贵阳夜宵。",
            "place": {"name": "贵阳市区", "lat": 26.583, "lng": 106.717}
          },
          {
            "type": "stay",
            "text": "入住贵阳酒店",
            "startTime": "20:30",
            "endTime": "22:00",
            "place": {"name": "贵阳市区", "lat": 26.583, "lng": 106.717},
            "bookings": [{"type": "hotel", "label": "查住宿", "cost": "¥300-500/晚"}]
          }
        ]
      },
      {
        "photo": "https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&h=500&fit=crop",
        "activity": "还车 · 各回各家",
        "weather": {"icon": "⛅", "temp": "22°"},
        "steps": [
          {
            "type": "transit",
            "text": "还租车 · 去机场",
            "startTime": "08:00",
            "endTime": "09:00",
            "description": "贵阳龙洞堡机场还车。",
            "place": {"name": "贵阳龙洞堡机场", "lat": 26.537812, "lng": 106.805223}
          },
          {
            "type": "home",
            "text": "北京组：飞回北京",
            "startTime": "10:30",
            "endTime": "13:30",
            "description": "贵阳→北京，约 3 小时。国庆最后一天返程航班紧张，提前买。",
            "place": {"name": "贵阳龙洞堡机场", "lat": 26.537812, "lng": 106.805223},
            "bookings": [{"type": "flight", "label": "查返程机票", "cost": "¥800-1500"}]
          },
          {
            "type": "home",
            "text": "苏州组：飞回上海",
            "startTime": "10:30",
            "endTime": "13:00",
            "description": "贵阳→上海，约 2.5 小时，落地后高铁回苏州 30min。",
            "place": {"name": "贵阳龙洞堡机场", "lat": 26.537812, "lng": 106.805223},
            "bookings": [{"type": "flight", "label": "查返程机票", "cost": "¥600-1200"}]
          }
        ]
      }
    ]
  }
];
