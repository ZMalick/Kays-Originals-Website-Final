/* =============================================
   Kay's Originals — Main JavaScript
   ============================================= */

(function () {
  'use strict';

  /* ---- Helpers ---- */
  function getParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ---- Active Nav State ---- */
  (function () {
    var page = document.body.dataset.page;
    if (!page) return;
    var links = document.querySelectorAll('.nav-link');
    var map = {
      home: null,
      gallery: 'gallery.html',
      artists: 'artists.html',
      consignment: 'consignment.html',
      about: 'about.html',
      contact: 'contact.html',
      faq: 'faq.html'
    };
    var target = map[page];
    links.forEach(function (link) {
      link.classList.remove('active');
      if (target && link.getAttribute('href').indexOf(target) !== -1) {
        link.classList.add('active');
      }
    });
  })();

  /* ---- Resolve local vs. external image paths ---- */
  function resolveImageSrc(src) {
    return src && src.startsWith('http') ? src : (window.IMAGE_BASE || '') + src;
  }

  /* ---- Render an artwork card (reused everywhere) ---- */
  function renderArtworkCard(art, isRecent) {
    var artist = KaysData.getArtist(art.artistId);
    var base = window.PAGE_BASE || '';
    var badge = isRecent ? '<span class="badge-new">Recently Added</span>' : '';
    return '<article class="artwork-card">' +
      '<a href="' + base + 'artwork.html?id=' + art.id + '" class="card-link">' +
        '<div class="card-frame">' +
          '<img src="' + resolveImageSrc(art.image) + '" alt="' + art.title + '" class="card-image" loading="lazy">' +
          '<div class="card-overlay"><div class="overlay-content">' +
            '<span class="overlay-title">' + art.title + '</span>' +
            '<span class="overlay-artist">' + (artist ? artist.name : '') + '</span>' +
          '</div></div>' +
        '</div>' +
        '<div class="card-info">' +
          '<span class="media-tag tag-' + art.category + '">' + capitalize(art.category) + '</span>' +
          (badge ? ' ' + badge : '') +
          '<h3 class="card-title">' + art.title + '</h3>' +
          '<p class="card-artist">' + (artist ? artist.name : '') + '</p>' +
          '<p class="card-year">' + art.year + '</p>' +
          (art.dimensions ? '<p class="card-dimensions">' + art.dimensions + '</p>' : '') +
        '</div>' +
      '</a>' +
    '</article>';
  }

  /* ---- Render an artist card (reused everywhere) ---- */
  function renderArtistCard(artist) {
    return '<div class="artist-card">' +
      '<a href="' + (window.PAGE_BASE || '') + 'artist.html?id=' + artist.id + '" class="artist-card-link">' +
        '<div class="artist-photo-wrap">' +
          '<img src="' + artist.photo + '" alt="' + artist.name + '" class="artist-photo" loading="lazy">' +
        '</div>' +
        '<div class="artist-info">' +
          '<h3>' + artist.name + '</h3>' +
          '<span class="artist-media">' + artist.media + '</span>' +
          '<p>' + artist.shortBio + '</p>' +
          '<span class="artist-link">View Portfolio &rarr;</span>' +
        '</div>' +
      '</a>' +
    '</div>';
  }

  /* ========================================
     PAGE: Homepage
     ======================================== */

  /* ---- Hero Slideshow ---- */
  var heroSlides = document.querySelectorAll('.hero-slide');
  if (heroSlides.length > 1) {
    var currentSlide = 0;
    setInterval(function () {
      heroSlides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
    }, 5000);
  }

  var featuredGrid = document.getElementById('featuredGrid');
  if (featuredGrid) {
    var featured = KaysData.artworks.slice(0, 6);
    var html = '';
    for (var i = 0; i < featured.length; i++) {
      html += renderArtworkCard(featured[i]);
    }
    featuredGrid.innerHTML = html;
  }

  var artistGrid = document.getElementById('artistGrid');
  if (artistGrid) {
    var artists = KaysData.artists.slice(0, 3);
    var ahtml = '';
    for (var j = 0; j < artists.length; j++) {
      ahtml += renderArtistCard(artists[j]);
    }
    artistGrid.innerHTML = ahtml;
  }

  /* ========================================
     PAGE: Gallery
     ======================================== */
  var galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    var artistFilter = document.getElementById('artistFilter');
    var sortSelect = document.getElementById('sortSelect');
    var galleryEmpty = document.getElementById('galleryEmpty');
    var clearFiltersBtn = document.getElementById('clearFilters');
    var pills = document.querySelectorAll('.filter-pill');
    var gallerySearch = document.getElementById('gallerySearch');
    var resultsCount = document.getElementById('resultsCount');

    // Normalize URL param — treat 'all' or missing as empty string
    var rawCat = getParam('category') || '';
    var currentCategory = rawCat === 'all' ? '' : rawCat;
    var currentArtist = '';
    var currentSort = 'default';
    var currentSearch = '';

    // Populate artist dropdown
    if (artistFilter) {
      var artistList = KaysData.getArtistList();
      artistList.forEach(function (a) {
        var opt = document.createElement('option');
        opt.value = a.id;
        opt.textContent = a.name;
        artistFilter.appendChild(opt);
      });
    }

    // Set active pill state (matches URL param or defaults to "All")
    pills.forEach(function (p) {
      var catVal = p.dataset.category === 'all' ? '' : (p.dataset.category || '');
      p.classList.toggle('active', catVal === currentCategory);
    });

    function renderGallery() {
      var artworks = KaysData.artworks.slice();

      // Filter by category
      if (currentCategory) {
        artworks = artworks.filter(function (a) { return a.category === currentCategory; });
      }

      // Filter by artist
      if (currentArtist) {
        artworks = artworks.filter(function (a) { return a.artistId === currentArtist; });
      }

      // Filter by search
      if (currentSearch) {
        var q = currentSearch.toLowerCase();
        artworks = artworks.filter(function (a) {
          var ar = KaysData.getArtist(a.artistId);
          return a.title.toLowerCase().indexOf(q) !== -1 ||
                 (ar && ar.name.toLowerCase().indexOf(q) !== -1) ||
                 a.medium.toLowerCase().indexOf(q) !== -1;
        });
      }

      // Sort
      if (currentSort === 'newest') {
        artworks.sort(function (a, b) {
          return (parseInt(b.year) || 0) - (parseInt(a.year) || 0);
        });
      } else if (currentSort === 'artist') {
        artworks.sort(function (a, b) {
          var na = (KaysData.getArtist(a.artistId) || {}).name || '';
          var nb = (KaysData.getArtist(b.artistId) || {}).name || '';
          return na.localeCompare(nb);
        });
      } else if (currentSort === 'title') {
        artworks.sort(function (a, b) { return a.title.localeCompare(b.title); });
      }

      // Determine which are "recently added" (last 4 in original data array)
      var totalCount = KaysData.artworks.length;
      var recentIds = KaysData.artworks.slice(totalCount - 4).map(function (a) { return a.id; });

      galleryGrid.innerHTML = artworks.map(function (art) {
        return renderArtworkCard(art, recentIds.indexOf(art.id) !== -1);
      }).join('');

      if (resultsCount) {
        resultsCount.textContent = artworks.length + ' piece' + (artworks.length !== 1 ? 's' : '');
      }

      if (galleryEmpty) {
        galleryEmpty.style.display = artworks.length === 0 ? 'block' : 'none';
        galleryGrid.style.display = artworks.length === 0 ? 'none' : '';
      }
    }

    // Filter pill clicks
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        currentCategory = this.dataset.category === 'all' ? '' : (this.dataset.category || '');
        pills.forEach(function (p) { p.classList.toggle('active', p === pill); });
        renderGallery();
      });
    });

    if (gallerySearch) {
      gallerySearch.addEventListener('input', function () {
        currentSearch = this.value;
        renderGallery();
      });
    }

    if (artistFilter) {
      artistFilter.addEventListener('change', function () {
        currentArtist = this.value;
        renderGallery();
      });
    }

    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        currentSort = this.value;
        renderGallery();
      });
    }

    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', function (e) {
        e.preventDefault();
        currentCategory = '';
        currentArtist = '';
        currentSearch = '';
        currentSort = 'default';
        if (gallerySearch) gallerySearch.value = '';
        if (artistFilter) artistFilter.value = '';
        if (sortSelect) sortSelect.value = 'default';
        pills.forEach(function (p) {
          p.classList.toggle('active', p.dataset.category === 'all' || !p.dataset.category);
        });
        renderGallery();
      });
    }

    renderGallery();
  }

  /* ========================================
     PAGE: Artwork Detail
     ======================================== */
  var artworkDetail = document.getElementById('artworkDetail');
  if (artworkDetail) {
    var artId = getParam('id');
    var artwork = artId ? KaysData.getArtwork(artId) : null;

    if (artwork) {
      var artist = KaysData.getArtist(artwork.artistId);

      // Dynamic page title
      document.title = artwork.title + ' \u2014 Kay\'s Originals';

      // Dynamic meta description
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', artwork.title + (artist ? ' by ' + artist.name : '') + ' \u2014 view at Kay\'s Originals gallery.');
      }

      // Dynamic OG tags
      var ogTitle = document.querySelector('meta[property="og:title"]');
      var ogDesc = document.querySelector('meta[property="og:description"]');
      var ogImage = document.querySelector('meta[property="og:image"]');
      if (ogTitle) ogTitle.setAttribute('content', artwork.title + ' \u2014 Kay\'s Originals');
      if (ogDesc) ogDesc.setAttribute('content', artwork.title + (artist ? ' by ' + artist.name : ''));
      if (ogImage) ogImage.setAttribute('content', artwork.imageLg || artwork.image);

      // JSON-LD structured data
      var jsonLd = document.createElement('script');
      jsonLd.type = 'application/ld+json';
      jsonLd.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'VisualArtwork',
        name: artwork.title,
        creator: artist ? { '@type': 'Person', name: artist.name } : undefined,
        dateCreated: artwork.year,
        artMedium: artwork.medium,
        image: artwork.imageLg || artwork.image,
        description: artwork.description
      });
      document.head.appendChild(jsonLd);

      artworkDetail.innerHTML =
        '<div class="detail-layout">' +
          '<div class="detail-image-wrap">' +
            '<img src="' + resolveImageSrc(artwork.imageLg) + '" alt="' + artwork.title + '" class="detail-image artwork-detail-image">' +
          '</div>' +
          '<div class="detail-info">' +
            '<span class="media-tag tag-' + artwork.category + '">' + capitalize(artwork.category) + '</span>' +
            '<h1 class="detail-title">' + artwork.title + '</h1>' +
            '<p class="detail-artist-year">' + (artist ? artist.name : '') + ' &middot; ' + artwork.year + '</p>' +
            '<p class="detail-description">' + artwork.description + '</p>' +
            '<div class="detail-specs">' +
              '<p><strong>Medium:</strong> ' + artwork.medium + '</p>' +
              '<p><strong>Dimensions:</strong> ' + artwork.dimensions + '</p>' +
              '<p><strong>Year:</strong> ' + artwork.year + '</p>' +
            '</div>' +
            (artist ? '<a href="' + (window.PAGE_BASE || '') + 'artist.html?id=' + artist.id + '" class="btn btn-primary" style="margin-top:1.5rem;">View Artist Profile</a>' : '') +
          '</div>' +
        '</div>' +
        (artist ?
          '<div class="detail-about-artist">' +
            '<h3>About the Artist</h3>' +
            '<p>' + artist.shortBio + ' <a href="' + (window.PAGE_BASE || '') + 'artist.html?id=' + artist.id + '">View full profile &rarr;</a></p>' +
          '</div>' : '');

      // Update breadcrumb title
      var breadcrumbTitle = document.getElementById('breadcrumbTitle');
      if (breadcrumbTitle) breadcrumbTitle.textContent = artwork.title;

      // Lightbox
      var artImg = document.querySelector('.artwork-detail-image');
      if (artImg) {
        artImg.style.cursor = 'zoom-in';
        artImg.addEventListener('click', function () {
          var lightbox = document.createElement('div');
          lightbox.className = 'lightbox active';
          lightbox.innerHTML =
            '<button class="lightbox-close" aria-label="Close">&times;</button>' +
            '<img src="' + resolveImageSrc(artwork.imageLg || artwork.image) + '" alt="' + artwork.title + '">';
          document.body.appendChild(lightbox);
          document.body.style.overflow = 'hidden';

          function closeLightbox() {
            lightbox.remove();
            document.body.style.overflow = '';
          }

          lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
          lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
          });
          document.addEventListener('keydown', function onEsc(e) {
            if (e.key === 'Escape') {
              closeLightbox();
              document.removeEventListener('keydown', onEsc);
            }
          });
        });
      }

      // More by this artist
      var moreSection = document.getElementById('moreByArtist');
      var moreGrid = document.getElementById('moreByArtistGrid');
      var moreHeading = document.getElementById('moreByArtistHeading');
      if (moreSection && moreGrid && artist) {
        var otherWorks = KaysData.getArtworksByArtist(artwork.artistId)
          .filter(function (a) { return a.id !== artwork.id; });
        if (otherWorks.length > 0) {
          moreHeading.textContent = 'More by ' + artist.name;
          moreGrid.innerHTML = otherWorks.map(function (a) {
            return renderArtworkCard(a, false);
          }).join('');
          moreSection.style.display = '';
        }
      }

    } else {
      artworkDetail.innerHTML =
        '<div class="not-found">' +
          '<h2>Artwork Not Found</h2>' +
          '<p>The artwork you are looking for does not exist.</p>' +
          '<a href="' + (window.PAGE_BASE || '') + 'gallery.html" class="btn btn-primary">Back to Gallery</a>' +
        '</div>';
    }
  }

  /* ========================================
     PAGE: All Artists
     ======================================== */
  var allArtistsGrid = document.getElementById('allArtistsGrid');
  var artistSearch = document.getElementById('artistSearch');
  var artistResultsCount = document.getElementById('artistResultsCount');

  if (allArtistsGrid) {
    var artistsEmpty = document.getElementById('artistsEmpty');
    var clearArtistSearch = document.getElementById('clearArtistSearch');

    function renderArtists(query) {
      var q = query ? query.toLowerCase() : '';
      var filtered = [];
      for (var k = 0; k < KaysData.artists.length; k++) {
        var ar = KaysData.artists[k];
        if (!q || ar.name.toLowerCase().indexOf(q) !== -1 || ar.media.toLowerCase().indexOf(q) !== -1) {
          filtered.push(ar);
        }
      }

      var allHtml = '';
      for (var m = 0; m < filtered.length; m++) {
        allHtml += renderArtistCard(filtered[m]);
      }
      allArtistsGrid.innerHTML = allHtml;

      if (artistResultsCount) {
        artistResultsCount.textContent = filtered.length + ' artist' + (filtered.length !== 1 ? 's' : '');
      }

      if (artistsEmpty) {
        artistsEmpty.style.display = filtered.length === 0 ? 'block' : 'none';
        allArtistsGrid.style.display = filtered.length === 0 ? 'none' : '';
      }
    }

    if (artistSearch) {
      artistSearch.addEventListener('input', function () {
        renderArtists(this.value.trim());
      });
    }

    if (clearArtistSearch) {
      clearArtistSearch.addEventListener('click', function (e) {
        e.preventDefault();
        if (artistSearch) artistSearch.value = '';
        renderArtists('');
      });
    }

    renderArtists('');
  }

  /* ========================================
     PAGE: Artist Profile
     ======================================== */
  var artistDetail = document.getElementById('artistDetail');
  if (artistDetail) {
    var aId = getParam('id');
    var a = aId ? KaysData.getArtist(aId) : null;

    if (a) {
      // Dynamic page title
      document.title = a.name + ' \u2014 Kay\'s Originals';

      // Dynamic meta description
      var aMetaDesc = document.querySelector('meta[name="description"]');
      if (aMetaDesc) {
        aMetaDesc.setAttribute('content', a.name + ' \u2014 ' + a.media + ' artist at Kay\'s Originals gallery.');
      }

      // Dynamic OG tags
      var aOgTitle = document.querySelector('meta[property="og:title"]');
      var aOgDesc = document.querySelector('meta[property="og:description"]');
      var aOgImage = document.querySelector('meta[property="og:image"]');
      if (aOgTitle) aOgTitle.setAttribute('content', a.name + ' \u2014 Kay\'s Originals');
      if (aOgDesc) aOgDesc.setAttribute('content', a.shortBio);
      if (aOgImage) aOgImage.setAttribute('content', a.photo);

      // JSON-LD structured data
      var aJsonLd = document.createElement('script');
      aJsonLd.type = 'application/ld+json';
      aJsonLd.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: a.name,
        description: a.bio,
        image: a.photo,
        jobTitle: 'Artist'
      });
      document.head.appendChild(aJsonLd);

      var works = KaysData.getArtworksByArtist(a.id);
      var worksHtml = '';
      for (var w = 0; w < works.length; w++) {
        worksHtml += renderArtworkCard(works[w]);
      }

      artistDetail.innerHTML =
        '<div class="profile-header artist-hero-banner">' +
          '<img src="' + a.photo + '" alt="' + a.name + '" class="profile-photo">' +
          '<div class="profile-info">' +
            '<h1>' + a.name + '</h1>' +
            '<span class="artist-media">' + a.media + '</span>' +
            '<p class="profile-bio">' + a.bio + '</p>' +
          '</div>' +
        '</div>' +
        '<section class="profile-works">' +
          '<h2 class="section-heading" style="font-size:1.6rem;margin-bottom:1.5rem;">Works in Gallery</h2>' +
          '<div class="artwork-grid">' + worksHtml + '</div>' +
        '</section>';

      // Update breadcrumb title
      var aBreadcrumb = document.getElementById('breadcrumbTitle');
      if (aBreadcrumb) aBreadcrumb.textContent = a.name;
    } else {
      artistDetail.innerHTML =
        '<div class="not-found">' +
          '<h2>Artist Not Found</h2>' +
          '<p>The artist you are looking for does not exist.</p>' +
          '<a href="' + (window.PAGE_BASE || '') + 'artists.html" class="btn btn-primary">Back to Artists</a>' +
        '</div>';
    }
  }

  /* ========================================
     PAGE: FAQ Accordion
     ======================================== */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    var answer = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.closest('.faq-item').classList.toggle('open', !isOpen);
      if (answer) {
        if (isOpen) {
          answer.setAttribute('hidden', '');
        } else {
          answer.removeAttribute('hidden');
        }
      }
    });
  });

  /* ========================================
     PAGE: Contact Form
     ======================================== */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    var formSuccess = document.getElementById('formSuccess');

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      // Clear previous errors
      contactForm.querySelectorAll('.form-error-msg').forEach(function (el) { el.remove(); });
      contactForm.querySelectorAll('.form-group.has-error').forEach(function (el) { el.classList.remove('has-error'); });

      var valid = true;
      contactForm.querySelectorAll('[required]').forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          var group = field.closest('.form-group');
          if (group) {
            group.classList.add('has-error');
            var err = document.createElement('div');
            err.className = 'form-error-msg';
            err.textContent = 'This field is required.';
            group.appendChild(err);
          }
        }
      });

      if (valid) {
        contactForm.reset();
        if (formSuccess) formSuccess.style.display = 'block';
      }
    });
  }

  /* ========================================
     SHARED: Mobile Navigation
     ======================================== */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function toggleMenu() {
      var isOpen = navLinks.classList.contains('open');
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      backdrop.classList.toggle('active', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    }

    function closeMenu() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);

    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---- Close mobile menu on resize ---- */
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024 && navLinks) {
      navLinks.classList.remove('open');
      if (hamburger) {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
      var bd = document.querySelector('.nav-backdrop');
      if (bd) bd.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  /* ---- Scroll Reveal ---- */
  var reveals = document.querySelectorAll('.reveal');

  function checkReveal() {
    var windowHeight = window.innerHeight;
    reveals.forEach(function (el) {
      if (el.getBoundingClientRect().top < windowHeight - 80) {
        el.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', checkReveal, { passive: true });
  checkReveal();

  /* ---- Navbar shadow on scroll ---- */
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.15)' : 'none';
    }, { passive: true });
  }

})();
