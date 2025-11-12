(async function () {
  const DATA_URL = 'data.txt';
  const sidebar = document.getElementById('sidebar');
  const menuBtn = document.getElementById('menu-btn');
  const listEl = document.getElementById('list');
  const detailEl = document.getElementById('detail');
  const searchEl = document.getElementById('search');
  let data = {};
  let currentSection = 'fauna';

  menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  try {
    const resp = await fetch(DATA_URL, { cache: 'no-store' });
    data = JSON.parse(await resp.text());
  } catch (e) {
    console.error('Erro ao carregar data.txt', e);
    listEl.innerHTML = '<p style="color:red">Erro ao carregar dados.</p>';
    return;
  }

  function renderList(section, q = '') {
    listEl.innerHTML = '';
    detailEl.classList.add('hidden');
    const items = (data[section] || []).filter(it =>
      JSON.stringify(it).toLowerCase().includes(q.toLowerCase())
    );

    if (items.length === 0) {
      listEl.innerHTML = '<p style="color:gray">Nenhum resultado encontrado.</p>';
      return;
    }

    items.forEach(it => {
      const card = document.createElement('article');
      card.className = 'card';
      const img = document.createElement('img');
      img.src = it.imagem || 'https://via.placeholder.com/150?text=sem+imagem';
      const div = document.createElement('div');
      const h3 = document.createElement('h3');
      h3.textContent = it.nome || it.estacao;
      const p = document.createElement('p');
      p.textContent = it.resumo || '';
      div.append(h3, p);
      card.append(img, div);
      card.addEventListener('click', () => showDetail(section, it.id));
      listEl.append(card);
    });
  }

  function showDetail(section, id) {
    const item = (data[section] || []).find(x => x.id === id);
    if (!item) return;
    detailEl.classList.remove('hidden');
    detailEl.innerHTML = `
      <img src="${item.imagem || ''}" alt="">
      <h2>${item.nome || item.estacao}</h2>
      <p><em>${item.cientifico || item.periodo || ''}</em></p>
      <p>${item.detalhes || item.resumo}</p>
    `;
  }

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentSection = btn.dataset.section;
      renderList(currentSection, searchEl.value.trim());
      sidebar.classList.remove('open');
    });
  });

  searchEl.addEventListener('input', () => renderList(currentSection, searchEl.value.trim()));

  renderList(currentSection);
})();