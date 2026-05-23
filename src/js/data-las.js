/* ===== LAS 爱情态度量表 — 数据 ===== */
/* 来源: Lee (1973); Hendrick & Hendrick (1986, 1998) */
/* 计分方式: 原始分直接使用（1-5，越高=越认同该风格） */

const LAS = {
  // 完整版42题 (6风格 × 7题)
  allQuestions: [
    // Eros 情欲之爱 (题号1,7,13,19,25,31,37)
    { id: 1,  style: 'eros',   cn: '我的爱人和我在第一次见面时，就立刻被彼此吸引。', en: "My partner and I were attracted to each other immediately." },
    { id: 2,  style: 'ludus',  cn: '我试着对爱人保持一种不确定且模糊的承诺。',       en: "I try to keep my partner uncertain about my commitment." },
    { id: 3,  style: 'storge', cn: '很难确切说明我和对方是何时从友情进展到爱情的。', en: "It's hard to say when friendship became love." },
    { id: 4,  style: 'pragma', cn: '在托付之前，我会先仔细思考对方是怎样的人。',     en: "I consider what kind of person my partner is before committing." },
    { id: 5,  style: 'mania',  cn: '当关系出现问题时，我会感到十分不适。',           en: "I feel very upset when my relationship has problems." },
    { id: 6,  style: 'agape',  cn: '我会付出所有去帮助爱人度过艰难的时刻。',         en: "I give my all to help my partner through hard times." },
    { id: 7,  style: 'eros',   cn: '我的爱人之间存在一股十足的肉体化学作用。',       en: "There is a strong physical chemistry between us." },
    { id: 8,  style: 'ludus',  cn: '我相信不被了解的部分会伤害到对方。',             en: "What my partner doesn't know about me would hurt them." },
    { id: 9,  style: 'storge', cn: '真诚的爱情首先需有一段时间的关心和喜欢。',       en: "True love first requires a period of caring and liking." },
    { id: 10, style: 'pragma', cn: '选择对象之前，我会先试着规划我的生活。',         en: "I plan my life before choosing a partner." },
    { id: 11, style: 'mania',  cn: '失恋时我会变得十分沮丧。',                     en: "I get very depressed when I lose love." },
    { id: 12, style: 'agape',  cn: '宁愿由我来承受苦痛，而不是让爱人承受。',         en: "I'd rather suffer than let my partner suffer." },
    { id: 13, style: 'eros',   cn: '我们在亲密接触时是十分激情且满足的。',           en: "Our physical intimacy is passionate and satisfying." },
    { id: 14, style: 'ludus',  cn: '我会有时候避免和爱人互相深入了解。',             en: "I sometimes avoid getting to know my partner deeply." },
    { id: 15, style: 'storge', cn: '我和前任仍能保持良好的友谊关系。',               en: "I maintain good friendships with ex-partners." },
    { id: 16, style: 'pragma', cn: '和生活背景相似的人相爱是最好的。',               en: "It's best to love someone from a similar background." },
    { id: 17, style: 'mania',  cn: '有时因身陷爱情而兴奋得睡不着觉。',               en: "Sometimes love keeps me up at night with excitement." },
    { id: 18, style: 'agape',  cn: '除非爱人先得到快乐，不然我不会感到快乐。',       en: "I'm not happy unless my partner is happy first." },
    { id: 19, style: 'eros',   cn: '我感到和我的爱人是天生一对。',                   en: "I feel we were meant for each other." },
    { id: 20, style: 'ludus',  cn: '我可以轻易快速地遗忘自己的风流韵事。',           en: "I can quickly forget romantic flings." },
    { id: 21, style: 'storge', cn: '最佳的爱情产生于长久的友谊。',                   en: "The best love grows out of long friendship." },
    { id: 22, style: 'pragma', cn: '对方如何看待我的家人是选择伴侣的考量之一。',     en: "How my partner views my family matters to me." },
    { id: 23, style: 'mania',  cn: '当爱人不再注意我时，我会感到浑身不适。',         en: "I feel uncomfortable when my partner doesn't notice me." },
    { id: 24, style: 'agape',  cn: '我常牺牲自己愿望来让爱人达成想要的。',           en: "I often sacrifice my wishes for my partner's." },
    { id: 25, style: 'eros',   cn: '我们在肉体上彼此吸引的过程十分快速。',           en: "We were physically attracted very quickly." },
    { id: 26, style: 'ludus',  cn: '如果爱人知道某些事会感到难过。',                 en: "My partner would be upset if they knew some things." },
    { id: 27, style: 'storge', cn: '很难确切说明我和爱人是何时堕入爱河的。',         en: "It's hard to say exactly when we fell in love." },
    { id: 28, style: 'pragma', cn: '对方能否成为好父母是选择伴侣的重要因素。',       en: "Whether my partner would be a good parent is important." },
    { id: 29, style: 'mania',  cn: '恋爱时难以集中注意力在其它事物上。',             en: "I have trouble focusing on other things when in love." },
    { id: 30, style: 'agape',  cn: '我的任何东西都可以让爱人自行取用。',             en: "I offer everything I have to my partner freely." },
    { id: 31, style: 'eros',   cn: '我和爱人十分了解彼此。',                         en: "My partner and I really understand each other." },
    { id: 32, style: 'ludus',  cn: '如果爱人太依赖我，我会想退缩。',                 en: "I pull back when my partner gets too dependent." },
    { id: 33, style: 'storge', cn: '爱情是深厚友谊而非神秘情绪。',                   en: "Love is deep friendship, not mysterious emotion." },
    { id: 34, style: 'pragma', cn: '对方如何看待我的职业是考量之一。',               en: "How my partner views my career is a consideration." },
    { id: 35, style: 'mania',  cn: '怀疑爱人和别人在一起时我无法放松。',             en: "I can't relax when I suspect my partner is with others." },
    { id: 36, style: 'agape',  cn: '即使爱人对我发怒，我仍无条件爱ta。',             en: "I love my partner unconditionally, even when angry." },
    { id: 37, style: 'eros',   cn: '爱人很符合我对外貌的理想标准。',                 en: "My partner matches my ideal physical standard." },
    { id: 38, style: 'ludus',  cn: '我享受和不同对象进行爱情游戏。',                 en: "I enjoy playing the game of love with different partners." },
    { id: 39, style: 'storge', cn: '我最满意的爱情关系是由友谊发展而来的。',         en: "My best relationships grew from friendships." },
    { id: 40, style: 'pragma', cn: '相爱前我会考虑基因兼容性。',                     en: "I consider genetic compatibility before falling in love." },
    { id: 41, style: 'mania',  cn: '被忽略时我会做蠢事来引起注意。',                 en: "I do stupid things to get attention when ignored." },
    { id: 42, style: 'agape',  cn: '为了爱人我愿忍受任何事情。',                     en: "I would endure anything for my partner." },
  ],

  // 简化版24题 (每风格4题: 取前4题)
  shortIds: [1,2,3,4,5,6, 7,8,9,10,11,12, 13,14,15,16,17,18, 19,20,21,22,23,24],

  // 6种风格信息
  styles: {
    eros:   { cn: '情欲之爱', en: 'Eros',         color: '#FF3D00', bgColor: '#FFF3E0', icon: '❤️',
      desc: '你信奉一见钟情的浪漫，注重外表和身体吸引。感情浓烈而快速，享受恋爱中的激情与化学作用。',
      advice: '你的热情感染力很强。注意不要仅因外表或冲动进入关系，给彼此一些时间了解内心层面，让感情更有深度。' },
    ludus:  { cn: '游戏之爱', en: 'Ludus',        color: '#FFD600', bgColor: '#FFFDE7', icon: '🎮',
      desc: '你把恋爱当作一场有趣的游戏，享受新鲜感和追逐的过程，不愿被承诺束缚。',
      advice: '你的轻松态度能避免很多情感负担，但要注意：长期关系中需要一定的承诺和责任感。适当地打开心扉，可能会发现更深层的满足。' },
    storge: { cn: '友谊之爱', en: 'Storge',       color: '#2196F3', bgColor: '#E3F2FD', icon: '🌊',
      desc: '你相信最好的爱情从友谊开始，追求细水长流的陪伴，而不是轰轰烈烈的激情。',
      advice: '你的爱情稳定而持久，令人安心。偶尔制造一些浪漫和惊喜，能让关系增加更多火花。' },
    mania:  { cn: '狂热之爱', en: 'Mania',        color: '#9C27B0', bgColor: '#F3E5F5', icon: '🔥',
      desc: '你在爱情中全情投入，占有欲和嫉妒心强，情绪随关系状态剧烈起伏。',
      advice: '你的爱充满激情和投入，但也要学会给彼此空间。培养自己的情绪调节能力，练习在焦虑时先深呼吸再回应。' },
    pragma: { cn: '实用之爱', en: 'Pragma',       color: '#4CAF50', bgColor: '#E8F5E9', icon: '📋',
      desc: '你在感情中非常理性务实，看重双方条件的匹配，会认真思考对方是否适合长期相处。',
      advice: '你的务实态度有助于建立稳定的关系。偶尔放松标准，跟随内心的感觉走，爱情不仅是一份清单，也是一种体验。' },
    agape:  { cn: '利他之爱', en: 'Agape',        color: '#FF9800', bgColor: '#FFF3E0', icon: '🕊️',
      desc: '你在爱中无私付出，把对方的幸福放在自己之前，愿意为爱牺牲一切。',
      advice: '你的无私令人感动，但也要记得照顾自己的需求。健康的爱情是双向的，学会接受对方的付出同样重要。' }
  },

  getStyleOrder: function() {
    return ['eros', 'ludus', 'storge', 'mania', 'pragma', 'agape'];
  },

  // 计算分数 (翻转后: 6-原始分, 越高越强)
  compute: function(answers, isShort) {
    let styleScores = { eros:[], ludus:[], storge:[], mania:[], pragma:[], agape:[] };
    let questions = isShort
      ? this.shortIds.map(id => this.allQuestions.find(q => q.id === id))
      : this.allQuestions;
    questions.forEach((q, i) => {
      let raw = answers[i] || 3;
      let flipped = raw;  // 原始分直接使用: 越高代表越认同该风格
      styleScores[q.style].push(flipped);
    });
    let result = {};
    for (let [style, vals] of Object.entries(styleScores)) {
      result[style] = vals.reduce((a,b)=>a+b,0) / vals.length;
    }
    // 从高到低排序
    let sorted = Object.entries(result).sort((a,b) => b[1] - a[1]);
    return {
      scores: result,
      primary: sorted[0][0],
      secondary: sorted[1][0],
      ranking: sorted
    };
  }
};
