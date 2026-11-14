(() => {
  const dialog = document.querySelector('#leadershipProfileDialog');
  const dataNode = document.querySelector('#leadershipProfilesData');
  if (!dialog || !dataNode) return;

  const profiles = JSON.parse(dataNode.textContent);
  const name = dialog.querySelector('#leadershipProfileName');
  const role = dialog.querySelector('[data-profile-role]');
  const portrait = dialog.querySelector('[data-profile-portrait]');
  const portraitImage = portrait.querySelector('img');
  const portraitInitials = portrait.querySelector('span');
  const biography = dialog.querySelector('[data-profile-biography]');
  const contacts = dialog.querySelector('[data-profile-contacts]');
  const statement = dialog.querySelector('[data-profile-statement]');
  const statementText = statement.querySelector('blockquote');
  const closeButton = dialog.querySelector('[data-profile-close]');
  let lastTrigger = null;

  const initials = value => value.split(/\s+/).slice(0, 2).map(part => part[0]).join('');
  const addContact = (label, href, value) => {
    const link = document.createElement('a');
    link.href = href;
    const caption = document.createElement('span');
    caption.textContent = label;
    const text = document.createElement('strong');
    text.textContent = value;
    link.append(caption, text);
    contacts.append(link);
  };

  const openProfile = (id, trigger) => {
    const profile = profiles[id];
    if (!profile) return;
    lastTrigger = trigger;
    name.textContent = profile.name;
    role.textContent = profile.role;

    const cardImage = trigger.closest('[data-leadership-id]')?.querySelector('.leadership-card__portrait img');
    portraitImage.hidden = !cardImage;
    portraitInitials.hidden = Boolean(cardImage);
    if (cardImage) {
      portraitImage.src = cardImage.currentSrc || cardImage.src;
      portraitImage.alt = profile.name;
    } else {
      portraitImage.removeAttribute('src');
      portraitImage.alt = '';
      portraitInitials.textContent = initials(profile.name);
    }

    biography.replaceChildren();
    for (const paragraph of profile.biography || []) {
      const text = document.createElement('p');
      text.textContent = paragraph;
      biography.append(text);
    }
    biography.hidden = biography.childElementCount === 0;

    contacts.replaceChildren();
    if (profile.email) addContact('Электронная почта', `mailto:${profile.email}`, profile.email);
    if (profile.phone) addContact('Телефон', `tel:${profile.phone.replace(/[^+\d]/g, '')}`, profile.phone);
    contacts.hidden = contacts.childElementCount === 0;

    statement.hidden = !profile.statement;
    statementText.textContent = profile.statement || '';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    closeButton.focus();
  };

  document.querySelectorAll('[data-leadership-id]').forEach(card => {
    const button = card.querySelector('.leadership-card__open');
    button.addEventListener('click', event => {
      event.stopPropagation();
      openProfile(card.dataset.leadershipId, button);
    });
    card.addEventListener('click', event => {
      if (event.target.closest('a,button')) return;
      openProfile(card.dataset.leadershipId, card);
    });
  });

  const closeDialog = () => {
    if (dialog.open && typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  };
  closeButton.addEventListener('click', closeDialog);
  dialog.addEventListener('click', event => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener('close', () => {
    if (lastTrigger) lastTrigger.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && dialog.open) closeDialog();
  });
})();
