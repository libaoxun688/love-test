/* ===== 昵称系统 ===== */

const Profile = {
  KEY: 'love-test-nickname',

  getNickname: function() {
    return localStorage.getItem(this.KEY) || '';
  },

  saveNickname: function(name) {
    localStorage.setItem(this.KEY, name.trim());
  },

  hasNickname: function() {
    return !!this.getNickname();
  },

  renderPage: function() {
    const container = document.getElementById('page-nickname');
    container.innerHTML = `
      <div class="profile-setup">
        <div class="profile-icon">💗</div>
        <h2>给自己起个昵称吧</h2>
        <p class="profile-hint">用于匹配结果展示，2-8 个字</p>
        <div class="profile-input-wrap">
          <input type="text" id="nickname-input" class="profile-input"
            maxlength="8" placeholder="输入你的昵称..." value="${this.getNickname()}">
          <span class="profile-count" id="nickname-count">0/8</span>
        </div>
        <button class="btn btn-primary profile-btn" id="nickname-save">💕 保存</button>
      </div>
    `;
    // 字数实时统计
    const input = document.getElementById('nickname-input');
    const count = document.getElementById('nickname-count');
    const updateCount = () => { count.textContent = input.value.length + '/8'; };
    input.addEventListener('input', updateCount);
    updateCount();
    // 保存
    document.getElementById('nickname-save').addEventListener('click', () => {
      const val = input.value.trim();
      if (val.length < 2) { alert('昵称至少 2 个字哦'); return; }
      this.saveNickname(val);
      UI.switchPage('page-home');
      UI.renderHome();
    });
    // 回车保存
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') document.getElementById('nickname-save').click();
    });
  }
};
window.Profile = Profile;
