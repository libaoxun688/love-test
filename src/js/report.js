/* ===== 综合个人分析报告 ===== */

const Report = {

  /* ---- 入口 ---- */
  generate: function(results) {
    const norm = this.normalizeAll(results);
    const radar = this.buildRadarData(norm);
    const crossAnalysis = this.runCrossAnalysis(results, norm);
    const portrait = this.generatePortrait(results, norm);
    const strengths = this.generateStrengths(results, norm);
    const advice = this.generateAdvice(results, norm);

    const data = {
      meta: { date: new Date().toLocaleDateString('zh-CN') },
      modules: norm,
      radar,
      crossAnalysis,
      portrait,
      strengths,
      advice
    };
    this._downloadData = data;
    this.render(data);
  },

  /* ---- 数据归一化 ---- */
  normalizeAll: function(results) {
    const ecr = results.ecr;
    const stls = results.stls;
    const las = results.las;
    const ll = results.ll;

    const ecrNorm = {
      type: ecr.type,
      typeCn: ECR.types[ecr.type]?.cn || '未知',
      typeEn: ECR.types[ecr.type]?.en || '',
      color: ECR.types[ecr.type]?.color || '#999',
      icon: ECR.types[ecr.type]?.icon || '?',
      anxiety: ecr.anxiety,
      avoidance: ecr.avoidance,
      security: Math.round((7 - ecr.anxiety) / 6 * 100),
      closeness: Math.round((7 - ecr.avoidance) / 6 * 100)
    };

    const maxS = stls.maxScore || 5;
    const stlsNorm = {
      type: stls.type,
      scores: stls.scores,
      intimacy: Math.round(stls.scores.intimacy / maxS * 100),
      passion: Math.round(stls.scores.passion / maxS * 100),
      commitment: Math.round(stls.scores.commitment / maxS * 100)
    };

    const styleOrder = ['eros','ludus','storge','mania','pragma','agape'];
    const sortedLas = styleOrder.map(s => ({ key: s, score: las.scores[s] })).sort((a,b) => b.score - a.score);
    const top3Avg = (sortedLas[0].score + sortedLas[1].score + sortedLas[2].score) / 3;
    const lasNorm = {
      primary: las.primary,
      primaryCn: LAS.styles[las.primary]?.cn || '未知',
      primaryColor: LAS.styles[las.primary]?.color || '#999',
      secondary: las.secondary,
      secondaryCn: LAS.styles[las.secondary]?.cn || '未知',
      scores: las.scores,
      ranking: sortedLas,
      breadth: Math.round(top3Avg / 5 * 100)
    };

    const llNorm = {
      primary: ll.primary,
      primaryCn: LL.labels[ll.primary]?.cn || '未知',
      primaryColor: LL.labels[ll.primary]?.color || '#999',
      secondary: ll.secondary,
      secondaryCn: LL.labels[ll.secondary]?.cn || '未知',
      scores: ll.scores,
      sorted: ll.sorted,
      isBilingual: ll.isBilingual
    };

    return { ecr: ecrNorm, stls: stlsNorm, las: lasNorm, ll: llNorm };
  },

  /* ---- 雷达图数据 ---- */
  buildRadarData: function(norm) {
    const dims = [
      { key: 'security',    label: '情感安全感',   value: norm.ecr.security,    color: '#4CAF50' },
      { key: 'closeness',   label: '关系亲近力',   value: norm.ecr.closeness,   color: '#2196F3' },
      { key: 'intimacy',    label: '亲密深度',     value: norm.stls.intimacy,   color: '#66BB6A' },
      { key: 'passion',     label: '激情热度',     value: norm.stls.passion,    color: '#FF7043' },
      { key: 'commitment',  label: '承诺坚定度',   value: norm.stls.commitment, color: '#42A5F5' },
      { key: 'breadth',     label: '爱的广度',     value: norm.las.breadth,     color: '#AB47BC' }
    ];
    return dims;
  },

  /* ---- 交叉分析规则 ---- */
  RULES: [
    { id: 'secure_consummate', weight: 10,
      match: r => r.ecr.type === 'secure' && r.stls.type.key === 'consummate',
      title: '理想关系配置：安全依恋 × 完美之爱',
      insight: '你的安全型依恋为「完美之爱」提供了最坚实的基础。你既能享受亲密，也能保持独立；既有激情，也有承诺。',
      detail: '研究表明，安全型依恋是维持亲密、激情、承诺三者平衡的关键心理基础。你拥有建立健康长期关系最有利的心理素质。' },
    { id: 'anxious_mania', weight: 9,
      match: r => r.ecr.type === 'anxious' && r.las.primary === 'mania',
      title: '情绪共振：焦虑依恋 × 狂热之爱',
      insight: '你的焦虑型依恋与狂热之爱风格叠加，情感体验强烈但容易起伏。',
      detail: '你渴望亲密又容易担心失去，这种敏感让你爱得深沉，但也容易因小事陷入情绪漩涡。学会自我安抚和给彼此空间，会让你的爱更从容。' },
    { id: 'avoidant_ludus', weight: 9,
      match: r => r.ecr.type === 'avoidant' && r.las.primary === 'ludus',
      title: '独立至上：回避依恋 × 游戏之爱',
      insight: '你重视个人自由和独立空间，倾向于在感情中保持轻盈的姿态。',
      detail: '你不喜欢被束缚，享受恋爱的轻松感。这种态度让你避免了很多情感负担，但也可能错失深层次连接的珍贵体验。尝试适当敞开内心，可能会发现意想不到的深度。' },
    { id: 'fearful_passion', weight: 8,
      match: r => r.ecr.type === 'fearful' && (r.stls.type.key === 'fatuous' || r.stls.type.key === 'romantic'),
      title: '矛盾情感：恐惧依恋 × 激情关系',
      insight: '你的内心在渴望靠近和害怕受伤之间反复摇摆，激情让你投入，亲密让你不安。',
      detail: '这种矛盾模式可能让你和伴侣都感到困惑。关键是要识别自己的情感触发点——什么让你想靠近，什么让你想逃跑？建立稳定、可预测的互动模式对你很重要。' },
    { id: 'secure_storge_quality', weight: 7,
      match: r => r.ecr.type === 'secure' && r.las.primary === 'storge' && r.ll.primary === 'B',
      title: '细水长流型：安全依恋 × 友谊之爱 × 精心时刻',
      insight: '你最看重的是陪伴的质量——爱情最好的样子就是在一起。',
      detail: '你认为爱情从友情中自然生长，最好的爱是彼此的陪伴。精心时刻是你的爱语，说明全神贯注的陪伴比任何浪漫形式都更能让你感受到爱。' },
    { id: 'high_commitment_pragma', weight: 7,
      match: r => r.stls.type.key && [1,1,1].includes(r.stls.type.c) && r.las.primary === 'pragma',
      title: '理性承诺型：坚定承诺 × 实用之爱',
      insight: '你用清醒的头脑经营爱情，承诺对你来说不是束缚，而是深思熟虑后的选择。',
      detail: '你不会被一时冲动左右，而是认真考虑双方是否真正合适。这种理性态度有助于建立长期稳定的关系，但偶尔跟随内心感觉也很重要。' },
    { id: 'high_passion_eros', weight: 7,
      match: r => r.stls.type.p === 1 && r.las.primary === 'eros',
      title: '热烈相恋型：激情饱满 × 情欲之爱',
      insight: '你的爱情充满化学作用和浪漫火花，是典型的热恋配置。',
      detail: '你相信一见钟情，享受爱情中的激情和身体吸引。这种热烈的能量很有感染力，但注意给感情留出发展深度的空间，让激情之外也有亲密的沉淀。' },
    { id: 'anxious_words', weight: 6,
      match: r => r.ecr.type === 'anxious' && r.ll.primary === 'A',
      title: '言语确认需求：焦虑依恋 × 肯定的言辞',
      insight: '你渴望通过语言获得安全感——"我爱你""我在乎你"这些话对你意义重大。',
      detail: '当你感到不安时，伴侣的肯定话语是最有效的定心丸。主动告诉伴侣你的这一需求，同时也可以练习自我肯定，逐渐减少对外部确认的依赖。' },
    { id: 'avoidant_service', weight: 6,
      match: r => r.ecr.type === 'avoidant' && r.ll.primary === 'D',
      title: '行动胜于言语：回避依恋 × 服务的行动',
      insight: '你倾向于用行动而非语言来表达爱，也更在意对方为你做了什么而不是说了什么。',
      detail: '对你来说，实际行动比甜言蜜语更有说服力。这种务实风格是优势，但也要记得：偶尔用语言表达感情，能让伴侣更容易感受到你的爱。' },
    { id: 'agape_committed', weight: 6,
      match: r => r.las.primary === 'agape' && r.stls.type.c === 1,
      title: '无私奉献的爱：利他之爱 × 高承诺',
      insight: '你爱得深沉而无私，愿意把对方的幸福放在自己之前。',
      detail: '你在关系中全心付出，承诺对你来说意味着一生的责任。这种爱令人感动，但请记得：健康的爱情需要双向流动，学会接受对方的付出同样重要。' },
    { id: 'mania_gifts', weight: 5,
      match: r => r.las.primary === 'mania' && r.ll.primary === 'C',
      title: '仪式感确认：狂热之爱 × 接受礼物',
      insight: '礼物对你来说不仅是物品，更是爱的象征和情感的确认。',
      detail: '你在感情中全情投入，而礼物是"你被想着"的实物证据。收到礼物让你安心，但也要注意：爱与不爱不取决于礼物本身，日常的点滴关怀同样重要。' },
    { id: 'secure_bilingual', weight: 5,
      match: r => r.ecr.type === 'secure' && r.ll.isBilingual,
      title: '情感表达灵活型：安全依恋 × 双语者',
      insight: '你的安全感让你在感情中更加灵活——你能用多种方式表达和接收爱。',
      detail: '作为"双语者"，你拥有情感表达的多样性，这是很大的优势。你既能享受陪伴，也能欣赏礼物；既需要肯定的话语，也能感受服务的温暖。' }
  ],

  matchThreshold: function(score, maxScore) {
    return score >= maxScore * 0.6;
  },

  runCrossAnalysis: function(results) {
    const stls = results.stls;
    stls.type = stls.type || { key: 'nonlove', i:0, p:0, c:0 };
    return this.RULES
      .filter(rule => rule.match(results))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 8);
  },

  /* ---- 画像生成 ---- */
  PORTRAITS: {
    'secure_consummate': { label: '平衡的爱人',
      summary: '你是爱情中最理想的伴侣类型——既有安全感，又懂得经营。',
      desc: [
        '你的安全型依恋让你在关系中既能够自然地亲近对方，又保持健康的独立性。你相信自己是值得被爱的，也相信伴侣会真心待你。这种内在的安全感，为「完美之爱」提供了最坚实的基础。',
        '在爱情三元论中，你的亲密、激情和承诺三者均衡发展。这意味着你既享受与伴侣的心灵相通，也珍惜激情带来的火花，同时愿意为关系做出长期承诺。你不是那种爱得盲目的人，而是清醒地选择去爱。',
        '你的爱情风格和爱语进一步丰富了这个画像。整体而言，你拥有建立健康、持久亲密关系的最佳心理素质——这是许多人向往的状态，而你做到了。' ]
    },
    'secure_romantic': { label: '温情的追光者',
      summary: '你充满温情与激情，亲密感是你爱情的核心。',
      desc: [
        '你拥有安全型依恋带来的情感稳定性，同时你的爱情中亲密感和激情都很充沛。你知道如何与伴侣建立深层连接，也享受恋爱中的浪漫火花。',
        '尽管你享受当下的美好，目前这段关系可能还缺少长期的承诺维度。这未必是问题——每段关系都有自己的节奏。你的安全感会帮助你们在适当的时候走向更深层的承诺。',
        '保持你开放和真诚的情感表达方式，这是你最吸引人的特质。' ]
    },
    'secure_companionate': { label: '成熟的同行者',
      summary: '你的爱像一条宽阔的河流——深沉、稳定、持久。',
      desc: [
        '你的安全型依恋让你在关系中既有温度又有边界。你的爱情模式是亲密与承诺的结合，如同最可靠的伙伴关系。',
        '你与伴侣之间的关系像最好的朋友加上生活伴侣——彼此信任、相互扶持。激情可能不是你们关系中最突出的部分，但你们拥有的深度连接是许多关系羡慕不来的。',
        '如果你怀念更多的激情，完全可以通过创造新的共同体验来重新点燃。你们已经拥有了最稳固的基础——信任和承诺。' ]
    },
    'secure_low': { label: '从容的独行者',
      summary: '你独立而自信，爱情不是你生活的全部。',
      desc: [
        '你的安全型依恋让你即使独处也安然自在。目前你在爱情中的投入度不高，但这源于你的从容而非恐惧——这是健康的独立性。',
        '无论你正处于空窗期还是关系中的冷静期，你都能够理性看待。你不急于用关系来定义自己，这种态度让你在选择伴侣时更加清醒。',
        '当你遇到真正让你心动的人，你安全型的底色会让你有能力建立健康的关系。不着急，你走在自己的节奏里。' ]
    },
    'anxious_consummate': { label: '浓烈的追光者',
      summary: '你爱得浓烈而投入，渴望全然的亲密与确认。',
      desc: [
        '你在感情中全情投入，亲密、激情、承诺你都想要——这正是「完美之爱」的追求。但你的焦虑型依恋让你在追求完美的同时，也容易患得患失。',
        '你的焦虑感其实源于对爱的高度重视。你害怕失去，所以格外敏感于伴侣的一举一动。这份敏感是你爱得深沉的证明，但也可能成为关系的负担。',
        '学会给自己安全感——培养独立的生活圈子和兴趣爱好。当你不再把全部情感重量压在伴侣身上时，你会发现自己反而更能享受爱情的甜美。' ]
    },
    'anxious_romantic': { label: '不安的追梦者',
      summary: '你的爱情像一部浪漫电影——充满激情，也充满内心戏。',
      desc: [
        '你渴望浪漫的亲密关系，对爱情有着美好的想象和向往。激情和亲密对你来说都不可或缺，但焦虑型依恋让你在享受爱情的同时也常常感到不安。',
        '你可能会过度解读伴侣的行为——一条回复慢了的消息、一个不经意的眼神，都可能引发你内心的风暴。这不是你的错，而是你的依恋系统在过度工作。',
        '练习在焦虑时先暂停一下，问自己「这是事实还是我的担忧在说话？」。给伴侣也多一些信任，你值得拥有一段安心的爱情。' ]
    },
    'anxious_companionate': { label: '渴望的守候者',
      summary: '你渴望稳定的陪伴，但又常常怀疑这份稳定是否真实。',
      desc: [
        '你渴望亲密和承诺带来的安全感，却总是担心这份安全感随时会被打破。你的焦虑让你即使在看似稳定的关系中也无法完全放松。',
        '你需要伴侣不断地确认TA的爱，这种需求本身不是问题——问题在于，即使得到了确认，你内心的疑虑可能很快又卷土重来。',
        '真正的突破口不在外界而在你内心：练习自我安抚，学着相信自己值得被爱。当内在的安全感慢慢建立起来，你就不再需要不断地向外界索取了。' ]
    },
    'anxious_low': { label: '纠结的寻觅者',
      summary: '你想要靠近，又害怕受伤；渴望爱情，又充满担忧。',
      desc: [
        '你的焦虑型依恋让你对爱情既向往又紧张。你可能正在寻找一段关系，或者身处一段不够投入的关系中，这种不确定感加剧了你的不安。',
        '当关系中的亲密、激情或承诺不足时，你的焦虑会被放大——你会怀疑是不是自己不够好，或者对方是不是不够爱你。',
        '先学会享受自己的陪伴。当你不再把爱情当作安全感的唯一来源时，你反而能更清晰地看到：什么样的人才真正适合你。' ]
    },
    'avoidant_consummate': { label: '克制的爱慕者',
      summary: '你追求完美的爱情，但需要保持恰到好处的距离。',
      desc: [
        '你内心渴望高质量的亲密关系——亲密、激情、承诺你都想要。但你的回避型依恋让你在靠近的同时本能地想要保持距离。',
        '当关系变得太亲密或对方情感需求增加时，你可能会感到窒息，想要后退。这并不意味着你不爱对方，而是你的心理边界在发出保护信号。',
        '学会识别自己的回避模式：什么时候你想逃？是因为压力，还是真的需要空间？尝试在感到不适时用沟通代替逃离，告诉伴侣你需要多少空间，而不是直接消失。' ]
    },
    'avoidant_romantic': { label: '距离的浪漫者',
      summary: '你享受浪漫的激情，但害怕被亲密吞没。',
      desc: [
        '你享受爱情中的激情和浪漫——那种心动的感觉让你着迷。但当关系开始变得更亲密、伴侣希望更多情感交流时，你可能会本能地退缩。',
        '这种模式让你更容易陷入激情驱动的关系，而在需要情感深度的阶段感到不适。你的独立不是缺点，但过度独立可能会让你错失真正深刻的连接。',
        '尝试在小事上主动靠近：分享一个微小的感受、主动表达一次关心。依赖不意味着失去自我，恰当地示弱反而是勇气的表现。' ]
    },
    'avoidant_companionate': { label: '淡然的同行者',
      summary: '你相信陪伴胜过激情，责任胜过甜言蜜语。',
      desc: [
        '你的爱情模式是亲密和承诺的结合——你认同长久的陪伴和共同的责任。但回避型依恋让你在表达情感方面显得克制甚至冷淡。',
        '你可能认为"做"比"说"更重要——你用实际行动关心伴侣，但不太擅长用语言表达爱意。这种风格本身没有问题，只是需要让伴侣理解你的爱的方式。',
        '偶尔尝试用语言表达你的感受——即使只是简单的一句"我今天很高兴和你在一起"。对方需要听到这些，而你其实也值得更自由地表达情感。' ]
    },
    'avoidant_low': { label: '自在的独行者',
      summary: '你享受独处的自由，亲密关系不是你的必需品。',
      desc: [
        '你目前在各个维度上的投入都不高，爱情在你生活中的优先级较低。加上你的回避倾向，你可能更享受一个人的自由和独立。',
        '这种状态本身没有任何问题——不是每个人都必须追求亲密关系。你有权利选择自己想要的生活方式。',
        '如果未来遇到让你心动的人，试着给关系一个机会。你不需要改变自己的独立性，但适度打开心扉可能会带来意想不到的美好体验。' ]
    },
    'fearful_consummate': { label: '矛盾的追梦者',
      summary: '你渴望完美的爱情，但内心深处又害怕自己不配拥有。',
      desc: [
        '你向往亲密、激情、承诺三者兼备的理想关系，但恐惧型依恋让你在靠近这个目标时充满矛盾。当你感到安全时你渴望亲密，但当关系真正走近时你又感到恐惧。',
        '这种"想要又不敢要"的模式可能让你和伴侣都感到困惑。你的内心住着一个渴望被爱的小孩和一个害怕受伤的守护者。',
        '首先要理解：这种矛盾是完全正常的，不是你一个人的问题。学会识别自己的情感模式——什么触发了你的逃离冲动？什么让你感到足够安全？给自己时间和耐心，专业的心理咨询（如EFT）对恐惧型依恋有很好的帮助。' ]
    },
    'fearful_romantic': { label: '拉扯的追光者',
      summary: '你的爱情是一场靠近与逃离的拉锯战。',
      desc: [
        '强烈的激情和亲密让你着迷——你渴望这种令人心动的连接。但每当你感到关系变得更近，恐惧就会悄然而至，让你想要逃离。你在靠近-逃离的循环中反复。',
        '这种模式让你在关系的早期阶段感到兴奋，但在需要深化的阶段充满焦虑。你的伴侣可能会觉得你忽冷忽热、难以捉摸。',
        '学习识别这个循环模式本身是改变的开始。当你注意到自己又想逃的时候，停下来问问自己：我在害怕什么？现在的TA真的会伤害我吗？' ]
    },
    'fearful_companionate': { label: '试探的守望者',
      summary: '你渴望稳定的陪伴，但又不敢相信这份稳定是真的。',
      desc: [
        '你内心渴望亲密和承诺，羡慕那些能够安心相伴的关系。但当你自己身处这样的关系中时，不安和怀疑又会浮上心头——"TA真的会一直在我身边吗？"',
        '你可能在关系中表现得忽远忽近：今天渴望拥抱，明天又需要独处。这不是你矫情，而是你内心的安全系统在发出矛盾的信号。',
        '一个稳定、可预测的伴侣对你来说是最好的良方。同时你也要学会在感到不安时不立即行动——给自己时间分辨这是真实的危险还是过去的阴影在说话。' ]
    },
    'fearful_low': { label: '迷茫的寻觅者',
      summary: '你对爱情既向往又害怕，不确定自己真正想要什么。',
      desc: [
        '目前你在爱情的各个维度上投入不多，但这可能不是因为你不想要，而是因为你的内心在矛盾和犹豫中消耗了大量能量。',
        '你的恐惧型依恋让你在面对亲密关系时比其他人更加谨慎。这不是缺点——你的敏感让你能够洞察关系中细微的动向，只是过于敏感的警报系统让你无法放松。',
        '给自己时间，不要强迫自己快速进入一段关系。先从了解自己开始：什么让你感到安全？什么触发了你的恐惧？当你对自己有了更深的理解，选择也会更清晰。' ]
    }
  },

  generatePortrait: function(results, norm) {
    const ecr = results.ecr.type;
    const stls = results.stls.type.key;
    const ecrMap = { secure:'secure', anxious:'anxious', avoidant:'avoidant', fearful:'fearful' };
    let stlsGroup = 'low';
    if (stls === 'consummate') stlsGroup = 'consummate';
    else if (stls === 'romantic' || stls === 'fatuous') stlsGroup = 'romantic';
    else if (stls === 'companionate' || stls === 'liking') stlsGroup = 'companionate';
    const key = (ecrMap[ecr] || 'secure') + '_' + stlsGroup;
    const portrait = this.PORTRAITS[key] || this.PORTRAITS['secure_consummate'];
    return portrait;
  },

  /* ---- 优势生成 ---- */
  generateStrengths: function(results, norm) {
    const items = [];
    if (results.ecr.type === 'secure') items.push('安全型依恋：你天生具备建立健康亲密关系的情感基础，能够平衡亲密与独立。');
    if (norm.ecr.security > 60) items.push('情感安全感强：你不易患得患失，能理性看待关系中的起起伏伏。');
    if (norm.ecr.closeness > 60) items.push('关系亲近力强：你能够自在地亲近伴侣，不害怕亲密。');
    if (norm.stls.intimacy > 60) items.push('亲密深度高：你擅长建立深层情感连接，能与伴侣分享内心世界。');
    if (norm.stls.passion > 60) items.push('激情热度高：你的爱情充满活力与浪漫，能够保持新鲜感。');
    if (norm.stls.commitment > 60) items.push('承诺坚定度高：你对关系认真负责，愿意为长期幸福付出努力。');
    if (results.las.primary === 'agape') items.push('无私的爱：你在爱情中展现难得的奉献精神，真心为伴侣的幸福着想。');
    if (results.las.primary === 'storge') items.push('友谊之爱：你的爱情建立在深厚的友情基础上，稳定而持久。');
    if (results.las.primary === 'eros') items.push('浪漫热情：你懂得欣赏爱情中的美和激情，富有感染力。');
    if (results.ll.isBilingual) items.push('爱语灵活：你能用多种方式表达爱，不拘泥于单一形式。');
    if (items.length < 3) items.push('自我觉察：你愿意通过测试深入了解自己，这是成长最重要的第一步。');
    return items.slice(0, 5);
  },

  /* ---- 分数等级判断 ---- */
  _scoreTier: function(score) {
    if (score < 25) return 'veryLow';
    if (score < 40) return 'low';
    if (score < 60) return 'medium';
    if (score < 80) return 'high';
    return 'veryHigh';
  },

  /* ---- 共情向建议模板 ---- */
  ADVICE_TEMPLATES: {
    ecr: {
      secure: '你有安全型的依恋风格——这在感情中是一种很珍贵的底气和能力。你能够自然地亲近对方，同时保持独立的自我。在关系中继续发挥这份从容就好，如果注意到伴侣偶尔缺乏安全感，你的稳定本身就已经是最好的礼物。',
      anxious: {
        general: '你在感情中投入很深，会因为在意而焦虑——这说明你很在乎这段关系。但有时你内心的警报系统过于灵敏了：一条回复慢了的消息、一个不经意的语气变化，都可能让你陷入不安。试着在感到焦虑时先停下来，问自己："这是事实，还是我的担忧在说话？"一点一点的自我安抚，会让你在爱中更加从容。',
        highAnxiety: '你的焦虑感偏高，心里好像住着一个总在担心"TA还爱我吗"的小孩。这不是你的错，而是你的依恋系统在过度工作。练习正念和自我安抚会有帮助——哪怕只是每天几分钟的深呼吸。你值得在关系中获得安心，这份安心首先可以从你给自己开始。'
      },
      avoidant: {
        general: '你习惯在感情中保持独立和理性的姿态，这让你避免了很多人陷入的情感纠缠。但真正的亲密，有时候恰恰来自于勇敢地展现脆弱。下一次当你想退缩时，试着告诉伴侣你的真实感受——哪怕只是一句"我需要一点空间，但我在乎你"。依赖不是软弱，而是信任的开始。',
        highAvoidance: '你的回避倾向比较明显，亲密靠近时你本能地想要后退和保持距离。这种感受本身完全正常——每个人都有自己的心理边界。关键是要学会在需要空间时好好沟通，而不是突然消失。告诉伴侣"我需要一些时间独处，这与你无关"，会让对方更容易理解你。'
      },
      fearful: {
        general: '你的内心同时存在着对亲密的渴望和对受伤的害怕——这种"想要靠近又不敢靠近"的拉扯一定让你很累吧。请理解：你的矛盾不是缺陷，而是你的自我保护机制在过于努力地工作。学习区分"过去的恐惧"和"当下的真实"是走出循环的重要一步。给自己多一些耐心，你值得拥有一段让你安心的关系。',
        highFear: '你在亲密和回避两个维度上的得分都较高，内心的拉扯感可能更加强烈。这种情况下，一个稳定、可预测的伴侣对你很有帮助。同时，专业的心理咨询（如EFT情绪聚焦疗法）可以非常有针对性地支持你。寻求帮助不是软弱，而是对自己最温柔的关怀。'
      }
    },
    stls: {
      intimacy: {
        low: '亲密维度还有成长的空间。你可能还没有完全敞开自己，这很正常——信任需要时间来建立。试着从小事开始：分享一件今天发生的小事、一个心底的微小的感受。每一次敞开都是一次信任的练习，你不需要一下子就做到毫无保留。',
        medium: '你在亲密维度上表现适中，有一定的情感连接基础。你可以问问自己：在什么情况下你更愿意敞开内心？在什么情况下你更倾向于保留？朝着让你感到安全的方向多走一步就好，不必勉强自己。',
        high: '你在亲密维度上得分很高——你很擅长建立深层的情感连接，能够与伴侣分享内心世界。这是一份很珍贵的能力。留意的是，有时候过高的亲密需求可能会让对方感到压力。保持你真诚的分享，同时也记得给对方呼吸的空间。'
      },
      passion: {
        low: '激情维度还有升温的空间。日常生活的琐碎有时会冲淡浪漫的火花，这是任何长期关系中都会遇到的情况，不必担心。试着安排一个小小的约会、一起尝试一件从未做过的事——新的体验往往能带来新的心跳。',
        medium: '你的激情水平适中，保持着一定的浪漫温度。如果你想让它更热烈一些，可以主动创造一些惊喜——还记得你们上一次真正感到心动是什么时候吗？试着重现那一刻的感觉。',
        high: '你的激情指数很高，这是关系中非常宝贵的能量。你的热情和吸引力让人着迷。在享受激情的同时，留意这段关系是否有亲密和承诺作为支撑——激情是最好的催化剂，但持久的爱需要多个维度一起滋养。'
      },
      commitment: {
        low: '承诺维度还有加强的空间。也许你还在观望，或者对关系的未来方向还不确定——这完全正常，每段关系都有自己的节奏。试着和伴侣坦诚地聊一聊彼此的期待，不是为了给对方压力，而是为了让双方都更清楚彼此的位置。',
        medium: '你的承诺感适中，说明你对关系有一定的责任感和投入。如果你觉得可以更进一步，试着和伴侣分享一些关于未来的想象——即使只是明年的一次旅行计划，也能让你们的连结更加紧密。',
        high: '你对关系的承诺感很强——这是安全感和责任心的体现，让人感到可靠和安心。偶尔也审视一下：这份承诺是来自内心的"想要"，还是惯性中的"应该"？确保你留在关系里是因为真正的满足，而不是因为习惯。'
      }
    },
    las: {
      ludus: '你把恋爱看作一种轻松的游戏，享受新鲜感和追逐的过程——这种态度让你避免了很多人陷入的情感负担。但偶尔也值得想一想：长期关系中的承诺和深度，也许能带来不一样的满足。你不需要改变自己，但可以试着偶尔敞开内心。',
      mania: '你的爱充满投入和热情，这让你的感情生活非常浓烈——这是你的魅力所在。但你的情绪可能太容易被恋人的言行牵动了。练习在焦虑时先深呼吸再回应，给自己和对方都留一些空间。真正的爱不需要时刻紧握。',
      eros: '你相信一见钟情的浪漫，享受爱情中的激情和化学作用。你的热情很有感染力。试着在火花之外也关注内心的契合——给感情留出发展深度的时间，让外表之下的美好也有机会被看见。',
      storge: '你相信最好的爱情从友谊开始，追求细水长流的陪伴。这种温和而坚定的态度让人安心。不过偶尔也可以主动制造一些浪漫和惊喜——激情的火花有时候需要主动点燃，而你们已经拥有了最稳固的基础。',
      pragma: '你在感情中理性务实，看重双方条件的匹配——这其实是对自己和生活负责的表现。但爱情不只是清单上的一项项核对。偶尔放下分析，跟随内心的感觉走，让关系多一点点不可预测的惊喜和温度。',
      agape: '你在爱中无私付出，把对方的幸福放在首位——这种纯粹和真诚真的很难得。但健康的爱是双向流动的。学会接受对方的付出同样重要，照顾好自己才能更好地爱别人。你不是超人，也要记得给自己被爱的权利。'
    }
  },

  /* ---- 成长建议生成 ---- */
  generateAdvice: function(results, norm) {
    const items = [];
    const T = this.ADVICE_TEMPLATES;

    /* 1. ECR 依恋类型建议 */
    const ecrType = results.ecr.type;
    if (ecrType === 'anxious') {
      items.push(T.ecr.anxious.general);
      if (norm.ecr.security < 30) items.push(T.ecr.anxious.highAnxiety);
    } else if (ecrType === 'avoidant') {
      items.push(T.ecr.avoidant.general);
      if (norm.ecr.closeness < 30) items.push(T.ecr.avoidant.highAvoidance);
    } else if (ecrType === 'fearful') {
      items.push(T.ecr.fearful.general);
      if (norm.ecr.security < 20 || norm.ecr.closeness < 20) items.push(T.ecr.fearful.highFear);
    } else {
      items.push(T.ecr.secure); // 安全型 — 之前完全没有建议
    }

    /* 2. STLS 三维度建议 */
    ['intimacy','passion','commitment'].forEach(dim => {
      const tier = this._scoreTier(norm.stls[dim]);
      if (tier === 'veryLow' || tier === 'low') {
        items.push(T.stls[dim].low);
      } else if (tier === 'medium') {
        items.push(T.stls[dim].medium);
      } else if (tier === 'high' || tier === 'veryHigh') {
        items.push(T.stls[dim].high);
      }
    });

    /* 3. LAS 主风格建议 */
    const lasPrimary = results.las.primary;
    if (T.las[lasPrimary]) items.push(T.las[lasPrimary]);

    /* 4. 兜底 */
    if (items.length < 2) {
      items.push('持续自我探索：爱情是一场终身的修行，每一步都算数。保持对自己的觉察和好奇，你在感情中会越来越从容。');
    }

    return items.slice(0, 5);
  },

  /* ---- DOM 渲染 ---- */
  render: function(data) {
    const container = document.getElementById('report-content');
    container.innerHTML =
      this.renderHeader(data) +
      this.renderModuleSummaries(data) +
      this.renderRadarSection(data) +
      this.renderCrossAnalysis(data) +
      this.renderPortraitSection(data) +
      this.renderStrengths(data) +
      this.renderGrowthAdvice(data) +
      this.renderFooter(data);
    setTimeout(() => this.drawChart(data.radar), 50);
  },

  renderHeader: function(d) {
    return `
      <div class="report-section report-hero">
        <div class="report-hero-badge">个人分析报告</div>
        <h1 class="report-hero-title">你的爱情心理画像</h1>
        <p class="report-hero-sub">基于 4 项心理学量表 · 综合解读</p>
        <p class="report-hero-date">${d.meta.date}</p>
      </div>`;
  },

  renderModuleSummaries: function(d) {
    const m = d.modules;
    const stlsType = m.stls.type;
    return `
      <div class="report-section">
        <div class="report-section-header"><span class="section-num">01</span> 各模块结果概览</div>
        <div class="report-module-grid">
          <div class="rm-card" style="border-top-color:${m.ecr.color}">
            <div class="rm-icon">🧠</div>
            <div class="rm-module">依恋类型</div>
            <div class="rm-type" style="color:${m.ecr.color}">${m.ecr.typeCn}</div>
            <div class="rm-en">${m.ecr.typeEn}</div>
            <div class="rm-stats">焦虑 ${m.ecr.anxiety.toFixed(1)} · 回避 ${m.ecr.avoidance.toFixed(1)}</div>
          </div>
          <div class="rm-card" style="border-top-color:${stlsType.color}">
            <div class="rm-icon">${stlsType.icon}</div>
            <div class="rm-module">爱情三元论</div>
            <div class="rm-type" style="color:${stlsType.color}">${stlsType.cn}</div>
            <div class="rm-en">${stlsType.en}</div>
            <div class="rm-stats">亲 ${m.stls.scores.intimacy.toFixed(1)} · 激 ${m.stls.scores.passion.toFixed(1)} · 承 ${m.stls.scores.commitment.toFixed(1)}</div>
          </div>
          <div class="rm-card" style="border-top-color:${m.las.primaryColor}">
            <div class="rm-icon">🎨</div>
            <div class="rm-module">爱情风格</div>
            <div class="rm-type" style="color:${m.las.primaryColor}">${m.las.primaryCn}</div>
            <div class="rm-en">${LAS.styles[m.las.primary]?.en || ''}</div>
            <div class="rm-stats">次要：${m.las.secondaryCn}</div>
          </div>
          <div class="rm-card" style="border-top-color:${m.ll.primaryColor}">
            <div class="rm-icon">💬</div>
            <div class="rm-module">恋爱语言</div>
            <div class="rm-type" style="color:${m.ll.primaryColor}">${m.ll.primaryCn}</div>
            <div class="rm-en">${LL.labels[m.ll.primary]?.en || ''}</div>
            <div class="rm-stats">${m.ll.isBilingual ? '双语者 · ' : ''}次要：${m.ll.secondaryCn}</div>
          </div>
        </div>
      </div>`;
  },

  renderRadarSection: function(d) {
    return `
      <div class="report-section">
        <div class="report-section-header"><span class="section-num">02</span> 综合维度雷达</div>
        <div class="report-radar-container">
          <canvas id="report-radar-canvas" width="340" height="340"></canvas>
        </div>
        <div class="report-radar-legend">
          ${d.radar.map(dim => `
            <span class="radar-legend-item">
              <span class="radar-legend-dot" style="background:${dim.color}"></span>
              ${dim.label} <em>${dim.value}</em>
            </span>
          `).join('')}
        </div>
      </div>`;
  },

  renderCrossAnalysis: function(d) {
    if (!d.crossAnalysis.length) return '';
    return `
      <div class="report-section">
        <div class="report-section-header"><span class="section-num">03</span> 跨模块交叉解读</div>
        ${d.crossAnalysis.map(rule => `
          <div class="ca-card">
            <div class="ca-title">${rule.title}</div>
            <div class="ca-insight">${rule.insight}</div>
            <div class="ca-detail">${rule.detail}</div>
          </div>
        `).join('')}
      </div>`;
  },

  renderPortraitSection: function(d) {
    const p = d.portrait;
    return `
      <div class="report-section">
        <div class="report-section-header"><span class="section-num">04</span> 你的爱情画像</div>
        <div class="portrait-badge">${p.label}</div>
        <p class="portrait-summary">${p.summary}</p>
        ${p.desc.map(para => `<p class="portrait-paragraph">${para}</p>`).join('')}
      </div>`;
  },

  renderStrengths: function(d) {
    return `
      <div class="report-section">
        <div class="report-section-header"><span class="section-num">05</span> 你的爱情优势</div>
        <ul class="report-list">
          ${d.strengths.map(s => `<li class="report-list-item positive">${s}</li>`).join('')}
        </ul>
      </div>`;
  },

  renderGrowthAdvice: function(d) {
    return `
      <div class="report-section">
        <div class="report-section-header"><span class="section-num">06</span> 成长建议</div>
        <ul class="report-list">
          ${d.advice.map(a => `<li class="report-list-item growth">${a}</li>`).join('')}
        </ul>
      </div>`;
  },

  renderFooter: function(d) {
    return `
      <div class="report-section report-footer">
        <p class="report-footer-text">本报告基于 ECR、STLS、LAS、5LL 四项心理学量表结果综合生成，仅供自我探索参考。</p>
        <p class="report-footer-date">生成于 ${d.meta.date}</p>
      </div>`;
  },

  /* ---- 雷达图绘制 ---- */
  drawChart: function(radarData) {
    const canvas = document.getElementById('report-radar-canvas');
    if (!canvas) return;
    const scores = {};
    const labels = {};
    radarData.forEach(d => {
      scores[d.key] = d.value;
      labels[d.key] = { cn: d.label, color: d.color };
    });
    Utils.drawRadar(canvas, scores, labels, {
      fillColor: 'rgba(156,39,176,0.08)',
      strokeColor: '#9C27B0',
      pointColor: '#9C27B0',
      labelColor: '#666',
      hideScoreLabel: true
    });
  },

  /* ---- 下载 ---- */
  _downloadData: null,
  download: function() {
    if (!this._downloadData) return;
    const action = confirm('点击"确定"保存为图片，点击"取消"打印PDF');
    if (action) {
      this.generateCoverImage(this._downloadData);
    } else {
      window.print();
    }
  },

  generateCoverImage: function(data) {
    const canvas = document.createElement('canvas');
    const ctx = Utils.setupHiDPICanvas(canvas, 800, 600);
    const W = 800, H = 600;

    // 背景
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#FAFAFA');
    grad.addColorStop(1, '#F0ECF5');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 顶部色带
    ctx.fillStyle = '#9C27B0';
    ctx.fillRect(0, 0, W, 6);

    // 标题
    ctx.fillStyle = '#2D2D2D';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('你的爱情心理画像', W/2, 80);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#888';
    ctx.fillText('个人分析报告', W/2, 116);

    // 分隔线
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(100, 140); ctx.lineTo(W-100, 140); ctx.stroke();

    // 原型标签
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#9C27B0';
    ctx.fillText(data.portrait.label, W/2, 200);

    // 一句话
    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#555';
    ctx.fillText(data.portrait.summary, W/2, 240);

    // 迷你雷达图
    const miniCanvas = document.createElement('canvas');
    const radarCtx = Utils.setupHiDPICanvas(miniCanvas, 240, 240);
    const scores = {};
    const labels = {};
    data.radar.forEach(d => {
      scores[d.key] = d.value;
      labels[d.key] = { cn: d.label };
    });
    // Quick manual radar drawing for the cover
    const cx = 120, cy = 120, r = 80, n = 6;
    const maxV = Math.max(1, ...Object.values(scores));
    // grid
    for (let g = 1; g <= 3; g++) {
      radarCtx.beginPath();
      for (let i = 0; i < n; i++) {
        let a = Math.PI/2 - (Math.PI*2/n)*i;
        let x = cx + r * (g/3) * Math.cos(a);
        let y = cy - r * (g/3) * Math.sin(a);
        i === 0 ? radarCtx.moveTo(x, y) : radarCtx.lineTo(x, y);
      }
      radarCtx.closePath();
      radarCtx.strokeStyle = '#DDD';
      radarCtx.lineWidth = 0.5;
      radarCtx.stroke();
    }
    // data
    radarCtx.beginPath();
    Object.entries(scores).forEach(([k,v], i) => {
      let a = Math.PI/2 - (Math.PI*2/n)*i;
      let val = Math.min(v / maxV, 1);
      let x = cx + r * val * Math.cos(a);
      let y = cy - r * val * Math.sin(a);
      i === 0 ? radarCtx.moveTo(x, y) : radarCtx.lineTo(x, y);
    });
    radarCtx.closePath();
    radarCtx.fillStyle = 'rgba(156,39,176,0.15)';
    radarCtx.fill();
    radarCtx.strokeStyle = '#9C27B0';
    radarCtx.lineWidth = 1.5;
    radarCtx.stroke();

    // 迷你标签
    radarCtx.font = '8px sans-serif';
    radarCtx.textAlign = 'center';
    Object.entries(labels).forEach(([k, lb], i) => {
      let a = Math.PI/2 - (Math.PI*2/n)*i;
      let x = cx + (r + 16) * Math.cos(a);
      let y = cy - (r + 16) * Math.sin(a);
      radarCtx.fillStyle = '#999';
      radarCtx.fillText(lb.cn, x, y+3);
    });

    // 将迷你雷达绘制到主 canvas
    ctx.drawImage(miniCanvas, (W - 240) / 2, 270);

    // 模块概要
    ctx.textAlign = 'center';
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#555';
    const m = data.modules;
    const summaries = [
      `🧠 依恋：${m.ecr.typeCn}     ${m.stls.type.icon} 三元论：${m.stls.type.cn}`,
      `🎨 风格：${m.las.primaryCn}     💬 爱语：${m.ll.primaryCn}`
    ];
    let sy = 550;
    summaries.forEach(line => { ctx.fillText(line, W/2, sy); sy += 24; });

    // 底部
    ctx.fillStyle = '#CCC';
    ctx.font = '11px sans-serif';
    ctx.fillText(`生成于 ${data.meta.date}  ·  love-psych-test`, W/2, H-16);

    // 下载
    Utils.downloadImage(canvas.toDataURL('image/png'), 'love-report-cover.png');
  }
};
