/* YourGP Group Site — ygp.au
   Two behaviours only: the mobile menu and the content accordions.
   Everything else on this site works without JavaScript. */

document.addEventListener('DOMContentLoaded', function () {

  // === Mobile navigation toggle ===
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      var isOpen = mobileMenu.classList.toggle('open');
      this.classList.toggle('active', isOpen);
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close the menu once a link is followed
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Escape closes it
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.focus();
      }
    });

    // Reaching desktop width leaves no way to close it, so close it here
    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // === Accordions ===
  document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var item = this.closest('.accordion-item');
      var willOpen = !item.classList.contains('open');
      item.classList.toggle('open', willOpen);
      this.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });
  });

});
