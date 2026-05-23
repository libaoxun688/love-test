/* ===== ECR 亲密关系经历量表 — 数据 ===== */
/* 来源: Brennan, Clark & Shaver (1998); Fraley, Waller & Brennan (2000) */

const ECR = {
  // 全量36题
  allQuestions: [
    // ---- 回避维度 (18题) ----
    { id: 1,  dim: 'avoidance', reverse: false, cn: '总的来说，我不喜欢让恋人知道自己内心深处的感觉。', en: "I prefer not to show my partner how I feel deep down." },
    { id: 2,  dim: 'anxiety',   reverse: false, cn: '我担心我会被抛弃。', en: "I'm afraid that I will lose my partner's love." },
    { id: 3,  dim: 'avoidance', reverse: true,  cn: '我觉得跟恋人亲近是一件惬意的事情。', en: "I am very comfortable being close to my partner." },
    { id: 4,  dim: 'anxiety',   reverse: false, cn: '我很担心我的恋爱关系。', en: "I worry a lot about my relationships." },
    { id: 5,  dim: 'avoidance', reverse: false, cn: '当恋人开始要跟我亲近时，我发现我自己在退缩。', en: "When my partner starts to get close, I find myself pulling back." },
    { id: 6,  dim: 'anxiety',   reverse: false, cn: '我担心恋人不会像我关心他/她那样地关心我。', en: "I worry that my partner doesn't care about me as much as I care about them." },
    { id: 7,  dim: 'avoidance', reverse: false, cn: '当恋人希望跟我非常亲近时，我会觉得不自在。', en: "I get uncomfortable when my partner wants to be very close." },
    { id: 8,  dim: 'anxiety',   reverse: false, cn: '我有点担心会失去恋人。', en: "I worry a bit about losing my partner." },
    { id: 9,  dim: 'avoidance', reverse: false, cn: '我觉得对恋人开诚布公，不是一件很舒服的事情。', en: "I don't feel comfortable opening up to my partner." },
    { id: 10, dim: 'anxiety',   reverse: false, cn: '我常常希望恋人对我的感情和我对恋人的感情一样强烈。', en: "I often wish my partner's feelings for me were as strong as mine." },
    { id: 11, dim: 'avoidance', reverse: false, cn: '我想与恋人亲近，但我又总是会退缩不前。', en: "I want to get close to my partner, but I keep pulling back." },
    { id: 12, dim: 'anxiety',   reverse: false, cn: '我常常想与恋人形影不离，但有时这样会把恋人吓跑。', en: "I often want to be inseparable from my partner, but it sometimes scares them away." },
    { id: 13, dim: 'avoidance', reverse: false, cn: '当恋人跟我过分亲密的时候，我会感到内心紧张。', en: "I feel tense when my partner is too intimate with me." },
    { id: 14, dim: 'anxiety',   reverse: false, cn: '我担心一个人独处。', en: "I worry about being alone." },
    { id: 15, dim: 'avoidance', reverse: true,  cn: '我愿意把我内心的想法和感觉告诉恋人，我觉得这是一件自在的事情。', en: "I feel comfortable sharing my inner thoughts and feelings with my partner." },
    { id: 16, dim: 'anxiety',   reverse: false, cn: '我想跟恋人非常亲密的愿望，有时会把恋人吓跑。', en: "My desire to be very close sometimes scares my partner away." },
    { id: 17, dim: 'avoidance', reverse: false, cn: '我试图避免与恋人变得太亲近。', en: "I try to avoid getting too close to my partner." },
    { id: 18, dim: 'anxiety',   reverse: false, cn: '我需要我的恋人一再地保证他/她是爱我的。', en: "I need my partner to reassure me of their love over and over." },
    { id: 19, dim: 'avoidance', reverse: true,  cn: '我觉得我比较容易与恋人亲近。', en: "I find it relatively easy to get close to my partner." },
    { id: 20, dim: 'anxiety',   reverse: false, cn: '我觉得自己在要求恋人把更多的感觉以及对恋爱关系的投入程度表现出来。', en: "I feel I demand more emotional expression and commitment from my partner." },
    { id: 21, dim: 'avoidance', reverse: false, cn: '我发现让我依赖恋人，是一件困难的事情。', en: "I find it difficult to depend on my partner." },
    { id: 22, dim: 'anxiety',   reverse: true,  cn: '我并不是常常担心被恋人抛弃。', en: "I don't often worry about being abandoned by my partner." },
    { id: 23, dim: 'avoidance', reverse: false, cn: '我倾向于不跟恋人过分亲密。', en: "I tend not to get too close with my partner." },
    { id: 24, dim: 'anxiety',   reverse: false, cn: '如果我无法得到恋人的注意和关心，我会心烦意乱或者生气。', en: "I get upset or angry if I don't get my partner's attention and care." },
    { id: 25, dim: 'avoidance', reverse: true,  cn: '我跟恋人什么事情都讲。', en: "I tell my partner just about everything." },
    { id: 26, dim: 'anxiety',   reverse: false, cn: '我发现恋人并不愿意像我所想的那样跟我亲近。', en: "I find that my partner isn't willing to get as close as I'd like." },
    { id: 27, dim: 'avoidance', reverse: true,  cn: '我经常与恋人讨论我所遇到的问题以及我关心的事情。', en: "I often discuss my problems and concerns with my partner." },
    { id: 28, dim: 'anxiety',   reverse: false, cn: '如果我还没有恋人的话，我会感到有点焦虑和不安。', en: "If I don't have a partner, I feel somewhat anxious and uneasy." },
    { id: 29, dim: 'avoidance', reverse: true,  cn: '我觉得依赖恋人是很自在的事情。', en: "I feel comfortable depending on my partner." },
    { id: 30, dim: 'anxiety',   reverse: false, cn: '如果恋人不能像我所希望的那样在我身边时，我会感到灰心丧气。', en: "I feel frustrated when my partner isn't around as much as I'd like." },
    { id: 31, dim: 'avoidance', reverse: true,  cn: '我并不在意从恋人那里寻找安慰、听取劝告、得到帮助。', en: "I don't mind seeking comfort, advice, and help from my partner." },
    { id: 32, dim: 'anxiety',   reverse: false, cn: '如果在我需要的时候，恋人却不在我身边，我会感到沮丧。', en: "I feel depressed when my partner isn't there when I need them." },
    { id: 33, dim: 'avoidance', reverse: true,  cn: '在需要的时候，我向恋人求助是很有用的。', en: "It's helpful to turn to my partner when I'm in need." },
    { id: 34, dim: 'anxiety',   reverse: false, cn: '当恋人不赞同我时，我觉得确实是我不好。', en: "When my partner disagrees with me, I feel like it's my fault." },
    { id: 35, dim: 'avoidance', reverse: true,  cn: '我会在很多事情上向恋人求助，包括寻求安慰和得到承诺。', en: "I turn to my partner for many things, including comfort and reassurance." },
    { id: 36, dim: 'anxiety',   reverse: false, cn: '当恋人不花时间和我在一起时，我会感到怨恨。', en: "I feel resentful when my partner doesn't spend time with me." },
  ],

  // 各版本题号索引 (1-based)
  versions: {
    light:  [1,2,3,4,  7,8,9,10,  17,18,21,22],   // 12题
    standard: [1,2,3,4,5,6,7,8,9,10,11,12, 13,14,15,16,17,18,19,20,21,22,23,24], // 24题
    full: 'all'  // 36题
  },

  // Fisher 线性判别系数
  fisher: {
    secure:  { a: 3.2893296, b: 5.4725318, c: -11.5307833 },
    fearful: { a: 7.2371075, b: 8.1776448, c: -32.3553266 },
    preoccupied: { a: 3.9246754, b: 9.7102446, c: -28.4573220 },
    dismissive:  { a: 7.3654621, b: 4.9392039, c: -22.2281088 }
  },

  // 常模阈值（精简/标准版用）
  threshold: 3.5,

  // 4种类型信息
  types: {
    secure: {
      cn: '安全型',
      en: 'Secure',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
      icon: '🌱',
      desc: '你在感情中能够自然而然地亲近对方，同时保持健康的独立性。你相信自己是值得被爱的，也相信伴侣会真心对待你。你能够坦诚地表达情感和需求，面对冲突时愿意积极沟通解决，而不是逃避或过度反应。',
      advice: '你的依恋风格是情感关系中的理想基础。继续保持你健康的情感表达和沟通方式。在选择伴侣时，注意识别对方的依恋风格，有时你可能需要耐心帮助焦虑型伴侣获得安全感，或帮助回避型伴侣打开心扉。',
      partnerAdvice: '与安全型伴侣相处很舒适：直接表达需求，他们会理解。他们不害怕亲密，也不过度依赖，你可以放松地做自己。'
    },
    anxious: {
      cn: '焦虑型',
      en: 'Anxious / Preoccupied',
      color: '#FF9800',
      bgColor: '#FFF3E0',
      icon: '💭',
      desc: '你极度渴望亲密和确认，在感情中容易患得患失。你非常敏感于伴侣的情绪和行为的细微变化，常常需要对方的安抚和保证来获得安全感。你爱得深沉而热烈，但这种强烈的情感需求有时会让对方感到压力。',
      advice: '你的情感丰富而深刻，这是你的天赋。但学会给自己安全感同样重要：培养独立的生活圈子和兴趣爱好，练习自我安抚和情绪调节。选择一个能够理解你的情感需求、愿意给你稳定回应的伴侣。在感到焦虑时，先问自己："这是事实，还是我的担忧在说话？"',
      partnerAdvice: '与焦虑型伴侣相处：给予稳定的回应和 reassurance，及时回复消息，主动表达爱意。理解他们的敏感并非不信任，而是内心对安全感的渴望。'
    },
    avoidant: {
      cn: '回避型',
      en: 'Dismissive-Avoidant',
      color: '#2196F3',
      bgColor: '#E3F2FD',
      icon: '🏔️',
      desc: '你极度重视独立和个人空间，在亲密关系中倾向于保持情感距离。你觉得自己完全可以独立生活，不需要依赖他人。当关系变得太亲密或对方情感需求增加时，你本能地想要后退和逃离。你习惯用理性掩盖情感，在冲突时倾向于冷处理。',
      advice: '你的独立和理性是你的优势，但亲密关系的深度来自于情感上的坦诚和脆弱。尝试在小事上有意识地靠近对方：分享一件小事、表达一次真实的感受。接纳自己也需要情感连接的事实——依赖他人不是软弱，而是勇气的表现。',
      partnerAdvice: '与回避型伴侣相处：给他们足够的个人空间，不要过度追求亲密。用温和而非强烈的方式表达需求。尊重他们的独立性，同时温柔地鼓励情感表达。'
    },
    fearful: {
      cn: '恐惧/矛盾型',
      en: 'Fearful-Avoidant / Disorganized',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
      icon: '🌀',
      desc: '你的内心存在着一场拉锯战：你渴望亲密的连接和爱，但同时深深地害怕受伤和被拒绝。你在"想要靠近"和"害怕靠近"之间反复摇摆。当你感到安全时你渴望亲密，但当关系真正走近时你又感到恐惧而退缩。',
      advice: '你的矛盾源于内心深处对安全与自由的同等渴望。首先要理解：这种"既想靠近又想逃跑"的感受是完全正常的。学会识别自己的情感模式——什么触发了你想逃离的冲动？什么让你感到足够安全？给自己时间和耐心。心理咨询（如EFT情绪聚焦疗法）对恐惧型依恋有很好的帮助。',
      partnerAdvice: '与恐惧型伴侣相处：保持耐心和一致性至关重要。用稳定的行动证明你不会离开，同时尊重他们需要空间的时候。避免忽冷忽热，建立可预测的互动模式。'
    }
  },

  // 计算分数 - 精简/标准版用维度均分法
  // questions 参数限定只计算已作答的题目（精简/标准版传 questions 子集）
  scoreByMean: function(answers, questions) {
    let anxietyItems = [], avoidanceItems = [];
    let items = questions || this.allQuestions;
    items.forEach((q, i) => {
      let score = answers[i] || 0;
      if (q.reverse) score = 8 - score;
      if (q.dim === 'anxiety') anxietyItems.push(score);
      else avoidanceItems.push(score);
    });
    let anxiety = anxietyItems.reduce((a,b)=>a+b,0) / anxietyItems.length;
    let avoidance = avoidanceItems.reduce((a,b)=>a+b,0) / avoidanceItems.length;
    return { anxiety, avoidance };
  },

  // 计算分数 - 完整版用 Fisher 判别（仅完整36题调用，不传 questions）
  scoreByFisher: function(answers) {
    let { anxiety, avoidance } = this.scoreByMean(answers);
    let scores = {};
    for (let [key, coef] of Object.entries(this.fisher)) {
      scores[key] = coef.a * avoidance + coef.b * anxiety + coef.c;
    }
    let maxType = Object.entries(scores).reduce((a,b) => a[1] > b[1] ? a : b)[0];
    return { anxiety, avoidance, scores, type: maxType };
  }

};
