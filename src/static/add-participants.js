(function () {
  function parseParticipants(el) {
    // 1) atributo data-participants: "Ana,Beto"
    const attr = el.getAttribute('data-participants');
    if (attr && attr.trim()) {
      return attr.split(',').map(s => s.trim()).filter(Boolean);
    }
    // 2) elemento .participants-json con JSON array
    const jsonEl = el.querySelector('.participants-json');
    if (jsonEl) {
      try {
        const parsed = JSON.parse(jsonEl.textContent || '[]');
        if (Array.isArray(parsed)) return parsed.map(String);
      } catch (e) { /* ignore */ }
    }
    return [];
  }

  function initials(name) {
    return (name || '').split(/\s+/).map(p => p[0]).slice(0,2).join('').toUpperCase();
  }

  function buildSection(participants) {
    const section = document.createElement('div');
    section.className = 'participants-section';
    const header = document.createElement('div');
    header.className = 'participants-header';
    header.textContent = 'Participantes';
    section.appendChild(header);

    if (!participants.length) {
      const empty = document.createElement('div');
      empty.className = 'no-participants';
      empty.textContent = 'No hay participantes aún.';
      section.appendChild(empty);
      return section;
    }

    const ul = document.createElement('ul');
    ul.className = 'participants-list';
    participants.forEach(p => {
      const li = document.createElement('li');
      const avatar = document.createElement('span');
      avatar.className = 'participant-avatar';
      avatar.textContent = initials(p);
      const name = document.createElement('span');
      name.className = 'participant-name';
      name.textContent = p;
      li.appendChild(avatar);
      li.appendChild(name);
      ul.appendChild(li);
    });
    section.appendChild(ul);
    return section;
  }

  function insertSections() {
    const cards = document.querySelectorAll('.activity-card');
    cards.forEach(card => {
      // evita duplicados
      if (card.querySelector('.participants-section')) return;
      const participants = parseParticipants(card);
      const section = buildSection(participants);
      // intenta insertar después de .activity-meta si existe, si no al final
      const ref = card.querySelector('.activity-meta');
      if (ref && ref.parentNode) ref.parentNode.insertBefore(section, ref.nextSibling);
      else card.appendChild(section);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertSections);
  } else {
    insertSections();
  }
})();
