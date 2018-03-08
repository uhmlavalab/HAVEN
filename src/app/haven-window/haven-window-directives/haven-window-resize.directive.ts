import { Directive, HostListener, Output, EventEmitter } from '@angular/core';

@Directive({
  selector: '[appHavenWindowResize]'
})
export class HavenWindowResizeDirective {

  @Output() mouseupHaven: EventEmitter<any> = new EventEmitter();
  @Output() mousedownHaven: EventEmitter<any> = new EventEmitter();
  @Output() mousemoveHaven: EventEmitter<any> = new EventEmitter();

  @HostListener('document:mouseup', ['$event']) onMouseup(event) {
    this.mouseupHaven.emit(event);
  }

  @HostListener('mousedown', ['$event']) onMousedown(event) {
    if (event.button === 0) {
      this.mousedownHaven.emit(event);
    }
  }

  @HostListener('document:mousemove', ['$event']) onMousemove(event) {
    this.mousemoveHaven.emit(event);
  }

  constructor() { }

}
