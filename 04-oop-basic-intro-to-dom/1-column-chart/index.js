export default class ColumnChart {
  constructor(options) {
    const currentOptions = options || {};
    this.data = currentOptions.data || [];
    this.label = currentOptions.label || '';
    this.link = currentOptions.link || '';
    this.value = currentOptions.value || 0;
    this.chartHeight = 50;
    this.render();
  }

  render() {
    const element = document.createElement('div');

    element.innerHTML = `
      <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          <a href="${this.link}" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.value}</div>
          <div data-element="body" class="column-chart__chart">${this.getColumnProps(this.data)}</div>
        </div>
      </div>
    `;

    if (this.data.length) {
      element.firstElementChild.classList.remove('column-chart_loading');
    }

    this.element = element.firstElementChild;
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0) + '%';
      const value = String(Math.floor(item * scale));

      return `<div style="--value: ${value}" data-tooltip="${percent}"></div>`;
    }).join('');
  }

  update (data) {
    document.querySelector('.column-chart__chart').innerHTML = this.getColumnProps(data);
  }

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
