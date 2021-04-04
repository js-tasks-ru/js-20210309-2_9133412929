export default class ColumnChart {
  subElements = {};
  chartHeight = 50;

  constructor({
    url = '',
    range = { from: new Date(), to: new Date() },
    label = '',
    link = '',
    formatHeading = value => value,
    value = null
  } = {}) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.value = value;

    this.render();
    this.fetchData();
  }

  async fetchData() {
    const url = new URL(`https://course-js.javascript.ru/${this.url}`);
    url.searchParams.set('from', this.range.from.toISOString());
    url.searchParams.set('to', this.range.to.toISOString());

    const response = await fetch(url.toString());

    if (response.ok) {
      const data = await response.json();
      const summary = Object.values(data).reduce((acc, currentItem) => acc + currentItem, 0);
      this.subElements.header.innerText = this.formatHeading(this.value ?? summary);
      this.subElements.body.innerHTML = this.getColumnBody(Object.values(data));
      this.element.classList.remove('column-chart_loading');
    }
  }

  getColumnBody(data) {
    const maxValue = Math.max(...data);
    const scale = this.chartHeight / maxValue;

    return data
      .map(item => {
        const percent = (item / maxValue * 100).toFixed(0);

        return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
      })
      .join('');
  }

  getLink() {
    return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          Total ${this.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
           <div data-element="header" class="column-chart__header">${this.value}</div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  async update(startDate, endDate) {
    this.range.from = startDate;
    this.range.to = endDate;
    await this.fetchData();
  }

  remove () {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}
