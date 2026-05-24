/* ===== 情侣匹配：编解码 + 评分引擎 + 称号 + 建议 ===== */

/* ---------- 结果码编解码 ---------- */
const CoupleCodec = {
  _version: '1',

  encode: function(allResults) {
    let parts = [];
    const modules = { ecr:'e', stls:'s', las:'l', ll:'c' };
    for (let [mod, prefix] of Object.entries(modules)) {
      const data = allResults[mod];
      if (!data || !data._answers) { parts.push(prefix + 'x'); continue; }
      let ver = data._version;
      if (mod === 'ecr') ver = ({ light:0, standard:1, full:2 })[ver] ?? 0;
      else ver = ({ short:0, full:1 })[ver] ?? 0;
      let ans = data._answers.map(v => {
        if (mod === 'll') return v === 'A' ? '0' : '1';
        return v.toString(36);
      }).join('');
      parts.push(prefix + ver.toString(36) + ans);
    }
    let code = parts.join('');
    // 简单校验和：字符码之和 mod 1296，转2位 base36
    let sum = 0;
    for (let i = 0; i < code.length; i++) sum += code.charCodeAt(i);
    code += (sum % 36).toString(36) + (Math.floor(sum / 36) % 36).toString(36);
    return code;
  },

  decode: function(code) {
    if (!code || code.length < 8) return null;
    // 切掉校验和
    const body = code.slice(0, -2);
    // 验证校验和
    let sum = 0;
    for (let i = 0; i < body.length; i++) sum += body.charCodeAt(i);
    const cs1 = parseInt(code[code.length-2], 36);
    const cs2 = parseInt(code[code.length-1], 36);
    if (sum % 36 !== cs1 || Math.floor(sum / 36) % 36 !== cs2) return null;

    const result = {};
    const markers = { e:'ecr', s:'stls', l:'las', c:'ll' };
    let i = 0;
    while (i < body.length) {
      const prefix = body[i];
      const mod = markers[prefix];
      if (!mod) { i++; continue; }
      i++;
      const verChar = body[i];
      if (verChar === 'x') { result[mod] = null; i++; continue; }
      const verNum = parseInt(verChar, 36);
      // 根据模块和版本确定剩余答案数
      let expectedLen = 0;
      if (mod === 'ecr') expectedLen = [12, 24, 36][verNum] || 0;
      else if (mod === 'stls') expectedLen = verNum === 0 ? 15 : 45;
      else if (mod === 'las') expectedLen = verNum === 0 ? 24 : 42;
      else if (mod === 'll') expectedLen = verNum === 0 ? 15 : 30;
      if (expectedLen <= 0) { result[mod] = null; i++; continue; }
      i++;
      const ansStr = body.slice(i, i + expectedLen);
      i += expectedLen;
      const answers = ansStr.split('').map(ch => {
        if (mod === 'll') return ch === '0' ? 'A' : 'B';
        return parseInt(ch, 36);
      });
      const versionMap = { ecr: ['light','standard','full'], stls: ['short','full'], las: ['short','full'], ll: ['short','full'] };
      result[mod] = { _version: versionMap[mod][verNum], _answers: answers };
    }
    return result;
  },

  validate: function(code) {
    return this.decode(code) !== null;
  }
};

