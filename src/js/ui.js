/* ===== UI 渲染 + 页面切换 ===== */

const UI = {
  /* ---- 页面切换 ---- */
  switchPage: function(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
  },

  /* ---- 首页渲染 ---- */
  renderHome: function() {
    const grid = document.getElementById('home-grid');
    grid.innerHTML = '';

    const modules = [
      { key:'ecr',  icon:'🧠', title:'依恋类型诊断', en:'Attachment Style', desc:'测测你在亲密关系中的情感模式', color: 'var(--ecr-color)', versions:[
        {key:'light', label:'精简 (12题)'}, {key:'standard', label:'标准 (24题)'}, {key:'full', label:'完整 (36题)'}
      ]},
      { key:'stls', icon:'🔺', title:'爱情三元论', en:'Triangular Theory of Love', desc:'了解你的爱情处于什么状态', color: 'var(--stls-color)', versions:[
        {key:'short', label:'简化 (15题)'}, {key:'full', label:'完整 (45题)'}
      ]},
      { key:'las',  icon:'🎨', title:'爱情色彩风格', en:'Colors of Love', desc:'你的恋爱价值观是什么颜色', color: 'var(--las-color)', versions:[
        {key:'short', label:'简化 (24题)'}, {key:'full', label:'完整 (42题)'}
      ]},
      { key:'ll',   icon:'💬', title:'五种恋爱语言', en:'5 Love Languages', desc:'你在恋爱中说的是哪种语言', color: 'var(--ll-color)', versions:[
        {key:'short', label:'简化 (15对)'}, {key:'full', label:'完整 (30对)'}
      ]}
    ];

    modules.forEach(mod => {
      const card = document.createElement('div');
      card.className = 'module-card';
      card.dataset.module = mod.key;
      card.innerHTML = `
        <div class="card-accent ${mod.key}"></div>
        <div class="card-icon">${mod.icon}</div>
        <div class="card-title">${mod.title} <span class="en">${mod.en}</span></div>
        <div class="card-desc">${mod.desc}</div>
        <div class="version-btns">
          ${mod.versions.map((v, i) => `
            <button class="version-btn ${i===0 ? 'selected' : ''}" data-version="${v.key}" data-module="${mod.key}">${v.label}</button>
          `).join('')}
        </div>
      `;
      grid.appendChild(card);

      // 版本按钮切换
      card.querySelectorAll('.version-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          card.querySelectorAll('.version-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
        });
      });

      // 点击卡片开始测试
      card.addEventListener('click', () => {
        const selected = card.querySelector('.version-btn.selected');
        const version = selected ? selected.dataset.version : mod.versions[0].key;
        App.startTest(mod.key, version);
      });
    });

    // 展示历史结果提示
    const results = Utils.loadAllResults();
    const historyEl = document.getElementById('history-hints');
    historyEl.innerHTML = '';
    const historyKeys = Object.keys(results).filter(k => results[k].timestamp);
    if (historyKeys.length > 0) {
      const hint = document.createElement('div');
      hint.style.cssText = 'margin-top:20px;text-align:center;';
      hint.innerHTML = `<button class="btn btn-outline" onclick="App.showHistory()">📋 查看历史结果 (${historyKeys.length})</button>`;
      historyEl.appendChild(hint);

      // 四个模块全完成时显示报告生成按钮
      const allDone = ['ecr','stls','las','ll'].every(k => results[k] && results[k].timestamp);
      if (allDone) {
        const reportDiv = document.createElement('div');
        reportDiv.style.cssText = 'margin-top:12px;text-align:center;';
        reportDiv.innerHTML = `<button class="btn btn-primary" onclick="App.openReport()">📊 生成个人分析报告</button>`;
        historyEl.appendChild(reportDiv);
      }
    }
  },

  /* ---- 测试页面渲染 ---- */
  renderTest: function(module, version, total) {
    const bar = document.getElementById('test-module-name');
    const names = { ecr:'依恋类型诊断', stls:'爱情三元论', las:'爱情色彩风格', ll:'五种恋爱语言' };
    bar.textContent = names[module] || '测试';

    // 题量描述
    document.getElementById('test-version-label').textContent = `共 ${total} ${module === 'll' ? '对' : '题'}`;

    // 重置进度
    this.updateProgress(0, total);
  },

  /* ---- 进度条更新 ---- */
  updateProgress: function(current, total) {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    document.getElementById('progress-fill').style.width = pct + '%';
    document.getElementById('progress-text').textContent = `${current} / ${total}`;
  },

  /* ---- 渲染题目 ---- */
  renderQuestion: function(question, index, total, module) {
    const container = document.getElementById('question-container');
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'question-card';
    card.style.animation = 'fadeIn 0.3s ease';

    // 题号 + 题目文字
    card.innerHTML = `
      <div class="question-number">第 ${index+1} / ${total} 题</div>
      <div class="question-text">${module === 'll' ? '以下哪种描述更符合你？' : question.cn}</div>
      ${module !== 'll' && question.en ? `<div class="question-en">${question.en}</div>` : ''}
    `;

    // 选项区
    const optContainer = document.createElement('div');
    optContainer.className = 'options-container';

    if (module === 'll') {
      // 第一题上方显示引导说明
      if (index === 0) {
        const banner = document.createElement('div');
        banner.className = 'info-banner';
        banner.innerHTML = '💡 每对描述<strong>可能都符合你</strong>，请选出<strong>相对更贴近</strong>的那一项。这不是排除另一项，而是帮你发现哪种爱语对你更重要。';
        card.prepend(banner);
      }
      // 强迫选择 (5LL)
      optContainer.className = 'forced-pair';
      const pair = question;
      const opt1 = document.createElement('div');
      opt1.className = 'forced-opt';
      opt1.textContent = 'A. ' + pair.aText;
      opt1.addEventListener('click', () => App.answer(pair.a));

      const opt2 = document.createElement('div');
      opt2.className = 'forced-opt';
      opt2.textContent = 'B. ' + pair.bText;
      opt2.addEventListener('click', () => App.answer(pair.b));

      optContainer.appendChild(opt1);
      optContainer.appendChild(opt2);
    } else if (module === 'ecr') {
      // 7点 Likert
      const labels = ['完全不同意','不同意','比较不同意','中立','比较同意','同意','完全同意'];
      optContainer.className = 'likert-options';
      for (let i = 1; i <= 7; i++) {
        const btn = document.createElement('div');
        btn.className = 'likert-opt';
        btn.innerHTML = `<span class="num">${i}</span><span class="label">${labels[i-1]}</span>`;
        btn.addEventListener('click', () => App.answer(i));
        optContainer.appendChild(btn);
      }
    } else if (module === 'las') {
      // 5点 Likert
      const labels = ['完全不同意','不同意','中立','同意','完全同意'];
      optContainer.className = 'likert-options';
      for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('div');
        btn.className = 'likert-opt';
        btn.innerHTML = `<span class="num">${i}</span><span class="label">${labels[i-1]}</span>`;
        btn.addEventListener('click', () => App.answer(i));
        optContainer.appendChild(btn);
      }
    } else if (module === 'stls') {
      // 动态 Likert (5点或9点)
      const scale = question.scale || 5;
      const labels = scale === 5
        ? ['完全没有','有一点','中等','比较多','非常有']
        : ['1','2','3','4','5','6','7','8','9'];
      optContainer.className = 'likert-options';
      if (scale === 9) optContainer.style.flexWrap = 'wrap';

      for (let i = 1; i <= scale; i++) {
        const btn = document.createElement('div');
        btn.className = 'likert-opt';
        btn.style.cssText += scale === 9 ? 'min-width:44px;flex:none;' : '';
        btn.innerHTML = `<span class="num">${i}</span>${scale === 5 ? `<span class="label">${labels[i-1]}</span>` : ''}`;
        btn.addEventListener('click', () => App.answer(i));
        optContainer.appendChild(btn);
      }
    }

    card.appendChild(optContainer);
    container.appendChild(card);
  },

  /* ---- 依恋结果页 ---- */
  renderECRResult: function(result) {
    const type = ECR.types[result.type];
    const sec = document.getElementById('result-content');
    sec.innerHTML = `
      <div class="result-section">
        <div class="result-type" style="color:${type.color}">
          <div class="type-icon">${type.icon}</div>
          <div class="type-name" style="color:${type.color}">${type.cn}</div>
          <div class="type-en">${type.en}</div>
        </div>
      </div>
      <div class="result-section">
        <div class="result-chart"><canvas id="chart-canvas" width="280" height="280"></canvas></div>
      </div>
      <div class="result-section">
        <div class="score-bar-container">
          <div class="score-bar-item">
            <span class="score-bar-label">焦虑度</span>
            <div class="score-bar-track">
              <div class="score-bar-fill" style="width:${(result.anxiety/7*100).toFixed(0)}%;background:#FF9800"></div>
            </div>
            <span class="score-bar-value">${result.anxiety.toFixed(1)}</span>
          </div>
          <div class="score-bar-item">
            <span class="score-bar-label">回避度</span>
            <div class="score-bar-track">
              <div class="score-bar-fill" style="width:${(result.avoidance/7*100).toFixed(0)}%;background:#2196F3"></div>
            </div>
            <span class="score-bar-value">${result.avoidance.toFixed(1)}</span>
          </div>
        </div>
      </div>
      <div class="result-section">
        <div class="result-desc">${type.desc}</div>
        <div class="result-advice">
          <div class="advice-title">💡 相处建议</div>
          <p>${type.advice}</p>
        </div>
        <div class="result-advice" style="border-left-color:${type.color}">
          <div class="advice-title">🤝 伴侣相处指南</div>
          <p>${type.partnerAdvice}</p>
        </div>
      </div>
    `;

    // 绘制四象限图
    setTimeout(() => {
      const canvas = document.getElementById('chart-canvas');
      if (canvas) Utils.drawQuadrant(canvas, result.anxiety, result.avoidance);
    }, 50);
  },

  /* ---- 三元论结果页 ---- */
  renderSTLSResult: function(result) {
    const type = result.type;
    const sec = document.getElementById('result-content');
    sec.innerHTML = `
      <div class="result-section">
        <div class="result-type" style="color:${type.color}">
          <div class="type-icon">${type.icon}</div>
          <div class="type-name" style="color:${type.color}">${type.cn}</div>
          <div class="type-en">${type.en}</div>
        </div>
      </div>
      <div class="result-section">
        <div class="result-chart"><canvas id="chart-canvas" width="280" height="260"></canvas></div>
      </div>
      <div class="result-section">
        <div class="score-bar-container">
          ${['intimacy','passion','commitment'].map(dim => {
            const labels = {intimacy:'亲密', passion:'激情', commitment:'承诺'};
            const colors = {intimacy:'#66BB6A', passion:'#FF7043', commitment:'#42A5F5'};
            const maxScore = result.maxScore || 5;
            return `
              <div class="score-bar-item">
                <span class="score-bar-label">${labels[dim]}</span>
                <div class="score-bar-track">
                  <div class="score-bar-fill" style="width:${(result.scores[dim]/maxScore*100).toFixed(0)}%;background:${colors[dim]}"></div>
                </div>
                <span class="score-bar-value">${result.scores[dim].toFixed(1)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div class="result-section">
        <div class="result-desc">${type.desc || ''}</div>
        <div class="result-advice" style="border-left-color:${type.color}">
          <div class="advice-title">💡 关系建议</div>
          <p>${type.advice || ''}</p>
        </div>
      </div>
    `;

    setTimeout(() => {
      const canvas = document.getElementById('chart-canvas');
      if (canvas) Utils.drawTriangle(canvas, result.scores.intimacy, result.scores.passion, result.scores.commitment, result.maxScore || 5);
    }, 50);
  },

  /* ---- LAS 结果页 ---- */
  renderLASResult: function(result) {
    const primary = LAS.styles[result.primary];
    const secondary = LAS.styles[result.secondary];
    const sec = document.getElementById('result-content');

    // 色板
    const styleOrder = LAS.getStyleOrder();
    const paletteHtml = styleOrder.map(s => {
      const score = result.scores[s];
      const st = LAS.styles[s];
      const isPrimary = s === result.primary;
      const isSecondary = s === result.secondary;
      const size = isPrimary ? 50 : (isSecondary ? 40 : 32);
      return `<div class="color-swatch ${isPrimary ? 'primary' : ''}" style="width:${size}px;height:${size}px;background:${st.color}" title="${st.cn}: ${score.toFixed(1)}">
        <span class="swatch-label">${isPrimary ? '★'+st.cn : (isSecondary ? st.cn : '')}</span>
      </div>`;
    }).join('');

    sec.innerHTML = `
      <div class="result-section">
        <div class="result-type" style="color:${primary.color}">
          <div class="type-icon">${primary.icon}</div>
          <div class="type-name" style="color:${primary.color}">${primary.cn}</div>
          <div class="type-en">${primary.en}</div>
        </div>
      </div>
      <div class="result-section">
        <div style="text-align:center;font-size:0.85rem;color:var(--text-secondary);margin-bottom:8px;">你的爱情色板</div>
        <div class="color-palette">${paletteHtml}</div>
        <div style="text-align:center;font-size:0.75rem;color:var(--text-light);margin-top:8px;">
          主导: ${primary.cn} (${primary.en}) &nbsp;·&nbsp; 次要: ${secondary.cn} (${secondary.en})
        </div>
      </div>
      <div class="result-section">
        <div class="score-bar-container">
          ${styleOrder.map(s => {
            const st = LAS.styles[s];
            const score = result.scores[s];
            const maxScore = 5;
            return `
              <div class="score-bar-item">
                <span class="score-bar-label" style="color:${st.color}">${st.cn}</span>
                <div class="score-bar-track">
                  <div class="score-bar-fill" style="width:${(score/maxScore*100).toFixed(0)}%;background:${st.color}"></div>
                </div>
                <span class="score-bar-value">${score.toFixed(1)}</span>
              </div>
            `;
          }).join('')}
        </div>
      </div>
      <div class="result-section">
        <div class="result-desc">${primary.desc}</div>
        <div class="result-advice" style="border-left-color:${primary.color}">
          <div class="advice-title">💡 成长建议</div>
          <p>${primary.advice}</p>
        </div>
      </div>
    `;
  },

  /* ---- 5LL 结果页 ---- */
  renderLLResult: function(result) {
    const primary = LL.labels[result.primary];
    const sec = document.getElementById('result-content');

    const rankHtml = result.sorted.map(([k, v], i) => {
      const lb = LL.labels[k];
      return `
        <div class="ll-rank-item">
          <span class="rank-num">#${i+1}</span>
          <div class="rank-color" style="background:${lb.color}"></div>
          <span class="rank-name">${lb.cn}</span>
          <span class="rank-score">${v} 分</span>
        </div>
      `;
    }).join('');

    sec.innerHTML = `
      <div class="result-section">
        <div class="result-type" style="color:${primary.color}">
          <div class="type-icon">${primary.icon}</div>
          <div class="type-name" style="color:${primary.color}">${primary.cn}</div>
          <div class="type-en">${primary.en}</div>
          ${result.isBilingual ? '<div style="margin-top:8px;font-size:0.8rem;color:#E8736F">🌟 你是"双语者" —— 两种爱语对你同等重要</div>' : ''}
        </div>
      </div>
      <div class="result-section">
        <div class="result-chart"><canvas id="chart-canvas" width="320" height="300"></canvas></div>
      </div>
      <div class="result-section">
        <div style="font-size:0.85rem;font-weight:600;margin-bottom:10px;">📊 爱语排行榜</div>
        ${rankHtml}
      </div>
      <div class="result-section">
        <div class="result-advice" style="border-left-color:${primary.color}">
          <div class="advice-title">💡 关于「${primary.cn}」</div>
          <p>${this.getLLAdvice(result.primary)}</p>
        </div>
      </div>
    `;

    setTimeout(() => {
      const canvas = document.getElementById('chart-canvas');
      if (canvas) Utils.drawRadar(canvas, result.scores, LL.labels);
    }, 50);
  },

  getLLAdvice: function(key) {
    const advice = {
      A: '你渴望听到肯定和鼓励的话语。主动告诉伴侣你希望听到什么样的表达，同时也要记得：行动同样重要。',
      B: '对你来说，全神贯注的陪伴是最有力量的爱的表达。定期安排不被打扰的二人时间，深度交流能让你感受到被爱。',
      C: '礼物对你来说是爱的视觉象征，代表着"你被想着"。不必追求贵重，用心和惊喜更重要。也学习用其他方式表达爱。',
      D: '行动胜于言语——当伴侣主动为你做事时，你感受到最深的爱。清晰地表达你的需求，也欣赏伴侣用ta的方式为你付出。',
      E: '身体的亲近是你感受爱和安全的核心方式。拥抱、牵手、依偎——这些"无言的爱"比起言语更能让你安心。'
    };
    return advice[key] || '';
  },

  /* ---- 历史结果 ---- */
  showHistory: function() {
    const results = Utils.loadAllResults();
    const sec = document.getElementById('result-content');
    sec.innerHTML = '<div class="result-section"><h3 style="text-align:center;margin-bottom:16px;">📋 历史测试结果</h3></div>';

    const moduleMeta = {
      ecr: { name:'依恋类型诊断', fn: r => ECR.types[r.type]?.cn || '?', color: r => ECR.types[r.type]?.color || '#999' },
      stls: { name:'爱情三元论', fn: r => STLS.types[r.type?.key]?.cn || '?', color: r => STLS.types[r.type?.key]?.color || '#999' },
      las: { name:'爱情色彩风格', fn: r => LAS.styles[r.primary]?.cn || '?', color: r => LAS.styles[r.primary]?.color || '#999' },
      ll: { name:'五种恋爱语言', fn: r => LL.labels[r.primary]?.cn || '?', color: r => LL.labels[r.primary]?.color || '#999' }
    };

    Object.entries(results).filter(([k,v]) => v.timestamp).forEach(([modKey, data]) => {
      const meta = moduleMeta[modKey];
      if (!meta) return;
      const name = meta.fn(data);
      const color = meta.color(data);
      const date = new Date(data.timestamp).toLocaleString('zh-CN');
      sec.innerHTML += `
        <div class="result-section" style="cursor:pointer;border-left:3px solid ${color}" onclick="App.showModuleResult('${modKey}')">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
              <div style="font-size:0.8rem;color:var(--text-secondary)">${meta.name}</div>
              <div style="font-weight:600;color:${color}">${name}</div>
            </div>
            <div style="font-size:0.7rem;color:var(--text-light)">${date}</div>
          </div>
        </div>
      `;
    });

    sec.innerHTML += `
      <div style="text-align:center;margin-top:16px;">
        <button class="btn btn-outline" onclick="UI.renderHome();UI.switchPage('page-home')">🏠 返回首页</button>
        <button class="btn btn-outline" style="margin-left:8px;color:#999;border-color:#DDD;" onclick="Utils.clearResults();UI.renderHome();UI.switchPage('page-home');alert('已清空历史记录')">🗑️ 清空</button>
      </div>
    `;

    this.switchPage('page-result');
    document.getElementById('result-module-name').textContent = '历史记录';
    document.getElementById('result-actions').style.display = 'none';
  }
};
