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
    // Check regular nav links
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.remove('active');
      var href = link.getAttribute('href');
      if (href && href.indexOf(target) !== -1) {
        link.classList.add('active');
      }
    });
    // Check dropdown toggle for gallery/artwork pages
    if (target === 'gallery.html') {
      var toggle = document.querySelector('.dropdown-toggle');
      if (toggle) toggle.classList.add('active');
    }
  })();

  /* ---- Resolve local vs. external image paths ---- */
  function resolveImageSrc(src) {
    return src && src.startsWith('http') ? src : (window.IMAGE_BASE || '') + src;
  }

  /* ---- Render an artwork card (reused everywhere) ---- */
  function renderArtworkCard(art, isRecent) {
    var artist = KaysData.getArtist(art.artistId);
    var base = window.PAGE_BASE || '';
    var badges = '';
    if (art.featured) badges += '<span class="badge-featured">Featured</span> ';
    if (isRecent) badges += '<span class="badge-new">Recently Added</span>';
    return '<article class="artwork-card" data-artwork-id="' + art.id + '">' +
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
          (badges ? ' ' + badges : '') +
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
      '<a href="' + (window.PAGE_BASE || '') + 'artist.html?id=' + artist.id + '" class="artist-card-link" title="View more about ' + artist.name + '">' +
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

  /* Note: All data here comes from the trusted KaysData module (js/data.js),
     not from user input. innerHTML usage is safe in this context. */
  var homeFeatured = document.getElementById('homeFeaturedArtwork');
  if (homeFeatured) {
    var feat = KaysData.getFeaturedArtwork();
    if (feat) {
      var featArtist = KaysData.getArtist(feat.artistId);
      var base = window.PAGE_BASE || '';
      homeFeatured.innerHTML =
        '<div class="home-featured-card">' +
          '<span class="badge-featured">Featured</span>' +
          '<a href="' + base + 'artwork.html?id=' + feat.id + '" class="home-featured-link">' +
            '<img src="' + resolveImageSrc(feat.imageLg || feat.image) + '" alt="' + feat.title + '" class="home-featured-img">' +
          '</a>' +
          '<div class="home-featured-info">' +
            '<h2 class="home-featured-title">' + feat.title + '</h2>' +
            '<p class="home-featured-artist">' + (featArtist ? featArtist.name : '') + ' &middot; ' + feat.year + '</p>' +
            '<p class="home-featured-desc">' + feat.description + '</p>' +
            '<a href="' + base + 'artwork.html?id=' + feat.id + '" class="btn btn-primary">View This Piece</a>' +
          '</div>' +
        '</div>';
    }
  }

  /* ========================================
     PAGE: Gallery
     ======================================== */
  /* Note: All innerHTML below uses trusted KaysData module data, not user input. */
  var galleryGrid = document.getElementById('galleryGrid');
  if (galleryGrid) {
    var galleryEmpty = document.getElementById('galleryEmpty');
    var pills = document.querySelectorAll('.filter-pill');
    var resultsCount = document.getElementById('resultsCount');

    // Read category from URL param (from nav dropdown)
    var rawCat = getParam('category') || '';
    var showAll = rawCat === 'all';
    var currentCategory = showAll ? '' : (rawCat || 'painting');

    // If URL has a specific category, set the matching pill active; otherwise default to first pill
    pills.forEach(function (p) {
      p.classList.toggle('active', !showAll && p.dataset.category === currentCategory);
    });
    if (!rawCat) {
      // No URL param: default to paintings, first pill stays active
      var firstPill = pills[0];
      if (firstPill) firstPill.classList.add('active');
    }

    function renderGallery() {
      var artworks = KaysData.artworks.slice();

      if (currentCategory) {
        artworks = artworks.filter(function (a) { return a.category === currentCategory; });
      }

      galleryGrid.innerHTML = artworks.map(function (art) {
        return renderArtworkCard(art, false);
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
        currentCategory = this.dataset.category || '';
        pills.forEach(function (p) { p.classList.toggle('active', p === pill); });
        renderGallery();
      });
    });

    renderGallery();

    // ---- Artwork Modal ----
    var artworkModal = document.getElementById('artworkModal');
    var modalClose = document.getElementById('modalClose');

    if (artworkModal) {
      // Click on card to open modal
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

      function closeArtworkModal() {
        artworkModal.setAttribute('hidden', '');
        document.body.style.overflow = '';
      }

      if (modalClose) modalClose.addEventListener('click', closeArtworkModal);
      artworkModal.querySelector('.modal-backdrop').addEventListener('click', closeArtworkModal);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !artworkModal.hasAttribute('hidden')) closeArtworkModal();
      });
    }
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

      var featuredBadge = artwork.featured ? '<span class="badge-featured">Featured</span> ' : '';

      // Exhibition cross-links
      var exhibitionLinks = '';
      var artExhibitions = KaysData.getExhibitionsByArtwork(artwork.id);
      if (artExhibitions.length > 0) {
        exhibitionLinks = '<div class="detail-exhibitions"><h3>Featured in Exhibitions</h3><ul>';
        for (var ei = 0; ei < artExhibitions.length; ei++) {
          exhibitionLinks += '<li><a href="' + (window.PAGE_BASE || '') + 'exhibition.html?id=' + artExhibitions[ei].id + '">' + artExhibitions[ei].title + '</a></li>';
        }
        exhibitionLinks += '</ul></div>';
      }

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
          '</div>' : '') +
        exhibitionLinks;

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
  if (allArtistsGrid) {
    var artistsEmpty = document.getElementById('artistsEmpty');
    var artistResultsCount = document.getElementById('artistResultsCount');
    var artistAlphaFilter = document.getElementById('artistAlphaFilter');
    var artistMediaFilter = document.getElementById('artistMediaFilter');

    function getAlphaRange(range) {
      if (!range) return null;
      var parts = range.split('-');
      return { start: parts[0].trim(), end: parts[1].trim() };
    }

    function artistInRange(name, range) {
      if (!range) return true;
      var first = name.charAt(0).toUpperCase();
      return first >= range.start && first <= range.end;
    }

    function renderArtists() {
      var range = artistAlphaFilter ? getAlphaRange(artistAlphaFilter.value) : null;
      var mediaVal = artistMediaFilter ? artistMediaFilter.value : '';
      var filtered = [];

      for (var k = 0; k < KaysData.artists.length; k++) {
        var ar = KaysData.artists[k];
        if (!artistInRange(ar.name, range)) continue;
        if (mediaVal && ar.media.toLowerCase().indexOf(mediaVal) === -1) continue;
        filtered.push(ar);
      }

      // Sort alphabetically
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

    if (artistAlphaFilter) {
      artistAlphaFilter.addEventListener('change', renderArtists);
    }
    if (artistMediaFilter) {
      artistMediaFilter.addEventListener('change', renderArtists);
    }

    renderArtists();
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

      // Exhibition cross-links for artist
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
              '<span class="exhibition-card-cta">View Exhibition &rarr;</span>' +
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

  /* ---- Date formatting helper ---- */
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
    var artistNote = document.getElementById('artistNote');
    var visitorRadios = contactForm.querySelectorAll('input[name="visitor-type"]');
    visitorRadios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (artistNote) {
          artistNote.style.display = this.value === 'artist' ? 'block' : 'none';
        }
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      contactForm.reset();
      if (formSuccess) formSuccess.style.display = 'block';
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

  /* ---- Nav dropdown toggle (click for mobile/accessibility) ---- */
  document.querySelectorAll('.has-dropdown').forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
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

  // Close dropdown when clicking outside
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.has-dropdown')) {
      document.querySelectorAll('.has-dropdown.open').forEach(function (item) {
        item.classList.remove('open');
        var t = item.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    }
  });

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
