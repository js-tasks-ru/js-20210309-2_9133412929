export default class SortableTable {
  subElements = {};

  constructor(header = [], { data } = {}) {
    this.header = header;
    this.data = data;

    this.render();
  }

  get head() {
    return this.header.map(item =>`<th>${item.title}</th>`).join('');
  }

  getCells(dataItem) {
    return this.header.map(item => {
      return item.id !== 'images' ?
        `<td>${dataItem[item.id]}</td>` :
        `<td>${item.template(dataItem.images)}</td>`;
    }).join('');
  }

  getBody(data) {
    return data.map(item => {
      return `<tr>${this.getCells(item)}</tr>`;
    }).join('');
  }

  get template() {
    return `
      <table>
        <thead data-element="head"><tr>${this.head}</tr></thead>
        <tbody data-element="body">${this.getBody(this.data)}</tbody>
      </table>
    `;
  }

  getSubElements(element) {
    const elements = element.querySelectorAll('[data-element]');
    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;
      return accum;
    }, {});
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  sort(field, order) {
    const sortType = this.header.find(item => item.id === field).sortType;
    let sortedData = [];

    if (sortType === 'string') {
      sortedData = makeStringSort(this.data, field, order);
    } else if (sortType === 'number') {
      sortedData = makeNumberSort(this.data, field, order);
    } else {
      sortedData = this.data;
    }

    this.subElements.body.innerHTML = this.getBody(sortedData);

    function makeStringSort(arr, field, order) {
      const direction = order === 'asc' ? 1 : -1;
      return [...arr].sort((a, b) => {
        return direction * a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'});
      });
    }

    function makeNumberSort(arr, field, order) {
      return [...arr].sort((a, b) => {
        return order === 'desc' ? b[field] - a[field] : a[field] - b[field];
      });
    }
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

