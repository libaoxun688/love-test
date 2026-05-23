/* ===== 主控制器 — 状态管理 & 业务逻辑 ===== */

const App = {
  // 当前状态
  state: {
    module: null,       // 'ecr' | 'stls' | 'las' | 'll'
    version: null,      // 'light'|'standard'|'full'|'short'
    answers: [],        // 用户答案数组
    currentQ: 0,        // 当前题号 (0-based)
    totalQ: 0,          // 总题数
    questions: [],      // 当前测试的题目列表
  },

  /* ---- 初始化 ---- */
  init: function() {
    UI.renderHome();
    // 重新测试按钮
    document.getElementById('retry-btn').addEventListener('click', () => {
      let mod = this.state.module;
      let ver = this.state.version;
      if (mod && ver) this.startTest(mod, ver);
    });
    // 分享按钮
    document.getElementById('share-btn').addEventListener('click', () => {
      this.shareResult();
    });
    // 首页按钮（结果页）
    document.getElementById('home-btn').addEventListener('click', () => {
      UI.renderHome();
      UI.switchPage('page-home');
    });
    // 报告生成按钮（结果页）
    document.getElementById('report-gen-btn').addEventListener('click', () => {
      this.openReport();
    });
  },

  /* ---- 开始测试 ---- */
  startTest: function(module, version) {
    this.state.module = module;
    this.state.version = version;
    this.state.answers = [];
    this.state.currentQ = 0;

    // 获取题目列表
    this.state.questions = this.getQuestions(module, version);
    this.state.totalQ = this.state.questions.length;

    // 渲染测试界面
    UI.renderTest(module, version, this.state.totalQ);
    this.showQuestion();
    UI.switchPage('page-test');
  },

  /* ---- 获取题目列表 ---- */
  getQuestions: function(module, version) {
    if (module === 'ecr') {
      const ecr = ECR;
      if (version === 'light') {
        // 精简12题: 6焦虑+6回避
        const anxietyQ = ecr.allQuestions.filter(q => q.dim === 'anxiety').slice(0, 6);
        const avoidQ = ecr.allQuestions.filter(q => q.dim === 'avoidance').slice(0, 6);
        // 交错排列便于体验
        let result = [];
        for (let i = 0; i < 6; i++) {
          result.push(anxietyQ[i], avoidQ[i]);
        }
        return result;
      } else if (version === 'standard') {
        // 标准24题
        const anxietyQ = ecr.allQuestions.filter(q => q.dim === 'anxiety').slice(0, 12);
        const avoidQ = ecr.allQuestions.filter(q => q.dim === 'avoidance').slice(0, 12);
        let result = [];
        for (let i = 0; i < 12; i++) {
          result.push(anxietyQ[i], avoidQ[i]);
        }
        return result;
      } else {
        // 完整36题
        return [...ecr.allQuestions];
      }
    } else if (module === 'stls') {
      if (version === 'short') {
        return STLS.short.questions.map(q => ({ ...q, scale: STLS.short.scale }));
      } else {
        return STLS.full.questions.map(q => ({ ...q, scale: STLS.full.scale }));
      }
    } else if (module === 'las') {
      if (version === 'short') {
        return LAS.shortIds.map(id => LAS.allQuestions.find(q => q.id === id));
      } else {
        return [...LAS.allQuestions];
      }
    } else if (module === 'll') {
      if (version === 'short') {
        return LL.getShortPairs();
      } else {
        return [...LL.fullPairs];
      }
    }
    return [];
  },

  /* ---- 显示当前题目 ---- */
  showQuestion: function() {
    const idx = this.state.currentQ;
    const total = this.state.totalQ;
    if (idx >= total) {
      this.finishTest();
      return;
    }
    const question = this.state.questions[idx];
    UI.updateProgress(idx + 1, total);
    UI.renderQuestion(question, idx, total, this.state.module);
  },

  /* ---- 记录答案 ---- */
  answer: function(value) {
    this.state.answers.push(value);
    this.state.currentQ++;
    this.showQuestion();
  },

  /* ---- 完成测试 & 计算结果 ---- */
  finishTest: function() {
    const module = this.state.module;
    const version = this.state.version;
    const answers = this.state.answers;
    let result = null;

    if (module === 'ecr') {
      if (version === 'full') {
        result = ECR.scoreByFisher(answers);
      } else {
        const scores = ECR.scoreByMean(answers, this.state.questions);
        let type;
        if (scores.anxiety >= ECR.threshold && scores.avoidance >= ECR.threshold) type = 'fearful';
        else if (scores.anxiety >= ECR.threshold) type = 'anxious';
        else if (scores.avoidance >= ECR.threshold) type = 'avoidant';
        else type = 'secure';
        result = { ...scores, type };
      }
      Utils.saveResult('ecr', result);
      UI.renderECRResult(result);

    } else if (module === 'stls') {
      result = STLS.compute(answers, version);
      result.maxScore = version === 'short' ? 5 : 9;
      Utils.saveResult('stls', result);
      UI.renderSTLSResult(result);

    } else if (module === 'las') {
      const isShort = version === 'short';
      result = LAS.compute(answers, isShort);
      Utils.saveResult('las', result);
      UI.renderLASResult(result);

    } else if (module === 'll') {
      result = LL.compute(answers);
      Utils.saveResult('ll', result);
      UI.renderLLResult(result);
    }

    // 切换到结果页
    const names = { ecr:'依恋类型诊断', stls:'爱情三元论', las:'爱情色彩风格', ll:'五种恋爱语言' };
    document.getElementById('result-module-name').textContent = names[module] || '测试结果';
    document.getElementById('result-actions').style.display = 'flex';
    // 显示/隐藏完整报告按钮
    const allResults = Utils.loadAllResults();
    const allDone = ['ecr','stls','las','ll'].every(k => allResults[k] && allResults[k].timestamp);
    document.getElementById('report-gen-btn').style.display = allDone ? '' : 'none';
    UI.switchPage('page-result');
  },

  /* ---- 分享结果 ---- */
  shareResult: function() {
    const module = this.state.module;
    const results = Utils.loadAllResults();
    const data = results[module];
    if (!data) return;

    const dataUrl = Utils.generateShareCard(module, data);
    Utils.downloadImage(dataUrl, `love-test-${module}-${Date.now()}.png`);
  },

  /* ---- 显示历史某个模块的结果 ---- */
  showModuleResult: function(moduleKey) {
    const results = Utils.loadAllResults();
    const data = results[moduleKey];
    if (!data) return;

    this.state.module = moduleKey;
    const names = { ecr:'依恋类型诊断', stls:'爱情三元论', las:'爱情色彩风格', ll:'五种恋爱语言' };
    document.getElementById('result-module-name').textContent = names[moduleKey] || '测试结果';
    document.getElementById('result-actions').style.display = 'flex';
    // 报告按钮可见性
    const allDone = ['ecr','stls','las','ll'].every(k => results[k] && results[k].timestamp);
    document.getElementById('report-gen-btn').style.display = allDone ? '' : 'none';

    if (moduleKey === 'ecr') UI.renderECRResult(data);
    else if (moduleKey === 'stls') UI.renderSTLSResult(data);
    else if (moduleKey === 'las') UI.renderLASResult(data);
    else if (moduleKey === 'll') UI.renderLLResult(data);

    UI.switchPage('page-result');
  },

  /* ---- 显示历史列表 ---- */
  showHistory: function() {
    UI.showHistory();
  },

  /* ---- 生成个人分析报告 ---- */
  openReport: function() {
    const results = Utils.loadAllResults();
    const modules = ['ecr','stls','las','ll'];
    const missing = modules.filter(k => !results[k] || !results[k].timestamp);
    if (missing.length > 0) {
      const names = { ecr:'依恋类型诊断', stls:'爱情三元论', las:'爱情色彩风格', ll:'五种恋爱语言' };
      alert('请先完成以下模块：' + missing.map(k => names[k]).join('、'));
      return;
    }
    Report.generate(results);
    UI.switchPage('page-report');
  }
};

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});
