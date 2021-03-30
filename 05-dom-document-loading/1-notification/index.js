export default class NotificationMessage {
  static currentElement;

  constructor(message = '', { duration = 0, type = 'success' } = {}) {
    this.message = message;
    this.duration = duration;
    this.type = type;

    this.render();
  }

  get template() {
    return `<div class="notification ${this.type}" style="--value:${this.duration}ms">
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">success</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    </div>`;
  }

  render() {
    if (NotificationMessage.currentElement) {
      NotificationMessage.currentElement.remove();
    }

    const div = document.createElement('div');
    div.innerHTML = this.template;

    this.element = div.firstElementChild;
    NotificationMessage.currentElement = this.element;
  }

  show(wrapper = document.body) {
    wrapper.append(this.element);

    setTimeout(() => this.remove(), this.duration);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
