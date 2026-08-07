(function initTeamSwiper() {
  "use strict";

  var swiperEl = document.querySelector(".team-swiper");
  if (!swiperEl || typeof Swiper === "undefined") return;

  new Swiper(swiperEl, {
    slidesPerView: "auto",
    spaceBetween: 24,
    grabCursor: true,
    watchOverflow: true,
    freeMode: {
      enabled: true,
      momentum: true,
      momentumRatio: 0.8,
    },
    navigation: {
      nextEl: ".team-swiper__btn--next",
      prevEl: ".team-swiper__btn--prev",
    },
    breakpoints: {
      768: {
        spaceBetween: 24,
      },
      1024: {
        spaceBetween: 24,
      },
    },
  });
})();
