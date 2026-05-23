/* ===== 工具函数：Canvas 绘图 + localStorage ===== */

const Utils = {
  /* ---- localStorage ---- */
  saveResult: function(moduleKey, data) {
    let all = this.loadAllResults();
    all[moduleKey] = { ...data, timestamp: Date.now() };
    try {
      localStorage.setItem('love-test-results', JSON.stringify(all));
    } catch(e) { console.warn('localStorage save failed', e); }
  },
  loadAllResults: function() {
    try {
      return JSON.parse(localStorage.getItem('love-test-results')) || {};
    } catch(e) { return {}; }
  },
  loadResult: function(moduleKey) {
    return this.loadAllResults()[moduleKey] || null;
  },
  clearResults: function() {
    localStorage.removeItem('love-test-results');
  },

  /* ---- HiDPI Canvas 缩放 ---- */
  setupHiDPICanvas: function(canvas, w, h) {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    return ctx;
  },

  /* ---- 依恋四象限图 ---- */
  /* 坐标系：X轴左=回避度低，右=回避度高；Y轴上=焦虑度低，下=焦虑度高 */
  /* 象限映射：
   *   左上 (焦虑度低+回避度低) = 安全型
   *   右上 (焦虑度低+回避度高) = 回避型
   *   左下 (焦虑度高+回避度低) = 焦虑型
   *   右下 (焦虑度高+回避度高) = 恐惧型
   */
  drawQuadrant: function(canvas, anxiety, avoidance) {
    const ctx = this.setupHiDPICanvas(canvas, 340, 340);
    const W = 340, H = 340;
    const pad = 40;
    const cx = W/2, cy = H/2;
    // 1-7点量表，中心在4
    const scaleX = (W/2 - pad) / 3.5;  // 每1分的像素
    const scaleY = (H/2 - pad) / 3.5;

    const QW = W/2 - pad;  // 象限宽
    const QH = H/2 - pad;  // 象限高

    ctx.clearRect(0, 0, W, H);

    // ---- 背景 ----
    ctx.fillStyle = '#FAFAFA';
    ctx.fillRect(0, 0, W, H);

    // ---- 4 象限着色 + 标签（圆角区域）----
    const quadrants = [
      // [x, y, w, h, color, label, sub, textColor]
      // 左上: 安全型
      [pad, pad, QW, QH, '#4CAF50', '安全型', 'Secure', '#2E7D32'],
      // 右上: 回避型
      [cx, pad, QW, QH, '#2196F3', '回避型', 'Dismissive-Avoidant', '#1565C0'],
      // 左下: 焦虑型
      [pad, cy, QW, QH, '#FF9800', '焦虑型', 'Anxious / Preoccupied', '#E65100'],
      // 右下: 恐惧型
      [cx, cy, QW, QH, '#9C27B0', '恐惧/矛盾型', 'Fearful-Avoidant', '#6A1B9A']
    ];

    quadrants.forEach(q => {
      // 半透明着色
      ctx.fillStyle = q[4];
      ctx.globalAlpha = 0.10;
      ctx.beginPath();
      let rx=q[0], ry=q[1], rw=q[2], rh=q[3], rr=6;
      ctx.moveTo(rx+rr, ry);
      ctx.lineTo(rx+rw-rr, ry);
      ctx.arcTo(rx+rw, ry, rx+rw, ry+rr, rr);
      ctx.lineTo(rx+rw, ry+rh-rr);
      ctx.arcTo(rx+rw, ry+rh, rx+rw-rr, ry+rh, rr);
      ctx.lineTo(rx+rr, ry+rh);
      ctx.arcTo(rx, ry+rh, rx, ry+rh-rr, rr);
      ctx.lineTo(rx, ry+rr);
      ctx.arcTo(rx, ry, rx+rr, ry, rr);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;

      // 类型名
      ctx.fillStyle = q[7];
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(q[5], q[0] + q[2]/2, q[1] + q[3]/2 - 8);

      // 英文副标签
      ctx.fillStyle = q[7] + '80';
      ctx.font = '10px sans-serif';
      ctx.fillText(q[6], q[0] + q[2]/2, q[1] + q[3]/2 + 12);
    });

    // ---- 坐标轴（十字线）----
    ctx.strokeStyle = '#BBB';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(pad, cy); ctx.lineTo(W-pad, cy);
    ctx.moveTo(cx, pad); ctx.lineTo(cx, H-pad);
    ctx.stroke();

    // ---- 轴刻度 ----
    ctx.fillStyle = '#999';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let v = 1; v <= 7; v++) {
      let x = pad + (v - 1) * (QW / 3);
      ctx.fillText(v, x, cy + 4);
    }
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let v = 1; v <= 7; v++) {
      let y = pad + (v - 1) * (QH / 3);
      ctx.fillText(v, cx - 4, y);
    }

    // ---- 轴标签 ----
    ctx.fillStyle = '#666';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('回避度 →', W-pad-20, cy + 18);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText('← 回避度低', pad + 35, cy + 18);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText('焦虑度高 ↓', cx + 50, H - pad + 6);
    ctx.textBaseline = 'top';
    ctx.fillText('↑ 焦虑度低', cx - 50, pad - 6);

    // ---- 用户位置 ----
    // 中心在 (cx, cy) 对应焦虑度=4, 回避度=4
    let ax = cx + (avoidance - 4) * scaleX;
    let ay = cy + (anxiety - 4) * scaleY;
    ax = Math.max(pad+2, Math.min(W-pad-2, ax));
    ay = Math.max(pad+2, Math.min(H-pad-2, ay));

    // 外发光
    ctx.shadowColor = 'rgba(233,30,99,0.4)';
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(ax, ay, 8, 0, Math.PI*2);
    ctx.fillStyle = '#E91E63';
    ctx.fill();
    ctx.shadowBlur = 0;

    // 白边
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 坐标值指示器（右上角）
    ctx.fillStyle = '#E91E63';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillText(`● 焦虑度 ${anxiety.toFixed(1)}`, W-8, 10);
    ctx.fillText(`● 回避度 ${avoidance.toFixed(1)}`, W-8, 28);
  },

  /* ---- 爱情三角形图 ---- */
  drawTriangle: function(canvas, intimacy, passion, commitment, maxScore) {
    const ctx = this.setupHiDPICanvas(canvas, 280, 260);
    const W = 280, H = 260;
    const cx = W/2, cy = 30;
    const side = 200;
    const h = side * Math.sqrt(3)/2;

    ctx.clearRect(0, 0, W, H);

    // 外三角形（等边）
    let pts = [
      [cx, cy],                                    // 上顶点
      [cx - side/2, cy + h],                       // 左下
      [cx + side/2, cy + h]                        // 右下
    ];

    // 内三角形（根据得分）
    let factor = s => Math.max(0.1, Math.min(1, s / maxScore));
    let fi = factor(intimacy), fp = factor(passion), fc = factor(commitment);

    let inner = [
      [cx, cy + (h * (1 - fi))],                    // 亲密: 从上顶点向内
      [cx - side/2 * fp, cy + h * (1 - (1-fp)*0.1)], // 激情: 从左下角向内
      [cx + side/2 * fc, cy + h * (1 - (1-fc)*0.1)]  // 承诺: 从右下角向内
    ];

    // 绘制外三角形（虚线）
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 1;
    ctx.setLineDash([4,4]);
    ctx.beginPath();
    ctx.moveTo(...pts[0]); ctx.lineTo(...pts[1]); ctx.lineTo(...pts[2]); ctx.closePath();
    ctx.stroke();
    ctx.setLineDash([]);

    // 绘制内三角形
    ctx.beginPath();
    ctx.moveTo(...inner[0]); ctx.lineTo(...inner[1]); ctx.lineTo(...inner[2]); ctx.closePath();
    ctx.fillStyle = 'rgba(255,127,111,0.25)';
    ctx.fill();
    ctx.strokeStyle = '#FF7F6F';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 顶点标签
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#555';
    let labels = [
      [cx, cy - 14, `亲密 ${intimacy.toFixed(1)}`],
      [cx - side/2, cy + h + 18, `激情 ${passion.toFixed(1)}`],
      [cx + side/2, cy + h + 18, `承诺 ${commitment.toFixed(1)}`]
    ];
    labels.forEach(([x,y,t]) => { ctx.fillText(t, x, y); });
  },

  /* ---- 雷达图 ---- */
  drawRadar: function(canvas, scores, labels, options) {
    const ctx = this.setupHiDPICanvas(canvas, 320, 300);
    const W = 320, H = 300;
    const cx = W/2, cy = H/2 - 10;
    const radius = 95;
    const n = Object.keys(scores).length;
    const maxScore = Math.max(1, ...Object.values(scores));
    const opt = options || {};
    const fillColor = opt.fillColor || 'rgba(232,115,111,0.2)';
    const strokeColor = opt.strokeColor || '#E8736F';
    const pointColor = opt.pointColor || '#E8736F';
    const labelColor = opt.labelColor || '#555';

    ctx.clearRect(0, 0, W, H);

    // 网格圆
    for (let r = 1; r <= 3; r++) {
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        let angle = Math.PI/2 - (Math.PI*2/n)*i;
        let x = cx + radius * (r/3) * Math.cos(angle);
        let y = cy - radius * (r/3) * Math.sin(angle);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = '#E0E0E0';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // 数据多边形
    let entries = Object.entries(scores).map(([k,v], i) => {
      let angle = Math.PI/2 - (Math.PI*2/n)*i;
      let val = Math.min(v / maxScore, 1);
      return { key: k, x: cx + radius * val * Math.cos(angle), y: cy - radius * val * Math.sin(angle) };
    });

    ctx.beginPath();
    entries.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.closePath();
    ctx.fillStyle = fillColor;
    ctx.fill();
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 数据点
    entries.forEach(p => {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI*2);
      ctx.fillStyle = pointColor; ctx.fill();
    });

    // 轴标签
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    Object.entries(labels).forEach(([k, lb], i) => {
      let angle = Math.PI/2 - (Math.PI*2/n)*i;
      let x = cx + (radius + 22) * Math.cos(angle);
      let y = cy - (radius + 22) * Math.sin(angle);
      ctx.fillStyle = labelColor;
      ctx.fillText(lb.cn, x, y+4);
    });

    if (!opt.hideScoreLabel) {
      ctx.fillStyle = '#999';
      ctx.font = '10px sans-serif';
      ctx.fillText('得分', cx, H-8);
    }
  },

  /* ---- 分享图生成（重设计） ---- */
  _hexToRgba: function(hex, alpha) {
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  },

  _roundRect: function(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r, y);
    ctx.lineTo(x+w-r, y);
    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
    ctx.lineTo(x+w, y+h-r);
    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
    ctx.lineTo(x+r, y+h);
    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
    ctx.lineTo(x, y+r);
    ctx.quadraticCurveTo(x, y, x+r, y);
    ctx.closePath();
  },

  _measureWrappedHeight: function(ctx, text, maxWidth, lineHeight) {
    let line = '', lines = 1;
    for (let i = 0; i < text.length; i++) {
      let testLine = line + text[i];
      if (ctx.measureText(testLine).width > maxWidth && i > 0) { lines++; line = text[i]; }
      else { line = testLine; }
    }
    return lines * lineHeight;
  },

  _getShareTypeName: function(moduleKey, data) {
    if (moduleKey === 'ecr') return ECR.types[data.type]?.cn || '未知';
    if (moduleKey === 'stls') return data.type?.cn || '未知';
    if (moduleKey === 'las') return LAS.styles[data.primary]?.cn || '未知';
    if (moduleKey === 'll') return LL.labels[data.primary]?.cn || '未知';
    return '未知';
  },

  _getShareTypeEn: function(moduleKey, data) {
    if (moduleKey === 'ecr') return ECR.types[data.type]?.en || '';
    if (moduleKey === 'stls') return data.type?.en || '';
    if (moduleKey === 'las') return LAS.styles[data.primary]?.en || '';
    if (moduleKey === 'll') return LL.labels[data.primary]?.en || '';
    return '';
  },

  _drawShareCardBackground: function(ctx, W, H, moduleKey) {
    const colors = { ecr:'#9B72AA', stls:'#FF7F6F', las:'#FF6B9D', ll:'#E8736F' };
    const color = colors[moduleKey] || '#888';
    // 渐变背景
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, this._hexToRgba(color, 0.10));
    grad.addColorStop(0.2, this._hexToRgba(color, 0.03));
    grad.addColorStop(0.5, '#FFFFFF');
    grad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // 装饰圆（右上）
    ctx.globalAlpha = 0.04;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(W + 30, -40, 200, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // 顶部色带
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, W, 8);
    return color;
  },

  _drawShareCardHeader: function(ctx, W, moduleKey, resultData, color) {
    const titles = { ecr:'依恋类型诊断', stls:'爱情三元论', las:'爱情色彩风格', ll:'五种恋爱语言' };
    // 图标 emoji
    let icon = '?';
    if (moduleKey === 'ecr') icon = ECR.types[resultData.type]?.icon || '?';
    else if (moduleKey === 'stls') icon = resultData.type?.icon || '?';
    else if (moduleKey === 'las') icon = LAS.styles[resultData.primary]?.icon || '?';
    else if (moduleKey === 'll') icon = LL.labels[resultData.primary]?.icon || '?';
    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(icon, W / 2, 52);
    // 中文名
    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(this._getShareTypeName(moduleKey, resultData), W / 2, 112);
    // 英文名
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#999';
    ctx.textBaseline = 'middle';
    ctx.fillText(this._getShareTypeEn(moduleKey, resultData), W / 2, 138);
    // 模块标签
    ctx.font = '11px sans-serif';
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(titles[moduleKey] || '心理测试', W / 2, 164);
    return 180;
  },

  _drawScoreBar: function(ctx, label, value, maxValue, barColor, x, y, barWidth) {
    const trackX = x + 80;
    const trackWidth = barWidth - 80 - 40;
    const trackH = 10;
    // 标签
    ctx.font = '13px sans-serif';
    ctx.fillStyle = '#555';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, x, y);
    // 轨道背景
    ctx.fillStyle = '#F0F0F0';
    this._roundRect(ctx, trackX, y - trackH/2, trackWidth, trackH, 5);
    ctx.fill();
    // 填充
    const fillW = Math.max(0, Math.min(1, Math.min(value, maxValue) / Math.max(1, maxValue))) * trackWidth;
    ctx.fillStyle = barColor;
    ctx.globalAlpha = 0.8;
    this._roundRect(ctx, trackX, y - trackH/2, fillW, trackH, 5);
    ctx.fill();
    ctx.globalAlpha = 1;
    // 数值
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = barColor;
    ctx.textAlign = 'right';
    ctx.fillText(value.toFixed(1), trackX + trackWidth + 8, y);
  },

  _drawShareCardScores: function(ctx, W, startY, moduleKey, resultData, color) {
    let y = startY;
    const barW = W - 60;
    if (moduleKey === 'ecr') {
      this._drawScoreBar(ctx, '焦虑度', resultData.anxiety || 0, 7, '#FF9800', 30, y, barW); y += 36;
      this._drawScoreBar(ctx, '回避度', resultData.avoidance || 0, 7, '#2196F3', 30, y, barW); y += 36;
    } else if (moduleKey === 'stls') {
      const dims = [
        { label: '亲密', key: 'intimacy', color: '#66BB6A' },
        { label: '激情', key: 'passion', color: '#FF7043' },
        { label: '承诺', key: 'commitment', color: '#42A5F5' }
      ];
      dims.forEach(d => {
        this._drawScoreBar(ctx, d.label, resultData.scores?.[d.key] || 0, resultData.maxScore || 5, d.color, 30, y, barW);
        y += 36;
      });
    } else if (moduleKey === 'las') {
      const all = Object.entries(resultData.scores || {}).sort((a, b) => b[1] - a[1]);
      all.slice(0, 4).forEach(([k, v], i) => {
        const st = LAS.styles[k];
        const label = i === 0 ? '★ ' + st.cn : st.cn;
        this._drawScoreBar(ctx, label, v, 5, st.color, 30, y, barW);
        y += 32;
      });
    } else if (moduleKey === 'll') {
      const sorted = resultData.sorted || [];
      const maxV = Math.max(1, ...sorted.map(s => s[1]));
      sorted.forEach(([k, v], i) => {
        const lb = LL.labels[k];
        this._drawScoreBar(ctx, lb.cn, v, maxV, lb.color, 30, y, barW);
        y += 30;
      });
    }
    return y + 12;
  },

  generateShareCard: function(moduleKey, resultData) {
    const canvas = document.getElementById('share-canvas');
    const ctx = this.setupHiDPICanvas(canvas, 480, 640);
    const W = 480, H = 640;

    // 1. 渐变背景
    const color = this._drawShareCardBackground(ctx, W, H, moduleKey);

    // 2. 头部（图标 + 中英文名 + 模块标签）
    let contentY = this._drawShareCardHeader(ctx, W, moduleKey, resultData, color);

    // 3. 分隔线
    ctx.strokeStyle = this._hexToRgba(color, 0.15);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, contentY);
    ctx.lineTo(W - 40, contentY);
    ctx.stroke();
    contentY += 18;

    // 4. 分数条
    contentY = this._drawShareCardScores(ctx, W, contentY, moduleKey, resultData, color);

    // 5. 分隔线
    ctx.strokeStyle = this._hexToRgba(color, 0.10);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, contentY);
    ctx.lineTo(W - 40, contentY);
    ctx.stroke();
    contentY += 16;

    // 6. 描述
    let desc = '';
    if (moduleKey === 'ecr') desc = ECR.types[resultData.type]?.desc || '';
    else if (moduleKey === 'stls') desc = resultData.type?.desc || '';
    else if (moduleKey === 'las') desc = LAS.styles[resultData.primary]?.desc || '';
    else if (moduleKey === 'll') desc = `你的主要爱语是「${LL.labels[resultData.primary]?.cn || ''}」——这是你最能感受到爱的方式。`;

    if (desc) {
      const descPad = 12;
      const descW = W - 80;
      const descH = this._measureWrappedHeight(ctx, desc, descW, 18) + descPad * 2;
      // 淡色背景胶囊
      ctx.fillStyle = this._hexToRgba(color, 0.05);
      this._roundRect(ctx, 35, contentY - 4, W - 70, descH + 8, 10);
      ctx.fill();
      // 文字
      ctx.fillStyle = '#666';
      ctx.font = '12px sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      this.wrapText(ctx, desc, 40, contentY + descPad, descW, 18);
      contentY += descH + 16;
    }

    // 7. 底部信息
    contentY = Math.max(contentY, H - 85);
    ctx.fillStyle = this._hexToRgba(color, 0.45);
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('心理学科普 · 了解你的爱情模式', W / 2, contentY);
    ctx.fillStyle = '#BBB';
    ctx.font = '10px sans-serif';
    ctx.fillText(new Date().toLocaleDateString('zh-CN'), W / 2, contentY + 22);
    ctx.fillStyle = '#CCC';
    ctx.font = '9px sans-serif';
    ctx.fillText('love-psych-test · 恋爱心理测试工具集', W / 2, H - 18);

    return canvas.toDataURL('image/png');
  },

  wrapText: function(ctx, text, x, y, maxWidth, lineHeight) {
    let words = text.split('');
    let line = '';
    for (let i = 0; i < text.length; i++) {
      let testLine = line + text[i];
      if (ctx.measureText(testLine).width > maxWidth && i > 0) {
        ctx.fillText(line, x, y);
        line = text[i];
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  },

  /* ---- 下载图片 ---- */
  downloadImage: function(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename || 'love-test-result.png';
    a.click();
  }
};
