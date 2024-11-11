import './jquery.min.js';
import './webflow.min.js';

function loadStylesheet(href, options) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  if (options)
    Object.keys(options).forEach((key) => link.setAttribute(key, options[key]));
  document.head.appendChild(link);
}
function loadScript(src, options, onloadCallback) {
  const script = document.createElement("script");
  script.src = src;
  if (options)
    Object.keys(options).forEach((key) =>
      script.setAttribute(key, options[key])
    );
  if (onloadCallback) script.onload = onloadCallback;
  document.head.appendChild(script);
}

var Webflow = window.Webflow || [];
Webflow.push(function () {
  // Start
  function loadFancyboxFunctions() {
    loadStylesheet(
      "https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.css",
      {
        crossorigin: "anonymous",
        referrerpolicy: "no-referrer",
      }
    );
    loadScript(
      "https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.5.7/jquery.fancybox.min.js",
      {
        defer: true,
        crossorigin: "anonymous",
        referrerpolicy: "no-referrer",
      },
      function () {
        $("[data-fancybox]").fancybox();
      }
    );
  }
  loadFancyboxFunctions();
  if ($("[data-lazy-video-src]").length > 0) {
    const lazyVideoLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const $figure = $(entry.target);
            const videoSrc = $figure.attr("data-lazy-video-src");
            const $posterImage = $figure.find("[data-lazy-video-poster]");
            const $lazyVideoClass = $figure.attr("data-lazy-video-class");
            function replaceImageWithVideo() {
              console.log("Poster Image Loaded, Replacing with Video");
              const $highResVideo = $("<video>", {
                autoplay: true,
                muted: true,
                loop: true,
                playsinline: true,
                preload: "none",
                fetchpriority: "low",
                decoding: "async",
                class: $lazyVideoClass,
              });
              $highResVideo.prop("muted", true);
              const $videoSource = $("<source>", {
                src: videoSrc,
                type: "video/mp4",
              });
              $highResVideo.append($videoSource);
              $highResVideo
                .on("loadeddata", function () {
                  $figure.append($highResVideo);
                  console.log("Video Loaded and Rendered");
                })
                .on("error", function () {
                  console.error("Video failed to load.");
                });
              $highResVideo[0].load();
            }
            if ($posterImage[0].complete) {
              replaceImageWithVideo();
            } else {
              $posterImage.on("load", replaceImageWithVideo);
            }
            observer.unobserve(entry.target);
          }
        });
      }
    );
    $("[data-lazy-video-src]").each(function () {
      lazyVideoLoadObserver.observe(this);
    });
  }
  $(".slider-arrow-button.testimonial").appendTo(
    ".testimonial__header__arrows"
  );
  $(".slider-arrow-button.home-service").appendTo(
    ".home-service__content__arrows"
  );
  $(".intro-founder-arrow._1").appendTo(
    ".home-intro-founder-slider .w-slide:first-of-type .intro-founder-infos"
  );
  $(".intro-founder-arrow._2").appendTo(
    ".home-intro-founder-slider .w-slide:nth-child(2) .intro-founder-infos"
  );
  $(".faq-header").click(function () {
    const $currentParentElement = $(this).closest(".faq-item");
    function hideAllFaq() {
      $(".faq-item").removeClass("active");
      $(".faq-text-wrapper").slideUp();
    }
    if (!$currentParentElement.hasClass("active")) {
      hideAllFaq();
      $currentParentElement.addClass("active");
      $currentParentElement.find(".faq-text-wrapper").slideDown();
    } else {
      hideAllFaq();
    }
  });
  // End
});
