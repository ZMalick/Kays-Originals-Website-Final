/* =============================================
   Kay's Originals — Main JavaScript
   ---------------------------------------------
   This file runs on every page. It does three kinds of work:

     1. Shared behavior that applies everywhere
        (mobile menu, dropdown, scroll reveal, navbar shadow).

     2. Page-specific rendering — each section below is wrapped in an
        `if (someElement) { ... }` check, so a block only runs on the
        page that actually contains its anchor element. For example,
        the gallery code only runs if a #galleryGrid element exists.

     3. Helpers used by multiple sections (renderArtworkCard,
        renderArtistCard, image path resolution, etc.).

   All data comes from the global `KaysData` object defined in
   js/data.js — this file never invents content.

   Whole file is wrapped in an IIFE so our variables don't pollute
   the global scope.
   ============================================= */

(function () {
  'use strict';  // Catches typos and unsafe patterns at runtime.

  /* ---- Helpers ---- */

  // Read a value from the URL query string, e.g. ?id=monet -> "monet".
  // Returns null if the parameter isn't present.
  function getParam(name) {
    var params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  // Uppercase the first letter of a string. Used for category labels
  // ("painting" -> "Painting") and similar small display tweaks.
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ---- Active Nav State ----
     Highlights the current page's link in the top nav. Each <body> has
     a `data-page="..."` attribute (e.g. data-page="gallery") and we map
     that name to the nav link's href. The matching link gets the
     `.active` class and `aria-current="page"` for accessibility.

     Special case: gallery sub-pages ("Paintings", "Sculptures", etc.)
     also need to highlight the matching dropdown child below the
     "Artwork" toggle. */
  (function () {
    var page = document.body.dataset.page;
    if (!page) return;
    // Page name -> nav link target. Multiple pages can map to the same
    // nav link (e.g. an "artwork" detail page still highlights "Artwork").
    var map = {
      gallery: 'gallery.html',
      artists: 'artists.html',
      artist: 'artists.html',
      artwork: 'gallery.html',
      consignment: 'consignment.html',
      about: 'about.html',
      contact: 'contact.html',
      faq: 'faq.html',
      exhibitions: 'exhibitions.html',
      exhibition: 'exhibitions.html'
    };
    var target = map[page];
    if (!target) return;
    // Check top-level nav links only (skip dropdown children so they don't all highlight on gallery.html)
    document.querySelectorAll('.nav-links > li > .nav-link').forEach(function (link) {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
      var href = link.getAttribute('href');
      if (href && href.indexOf(target) !== -1) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
    // Check dropdown toggle for gallery/artwork pages
    if (target === 'gallery.html') {
      var toggle = document.querySelector('.dropdown-toggle');
      if (toggle) {
        toggle.classList.add('active');
        toggle.setAttribute('aria-current', 'page');
      }

      // Highlight the matching dropdown child (Paintings / Sculptures / Sketches / All)
      var dropdownLinks = document.querySelectorAll('.dropdown .nav-link');
      dropdownLinks.forEach(function (link) { link.classList.remove('active'); });
      var catMatch = window.location.search.match(/category=([^&]+)/);
      var activeHrefFragment;
      if (catMatch) {
        activeHrefFragment = 'category=' + catMatch[1];
      } else if (page === 'gallery' || page === 'artwork') {
        activeHrefFragment = 'gallery.html';
      }
      if (activeHrefFragment) {
        dropdownLinks.forEach(function (link) {
          var href = link.getAttribute('href') || '';
          if (catMatch) {
            if (href.indexOf(activeHrefFragment) !== -1) link.classList.add('active');
          } else {
            // No category = "All Artwork" — match the link that has no ?category
            if (href.indexOf('category=') === -1 && href.indexOf('gallery.html') !== -1) {
              link.classList.add('active');
            }
          }
        });
      }
    }
  })();

  /* ---- Resolve local vs. external image paths ----
     Pages live in two places: index.html at the project root and
     everything else under pages/. To reach images/ correctly from
     either, each page sets `window.IMAGE_BASE` (either '' or '../').
     If the path is already a full URL (starts with "http"), we leave
     it alone. Otherwise we prepend the base. */
  function resolveImageSrc(src) {
    return src && src.startsWith('http') ? src : (window.IMAGE_BASE || '') + src;
  }

  /* ---- Category display label (singular, capitalized) ----
     Internal categories are stored as lowercase singulars
     ('painting', 'sculpture', 'sketch'). This converts them to the
     capitalized form we want to show on the cards and tags. */
  function categoryLabel(cat) {
    var map = { painting: 'Painting', sculpture: 'Sculpture', sketch: 'Sketch' };
    return map[cat] || capitalize(cat);
  }

  /* ---- Render an artwork card (reused everywhere) ----
     Returns an HTML string for one artwork tile. Used by the gallery,
     artist profile ("More by..."), exhibition detail, and homepage
     featured strip — anywhere we list multiple artworks.
     `isRecent` is an optional flag that adds a "Recently Added" badge. */
  function renderArtworkCard(art, isRecent) {
    // Look up the artist so we can show their name on the card.
    var artist = KaysData.getArtist(art.artistId);
    // Page links also need a base prefix (see PAGE_BASE comment above).
    var base = window.PAGE_BASE || '';

    // Build any badges that apply (Featured, Recently Added).
    var badges = '';
    if (art.featured) badges += '<span class="badge-featured">Featured</span> ';
    if (isRecent) badges += '<span class="badge-new">Recently Added</span>';

    // Pricing label: contemporary pieces show a price, permanent
    // collection pieces show a "Permanent Collection" label, and
    // anything else shows nothing. Prices use toLocaleString for commas.
    var priceHtml = '';
    if (!art.inPermanentCollection && art.price != null) {
      priceHtml = '<span class="card-price">$' + art.price.toLocaleString('en-US') + '</span>';
    } else if (art.inPermanentCollection) {
      priceHtml = '<span class="card-permanent">Permanent Collection</span>';
    }

    // The card markup. The whole card is a single anchor to the
    // artwork's detail page; the overlay shows on hover.
    return '<article class="artwork-card" data-artwork-id="' + art.id + '">' +
      '<a href="' + base + 'artwork.html?id=' + art.id + '" class="card-link">' +
        '<div class="card-image">' +
          '<img src="' + resolveImageSrc(art.image) + '" alt="' + art.title + '" loading="lazy">' +
          '<span class="card-category-tag cat-' + art.category + '">' + categoryLabel(art.category) + '</span>' +
          '<div class="card-overlay"><div class="overlay-content">' +
            '<span class="overlay-title">' + art.title + '</span>' +
            '<span class="overlay-artist">' + (artist ? artist.name : '') + '</span>' +
          '</div></div>' +
        '</div>' +
        '<div class="card-info">' +
          (badges ? badges + ' ' : '') +
          '<div class="card-info-row">' +
            '<h3 class="card-title">' + art.title + '</h3>' +
            '<span class="card-artist">' + (artist ? artist.name : '') + '</span>' +
          '</div>' +
          (art.dimensions ? '<div class="card-dimensions">(' + art.dimensions + ')</div>' : '') +
          priceHtml +
        '</div>' +
      '</a>' +
    '</article>';
  }

  /* ---- Render an artist's avatar ----
     If the artist has a `photo`, we use that. Historical figures
     (Picasso, Monet, etc.) don't have photos in our data, so we fall
     back to a two-letter monogram (initials of first + last name).
     The CSS picks accent colors based on the data-monogram-id. */
  function renderArtistAvatar(artist, photoClass) {
    if (artist.photo) {
      return '<img src="' + artist.photo + '" alt="' + artist.name + '" class="' + photoClass + '" loading="lazy">';
    }
    // Build initials from the first and last word of the artist's name.
    var parts = artist.name.split(' ');
    var first = (parts[0][0] || '').toUpperCase();
    var last = (parts[parts.length - 1][0] || '').toUpperCase();
    return '<div class="' + photoClass + ' artist-monogram" data-monogram-id="' + artist.id + '" aria-label="' + artist.name + '">' +
      '<span class="mono-1">' + first + '</span><span class="mono-2">' + last + '</span>' +
    '</div>';
  }

  /* ---- Render an artist card (reused everywhere) ----
     Returns the HTML for one artist tile. Used on the artists listing
     page and in the "Featured Artists" section of exhibition pages. */
  function renderArtistCard(artist) {
    var firstName = artist.name.split(' ')[0];
    return '<div class="artist-card">' +
      '<a href="' + (window.PAGE_BASE || '') + 'artist.html?id=' + artist.id + '" class="artist-card-link" title="View more about ' + artist.name + '">' +
        '<div class="artist-photo-wrap">' +
          renderArtistAvatar(artist, 'artist-photo') +
        '</div>' +
        '<div class="artist-info">' +
          '<h3>' + artist.name + '</h3>' +
          '<span class="artist-media">' + artist.media + '</span>' +
          '<p>' + artist.shortBio + '</p>' +
          '<span class="artist-link">View ' + firstName + '\'s profile &rarr;</span>' +
        '</div>' +
      '</a>' +
    '</div>';
  }

  /* ========================================
     PAGE: Homepage
     ----------------------------------------
     Two homepage widgets:
       1. The big "Featured Artwork" hero card (right side of the welcome).
       2. The 3-up "Featured Artwork" strip lower on the page.
     Both only run if their anchor element exists, so this code is
     a no-op on every other page.
     ======================================== */

  /* Note: All data here comes from the trusted KaysData module (js/data.js),
     not from user input. innerHTML usage is safe in this context. */

  // ---- Homepage hero: single featured artwork card ----
  var homeFeatured = document.getElementById('homeFeaturedArtwork');
  if (homeFeatured) {
    var feat = KaysData.getFeaturedArtwork();
    if (feat) {
      var featArtist = KaysData.getArtist(feat.artistId);
      var base = window.PAGE_BASE || '';
      var featUrl = base + 'artwork.html?id=' + feat.id;
      homeFeatured.innerHTML =
        '<div class="home-featured-card">' +
          '<span class="badge-featured">Featured</span>' +
          '<a href="' + featUrl + '" class="home-featured-link">' +
            '<img src="' + resolveImageSrc(feat.imageLg || feat.image) + '" alt="' + feat.title + '" class="home-featured-img">' +
          '</a>' +
          '<div class="home-featured-info">' +
            '<h2 class="home-featured-title"><a href="' + featUrl + '">' + feat.title + '</a></h2>' +
            '<p class="home-featured-artist">' + (featArtist ? featArtist.name : '') + ' &middot; ' + feat.year + '</p>' +
            '<p class="home-featured-desc">' + feat.description + '</p>' +
          '</div>' +
        '</div>';
    }
  }

  // ---- Homepage 3-up "Featured Artwork" strip ----
  // Sort the catalog so featured pieces float to the top, then take the
  // first three. This guarantees the featured piece is always shown
  // even if the rest of the strip is filled in with non-featured items.
  var homeFeaturedGrid = document.getElementById('homeFeaturedGrid');
  if (homeFeaturedGrid) {
    var pool = KaysData.artworks.slice();
    pool.sort(function(a, b) { return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); });
    var picks = pool.slice(0, 3);
    var stripHtml = '';
    for (var s = 0; s < picks.length; s++) {
      stripHtml += renderArtworkCard(picks[s], false);
    }
    homeFeaturedGrid.innerHTML = stripHtml;
  }

  /* ========================================
     PAGE: Gallery
     ----------------------------------------
     The main browse-and-filter page. This block:
       - populates the Artist + Decade dropdowns from data.js
       - reads ?category= and ?artistId= URL params on load
       - re-renders the grid whenever a filter changes
       - opens an artwork modal when a card is clicked
     The whole block only runs if #galleryGrid exists on the page.
     ======================================== */
  /* Note: All innerHTML below uses trusted KaysData module data, not user input. */
  var galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    // Cache references to the surrounding UI elements once.
    // Some are optional (the empty-state element), so we check before using them.
    var galleryEmpty = document.getElementById('galleryEmpty');
    var pills = document.querySelectorAll('.filter-pill');
    var resultsCount = document.getElementById('resultsCount');
    var galleryArtistFilter = document.getElementById('galleryArtistFilter');
    var galleryDecadeFilter = document.getElementById('galleryDecadeFilter');

    // Populate artist filter
    if (galleryArtistFilter) {
      var artistList = KaysData.getArtistList();
      for (var ai = 0; ai < artistList.length; ai++) {
        var aOpt = document.createElement('option');
        aOpt.value = artistList[ai].id;
        aOpt.textContent = artistList[ai].name;
        galleryArtistFilter.appendChild(aOpt);
      }
    }

    // Populate decade filter
    if (galleryDecadeFilter) {
      var decades = KaysData.getDecades();
      for (var di = 0; di < decades.length; di++) {
        var dOpt = document.createElement('option');
        dOpt.value = decades[di];
        dOpt.textContent = decades[di];
        galleryDecadeFilter.appendChild(dOpt);
      }
    }

    // Read category from URL param (from nav dropdown). No param = show All.
    var rawCat = getParam('category') || '';
    var showAll = !rawCat || rawCat === 'all';
    var currentCategory = showAll ? '' : rawCat;

    // Read artistId URL param — preselect artist filter if present
    var rawArtistId = getParam('artistId') || '';
    if (rawArtistId && galleryArtistFilter) {
      galleryArtistFilter.value = rawArtistId;
    }

    // Set the matching pill active (All pill has empty data-category)
    pills.forEach(function (p) {
      p.classList.toggle('active', (p.dataset.category || '') === currentCategory);
    });

    // If artistId param, clear category filter to show all of that artist's work
    if (rawArtistId) {
      currentCategory = '';
      pills.forEach(function (p) { p.classList.remove('active'); });
    }

    // Apply all active filters and rebuild the gallery grid.
    // Called once on load and again every time a filter changes.
    function renderGallery() {
      // Start from a copy of the full catalog (don't mutate the original).
      var artworks = KaysData.artworks.slice();
      var filterArtistId = galleryArtistFilter ? galleryArtistFilter.value : '';
      var filterDecade = galleryDecadeFilter ? galleryDecadeFilter.value : '';

      // Narrow down by category pill (Painting / Sculpture / Sketch).
      if (currentCategory) {
        artworks = artworks.filter(function (a) { return a.category === currentCategory; });
      }

      // Narrow down by selected artist.
      if (filterArtistId) {
        artworks = artworks.filter(function (a) { return a.artistId === filterArtistId; });
      }

      // Narrow down by selected decade.
      if (filterDecade) {
        artworks = artworks.filter(function (a) {
          return a.decade === filterDecade;
        });
      }

      // Always present results in alphabetical order by artist last name.
      artworks = KaysData.sortArtworksByArtistLastName(artworks);

      // Render every remaining artwork as a card. .map().join('') is a
      // common pattern: turn an array of items into a single HTML string.
      galleryGrid.innerHTML = artworks.map(function (art) {
        return renderArtworkCard(art, false);
      }).join('');

      // Update the small "X pieces" counter above the grid.
      if (resultsCount) {
        resultsCount.textContent = artworks.length + ' piece' + (artworks.length !== 1 ? 's' : '');
      }

      // If filters returned nothing, hide the grid and show the empty state.
      if (galleryEmpty) {
        galleryEmpty.style.display = artworks.length === 0 ? 'block' : 'none';
        galleryGrid.style.display = artworks.length === 0 ? 'none' : '';
      }
    }

    // Filter pill clicks: clicking a category pill (All / Paintings /
    // Sculptures / Sketches) updates currentCategory, marks just that
    // pill active, and re-renders.
    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        currentCategory = this.dataset.category || '';
        pills.forEach(function (p) { p.classList.toggle('active', p === pill); });
        renderGallery();
      });
    });

    if (galleryArtistFilter) {
      galleryArtistFilter.addEventListener('change', renderGallery);
    }
    if (galleryDecadeFilter) {
      galleryDecadeFilter.addEventListener('change', renderGallery);
    }

    // "Clear filters" link resets every filter back to its default state.
    var clearFiltersLink = document.getElementById('clearFilters');
    if (clearFiltersLink) {
      clearFiltersLink.addEventListener('click', function (e) {
        e.preventDefault();
        currentCategory = '';
        pills.forEach(function (p) { p.classList.toggle('active', (p.dataset.category || '') === ''); });
        if (galleryArtistFilter) { galleryArtistFilter.value = ''; }
        if (galleryDecadeFilter) { galleryDecadeFilter.value = ''; }
        renderGallery();
      });
    }

    // Initial render with whatever URL params said.
    renderGallery();

    /* ---- Artwork Modal ----
       Optional quick-look modal that opens when a card is clicked,
       preventing the link's default navigation. The modal is just
       hidden HTML on the page that we populate and reveal on demand. */
    var artworkModal = document.getElementById('artworkModal');
    var modalClose = document.getElementById('modalClose');

    if (artworkModal) {
      // Event delegation: one listener on the grid handles all card
      // clicks (rather than wiring one per card).
      galleryGrid.addEventListener('click', function (e) {
        var card = e.target.closest('.artwork-card');
        if (!card) return;
        e.preventDefault();
        var link = card.querySelector('.card-link');
        if (!link) return;
        var href = link.getAttribute('href');
        var idMatch = href.match(/id=([^&]+)/);
        if (!idMatch) return;
        openArtworkModal(idMatch[1]);
      });

      // Populate the modal's pre-existing fields with the chosen artwork
      // and reveal it. Locks page scroll while the modal is open.
      function openArtworkModal(id) {
        var art = KaysData.getArtwork(id);
        if (!art) return;
        var artist = KaysData.getArtist(art.artistId);
        var base = window.PAGE_BASE || '';

        document.getElementById('modalImage').src = resolveImageSrc(art.imageLg || art.image);
        document.getElementById('modalImage').alt = art.title;
        document.getElementById('modalTitle').textContent = art.title;
        document.getElementById('modalArtist').textContent = artist ? artist.name : '';
        document.getElementById('modalYear').textContent = art.year;
        document.getElementById('modalDesc').textContent = art.description;
        document.getElementById('modalSpecs').innerHTML =
          '<p><strong>Medium:</strong> ' + art.medium + '</p>' +
          '<p><strong>Dimensions:</strong> ' + art.dimensions + '</p>';

        var tag = document.getElementById('modalMediaTag');
        tag.textContent = capitalize(art.category);
        tag.className = 'media-tag tag-' + art.category;

        document.getElementById('modalDetailLink').href = base + 'artwork.html?id=' + art.id;

        var artistLink = document.getElementById('modalArtistLink');
        if (artist && artistLink) {
          artistLink.href = base + 'artist.html?id=' + artist.id;
          artistLink.style.display = '';
        } else if (artistLink) {
          artistLink.style.display = 'none';
        }

        artworkModal.removeAttribute('hidden');
        document.body.style.overflow = 'hidden';
      }

      // Hide the modal and restore page scrolling.
      function closeArtworkModal() {
        artworkModal.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }

      // Three ways to close the modal: X button, backdrop click, Escape key.
      if (modalClose) modalClose.addEventListener('click', closeArtworkModal);
      artworkModal.querySelector('.modal-backdrop').addEventListener('click', closeArtworkModal);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !artworkModal.hasAttribute('hidden')) closeArtworkModal();
      });
    }
  }

  /* ========================================
     PAGE: Artwork Detail
     ----------------------------------------
     Reads ?id=<slug> from the URL, looks up the artwork, and renders
     the entire detail page (image, info, "About the Artist", visit
     info, and exhibition cross-links). Also writes SEO metadata
     (title, description, Open Graph tags, JSON-LD) so the page
     previews well when shared.
     If the id is missing or invalid, shows a "Not Found" message.
     ======================================== */
  var artworkDetail = document.getElementById('artworkDetail');
  if (artworkDetail) {
    var artId = getParam('id');
    var artwork = artId ? KaysData.getArtwork(artId) : null;

    if (artwork) {
      var artist = KaysData.getArtist(artwork.artistId);

      // ---- SEO metadata ----
      // Set the browser tab title to match the artwork.
      document.title = artwork.title + ' \u2014 Kay\'s Originals';

      // Update the <meta name="description"> tag for search engines.
      var metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', artwork.title + (artist ? ' by ' + artist.name : '') + ' \u2014 view at Kay\'s Originals gallery.');
      }

      // Open Graph tags control how the page previews on Facebook,
      // iMessage, Slack, etc. when someone shares the link.
      var ogTitle = document.querySelector('meta[property="og:title"]');
      var ogDesc = document.querySelector('meta[property="og:description"]');
      var ogImage = document.querySelector('meta[property="og:image"]');
      if (ogTitle) ogTitle.setAttribute('content', artwork.title + ' \u2014 Kay\'s Originals');
      if (ogDesc) ogDesc.setAttribute('content', artwork.title + (artist ? ' by ' + artist.name : ''));
      if (ogImage) ogImage.setAttribute('content', artwork.imageLg || artwork.image);

      // JSON-LD structured data is a small JSON blob Google reads to
      // understand what the page is. Used to enrich search results.
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

      // Show a "Featured" badge in the corner if this piece is featured.
      var featuredBadge = artwork.featured ? '<span class="badge-featured">Featured</span> ' : '';

      // ---- Cross-links to exhibitions that include this artwork ----
      // If this piece appears in any exhibition, build a small list of
      // links so visitors can jump to the show's detail page.
      var exhibitionLinks = '';
      var artExhibitions = KaysData.getExhibitionsByArtwork(artwork.id);
      if (artExhibitions.length > 0) {
        exhibitionLinks = '<div class="detail-exhibitions"><h3>Featured in Exhibitions</h3><ul>';
        for (var ei = 0; ei < artExhibitions.length; ei++) {
          exhibitionLinks += '<li><a href="' + (window.PAGE_BASE || '') + 'exhibition.html?id=' + artExhibitions[ei].id + '">' + artExhibitions[ei].title + '</a></li>';
        }
        exhibitionLinks += '</ul></div>';
      }

      // Same pricing rule as the cards (see renderArtworkCard above):
      // contemporary pieces show a price, permanent pieces show a label.
      var detailPriceHtml = '';
      if (!artwork.inPermanentCollection && artwork.price != null) {
        detailPriceHtml = '<p class="artwork-price">$' + artwork.price.toLocaleString('en-US') + '</p>';
      } else if (artwork.inPermanentCollection) {
        detailPriceHtml = '<p class="artwork-permanent">Permanent Collection &mdash; not for sale</p>';
      }

      // Render the entire detail layout into the page in one shot.
      artworkDetail.innerHTML =
        '<div class="detail-layout">' +
          '<div class="detail-image-wrap">' +
            '<img src="' + resolveImageSrc(artwork.imageLg) + '" alt="' + artwork.title + '" class="detail-image artwork-detail-image">' +
          '</div>' +
          '<div class="detail-info">' +
            featuredBadge +
            '<span class="media-tag tag-' + artwork.category + '">' + capitalize(artwork.category) + '</span>' +
            '<h1 class="detail-title">' + artwork.title + '</h1>' +
            '<p class="detail-artist-year">' + (artist ? artist.name : '') + ' &middot; ' + artwork.year + '</p>' +
            detailPriceHtml +
            '<p class="detail-description">' + artwork.description + '</p>' +
            '<div class="detail-specs">' +
              '<p><strong>Medium:</strong> ' + artwork.medium + '</p>' +
              '<p><strong>Dimensions:</strong> ' + artwork.dimensions + '</p>' +
              '<p><strong>Year:</strong> ' + artwork.year + '</p>' +
            '</div>' +
            (artist ? '<a href="' + (window.PAGE_BASE || '') + 'artist.html?id=' + artist.id + '" class="btn btn-primary">View ' + artist.name + '\'s Profile</a>' : '') +
          '</div>' +
        '</div>' +
        (artist ?
          '<div class="detail-about-artist">' +
            '<h3>About the Artist</h3>' +
            '<p>' + artist.shortBio + ' <a href="' + (window.PAGE_BASE || '') + 'artist.html?id=' + artist.id + '">View full profile &rarr;</a></p>' +
          '</div>' : '') +
        '<div class="detail-visit">' +
          '<h3>See This Piece in Person</h3>' +
          '<p class="detail-visit-lede">' + (artwork.inPermanentCollection ? 'On display at the gallery as part of the Permanent Collection.' : 'Currently on view at the gallery.') + '</p>' +
          '<dl class="detail-visit-meta">' +
            '<dt>Hours</dt><dd>Tue&ndash;Sat 11am&ndash;6pm &middot; Sun 12pm&ndash;5pm</dd>' +
            '<dt>Address</dt><dd><a href="https://maps.google.com/?q=1234+Gallery+Lane+Suite+100+Austin+TX+78701" target="_blank" rel="noopener">1234 Gallery Lane, Suite 100 &middot; Austin, TX 78701</a></dd>' +
          '</dl>' +
          '<a href="' + (window.PAGE_BASE || '') + 'contact.html" class="btn btn-secondary">Plan a Visit</a>' +
        '</div>' +
        exhibitionLinks;

      // Replace the placeholder breadcrumb text with the actual title.
      var breadcrumbTitle = document.getElementById('breadcrumbTitle');
      if (breadcrumbTitle) breadcrumbTitle.textContent = artwork.title;

      // ---- Lightbox: click the artwork image to view it full-screen ----
      // Builds a fresh overlay each time so closing it cleanly removes
      // every listener it added.
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

      // ---- "More by this artist" section ----
      // Pull every artwork by the same artist except the current one,
      // and render them as cards. Hidden if the artist has no other work.
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
      // Bad or missing ?id=... — show a friendly fallback rather than a blank page.
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
     ----------------------------------------
     The artists.html listing page. Renders one card per artist with
     an optional media filter (Painting / Sculpture / Sketching).
     The filter compares the pill's `data-media` value against the
     artist's `media` field as a substring (case-insensitive), so an
     artist whose media is "Painting & Sculpture" matches both pills.
     ======================================== */
  var allArtistsGrid = document.getElementById('allArtistsGrid');
  if (allArtistsGrid) {
    var artistsEmpty = document.getElementById('artistsEmpty');
    var artistResultsCount = document.getElementById('artistResultsCount');
    var artistMediaPillActive = 'all';
    var artistMediaPills = document.querySelectorAll('[data-media]');

    // Apply the active media pill and rebuild the artist grid.
    function renderArtists() {
      // 'all' means no filter — empty string disables the substring check below.
      var pillMedia = artistMediaPillActive !== 'all' ? artistMediaPillActive : '';
      var filtered = [];

      // Loop manually (rather than .filter) to keep this readable.
      for (var k = 0; k < KaysData.artists.length; k++) {
        var ar = KaysData.artists[k];
        // Substring match: 'painting' matches "Painting & Sculpture".
        if (pillMedia && ar.media.toLowerCase().indexOf(pillMedia) === -1) continue;
        filtered.push(ar);
      }

      // Always alphabetize by full name.
      filtered.sort(function (a, b) { return a.name.localeCompare(b.name); });

      allArtistsGrid.innerHTML = filtered.map(function (artist) {
        return renderArtistCard(artist);
      }).join('');

      if (artistResultsCount) {
        artistResultsCount.textContent = filtered.length + ' artist' + (filtered.length !== 1 ? 's' : '');
      }

      if (artistsEmpty) {
        artistsEmpty.style.display = filtered.length === 0 ? 'block' : 'none';
        allArtistsGrid.style.display = filtered.length === 0 ? 'none' : '';
      }
    }

    artistMediaPills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        artistMediaPillActive = this.dataset.media || 'all';
        artistMediaPills.forEach(function (p) { p.classList.toggle('active', p === pill); });
        renderArtists();
      });
    });

    renderArtists();
  }

  /* ========================================
     PAGE: Artist Profile
     ----------------------------------------
     Reads ?id=<slug> from the URL, looks up the artist, and renders
     their hero banner, full bio, every piece they have in the gallery,
     and any exhibitions they're part of. Also writes SEO + JSON-LD
     metadata so an artist's page previews well when shared.
     If the id is missing or invalid, shows a "Not Found" message.
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
      if (aOgImage && a.photo) aOgImage.setAttribute('content', a.photo);

      // JSON-LD structured data
      var aJsonLd = document.createElement('script');
      aJsonLd.type = 'application/ld+json';
      var jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: a.name,
        description: a.bio,
        jobTitle: 'Artist'
      };
      if (a.photo) jsonLdData.image = a.photo;
      aJsonLd.textContent = JSON.stringify(jsonLdData);
      document.head.appendChild(aJsonLd);

      // Build a card for every artwork by this artist (in catalog order).
      var works = KaysData.getArtworksByArtist(a.id);
      var worksHtml = '';
      for (var w = 0; w < works.length; w++) {
        worksHtml += renderArtworkCard(works[w]);
      }

      // ---- Exhibition cross-links for this artist ----
      // If the artist appears in any exhibition, build a small list of
      // links to those shows. Skipped entirely if the list is empty.
      var artistExhibitions = KaysData.getExhibitionsByArtist(a.id);
      var artistExhibHtml = '';
      if (artistExhibitions.length > 0) {
        artistExhibHtml = '<section class="detail-exhibitions" style="margin-top:2.5rem;"><h2 class="section-heading" style="font-size:1.6rem;margin-bottom:1rem;">Exhibitions</h2><ul>';
        for (var ae = 0; ae < artistExhibitions.length; ae++) {
          artistExhibHtml += '<li><a href="' + (window.PAGE_BASE || '') + 'exhibition.html?id=' + artistExhibitions[ae].id + '">' + artistExhibitions[ae].title + '</a></li>';
        }
        artistExhibHtml += '</ul></section>';
      }

      artistDetail.innerHTML =
        '<div class="profile-header artist-hero-banner">' +
          renderArtistAvatar(a, 'profile-photo') +
          '<div class="profile-info">' +
            '<h1>' + a.name + '</h1>' +
            '<span class="artist-media">' + a.media + '</span>' +
            '<p class="profile-bio">' + a.bio + '</p>' +
            '<a href="' + (window.PAGE_BASE || '') + 'gallery.html?artistId=' + a.id + '" class="btn btn-primary" style="margin-top:1rem;display:inline-block;">See ' + a.name + '\'s Artwork</a>' +
          '</div>' +
        '</div>' +
        '<section class="profile-works">' +
          '<h2 class="section-heading" style="font-size:1.6rem;margin-bottom:1.5rem;">Works in Gallery</h2>' +
          '<div class="artwork-grid">' + worksHtml + '</div>' +
        '</section>' +
        artistExhibHtml;

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
     PAGE: Exhibitions Listing
     ----------------------------------------
     The exhibitions.html index page. Renders one card per exhibition
     with the show's date range, description, and a thumbnail (the
     first artwork in the show). Each card links to the detail page.
     ======================================== */
  var exhibitionsList = document.getElementById('exhibitionsList');
  if (exhibitionsList) {
    var exhbs = KaysData.getExhibitions();
    var exhibitionsEmpty = document.getElementById('exhibitionsEmpty');

    if (exhbs.length > 0) {
      var exHtml = '';
      for (var xi = 0; xi < exhbs.length; xi++) {
        var ex = exhbs[xi];
        var base = window.PAGE_BASE || '';
        // Format dates
        var dateRange = formatExhibitionDate(ex.startDate) + ' \u2013 ' + formatExhibitionDate(ex.endDate);
        // Get first artwork as cover thumbnail
        var thumbsHtml = '';
        var coverArt = KaysData.getArtwork(ex.artworkIds[0]);
        if (coverArt) {
          thumbsHtml = '<img src="' + resolveImageSrc(coverArt.image) + '" alt="' + coverArt.title + '" class="exhibition-thumb" loading="lazy">';
        }
        exHtml += '<article class="exhibition-card">' +
          '<a href="' + base + 'exhibition.html?id=' + ex.id + '" class="exhibition-card-link">' +
            '<div class="exhibition-thumbs">' + thumbsHtml + '</div>' +
            '<div class="exhibition-card-info">' +
              '<h2 class="exhibition-card-title">' + ex.title + '</h2>' +
              '<p class="exhibition-card-dates">' + dateRange + '</p>' +
              '<p class="exhibition-card-desc">' + ex.description + '</p>' +
              '<span class="exhibition-card-cta">View Exhibition</span>' +
            '</div>' +
          '</a>' +
        '</article>';
      }
      exhibitionsList.innerHTML = exHtml;
    } else if (exhibitionsEmpty) {
      exhibitionsEmpty.style.display = 'block';
    }
  }

  /* ========================================
     PAGE: Exhibition Detail
     ----------------------------------------
     Reads ?id=<slug>, renders the exhibition's title, date range,
     description, disclaimer, then two grids: artwork in the show
     and artists in the show. Falls back to a "Not Found" message
     if the id is missing or invalid.
     ======================================== */
  var exhibitionDetail = document.getElementById('exhibitionDetail');
  if (exhibitionDetail) {
    var exId = getParam('id');
    var exhibition = exId ? KaysData.getExhibition(exId) : null;

    if (exhibition) {
      var dateRange = formatExhibitionDate(exhibition.startDate) + ' \u2013 ' + formatExhibitionDate(exhibition.endDate);

      document.title = exhibition.title + ' \u2014 Kay\'s Originals';

      var breadcrumbTitle = document.getElementById('breadcrumbTitle');
      if (breadcrumbTitle) breadcrumbTitle.textContent = exhibition.title;

      exhibitionDetail.innerHTML =
        '<h1>' + exhibition.title + '</h1>' +
        '<p class="exhibition-dates">' + dateRange + '</p>' +
        '<p class="exhibition-description">' + exhibition.description + '</p>' +
        '<p class="exhibition-disclaimer">' + exhibition.disclaimer + '</p>';

      // Render artwork grid
      var artSection = document.getElementById('exhibitionArtwork');
      var artGrid = document.getElementById('exhibitionArtGrid');
      if (artSection && artGrid && exhibition.artworkIds.length > 0) {
        var artHtml = '';
        for (var ai = 0; ai < exhibition.artworkIds.length; ai++) {
          var artwork = KaysData.getArtwork(exhibition.artworkIds[ai]);
          if (artwork) artHtml += renderArtworkCard(artwork, false);
        }
        artGrid.innerHTML = artHtml;
        artSection.style.display = '';
      }

      // Render artist grid
      var artistSection = document.getElementById('exhibitionArtists');
      var artistGrid = document.getElementById('exhibitionArtistGrid');
      if (artistSection && artistGrid && exhibition.artistIds.length > 0) {
        var arHtml = '';
        for (var ari = 0; ari < exhibition.artistIds.length; ari++) {
          var artist = KaysData.getArtist(exhibition.artistIds[ari]);
          if (artist) arHtml += renderArtistCard(artist);
        }
        artistGrid.innerHTML = arHtml;
        artistSection.style.display = '';
      }
    } else {
      exhibitionDetail.innerHTML =
        '<div class="not-found">' +
          '<h2>Exhibition Not Found</h2>' +
          '<p>The exhibition you are looking for does not exist.</p>' +
          '<a href="' + (window.PAGE_BASE || '') + 'exhibitions.html" class="btn btn-primary">Back to Exhibitions</a>' +
        '</div>';
    }
  }

  /* ---- Date formatting helper ----
     Turns an ISO date string like "2026-04-06" into a friendly label
     like "Monday, April 6th".
     - We append T12:00:00 (noon) when parsing so timezone shifts can't
       bump the date to the day before/after.
     - The suffix logic picks st/nd/rd/th based on the day of the month. */
  function formatExhibitionDate(isoDate) {
    var d = new Date(isoDate + 'T12:00:00');
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var day = d.getDate();
    var suffix = (day === 1 || day === 21 || day === 31) ? 'st' :
                 (day === 2 || day === 22) ? 'nd' :
                 (day === 3 || day === 23) ? 'rd' : 'th';
    return days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + day + suffix;
  }

  /* ========================================
     PAGE: FAQ Accordion
     ----------------------------------------
     Click a question to expand/collapse its answer. We also flip the
     `aria-expanded` attribute and `hidden` attribute so screen readers
     announce the state correctly. Selector is harmless on pages
     that don't have any .faq-question elements.
     ======================================== */
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    // Each question's `aria-controls` value matches the answer's id.
    var answer = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));
      btn.closest('.faq-item').classList.toggle('open', !isOpen);
      if (answer) {
        // Setting/removing `hidden` toggles visibility AND screen-reader access.
        if (isOpen) {
          answer.setAttribute('hidden', '');
        } else {
          answer.removeAttribute('hidden');
        }
      }
    });
  });

  /* ========================================
     PAGE: Contact Form (EmailJS)
     ----------------------------------------
     EmailJS is a free service that lets a static site send emails
     without our own server. We have two templates: one for general
     customer inquiries, one for artists asking about consignment.
     The wireContactForm() helper below attaches the same submit
     behavior (validate, show "Sending...", success/error feedback)
     to either form using a per-form payload builder.
     ======================================== */
  // EmailJS credentials — public key lives in pages/contact.html (safe to expose, rate-limited per template)
  var EMAILJS_SERVICE_ID = 'service_9rwsrlf';
  var EMAILJS_CUSTOMER_TEMPLATE_ID = 'template_wxlyeed';
  var EMAILJS_ARTIST_TEMPLATE_ID = 'template_f02f8jb';

  // Wire one form (by id) up to send via EmailJS using `templateId`.
  // `buildPayload(form)` returns an object whose keys match the
  // {{placeholders}} in the corresponding EmailJS email template.
  function wireContactForm(formId, templateId, buildPayload) {
    var form = document.getElementById(formId);
    if (!form) return;

    var successEl = form.querySelector('.form-success');
    var errorEl = form.querySelector('.form-error');
    var submitBtn = form.querySelector('button[type="submit"]');
    var originalBtnText = submitBtn ? submitBtn.textContent : '';

    form.addEventListener('submit', function (e) {
      // Stop the browser's default page-reload behavior.
      e.preventDefault();

      // If the EmailJS script failed to load, show an error and bail out.
      if (typeof emailjs === 'undefined') {
        if (errorEl) errorEl.style.display = 'block';
        return;
      }

      // Hide any leftover success/error messages and put the button into a "sending" state.
      if (successEl) successEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Actually send the email. Returns a Promise.
      emailjs.send(EMAILJS_SERVICE_ID, templateId, buildPayload(form))
        .then(function () {
          // Sent: reset the form and show the success banner.
          form.reset();
          if (successEl) successEl.style.display = 'block';
        })
        .catch(function (err) {
          // Network/template error: log to the console for the developer
          // and show a generic error to the user.
          if (window.console) console.error('EmailJS send failed:', err);
          if (errorEl) errorEl.style.display = 'block';
        })
        .then(function () {
          // Always re-enable the button, regardless of success or failure.
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
          }
        });
    });
  }

  // Customer form payload — keys map to placeholders in the EmailJS template.
  wireContactForm('contactFormCustomer', EMAILJS_CUSTOMER_TEMPLATE_ID, function (form) {
    // Pull the human-readable text of the selected <option>, not its value.
    var subject = form.querySelector('#customerSubject');
    var subjectText = subject && subject.options[subject.selectedIndex] ? subject.options[subject.selectedIndex].text : '';
    return {
      from_name: form.querySelector('#customerName').value,
      from_email: form.querySelector('#customerEmail').value,
      subject_line: subjectText,
      extra_field_label: 'Subject',
      extra_field_value: subjectText,
      message: form.querySelector('#customerMessage').value
    };
  });

  // Artist form payload — same shape as customer, but combines the
  // chosen media + portfolio URL into one display value.
  wireContactForm('contactFormArtist', EMAILJS_ARTIST_TEMPLATE_ID, function (form) {
    var media = form.querySelector('#artistMedia');
    var mediaText = media && media.options[media.selectedIndex] ? media.options[media.selectedIndex].text : '';
    var portfolio = form.querySelector('#artistPortfolio').value;
    var extraValue = mediaText + (portfolio ? ' — Portfolio: ' + portfolio : '');
    return {
      from_name: form.querySelector('#artistName').value,
      from_email: form.querySelector('#artistEmail').value,
      subject_line: 'New artist inquiry',
      extra_field_label: 'Media / Portfolio',
      extra_field_value: extraValue,
      message: form.querySelector('#artistMessage').value
    };
  });

  /* ========================================
     SHARED: Mobile Navigation
     ----------------------------------------
     On screens narrower than 1024px the regular nav links collapse
     behind a hamburger button. This block:
       - opens/closes the slide-in menu
       - dims the page behind the menu with a backdrop overlay
       - locks the page scroll while the menu is open
       - closes the menu when a link inside it is clicked
     ======================================== */
  var hamburger = document.getElementById('hamburger');
  var navLinks = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    // The dimming backdrop is created in code (rather than HTML) so
    // pages without a nav don't get a stray empty <div>.
    var backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    // Flip the menu between open and closed.
    function toggleMenu() {
      var isOpen = navLinks.classList.contains('open');
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      backdrop.classList.toggle('active', !isOpen);
      document.body.style.overflow = !isOpen ? 'hidden' : '';
    }

    // Force the menu closed (used when a link is clicked or the viewport widens).
    function closeMenu() {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', toggleMenu);
    backdrop.addEventListener('click', closeMenu);

    // Tapping a regular link inside the menu closes it (so the user
    // sees the next page right away). Tapping the Artwork dropdown
    // toggle does NOT close — we want the sub-menu to open instead.
    navLinks.querySelectorAll('.nav-link').forEach(function (link) {
      if (link.classList.contains('dropdown-toggle')) return; // don't close the panel when opening the Artwork sub-menu
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---- Nav dropdown toggle (click for mobile/accessibility) ----
     Desktop users (>1023px) see the dropdown on hover; the click on
     the toggle should just navigate to the gallery page.
     On mobile/tablet there is no hover, so we intercept the click and
     open the sub-menu instead. */
  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      // Desktop: let the link navigate to gallery.html. Mobile/tablet: toggle the dropdown.
      if (window.innerWidth > 1023) return;
      e.preventDefault();
      e.stopPropagation();
      var isOpen = item.classList.contains('open');
      // Close any other open dropdowns
      document.querySelectorAll('.has-dropdown.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          var t = other.querySelector('.dropdown-toggle');
          if (t) t.setAttribute('aria-expanded', 'false');
        }
      });
      item.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close any open dropdown when the user clicks outside it.
  // .closest('.has-dropdown') returns null if the click was elsewhere.
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
        item.classList.remove('open');
        var t = item.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

  /* ---- Close mobile menu on resize ----
     If the user resizes from mobile to desktop while the mobile menu
     is open, we need to clean up: hide the menu, remove the backdrop,
     and unlock page scroll. Otherwise the layout looks broken. */
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

  /* ---- Scroll Reveal ----
     Any element with the `.reveal` class starts hidden (in CSS) and
     gets the `.visible` class added once it scrolls into view. The
     CSS handles the actual fade-in animation. The 80px buffer means
     elements reveal slightly before they reach the bottom of the
     viewport, which feels more natural. `passive: true` tells the
     browser we won't preventDefault, which keeps scrolling smooth. */
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
  checkReveal();  // Run once on load so anything already on screen reveals immediately.

  /* ---- Navbar shadow on scroll ----
     Adds a subtle drop shadow under the sticky nav once the user has
     scrolled past 20px. Removes it again at the top of the page. */
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.style.boxShadow = window.scrollY > 20 ? '0 4px 24px rgba(0,0,0,0.15)' : 'none';
    }, { passive: true });
  }

})();