/* ---------- 匹配评分引擎 ---------- */
const CoupleMatch = {
  // 等级定义
  TIERS: [
    { min: 92, icon: '💕', name: '灵魂伴侣',   quote: '万里挑一的默契',        className: 'tier-soulmate',  bgClass: 'bg-tier-soulmate',  color: '#D4AF37' },
    { min: 80, icon: '💖', name: '天作之合',   quote: '你们的爱情有科学依据',  className: 'tier-perfect',   bgClass: 'bg-tier-perfect',   color: '#FF69B4' },
    { min: 70, icon: '💗', name: '甜蜜恋人',   quote: '好的爱情不是完美，是懂得', className: 'tier-sweet',  bgClass: 'bg-tier-sweet',    color: '#9B72AA' },
    { min: 60, icon: '🌱', name: '成长伴侣',   quote: '喜欢是看见优点，爱是接受差异', className: 'tier-growth', bgClass: 'bg-tier-growth',  color: '#4CAF50' },
    { min: 50, icon: '🤝', name: '磨合之路',   quote: '没有天生一对，只有愿意磨合的两个人', className: 'tier-work', bgClass: 'bg-tier-work',    color: '#FF8C00' },
    { min: 0,  icon: '🔄', name: '深度磨合',   quote: '爱是需要勇气的事',      className: 'tier-deep',     bgClass: 'bg-tier-deep',     color: '#708090' },
  ],

  /* ---------- 主入口 ---------- */
  compute: function(myResults, partnerData) {
    // 检查数据完整性
    const mods = ['ecr','stls','las','ll'];
    const missing = mods.filter(m => !myResults[m] || !partnerData[m]);
    if (missing.length > 0) return { error: '以下模块数据缺失：' + missing.join(', ') };

    // 重新计算结果（解码后的数据只有原始答案，需要重新 compute）
    const myComputed = this._recomputeAll(myResults);
    const partnerComputed = this._recomputeAll(partnerData);

    // 各模块匹配分
    const ecrScore = this._ecrMatch(myComputed.ecr, partnerComputed.ecr);
    const lasScore = this._lasMatch(myComputed.las, partnerComputed.las);
    const stlsScore = this._stlsMatch(myComputed.stls, partnerComputed.stls);
    const llScore = this._llMatch(myComputed.ll, partnerComputed.ll);

    // 总分（加权）
    const total = Math.round(ecrScore * 0.35 + lasScore * 0.25 + stlsScore * 0.20 + llScore * 0.20);
    const tier = this._getTier(total);

    // 建议
    const advice = this._generateAdvice(myComputed, partnerComputed, { ecrScore, lasScore, stlsScore, llScore });

    // 百分位（基于模拟分布）
    const percentile = this._getPercentile(total);

    return {
      total, tier,
      modules: {
        ecr: { score: ecrScore, label: '依恋类型', icon: '🫂', my: myComputed.ecr.type?.cn || '', partner: partnerComputed.ecr.type?.cn || '' },
        las: { score: lasScore, label: '爱情色彩', icon: '🎨', my: myComputed.las.primaryName || '', partner: partnerComputed.las.primaryName || '' },
        stls: { score: stlsScore, label: '爱情三元', icon: '🔺', my: myComputed.stls.type?.cn || '', partner: partnerComputed.stls.type?.cn || '' },
        ll: { score: llScore, label: '恋爱语言', icon: '💬', my: myComputed.ll.primaryName || '', partner: partnerComputed.ll.primaryName || '' },
      },
      advice,
      percentile,
    };
  },

  /* ---------- 重算各模块结果 ---------- */
  _recomputeAll: function(data) {
    const out = {};
    if (data.ecr) {
      const ecr = data.ecr;
      const version = ecr._version || 'standard';
      const questions = App.getQuestions('ecr', version);
      // 确保 questions 与 _answers 长度匹配
      const scores = ECR.scoreByMean(ecr._answers, questions);
      let typeKey;
      if (scores.anxiety >= ECR.threshold && scores.avoidance >= ECR.threshold) typeKey = 'fearful';
      else if (scores.anxiety >= ECR.threshold) typeKey = 'anxious';
      else if (scores.avoidance >= ECR.threshold) typeKey = 'avoidant';
      else typeKey = 'secure';
      out.ecr = { ...scores, type: ECR.types[typeKey], typeKey };
    }
    if (data.stls) {
      const stls = data.stls;
      const version = stls._version || 'short';
      const res = STLS.compute(stls._answers, version);
      out.stls = res;
    }
    if (data.las) {
      const las = data.las;
      const isShort = (las._version || 'short') === 'short';
      const res = LAS.compute(las._answers, isShort);
      // 补充主要风格名称
      out.las = { ...res, primaryName: LAS.styles[res.primary]?.cn || '', secondaryName: LAS.styles[res.secondary]?.cn || '' };
    }
    if (data.ll) {
      const ll = data.ll;
      const res = LL.compute(ll._answers);
      out.ll = { ...res, primaryName: LL.labels[res.primary]?.cn || '' };
    }
    return out;
  },

  /* ---------- ECR 匹配分 ---------- */
  _ecrMatch: function(a, b) {
    const MATRIX = {
      'secure+secure': 95, 'secure+anxious': 80, 'secure+avoidant': 75, 'secure+fearful': 70,
      'anxious+anxious': 55, 'anxious+avoidant': 25, 'anxious+fearful': 45,
      'avoidant+avoidant': 50, 'avoidant+fearful': 35,
      'fearful+fearful': 30,
    };
    // 排序保证组合key一致
    const types = [a.typeKey, b.typeKey].sort();
    let score = MATRIX[types[0]+'+'+types[1]] || 50;

    // 强度微调
    let bonus = 0;
    const bothSecure = a.anxiety < 3.5 && a.avoidance < 3.5 && b.anxiety < 3.5 && b.avoidance < 3.5;
    if (bothSecure) bonus += 10;
    if (a.anxiety > 5.5 || a.avoidance > 5.5 || b.anxiety > 5.5 || b.avoidance > 5.5) bonus -= 8;
    if (Math.abs(a.anxiety - b.anxiety) < 0.5 && Math.abs(a.avoidance - b.avoidance) < 0.5) bonus += 5;

    return Math.max(0, Math.min(100, score + bonus));
  },

  /* ---------- LAS 匹配分 ---------- */
  _lasMatch: function(a, b) {
    const MATRIX = {
      'eros+eros':85, 'eros+ludus':50, 'eros+storge':75, 'eros+mania':45, 'eros+pragma':65, 'eros+agape':85,
      'ludus+ludus':35, 'ludus+storge':45, 'ludus+mania':20, 'ludus+pragma':40, 'ludus+agape':40,
      'storge+storge':80, 'storge+mania':55, 'storge+pragma':70, 'storge+agape':75,
      'mania+mania':30, 'mania+pragma':40, 'mania+agape':45,
      'pragma+pragma':70, 'pragma+agape':65,
      'agape+agape':70,
    };
    const pk = [a.primary, b.primary].sort().join('+');
    let styleScore = MATRIX[pk] || 60;

    // 差异惩罚
    let diffPenalty = 0;
    const dims = ['eros','ludus','storge','mania','pragma','agape'];
    for (let d of dims) {
      const diff = Math.abs((a.scores?.[d] || 0) - (b.scores?.[d] || 0));
      if (d === 'eros' || d === 'agape') {
        if (diff > 1.5) diffPenalty += 8;
      } else if (d === 'ludus') {
        if (diff > 2) diffPenalty += 5;
      }
    }

    // Eros/Agape 双高奖励
    let eaBonus = 0;
    if ((a.scores?.eros || 0) > 3.5 && (b.scores?.eros || 0) > 3.5) eaBonus += 10;
    if ((a.scores?.agape || 0) > 3.5 && (b.scores?.agape || 0) > 3.5) eaBonus += 10;

    return Math.max(0, Math.min(100, styleScore - diffPenalty + eaBonus));
  },

  /* ---------- STLS 匹配分 ---------- */
  _stlsMatch: function(a, b) {
    if (!a.scores || !b.scores) return 50;
    const dims = ['intimacy','passion','commitment'];

    // 维度差异越小分越高
    let dimScore = 0;
    for (let d of dims) {
      const diff = Math.abs((a.scores[d] || 0) - (b.scores[d] || 0));
      if (diff <= 1) dimScore += 30;
      else if (diff <= 2) dimScore += 20;
      else dimScore += 10;
    }
    dimScore = Math.round(dimScore / 3); // 平均

    // 类型分组一致性
    const HIGH_COMMIT = ['consummate','companionate','empty','fatuous'];
    const HIGH_PASSION = ['romantic','infatuation','fatuous','consummate'];
    const LOW_ALL = ['nonlove','liking'];

    const aKey = a.type?.key || '';
    const bKey = b.type?.key || '';

    let groupScore = 60;
    const aHighC = HIGH_COMMIT.includes(aKey);
    const bHighC = HIGH_COMMIT.includes(bKey);
    if (aHighC && bHighC) groupScore = 80;
    else if (!aHighC && !bHighC) groupScore = 70;
    else groupScore = 55;

    // 特殊组合惩罚/奖励
    let special = 0;
    if (aKey === 'consummate' && bKey === 'consummate') special = 10;
    if ((aKey === 'nonlove' && bKey === 'consummate') || (aKey === 'consummate' && bKey === 'nonlove')) special = -30;
    if ((aKey === 'infatuation' && bKey === 'empty') || (aKey === 'empty' && bKey === 'infatuation')) special = -25;

    return Math.max(0, Math.min(100, Math.round(dimScore * 0.5 + groupScore * 0.5 + special)));
  },

  /* ---------- LL 匹配分 ---------- */
  _llMatch: function(a, b) {
    if (!a.scores || !b.scores) return 50;
    // 排序各自的 5 种爱语
    const aSorted = Object.entries(a.scores).sort((x,y) => y[1] - x[1]);
    const bSorted = Object.entries(b.scores).sort((x,y) => y[1] - x[1]);
    const aTop2 = aSorted.slice(0,2).map(x => x[0]);
    const bTop2 = bSorted.slice(0,2).map(x => x[0]);

    // 首位覆盖
    let coverScore = 65;
    if (aSorted[0][0] === bSorted[0][0]) coverScore = 90;
    else if (aTop2.includes(bSorted[0][0]) && bTop2.includes(aSorted[0][0])) coverScore = 85;
    else if (aTop2.includes(bSorted[0][0]) || bTop2.includes(aSorted[0][0])) coverScore = 75;
    else if (aSorted[0][0] === bSorted[4][0] || bSorted[0][0] === aSorted[4][0]) coverScore = 45;

    // 双语奖励
    let bilingualBonus = 0;
    if (a.isBilingual || b.isBilingual) bilingualBonus = 10;
    // 分布平均度——如果前二和后三差距不大，说明很平衡
    const aSpread = aSorted[0][1] - aSorted[3][1];
    const bSpread = bSorted[0][1] - bSorted[3][1];
    if (aSpread <= 2 && bSpread <= 2) bilingualBonus += 5;

    return Math.min(100, coverScore + bilingualBonus);
  },

  /* ---------- 等级 ---------- */
  _getTier: function(total) {
    for (let t of this.TIERS) {
      if (total >= t.min) return t;
    }
    return this.TIERS[this.TIERS.length - 1];
  },

  /* ---------- 百分位 ---------- */
  _getPercentile: function(total) {
    // 模拟分布：正态近似，均值 65，标准差 15
    if (total >= 95) return 99;
    if (total >= 90) return 95;
    if (total >= 85) return 90;
    if (total >= 80) return 80;
    if (total >= 75) return 70;
    if (total >= 70) return 60;
    if (total >= 65) return 50;
    if (total >= 60) return 40;
    if (total >= 55) return 30;
    if (total >= 50) return 20;
    return 10;
  },

  /* ---------- 建议生成 ---------- */
  _generateAdvice: function(a, b, scores) {
    const list = [];

    // 1. ECR 组合建议
    const ecrCombo = [a.ecr.typeKey, b.ecr.typeKey].sort().join('+');
    const ECR_ADVICE = {
      'anxious+avoidant': {
        source: 'ECR·追逃模式',
        text: '你总是在想"TA是不是不爱我了"；而对方习惯把情绪藏起来说"我需要一点空间"。这不是谁对谁错——研究证明（Pietromonaco 2013），焦虑和回避的组合会导致双方在冲突前皮质醇水平显著升高。\n\n💡 焦虑方：当你感到不安时，试着说"我现在需要一点 reassurance"——把需求说出来，而不是追着对方要答案。\n💡 回避方：当你需要空间时，试着说"我爱你，但我需要半小时独处"——给一个确定的回来时间。\n💡 共同建立"安全信号"：一个手势或词，意思是"我被触发了，但我还在"。'
      },
      'secure+anxious': {
        source: 'ECR·安全与焦虑',
        text: '你的稳定性对对方来说是一种疗愈。研究表明（Strauss 2012），安全型伴侣的 supportive 行为能帮助焦虑型慢慢获得"获得性安全"。对方的焦虑不是不信任，而是内心对安全感的渴望——你的耐心是最好的药。\n\n💡 焦虑方：练习在被安抚后说"我现在感觉好多了"——让伴侣知道什么有用。\n💡 安全方：主动给出 reassurance——主动发一条消息、一个拥抱，比等对方来要好得多。'
      },
      'secure+avoidant': {
        source: 'ECR·安全与回避',
        text: '你的独立和理性是自己的优势，但亲密关系的深度有时需要你主动迈出一步。回避不是不爱，而是习惯了"靠自己"。\n\n💡 回避方：尝试在小事上有意识地靠近——分享一件小事、表达一次感受。依赖不是软弱，是勇气的表现。\n💡 安全方：给对方足够的个人空间，用温和而非强烈的方式表达需求。'
      },
      'secure+fearful': {
        source: 'ECR·安全与恐惧',
        text: '恐惧型伴侣内心对安全与自由有同等渴望。你的稳定和一致性是对方最需要的东西。\n\n💡 用稳定的行动证明"我不会离开"，同时尊重对方需要空间的时候。避免忽冷忽热，建立可预测的互动模式。'
      },
      'anxious+anxious': {
        source: 'ECR·双焦虑',
        text: '你们俩都很敏感、都很在乎对方——这让你们能互相理解那种"TA不回消息我就慌了"的感受。但小心：两个人同时陷入焦虑，可能会互相放大。\n\n💡 约定"冷静时间"：当两个人都焦虑时，先各自冷静15分钟，再沟通。\n💡 一起培养独立的兴趣爱好——给彼此一些自己的空间。'
      },
      'avoidant+avoidant': {
        source: 'ECR·双回避',
        text: '你们都很独立、尊重彼此的空间——这很舒适。但也要注意：关系需要一定程度的亲密才能深入。\n\n💡 尝试每周设立一次"关系时间"——哪怕只是一起做饭、聊聊天。\n💡 练习表达情感：从"我今天过得不错"开始，慢慢到"我今天有点累，需要你抱一下"。'
      },
      'fearful+fearful': {
        source: 'ECR·双恐惧',
        text: '你们都既渴望亲密又害怕受伤——这种矛盾会让关系像过山车。但好消息是：你们比任何人都能理解对方的矛盾。\n\n💡 当"想逃跑"的感觉出现时，先告诉对方"我现在需要一点空间，但我不是要离开"。\n💡 考虑一起学习 EFT（情绪聚焦疗法），对恐惧型依恋特别有效。'
      },
      'anxious+fearful': {
        source: 'ECR·焦虑与恐惧',
        text: '焦虑型的"追"会触发恐惧型的"逃"，而恐惧型的"逃"又会触发焦虑型的"追"。这是一个需要双方觉察的循环。\n\n💡 焦虑方：当你想靠近时，先问自己"这是事实还是我的担忧在说话？"\n💡 恐惧方：当你想逃离时，先告诉对方"我需要一点空间，但这不是结束"。'
      },
      'avoidant+fearful': {
        source: 'ECR·回避与恐惧',
        text: '你们俩都可能倾向于退缩——一人是习惯性的，一人是矛盾性的。关系最大的风险是两人都"冷"下来。\n\n💡 约定"谁先感到距离远了，谁就主动说"——不要让冷战成为默认模式。'
      }
    };
    if (ECR_ADVICE[ecrCombo]) list.push(ECR_ADVICE[ecrCombo]);

    // 2. LAS 风格建议
    const lasAdvice = {
      'eros': '你注重外表的吸引和激情的碰撞，这是恋爱的火花。但注意：激情会随时间变化，给彼此时间了解内心层面，让感情更有深度。',
      'ludus': '你享受恋爱的轻松和自由，这本身没有问题。但在长期关系中，适当的承诺和责任感能让关系走得更远。试着打开心扉，可能会发现更深层的满足。',
      'storge': '你相信最好的爱情从友谊开始。这种细水长流的陪伴非常珍贵，偶尔制造一些浪漫和惊喜，能让关系增加更多火花。',
      'mania': '你的爱充满激情和投入，但也容易让自己和对方疲惫。学会给彼此空间，练习在焦虑时先深呼吸再回应——而不是立刻追问。',
      'pragma': '你的理性态度让关系稳定有序。但偶尔放松标准，跟随内心的感觉走——爱情不仅是一份清单，也是一种体验。',
      'agape': '你的无私令人感动，但健康的爱情是双向的。学会接受对方的付出同样重要——你值得被爱，不需要用付出换取爱。'
    };
    if (lasAdvice[a.las.primary]) {
      list.push({ source: a.las.primaryName + '（你的色彩风格）', text: lasAdvice[a.las.primary] });
    }
    if (lasAdvice[b.las.primary] && b.las.primary !== a.las.primary) {
      list.push({ source: b.las.primaryName + '（对方的色彩风格）', text: lasAdvice[b.las.primary] });
    }

    // 4. LL 爱语建议
    const aLLName = a.ll.primaryName;
    const bLLName = b.ll.primaryName;
    const aAdvice = LL.advice?.[a.ll.primary];
    if (aAdvice) {
      list.push({ source: aLLName + '（你的主要爱语）', text: '你的主要爱语是' + aLLName + '。' + aAdvice });
    }
    if (b.ll.primary !== a.ll.primary) {
      const bAdvice = LL.advice?.[b.ll.primary];
      if (bAdvice) {
        list.push({ source: bLLName + '（对方的主要爱语）', text: '对方的主要爱语是' + bLLName + '。' + (bAdvice || '') });
      }
    }
    // 爱语双向理解建议
    if (a.ll.primary !== b.ll.primary) {
      list.push({
        source: '💡 爱语匹配建议',
        text: '你们的主要爱语不同——这不是问题，但需要互相学习和适应。研究（Mostova 2022）表明：当伴侣有意识地用对方偏好的方式表达爱时，双方满意度都会提升。\n\n本周小任务：尝试用对方的主要爱语做一件小事——哪怕只是一句肯定的话、一个拥抱、或帮对方做一件小事。'
      });
    } else {
      list.push({
        source: '💡 爱语匹配建议',
        text: '你们的主要爱语相同——这意味着你们天然理解对方想要的表达方式。但注意：不要只用一种语言表达爱，试着拓展自己的"爱语库"，用多种方式表达关心。'
      });
    }

    // 5. STLS 维度理解
    const aStlsName = a.stls.type?.cn || '';
    const bStlsName = b.stls.type?.cn || '';
    if (aStlsName && bStlsName && aStlsName !== bStlsName) {
      list.push({
        source: '🔺 关系结构理解',
        text: '你对这段关系的认知是"' + aStlsName + '"，对方认为是"' + bStlsName + '"——这不代表谁对谁错，而是你们关注的点不同。\n\n建议一起讨论：你们对这段关系的期待是什么？未来的方向在哪里？'
      });
    }

    // 限制最多 8 条建议
    return list.slice(0, 8);
  },

  /* ---------- 渲染匹配码页 ---------- */
  renderCodePage: function() {
    const allResults = Utils.loadAllResults();
    const nickname = Profile.getNickname() || '我';
    const modules = ['ecr','stls','las','ll'];
    const completed = modules.filter(m => allResults[m] && allResults[m].timestamp);
    const allDone = completed.length === 4;

    let code = '';
    if (allDone) {
      code = CoupleCodec.encode(allResults);
    }

    const container = document.getElementById('couple-code-content');
    container.innerHTML = '';

    if (!allDone) {
      // 未完成状态
      container.innerHTML = `
        <div class="couple-code-page">
          <div class="ccp-section" style="text-align:center;padding:40px 20px;">
            <div style="font-size:3rem;margin-bottom:12px;">💕</div>
            <h3 style="margin-bottom:8px;">还差几步就能匹配啦</h3>
            <p style="font-size:0.85rem;color:var(--text-secondary);margin-bottom:20px;">完成全部 4 个测试，生成匹配码发给TA</p>
            <div style="text-align:left;max-width:240px;margin:0 auto 20px;">
              ${modules.map(m => {
                const done = allResults[m] && allResults[m].timestamp;
                const names = { ecr:'依恋类型诊断', stls:'爱情三元论', las:'爱情色彩风格', ll:'五种恋爱语言' };
                return `<div style="display:flex;align-items:center;gap:8px;padding:4px 0;font-size:0.85rem;">
                  <span style="color:${done?'#4CAF50':'var(--text-light)'}">${done?'✅':'☐'}</span>
                  ${names[m]}
                </div>`;
              }).join('')}
            </div>
            <button class="btn btn-primary" onclick="UI.renderHome();UI.switchPage('page-home')">继续完成测试</button>
          </div>
        </div>
      `;
      return;
    }

    // 已完成，显示匹配码
    container.innerHTML = `
      <div class="couple-code-page">
        <div class="ccp-section">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">
            <span style="font-size:2rem;">💕</span>
            <div>
              <div style="font-size:1.1rem;font-weight:700;">${nickname} · 你的匹配码</div>
              <div style="font-size:0.78rem;color:var(--text-light);">将此码分享给TA，TA输入后即可匹配</div>
            </div>
          </div>
          <div class="couple-code-display">
            <span class="code-text" id="my-code">${code}</span>
            <button class="code-copy" id="copy-code-btn">📋 复制</button>
          </div>
        </div>

        <div class="ccp-section">
          <div class="ccp-label">你的另一半是？</div>
          <div class="couple-input-row" style="margin-bottom:8px;">
            <input type="text" id="partner-name-input" placeholder="输入对方的名字（可选）" style="flex:1;font-size:0.85rem;">
          </div>
          <div class="ccp-label">输入对方的匹配码</div>
          <div class="couple-input-row">
            <input type="text" id="partner-code-input" placeholder="粘贴或输入对方的码..." style="font-family:monospace;font-size:0.78rem;">
            <button class="match-btn" id="start-match-btn">💕 匹配</button>
          </div>
          <div style="margin-top:12px;">
            <span class="couple-invite" id="invite-partner-btn">📤 TA还没有测？邀请TA →</span>
          </div>
        </div>

        <div class="ccp-section" style="text-align:center;padding:16px;">
          <div style="font-size:0.78rem;color:var(--text-light);">
            匹配分析完全在本地完成，数据不会上传到任何服务器
          </div>
        </div>
      </div>
    `;

    // 复制按钮
    document.getElementById('copy-code-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(code).then(() => {
        Utils.showToast('已复制到剪贴板 💕');
      }).catch(() => {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = code;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        Utils.showToast('已复制到剪贴板 💕');
      });
    });

    // 匹配按钮
    document.getElementById('start-match-btn').addEventListener('click', () => {
      const input = document.getElementById('partner-code-input').value.trim();
      if (!input) { Utils.showToast('请输入对方的匹配码'); return; }
      const nameInput = document.getElementById('partner-name-input');
      App._partnerNickname = nameInput ? (nameInput.value.trim() || '对方') : '对方';
      App.startCoupleMatch(input);
    });

    // 回车触发匹配
    document.getElementById('partner-code-input').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('start-match-btn').click();
    });

    // 邀请按钮
    document.getElementById('invite-partner-btn').addEventListener('click', () => {
      const shareText = `来测测我们的恋爱匹配度吧！我已经完成测试了，等你输入我的码 💕\nhttps://libaoxun688.github.io/love-test/`;
      if (navigator.share) {
        navigator.share({ title: '恋爱心理测试', text: shareText }).catch(() => {});
      } else {
        navigator.clipboard.writeText(shareText).then(() => {
          Utils.showToast('邀请文案已复制 📤');
        }).catch(() => {});
      }
    });
  },

  /* ---------- 渲染匹配结果 ---------- */
  renderMatchResult: function(matchData) {
    if (matchData.error) {
      document.getElementById('couple-result-content').innerHTML = `
        <div class="match-result-section" style="text-align:center;padding:60px 20px;">
          <div style="font-size:2rem;margin-bottom:12px;">⚠️</div>
          <p style="color:var(--text-secondary);">${matchData.error}</p>
          <button class="btn btn-outline" style="margin-top:20px;" onclick="UI.switchPage('page-home')">返回首页</button>
        </div>
      `;
      return;
    }

    const { total, tier, modules, advice, percentile } = matchData;
    const myNick = Profile.getNickname() || '我';
    const partnerNick = App._partnerNickname || 'TA';

    // 模块详情
    const modOrder = [
      { ...modules.ecr, color: '#9B72AA', key: 'ecr' },
      { ...modules.las, color: '#FF6B9D', key: 'las' },
      { ...modules.stls, color: '#FF7F6F', key: 'stls' },
      { ...modules.ll, color: '#E8736F', key: 'll' },
    ];

    // 各模块分析文案
    var analysisMap = (function() {
      var ecrTexts = {
        '安全型+安全型': '双方都是安全型依恋——最理想的组合。你们能自然给彼此安全感和空间，冲突时也能理性沟通。',
        '安全型+焦虑型': '安全型能给焦虑型提供稳定的情绪锚点，焦虑型的情感表达也让关系保持温度。安全方主动给予安全感，焦虑方练习自我安抚。',
        '安全型+回避型': '安全型的包容让回避型感到安全，但回避型需要学习主动靠近。关系深浅取决于愿意分享多少内心世界。',
        '安全型+恐惧型': '恐惧型既渴望亲密又害怕受伤，安全型的一致性和耐心是解药。建立稳定可预测的互动节奏比热烈表达更有效。',
        '焦虑型+焦虑型': '你们能深度共情对方的"不安全感"，但也容易互相放大焦虑。需要有意识地建立冷静机制，培养独立空间。',
        '焦虑型+回避型': '经典的"追逃模式"——最具挑战的组合之一。焦虑型越追回避型越逃。打破循环需要双方觉察并主动调整互动方式。',
        '焦虑型+恐惧型': '焦虑型的"追"触发恐惧型的"逃"，恐惧型的退缩又加剧焦虑。觉察这个循环是改变的第一步。',
        '回避型+回避型': '你们都很独立尊重空间——这很舒适。但感情需要一定亲密才能深入。定期创造关系时间，练习表达情感。',
        '回避型+恐惧型': '双方都可能倾向退缩——一人习惯性一人矛盾性。最大风险是两人都冷下来。主动打破沉默是关键。',
        '恐惧型+恐惧型': '你们比任何人都能理解对方"既想靠近又害怕"的心情。EFT情绪聚焦疗法对你们特别有效。'
      };
      var lasTexts = (function(ak, bk) {
        if (ak === '情欲之爱' || ak === '无私之爱' || bk === '情欲之爱' || bk === '无私之爱') {
          if (ak === bk) return '相同的爱情风格——你们对爱情的期待和理解高度一致，这会让沟通变得顺畅。';
        }
        if ((ak === '情欲之爱' && bk === '友谊之爱') || (ak === '友谊之爱' && bk === '情欲之爱')) return '激情与温暖的结合——既有火花又有温度，是非常互补的组合。';
        if ((ak === '情欲之爱' && bk === '实用之爱') || (ak === '实用之爱' && bk === '情欲之爱')) return '浪漫与现实主义者——一方向往激情，一方注重实际。彼此欣赏对方的差异就能互补。';
        if (ak === bk) return '相同的爱情风格让你们的恋爱语言高度同步，对关系的期待也较为一致。';
        return '不同的爱情风格意味着你们对"爱"的表达方式有别——这不是问题，而是互相理解的机会。';
      })(modules.las.my, modules.las.partner);
      var stlsText = (function(ak, bk) {
        if (!ak || !bk) return '';
        if (ak === bk) return '你们对关系的认知一致——都认为这段关系是「' + ak + '」。这种共识是关系稳定的基础。';
        return '你对这段关系的认知是「' + ak + '」，对方认为是「' + bk + '」。不妨一起聊聊彼此的期待——这不代表谁对谁错。';
      })(modules.stls.my, modules.stls.partner);
      var llText = (function(ak, bk) {
        if (!ak || !bk) return '';
        if (ak === bk) return '爱语相同——你们天然理解对方想要的爱的方式。注意拓展爱语库，用多种方式表达关心。';
        return '爱语不同——你需要用对方偏好的方式表达爱，而非用你自己喜欢的方式。研究证明，适应对方爱语能显著提升关系满意度。';
      })(modules.ll.my, modules.ll.partner);

      return { ecrTexts: ecrTexts, lasTexts: lasTexts, stlsText: stlsText, llText: llText };
    })();

    // 获取模块分析文案
    var getAnalysis = function(modKey, myType, partnerType) {
      if (modKey === 'ecr') {
        var combo = myType + '+' + partnerType;
        return analysisMap.ecrTexts[combo] || '了解彼此的依恋模式是改善关系的第一步。';
      }
      if (modKey === 'las') return analysisMap.lasTexts;
      if (modKey === 'stls') return analysisMap.stlsText;
      if (modKey === 'll') return analysisMap.llText;
      return '';
    };

    let html = `
      <!-- Hero -->
      <div class="match-result-section match-hero" style="border-top:4px solid ${tier.color};">
        <div class="mh-badge">${tier.icon}</div>
        <div class="mh-title" style="color:${tier.color};">${tier.name}</div>
        <div class="mh-quote">${tier.quote}</div>
        <div class="mh-names">${myNick} ❤️ ${partnerNick}</div>
        <div class="mh-score" style="color:${tier.color};">${total}%</div>
        <div class="mh-bar" style="max-width:200px;">
          <div class="mh-bar-fill" style="width:${total}%;background:${tier.color};"></div>
        </div>
        <div class="mh-compare">超过了 ${percentile}% 的情侣</div>
      </div>

      <!-- 模块匹配分析 -->
      <div class="match-result-section">
        <div style="font-size:0.9rem;font-weight:700;margin-bottom:12px;">📊 各模块匹配分析</div>
        <div class="match-module-list">
          ${modOrder.map(m => {
            var analysisText = getAnalysis(m.key, m.my, m.partner);
            return `
            <div class="match-module-item">
              <div class="mm-header">
                <span class="mm-icon">${m.icon}</span>
                <span class="mm-name">${m.label}</span>
                <span class="mm-score" style="color:${m.color};">${m.score}%</span>
              </div>
              <div class="mm-types">${m.my} → ${m.partner}</div>
              <div class="mm-bar">
                <div class="mm-bar-fill" style="width:${m.score}%;background:${m.color};"></div>
              </div>
              ${analysisText ? '<div class="mm-analysis">📖 ' + analysisText + '</div>' : ''}
            </div>
            `;
          }).join('')}
        </div>
      </div>

      <!-- 科学相处指南 -->
      <div class="match-result-section">
        <div style="font-size:0.9rem;font-weight:700;margin-bottom:12px;">💡 相处指南</div>
        <div class="match-advice-list">
          ${advice.map(a => `
            <div class="match-advice-item">
              <div class="ma-label">${a.source}</div>
              <div class="ma-text">${a.text.replace(/\n/g, '<br>')}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('couple-result-content').innerHTML = html;

    // 分享按钮
    document.getElementById('match-share-btn').onclick = () => {
      Utils.generateMatchCard(matchData, myNick, partnerNick);
    };
  }
};
window.CoupleMatch = CoupleMatch;
