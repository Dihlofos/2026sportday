"use strict";
(function () {
  const containerSelector = ".js-etno-slider";
  const vw = window.innerWidth;
  const spaceBetween = window.innerWidth < 1025 ? 16 : 41;
  const slidesPerView = window.innerWidth < 1025 ? 2 : 3;

  if (vw < 768) {
    return;
  }

  new Swiper(containerSelector, {
    // Optional parameters
    slidesPerView,
    spaceBetween,
    initialSlide: 0,
    draggable: false,
    pagination: false,
    loop: false,
    navigation: {
      nextEl: `.js-etno-slider-next`,
      prevEl: `.js-etno-slider-prev`,
    },
  });
})();
