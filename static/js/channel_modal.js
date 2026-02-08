document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.channel-widget').forEach(w => {
        const d = JSON.parse(w.querySelector('.channel-data').textContent),
            all = d.all,
            sel = new Set(d.selected),
            name = w.dataset.name,
            srch = w.querySelector('.channel-search'),
            left = w.querySelector('[data-panel="left"]'),
            right = w.querySelector('[data-panel="right"]'),
            inputs = w.querySelector('.hidden-inputs');
        const upd = () => {
            left.innerHTML = all.filter(c => !sel.has(c.id) && (!srch.value || c.title.toLowerCase().includes(srch.value.toLowerCase()))).map(c => `<div class="channel-item" data-id="${c.id}"><span class="channel-thumb"><img src="${c.thumbnail}"></span><span>${c.title}</span><button class="add-btn" type="button">+</button></div>`).join('') || '<div class="empty-message">No channels available</div>';
            right.innerHTML = [...sel].map(id => all.find(c => c.id == id)).filter(Boolean).map(c => `<div class="channel-item" data-id="${c.id}"><span class="channel-thumb"><img src="${c.thumbnail}"></span><span>${c.title}</span><button class="remove-btn" type="button">&times;</button></div>`).join('') || '<div class="empty-message">No channels selected</div>';
            inputs.innerHTML = [...sel].map(id => `<input type="hidden" name="${name}" value="${id}">`).join('')
        };
        srch.oninput = upd;
        left.onclick = e => {
            const item = e.target.closest('.channel-item');
            if (item) {
                sel.add(item.dataset.id);
                upd()
            }
        };
        right.onclick = e => {
            const item = e.target.closest('.channel-item');
            if (item) {
                sel.delete(item.dataset.id);
                upd();
            }
        };
        upd();
    })
});