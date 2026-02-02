$(document).ready(function() {

  // Variables
  var $codeSnippets = $('.code-example-body'),
      $nav = $('.navbar'),
      $body = $('body'),
      $window = $(window),
      $popoverLink = $('[data-popover]'),
      navOffsetTop = $nav.offset().top,
      $document = $(document),
      entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': '&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
      }

  function init() {
    $window.on('scroll', onScroll)
    $window.on('resize', resize)
    $popoverLink.on('click', openPopover)
    $document.on('click', closePopover)
    $('a[href^="#"]').on('click', smoothScroll)
    buildSnippets();
  }

  function smoothScroll(e) {
    e.preventDefault();
    $(document).off("scroll");
    var target = this.hash,
        menu = target;
    $target = $(target);
    $('html, body').stop().animate({
        'scrollTop': $target.offset().top-40
    }, 0, 'swing', function () {
        window.location.hash = target;
        $(document).on("scroll", onScroll);
    });
  }

  function openPopover(e) {
    e.preventDefault()
    closePopover();
    var popover = $($(this).data('popover'));
    popover.toggleClass('open')
    e.stopImmediatePropagation();
  }

  function closePopover(e) {
    if($('.popover.open').length > 0) {
      $('.popover').removeClass('open')
    }
  }

  $("#button").click(function() {
    $('html, body').animate({
        scrollTop: $("#elementtoScrollToID").offset().top
    }, 2000);
});

  function resize() {
    $body.removeClass('has-docked-nav')
    navOffsetTop = $nav.offset().top
    onScroll()
  }

  function onScroll() {
    if(navOffsetTop < $window.scrollTop() && !$body.hasClass('has-docked-nav')) {
      $body.addClass('has-docked-nav')
    }
    if(navOffsetTop > $window.scrollTop() && $body.hasClass('has-docked-nav')) {
      $body.removeClass('has-docked-nav')
    }
  }

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

  function buildSnippets() {
    $codeSnippets.each(function() {
      var newContent = escapeHtml($(this).html())
      $(this).html(newContent)
    })
  }
  
  init();

});

function toggleNews() {
  var moreNews = document.getElementById("news-more");
  var toggle = document.getElementById("news-toggle");
  
  if (moreNews.style.display === "none") {
    moreNews.style.display = "block";
    toggle.innerHTML = "Show less ↑";
  } else {
    moreNews.style.display = "none";
    toggle.innerHTML = "Show more ↓";
  }
}

function togglePaper(element) {
  var details = element.nextElementSibling;
  var isActive = element.classList.contains('active');
  
  // Close all others (optional - remove these 4 lines if you want multiple open)
  document.querySelectorAll('.paper-row.active').forEach(function(row) {
    row.classList.remove('active');
    row.nextElementSibling.classList.remove('show');
  });
  
  // Toggle clicked one
  if (!isActive) {
    element.classList.add('active');
    details.classList.add('show');
  }
}

// Fetch GitHub stars for code buttons
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.code-btn').forEach(function(btn) {
    var repoUrl = btn.getAttribute('data-repo');
    
    // Extract owner/repo from GitHub URL
    var match = repoUrl.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (match) {
      var repo = match[1].replace(/\/$/, ''); // remove trailing slash if any
      
      fetch('https://api.github.com/repos/' + repo)
        .then(function(response) { return response.json(); })
        .then(function(data) {
          if (data.stargazers_count !== undefined) {
            var stars = data.stargazers_count;
            // Format: 1.2k for thousands
            if (stars >= 1000) {
              stars = (stars / 1000).toFixed(1) + 'k';
            }
            btn.innerHTML = 'Code <span class="star-count">★ ' + stars + '</span>';
          }
        })
        .catch(function(err) {
          // Keep original "Code" text if fetch fails
        });
    }
  });
});