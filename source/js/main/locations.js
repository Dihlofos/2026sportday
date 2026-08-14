"use strict";
(function () {
  const map = document.querySelector(".js-map");
  const mapScroller = document.querySelector(".js-map-scroll");
  const mapModal = document.querySelector(".js-map-modal");
  const modalText = mapModal.querySelector(".js-map-modal-text");
  const modalGoTo = mapModal.querySelector(".js-map-modal-goto");
  const modalClose = mapModal.querySelector(".js-map-modal-close");
  const bullitItems = document.querySelectorAll(".js-bullit");
  const tabItems = document.querySelectorAll(".js-tab-item");

  const figures = map.querySelectorAll(".figure");

  const sliders = {};

  const locations = {
    1: "Экстрим-парк",
    2: "Рампа",
    3: "Полоса препятствий",
    4: "Настольный теннис",
    5: "Панна футбол",
    6: "Праздник ГУ МЧС",
    7: "Прыжки в высоту",
    8: "Стритбол",
    9: "Кенгу джамп",
    10: "Настольные игры",
    11: "Сайклинг",
    12: "Зумба",
    13: "Фан-встречи (ток-шоу)",
    14: "Петанк",
    15: "Шахматы",
    16: "Беговелы",
    17: "Кубик Рубика",
    18: "Концерт",
    19: "Турнир по мини-футболу",
    20: "Шашки",
    21: "Футбольные клубы",
    22: "Степ-аэробика",
    23: "Детская зона",
    24: "Брейк-данс",
    25: "Толкание ядра",
    26: "Балансборды",
    27: "Роуп-скиппинг",
    28: "Городки"
  };
  // getURls();
  // Функция для генерации
  function getURls() {
    Object.entries(locations).forEach(([index, value]) => {
      console.log(
        value,
        `https://day.sport.mos.ru/?locationId=${index}#locations`,
      );
    });
  }

  // 32 убрать, когда заработает.
  const numbersWithoutAction = [];

  const concertNumber = "18";
  const childZone = []; // TODO Поменять, когда нумерацию заменят!

  const partnersLinks = {};
  const vw = window.innerWidth;
  // ACTIONS

  setTimeout(() => {
    mapScroller?.scroll({ left: 180, behavior: "smooth" });
  }, 500);

  figures.forEach((figure) => {
    figure.addEventListener("click", () => {
      // все классы фигур идут вид "figure /*номер*/" поэтому смело берем [1]
      onFigureClick(figure);
    });
  });

  modalGoTo.addEventListener("click", () => {
    const locationNumber = modalGoTo.dataset.locationNumber;
    onGoToLocation(locationNumber);
    closeModal();
  });

  modalClose.addEventListener("click", () => {
    closeModal();
  });

  init();

  // FUNCTIONS

  function init() {
    const locationNumber = findGetParameter("locationId");
    const artObjectLinks = document.querySelectorAll(".js-art-object-link");

    const element = document.querySelector(`[data-location="${locationNumber}"]`);

    if (locationNumber) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "auto", block: "center" });
        element.classList.add("is-active");
      }, 0);
    }

    // Собираем легенду.
    fillLegendList();
    artObjectLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const figure = document.getElementById(`figure ${artObject}`);
        onFigureClick(figure);
      });
    });

    bullitItems.forEach((item) => {
      item.addEventListener("click", (el) => {
        onGoToLocation(el.currentTarget.dataset.locationId);
      });
    });

    tabItems.forEach((item) => {
      item
        .querySelector(".js-tab-item-toggler")
        .addEventListener("click", () => {
          item.classList.toggle("is-active");

          if (item.classList.contains("is-active")) {
            const locationNumber = item.dataset.location;
            initSlider(locationNumber);
          }
        });
    });
  }

  function openTabItem(locationNumber) {
    const item = document.querySelector(
      `.js-tab-item[data-location="${locationNumber}"]`,
    );
    if (!item) return;
    item.classList.add("is-active");
    initSlider(locationNumber);
  }

  function initSlider(locationNumber) {
    const containerSelector = `[data-location="${locationNumber}"] .js-slider`;
    const vw = window.innerWidth;
    const spaceBetween = vw < 1025 ? 16 : 41;
    const slidesPerView = vw < 768 ? 1 : 3;

    console.log("container", containerSelector);

    if (sliders[locationNumber] || vw < 768) return;
    sliders[locationNumber] = new Swiper(containerSelector, {
      // Optional parameters
      slidesPerView,
      spaceBetween,
      initialSlide: 0,
      draggable: false,
      pagination: false,
      loop: false,
      navigation: {
        nextEl: `[data-location="${locationNumber}"] .js-slider-next`,
        prevEl: `[data-location="${locationNumber}"] .js-slider-prev`,
      },
    });
  }

  function onFigureClick(figure) {
    modalGoTo.classList.remove("is-hidden");
    let locationNumber = figure.classList[1].split("_")[1];
    const mapOffset =
      document.getElementById("map-title").getBoundingClientRect().top +
      document.documentElement.scrollTop;

    const legendItem = document.querySelector(
      `.js-legend-item[data-legend-item-id="${locationNumber}"]`,
    );

    if (numbersWithoutAction.includes(locationNumber)) {
      modalGoTo.classList.add("is-hidden");
    }

    window.scroll.animateScroll(mapOffset);

    if (figure.classList.contains("is-active")) {
      resetFigures();
      resetLegends();
      closeModal(locationNumber);
    } else {
      resetFigures();
      resetLegends();
      figure.classList.add("is-active");
      openModal(locationNumber);
      legendItem.classList.add("is-active");
    }
  }

  function resetFigures() {
    figures.forEach((figure) => {
      figure.classList.remove("is-active");
    });
  }

  function resetLegends() {
    const legends = document.querySelectorAll(".js-legend-item");
    legends.forEach((legend) => {
      legend.classList.remove("is-active");
    });
  }

  function openModal(locationNumber) {
    if (!locations[locationNumber]) return;

    if (locationNumber === concertNumber) {
      modalGoTo.href = "#concert";
    } else {
      modalGoTo.href = `#locations-${locationNumber}`;
    }

    modalText.innerHTML = DOMPurify.sanitize(locations[locationNumber]);

    let targetNumber = locationNumber;

    if (childZone.includes(locationNumber)) {
      targetNumber = 11;
    }

    modalGoTo.dataset.locationNumber = targetNumber;

    mapModal.classList.add("is-active");
    openTabItem(locationNumber);
  }

  function closeModal() {
    mapModal.classList.remove("is-active");
    setTimeout(() => {
      modalText.textContent = "";
      modalGoTo.dataset.locationNumber = "";
    }, 300);
    resetFigures();
    resetLegends();
  }

  function onGoToLocation(locationNumber) {
    let number = locationNumber;
    if (numbersWithoutAction.includes(number)) {
      return;
    }

    if (number === concertNumber) return;

    toggleContent(number);

    closeModal();
  }

  function getSlideIndex(locationNumber) {
    const element = document.querySelector(
      `.js-thumb[data-thumb-index="${locationNumber}"]`,
    );
    const elIndex = Array.from(element.parentNode.children).indexOf(element);
    return Number(elIndex);
  }

  function toggleContent(locationNumber) {}

  function findGetParameter(parameterName) {
    var result = null,
      tmp = [];
    location.search
      .substr(1)
      .split("&")
      .forEach(function (item) {
        tmp = item.split("=");
        if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
      });
    return result;
  }

  function fillLegendList() {
    const container = document.querySelector(".js-legend-list");
    const wrapper = document.querySelector(".js-legend-wrapper");
    const button = document.querySelector(".js-legend-more-button");

    const locationsArray = Object.entries(locations);

    locationsArray.forEach(([index, value]) => {
      const figure = document.querySelector(`.figure_${index}`);
      // не показываем локации, которых нет на карте.
      if (!figure) return;

      const itemLi = document.createElement("li");
      const itemSpan = document.createElement("span");
      const itemP = document.createElement("p");

      itemLi.classList.add("map__list-item");
      itemLi.classList.add("js-legend-item");
      itemLi.dataset["legendItemId"] = index;

      itemLi.addEventListener("click", function () {
        onFigureClick(figure);
      });

      itemSpan.textContent = `${index}`;
      itemP.innerHTML = DOMPurify.sanitize(value);
      itemLi.append(itemSpan);
      itemLi.append(itemP);
      container.append(itemLi);
    });

    button.addEventListener("click", function () {
      wrapper.classList.remove("more-hide");
    });
  }
})();
