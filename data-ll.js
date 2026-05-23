/* ===== 5 Love Languages 五种恋爱语言 — 数据 ===== */
/* 来源: Chapman (1992) The 5 Love Languages */

const LL = {
  // A = 肯定的言辞, B = 精心的时刻, C = 接受礼物, D = 服务的行动, E = 身体的接触
  labels: {
    A: { cn: '肯定的言辞', en: 'Words of Affirmation',  color: '#FF8A65', icon: '💬' },
    B: { cn: '精心的时刻', en: 'Quality Time',          color: '#66BB6A', icon: '⏰' },
    C: { cn: '接受礼物',   en: 'Receiving Gifts',       color: '#42A5F5', icon: '🎁' },
    D: { cn: '服务的行动', en: 'Acts of Service',       color: '#AB47BC', icon: '🛠️' },
    E: { cn: '身体的接触', en: 'Physical Touch',        color: '#EF5350', icon: '🤗' }
  },

  // 完整版30对
  fullPairs: [
    { a: 'A', aText: '伴侣写的爱的短笺让我感觉很好',          b: 'E', bText: '我喜欢伴侣给我的拥抱' },
    { a: 'B', aText: '我喜欢与伴侣单独待在一起',              b: 'D', bText: '伴侣帮助我做我的工作时，我感觉到爱' },
    { a: 'C', aText: '收到特别的礼物很开心',                  b: 'B', bText: '我喜欢与伴侣长途旅行' },
    { a: 'D', aText: '伴侣帮着做家务时我感觉被爱',            b: 'E', bText: '我喜欢伴侣抚触我' },
    { a: 'E', aText: '伴侣搂着我时感受到爱',                  b: 'C', bText: '伴侣送礼物让我惊喜' },
    { a: 'B', aText: '不管去哪里都愿意一起去',                b: 'E', bText: '我喜欢牵着伴侣的手' },
    { a: 'C', aText: '我很珍惜伴侣送的礼物',                  b: 'A', bText: '我喜欢听伴侣说爱我' },
    { a: 'E', aText: '我喜欢伴侣坐在我旁边',                  b: 'A', bText: '我喜欢听伴侣说我帅/漂亮' },
    { a: 'B', aText: '能和伴侣待在一起很高兴',                b: 'C', bText: '即使是最小的礼物也很重要' },
    { a: 'A', aText: '伴侣以我为骄傲时感觉被爱',              b: 'D', bText: '伴侣为我做饭时知道TA爱我' },
    { a: 'B', aText: '做什么都喜欢一起做',                    b: 'A', bText: '伴侣的支持意见让我感觉很好' },
    { a: 'D', aText: '伴侣做的小事比说的更重要',              b: 'E', bText: '我喜欢拥抱伴侣' },
    { a: 'A', aText: '伴侣的赞扬意义重大',                    b: 'C', bText: '伴侣送我喜欢的礼物很重要' },
    { a: 'B', aText: '在伴侣身边就感觉很好',                  b: 'E', bText: '喜欢伴侣揉我背部/按摩' },
    { a: 'A', aText: '伴侣对我成就的反应鼓舞我',              b: 'D', bText: '伴侣帮做TA讨厌做的事意义重大' },
    { a: 'E', aText: '从未厌倦伴侣的亲吻',                    b: 'B', bText: '伴侣对我的事表示真正兴趣' },
    { a: 'D', aText: '可指望伴侣帮我完成任务',                b: 'C', bText: '打开伴侣礼物时仍感到兴奋' },
    { a: 'A', aText: '喜欢伴侣称赞我的外表',                  b: 'B', bText: '喜欢伴侣聆听且不急于评判' },
    { a: 'E', aText: '忍不住要触摸伴侣',                      b: 'D', bText: '伴侣为我跑腿时很感谢TA' },
    { a: 'D', aText: '伴侣为帮助我应得到奖赏',                b: 'C', bText: '伴侣送礼如此用心让我惊奇' },
    { a: 'B', aText: '喜欢伴侣给我全部注意力',                b: 'D', bText: '保持家里清洁很重要' },
    { a: 'C', aText: '期待伴侣送的生日礼物',                  b: 'A', bText: '听伴侣说我对TA有多重要' },
    { a: 'C', aText: '伴侣送礼物让我知道TA爱我',              b: 'D', bText: '伴侣主动帮助表达爱' },
    { a: 'B', aText: '伴侣不打断我说话',                      b: 'C', bText: '从未厌倦收伴侣礼物' },
    { a: 'D', aText: '伴侣在我累时问我能帮什么',              b: 'B', bText: '去哪里不重要，和伴侣一起才重要' },
    { a: 'E', aText: '喜欢与伴侣亲密',                        b: 'C', bText: '喜欢收到礼物惊喜' },
    { a: 'A', aText: '伴侣鼓励的话语给我信心',                b: 'B', bText: '喜欢与伴侣一起看电影' },
    { a: 'C', aText: '没有比伴侣送的礼物更好的了',            b: 'E', bText: '无法把手从伴侣身上收回来' },
    { a: 'D', aText: '伴侣放下其他事来帮我很重要',            b: 'A', bText: '伴侣说欣赏我让我感觉很好' },
    { a: 'E', aText: '分开后喜欢拥抱亲吻',                    b: 'A', bText: '喜欢听伴侣说相信我/想念我' },
  ],

  // 简化版15对 (从30对中精选)
  shortPairs: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14].map(i => null), // will use indices

  getShortPairs: function() {
    // 选前15对 (均衡覆盖5种语言的配对)
    return this.fullPairs.slice(0, 15);
  },

  // 计算分数
  compute: function(choices) {
    let scores = { A:0, B:0, C:0, D:0, E:0 };
    choices.forEach(ch => { scores[ch]++; });
    let sorted = Object.entries(scores).sort((a,b) => b[1] - a[1]);
    let primary = sorted[0][0];
    let secondary = sorted[1][0];
    let isBilingual = sorted[0][1] === sorted[1][1];
    return { scores, sorted, primary, secondary, isBilingual };
  },

  // 配对数据 (给 UI 渲染用)
  getPair: function(index, isShort) {
    return isShort ? this.getShortPairs()[index] : this.fullPairs[index];
  },

  totalPairs: function(isShort) {
    return isShort ? 15 : 30;
  }
};
