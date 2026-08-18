/* ── Certificate Lightbox ──────────────────────────────────────────── */
(function () {
  const lightbox = document.getElementById('certLightbox');
  if (!lightbox) return;

  const backdrop = document.getElementById('certLightboxBackdrop');
  const dialog = lightbox.querySelector('.cert-lightbox-dialog');
  const skeleton = document.getElementById('certLightboxSkeleton');
  const img = document.getElementById('certLightboxImg');
  const title = document.getElementById('certLightboxTitle');
  const subtitle = document.getElementById('certLightboxSubtitle');
  const footer = document.getElementById('certLightboxFooter');
  const downloadBtn = document.getElementById('certLightboxDownload');
  const closeBtn = document.getElementById('certLightboxClose');

  let lastFocused = null;

  function renderFacts(factsAttr) {
    footer.innerHTML = '';
    if (!factsAttr) {
      footer.style.display = 'none';
      return;
    }
    const facts = factsAttr.split(',').map((f) => f.trim()).filter(Boolean);
    if (!facts.length) {
      footer.style.display = 'none';
      return;
    }
    footer.style.display = '';
    facts.forEach((fact) => {
      const pill = document.createElement('span');
      pill.className = 'cert-lightbox-fact';
      pill.textContent = fact;
      footer.appendChild(pill);
    });
  }

  function openCert(trigger) {
    const imgSrc = trigger.getAttribute('data-cert-img');
    const pdfSrc = trigger.getAttribute('data-cert-pdf');
    const certTitle = trigger.getAttribute('data-cert-title') || 'Certificate';
    const certSubtitle = trigger.getAttribute('data-cert-subtitle') || '';
    const certFacts = trigger.getAttribute('data-cert-facts') || '';
    if (!imgSrc) return;

    lastFocused = document.activeElement;
    img.classList.remove('loaded');
    skeleton.classList.add('active');
    img.src = imgSrc;
    img.alt = certTitle;
    title.textContent = certTitle;
    subtitle.textContent = certSubtitle;
    subtitle.style.display = certSubtitle ? '' : 'none';
    renderFacts(certFacts);

    if (pdfSrc) {
      downloadBtn.href = pdfSrc;
      downloadBtn.style.display = '';
    } else {
      downloadBtn.style.display = 'none';
    }

    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBtn.focus();
  }

  function closeCert() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  img.addEventListener('load', () => {
    img.classList.add('loaded');
    skeleton.classList.remove('active');
  });

  document.querySelectorAll('[data-cert-img]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      openCert(trigger);
    });
  });

  backdrop.addEventListener('click', closeCert);
  closeBtn.addEventListener('click', closeCert);
  dialog.addEventListener('click', (e) => e.stopPropagation());

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeCert();
  });
})();
