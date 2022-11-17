('use strict');
import './style.css';

// ^((\d+\.\d+)|(\d+))$
// function inputHandler(e) {
//   if (!e.target.value) return;
//   e.target.value = e.target.value
//     .replaceAll(',', '.')
//     .replaceAll(/[^0-9.]/gm, '')
//     .replaceAll('.', (match, offset, str) =>
//       offset > str.indexOf(match) ? '' : match
//     );
// }

class ConverterModel {
  #quoteAmount = 0;
  #baseAmount = 0;
  #basePrice = 0;

  constructor(basePrice) {
    this.#basePrice = basePrice;
  }

  setQuoteAmount(amount) {
    this.#baseAmount = +(amount / this.#basePrice).toFixed(2);
    this.#quoteAmount = +amount;
  }

  setBaseAmount(amount) {
    this.#quoteAmount = +(amount * this.#basePrice).toFixed(2);
    this.#baseAmount = +amount;
  }

  getQuoteAmount() {
    return this.#quoteAmount;
  }

  getBaseAmount() {
    return this.#baseAmount;
  }

  setBasePrice(price) {
    this.#basePrice = +price;
  }
}

class ConverterView {
  #baseInput;
  #quoteInput;
  #totalInput;

  constructor() {
    this.#baseInput = document.createElement('input');
    this.#baseInput.type = 'text';
    this.#baseInput.inputMode = 'numeric';

    this.#quoteInput = document.createElement('input');
    this.#quoteInput.type = 'text';
    this.#quoteInput.inputMode = 'numeric';

    const baseInputlabel = document.createElement('label');
    const quoteInputlabel = document.createElement('label');

    baseInputlabel.innerHTML += 'EUR';
    baseInputlabel.appendChild(this.#baseInput);
    quoteInputlabel.innerHTML += 'RUB';
    quoteInputlabel.appendChild(this.#quoteInput);

    document.body.appendChild(baseInputlabel);
    document.body.appendChild(quoteInputlabel);
  }

  setTotalInputValue(value) {
    this.#totalInput.value = value || '';
  }

  setBaseInputValue(value) {
    this.#baseInput.value = value || '';
  }

  setQuoteInputValue(value) {
    if (!value) {
      this.#quoteInput.value = '';
    } else {
      this.#quoteInput.value = value;
    }
  }

  onBaseInputChange(callback) {
    this.#baseInput.addEventListener('input', () => {
      // validate
      callback(this.#baseInput.value);
    });
  }

  onQuoteInputChange(callback) {
    this.#quoteInput.addEventListener('input', () => {
      // validate
      callback(this.#quoteInput.value);
    });
  }
}

class ConverterController {
  #converter;
  #converterView;

  constructor(converter, converterView) {
    this.#converter = converter;
    this.#converterView = converterView;

    this.#converterView.onBaseInputChange((inputValue) => {
      this.#converter.setBaseAmount(inputValue);
      this.#converterView.setQuoteInputValue(converter.getQuoteAmount());
    });

    this.#converterView.onQuoteInputChange((inputValue) => {
      this.#converter.setQuoteAmount(inputValue);
      this.#converterView.setBaseInputValue(converter.getBaseAmount());
    });
  }
}

const converterModel = new ConverterModel(62.68);
const converterView = new ConverterView();
const controller = new ConverterController(converterModel, converterView);
