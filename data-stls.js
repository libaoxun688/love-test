/* ===== STLS 斯滕伯格爱情三角量表 — 数据 ===== */
/* 来源: Sternberg (1986, 1988); Kowal et al. (2024) TLS-15 37-language validation */

const STLS = {
  // 简化版 TLS-15 (5分制)
  short: {
    scale: 5,
    threshold: 3.0,
    questions: [
      // 亲密 Intimacy
      { id: 1,  dim: 'intimacy',  cn: '我与伴侣的关系很温暖治愈。',   en: 'My relationship with my partner is warm and healing.' },
      { id: 2,  dim: 'intimacy',  cn: '我从伴侣那里得到相当多的情感支持。', en: 'I receive considerable emotional support from my partner.' },
      { id: 3,  dim: 'intimacy',  cn: '我在生活中非常重视伴侣。',     en: 'I value my partner greatly in my life.' },
      { id: 4,  dim: 'intimacy',  cn: '我与伴侣关系融洽。',          en: 'I have a comfortable relationship with my partner.' },
      { id: 5,  dim: 'intimacy',  cn: '我觉得伴侣真正理解我。',      en: 'I feel my partner truly understands me.' },
      // 激情 Passion
      { id: 6,  dim: 'passion',   cn: '我与伴侣的关系非常浪漫化。',   en: 'My relationship with my partner is very romantic.' },
      { id: 7,  dim: 'passion',   cn: '我觉得伴侣非常有个人魅力。',   en: 'I find my partner very personally attractive.' },
      { id: 8,  dim: 'passion',   cn: '我无法想象还有其他人能像ta一样让我快乐。', en: 'I cannot imagine another person making me as happy.' },
      { id: 9,  dim: 'passion',   cn: '我们的关系有一种"神奇"的相互吸引魔力。', en: 'There is something magical about our relationship.' },
      { id: 10, dim: 'passion',   cn: '我与伴侣的关系充满激情。',    en: 'My relationship with my partner is passionate.' },
      // 承诺 Commitment
      { id: 11, dim: 'commitment', cn: '我对与伴侣关系的稳定有信心。', en: 'I have confidence in the stability of my relationship.' },
      { id: 12, dim: 'commitment', cn: '我认为伴侣的承诺是笃定的。', en: 'I believe my partner is committed.' },
      { id: 13, dim: 'commitment', cn: '我确信我爱ta。',           en: 'I am certain of my love.' },
      { id: 14, dim: 'commitment', cn: '我认为我们的关系是一辈子的。', en: 'I see our relationship as lifelong.' },
      { id: 15, dim: 'commitment', cn: '我对伴侣有一种责任感。',    en: 'I feel a sense of responsibility toward my partner.' },
    ]
  },

  // 完整版 TLS-45 (9分制)
  full: {
    scale: 9,
    threshold: 5.0,
    questions: [
      // 亲密 Intimacy (1-15)
      { id: 1,  dim: 'intimacy',  cn: '我积极支持伴侣的幸福。',        en: 'I am actively supportive of my partner\'s well-being.' },
      { id: 2,  dim: 'intimacy',  cn: '我与伴侣之间关系很温暖。',      en: 'I have a warm relationship with my partner.' },
      { id: 3,  dim: 'intimacy',  cn: '在我需要时，我很信赖伴侣。',    en: 'I am able to count on my partner in times of need.' },
      { id: 4,  dim: 'intimacy',  cn: '伴侣在需要时也能信赖我。',      en: 'My partner can count on me in times of need.' },
      { id: 5,  dim: 'intimacy',  cn: '我愿意和伴侣分享我自己及拥有的东西。', en: 'I am willing to share myself with my partner.' },
      { id: 6,  dim: 'intimacy',  cn: '我从伴侣那里得到许多感情支持。', en: 'I receive considerable emotional support from my partner.' },
      { id: 7,  dim: 'intimacy',  cn: '我给伴侣许多感情支持。',        en: 'I give considerable emotional support to my partner.' },
      { id: 8,  dim: 'intimacy',  cn: '我和伴侣沟通良好。',            en: 'I communicate well with my partner.' },
      { id: 9,  dim: 'intimacy',  cn: '在我的生活中，我非常看重伴侣。', en: 'I value my partner greatly in my life.' },
      { id: 10, dim: 'intimacy',  cn: '我感觉与伴侣亲近。',            en: 'I feel close to my partner.' },
      { id: 11, dim: 'intimacy',  cn: '我和伴侣之间的关系让我感觉舒服。', en: 'I have a comfortable relationship with my partner.' },
      { id: 12, dim: 'intimacy',  cn: '我感觉我真正理解伴侣。',        en: 'I feel that I really understand my partner.' },
      { id: 13, dim: 'intimacy',  cn: '我感觉伴侣真正理解我。',        en: 'I feel my partner really understands me.' },
      { id: 14, dim: 'intimacy',  cn: '我感觉我能真正信任伴侣。',      en: 'I feel I can really trust my partner.' },
      { id: 15, dim: 'intimacy',  cn: '我可以和伴侣分享内心深处的想法。', en: 'I share deeply personal thoughts with my partner.' },
      // 激情 Passion (16-30)
      { id: 16, dim: 'passion',   cn: '只要见到伴侣我就会兴奋。',      en: 'Just seeing my partner excites me.' },
      { id: 17, dim: 'passion',   cn: '我发觉一整天都会频繁地想到伴侣。', en: 'I find myself thinking about my partner frequently.' },
      { id: 18, dim: 'passion',   cn: '我和伴侣的关系非常浪漫。',      en: 'My relationship with my partner is very romantic.' },
      { id: 19, dim: 'passion',   cn: '我发现伴侣非常具有个人魅力。',  en: 'I find my partner very personally attractive.' },
      { id: 20, dim: 'passion',   cn: '我认为伴侣很理想。',           en: 'I idealize my partner.' },
      { id: 21, dim: 'passion',   cn: '无法想象别人能带来同样的快乐。', en: 'I cannot imagine another person making me as happy.' },
      { id: 22, dim: 'passion',   cn: '我更愿意和伴侣待在一起。',      en: 'I would rather be with my partner than anyone else.' },
      { id: 23, dim: 'passion',   cn: '没有什么比我们的关系更重要。',   en: 'Nothing is more important than my relationship.' },
      { id: 24, dim: 'passion',   cn: '我特别喜欢和伴侣身体接触。',    en: 'I especially like physical contact with my partner.' },
      { id: 25, dim: 'passion',   cn: '我们的关系中有一种"魔力"。',    en: 'There is something magical about our relationship.' },
      { id: 26, dim: 'passion',   cn: '我真心爱慕伴侣。',             en: 'I adore my partner.' },
      { id: 27, dim: 'passion',   cn: '我不能想象没有伴侣的生活。',    en: 'I cannot imagine life without my partner.' },
      { id: 28, dim: 'passion',   cn: '我和伴侣的关系充满激情。',      en: 'My relationship with my partner is passionate.' },
      { id: 29, dim: 'passion',   cn: '看爱情题材时总会想起伴侣。',    en: 'I think of my partner when I see romantic movies.' },
      { id: 30, dim: 'passion',   cn: '伴侣常在我的幻想中出现。',      en: 'I fantasize about my partner.' },
      // 承诺 Commitment (31-45)
      { id: 31, dim: 'commitment', cn: '我知道我关心伴侣。',          en: 'I know that I care about my partner.' },
      { id: 32, dim: 'commitment', cn: '我致力于维持和伴侣的关系。',   en: 'I am committed to maintaining my relationship.' },
      { id: 33, dim: 'commitment', cn: '我不会让其他人干扰我们的关系。', en: 'I would not let others come between us.' },
      { id: 34, dim: 'commitment', cn: '我相信我们的关系是稳定的。',   en: 'I have confidence in our relationship stability.' },
      { id: 35, dim: 'commitment', cn: '我不会让任何事情干扰我的承诺。', en: 'I would not let anything get in the way of commitment.' },
      { id: 36, dim: 'commitment', cn: '我期望我们的爱持续一生。',    en: 'I expect my love to last a lifetime.' },
      { id: 37, dim: 'commitment', cn: '我常感到对伴侣强烈的责任感。',  en: 'I feel a strong responsibility for my partner.' },
      { id: 38, dim: 'commitment', cn: '我的承诺不会轻易改变。',      en: 'I view my commitment as a solid one.' },
      { id: 39, dim: 'commitment', cn: '我无法想象关系结束的情景。',   en: 'I cannot imagine ending my relationship.' },
      { id: 40, dim: 'commitment', cn: '我能确定我对伴侣的爱。',      en: 'I am certain of my love for my partner.' },
      { id: 41, dim: 'commitment', cn: '我认为我们的关系会长久。',    en: 'I view my relationship as permanent.' },
      { id: 42, dim: 'commitment', cn: '这段关系是个好决定。',        en: 'I view my relationship as a good decision.' },
      { id: 43, dim: 'commitment', cn: '我对伴侣有责任感。',          en: 'I feel a sense of responsibility toward my partner.' },
      { id: 44, dim: 'commitment', cn: '我打算继续维持这段关系。',    en: 'I plan to continue my relationship.' },
      { id: 45, dim: 'commitment', cn: '即使困难时我仍会坚守承诺。',  en: 'Even when it\'s hard, I remain committed.' },
    ]
  },

  // 8种恋爱状态
  types: {
    nonlove:      { cn: '无爱',          en: 'Nonlove',          i:0, p:0, c:0, color: '#BDBDBD', icon: '⬜',
      desc: '目前关系中三个维度（亲密、激情、承诺）均不显著。这可能是一段尚未发展的关系，或者已经走到尽头的关系。',
      advice: '如果你正处于一段"无爱"的关系中，诚实面对自己的感受很重要。思考这段关系是否还值得维系，或者需要投入更多努力来建立情感连接。如果这是你与某个人的初始阶段，不必着急——真正的爱需要时间培养。' },
    liking:       { cn: '喜欢',          en: 'Liking',           i:1, p:0, c:0, color: '#81C784', icon: '💛',
      desc: '你们之间有温暖的情感连接和亲近感，但缺少激情和长期承诺。这更像是深厚的友谊或好感，而不是完整的爱情。',
      advice: '这种状态是健康关系的基础——真正的爱情应该建立在喜欢之上。如果你希望进一步发展，可以尝试创造一些浪漫时刻，增进彼此的激情元素。但也要尊重：不是所有好感都需要变成爱情。' },
    infatuation:  { cn: '迷恋',          en: 'Infatuation',      i:0, p:1, c:0, color: '#FF8A65', icon: '🔥',
      desc: '强烈的激情和吸引力，但没有真正的亲密感和长期承诺。这就是通常所说的"一见钟情"或"热恋期"——感觉强烈但缺乏深度。',
      advice: '迷恋的感觉很美妙，但注意不要被激情冲昏头脑。在做出重大决定前，给彼此时间深入了解对方，让亲密感跟上激情的步伐。真正的爱需要时间沉淀。' },
    empty:        { cn: '空洞的爱',      en: 'Empty Love',       i:0, p:0, c:1, color: '#90A4AE', icon: '🕸️',
      desc: '只有承诺在维持关系，亲密感和激情已经消失。这常见于长期关系中的"搭伙过日子"状态——两人只是出于责任或习惯在一起。',
      advice: '空洞的爱并不意味着关系没有挽救余地。尝试重新点燃激情：安排约会、制造惊喜、重建情感连接。如果双方愿意共同努力，空洞的爱可以重新注入活力。真诚的沟通是第一步。' },
    romantic:     { cn: '浪漫之爱',      en: 'Romantic Love',    i:1, p:1, c:0, color: '#FF7043', icon: '💕',
      desc: '既有情感亲密又有强烈激情，但缺乏长期承诺。这是典型的恋爱关系——两人彼此吸引、相互理解，但还没有做出长久的约定。',
      advice: '浪漫之爱是爱情中最令人心动的阶段。享受当前的美好，同时也要思考：你们是否准备好了走向更长远的承诺？如果你们价值观一致，这种浪漫完全可以发展成更深刻的连接。' },
    companionate: { cn: '同伴之爱',      en: 'Companionate Love', i:1, p:0, c:1, color: '#66BB6A', icon: '🤝',
      desc: '亲密和承诺都很高，但激情已经淡化。这是长期伴侣常见的关系状态——两人彼此信任、相互扶持，像最好的朋友一样，但火花不如从前。',
      advice: '同伴之爱是许多长期关系的归宿，它稳定而珍贵。但如果你怀念激情，完全可以主动创造改变：安排二人旅行、尝试新的共同爱好、增加身体接触。激情可以被重新唤醒。' },
    fatuous:      { cn: '愚蠢之爱',      en: 'Fatuous Love',     i:0, p:1, c:1, color: '#AB47BC', icon: '⚡',
      desc: '激情和承诺结合，却缺少亲密基础。常见于闪电恋爱或闪婚——两人被激情驱动快速做出承诺，但还没有建立真正的情感了解和信任。',
      advice: '如果你正处于这样的关系中，建议放慢脚步。激情驱动的承诺可能缺乏根基，花时间去真正了解对方——价值观、生活习惯、情感需求。让亲密感跟上关系发展的速度。' },
    consummate:   { cn: '完美之爱',      en: 'Consummate Love',  i:1, p:1, c:1, color: '#E91E63', icon: '💎',
      desc: '亲密、激情、承诺三者兼备——斯滕伯格理论中最完整的爱情形态。你们既是彼此的知己，也是爱人和战友，关系既有温度又有深度。',
      advice: '完美之爱是许多人向往的理想状态，但维持它需要持续的努力。三个维度都可能随时间变化，定期"检视"你们的关系：亲密感是否足够？激情是否需要更新？承诺是否坚定？好的爱情需要用心经营。' }
  },

  getTypeLabel: function(i, p, c) {
    for (let [key, t] of Object.entries(this.types)) {
      if (t.i === i && t.p === p && t.c === c) return { key, ...t };
    }
    return { key: 'nonlove', ...this.types.nonlove };
  },

  // 判定
  classify: function(scores, threshold) {
    let i = scores.intimacy >= threshold ? 1 : 0;
    let p = scores.passion >= threshold ? 1 : 0;
    let c = scores.commitment >= threshold ? 1 : 0;
    return this.getTypeLabel(i, p, c);
  },

  // 获取各维度得分
  compute: function(answers, version) {
    let data = version === 'short' ? this.short : this.full;
    let dims = { intimacy: [], passion: [], commitment: [] };
    data.questions.forEach((q, i) => {
      dims[q.dim].push(answers[i] || 0);
    });
    let scores = {};
    for (let [dim, vals] of Object.entries(dims)) {
      scores[dim] = vals.reduce((a,b)=>a+b,0) / vals.length;
    }
    let type = this.classify(scores, data.threshold);
    return { scores, type };
  }
};
