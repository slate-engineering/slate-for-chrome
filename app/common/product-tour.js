//inject product-tour html into the test platform webpage
$(document).ready(() => {
  $.get(chrome.extension.getURL("./app/pages/product-tour.html"), function (
    data
  ) {
    $(data).prependTo("body");
    console.log("html added");
    _handleNavigation();
  });
});

_handleNavigation = () => {
  console.log("handlenavigation executed");
  let tourWrapper = document.getElementsByClassName("slate-product-tour");
  console.log("tourrapper", tourWrapper[0]);
  tourWrapper[0].classList.add("active");
  tourWrapper[0].onanimationend = () => {
    tourWrapper[0].classList.remove("active");
  };
  let productTours = document.getElementsByClassName(
    "slate-product-tour-module"
  );
  productTours[0].classList.add("active");
  let nextTourButtons = document.getElementsByClassName(
    "slate-secondary-button next"
  );
  for (let i = 0; i < nextTourButtons.length; i++) {
    nextTourButtons[i].addEventListener("click", () =>
      changeStep(tourWrapper, productTours, i, nextTourButtons[i])
    );
  }

  let prevTourButtons = document.getElementsByClassName(
    "slate-secondary-button previous"
  );
  for (let i = 0; i < prevTourButtons.length; i++) {
    prevTourButtons[i].addEventListener("click", () =>
      changeStep(tourWrapper, productTours, i + 1, prevTourButtons[i])
    );
  }

  let cancelTourButtons = document.getElementsByClassName(
    "slate-cancel-button"
  );
  for (let i = 0; i < cancelTourButtons.length; i++) {
    cancelTourButtons[i].addEventListener("click", () => closeTour());
  }

  let finishTourButton = document.getElementsByClassName(
    "slate-secondary-button finish"
  );
  finishTourButton[0].addEventListener("click", () => closeTour());

  let progressIndicators = document.getElementsByClassName(
    "slate-progress-indicator inactive"
  );
  for (let i = 0; i < progressIndicators.length; i++) {
    progressIndicators[i].addEventListener("click", () =>
      switchStep(tourWrapper, productTours, progressIndicators.length - 1 - i)
    );
  }
};

changeStep = (tourWrapper, productTours, stepNumber, tourButton) => {
  let totalSteps = productTours.length;
  tourWrapper[0].classList.remove("active");
  tourWrapper[0].classList.add("active");
  productTours[stepNumber].classList.remove("active");
  closeCurrentTour(productTours, stepNumber);
  if (tourButton.classList.contains("next") && stepNumber < totalSteps) {
    productTours[stepNumber + 1].classList.add("active");
  } else if (tourButton.classList.contains("previous") && stepNumber >= 0) {
    productTours[stepNumber - 1].classList.add("active");
  }
};

switchStep = (tourWrapper, productTours, stepNumber) => {
  tourWrapper[0].classList.remove("active");
  tourWrapper[0].classList.add("active");
  if (!productTours[stepNumber].classList.contains("active")) {
    for (productTour of productTours) {
      if (productTour.classList.contains("active")) {
        productTour.classList.remove("active");
      }
    }
    productTours[stepNumber].classList.add("active");
  }
};

closeCurrentTour = (productTours, stepNumber) => {
  productTours[stepNumber].classList.remove("active");
};

closeTour = () => {
  window.location.assign("/");
};
