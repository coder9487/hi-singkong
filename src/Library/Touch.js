import store from "../store/index"
export class Touch {
  constructor() {
    this.xDown = null;
    this.yDown = null;
    this.time = performance.now()

  }

  getTouches(evt) {
    return (
      evt.touches || // browser API
      evt.originalEvent.touches
    ); // jQuery
  }
  handleTouchEnd(){
    this.xDown = null;
    this.yDown = null;
    console.log("clear")
    store.commit("setLookDir",{x:0,y:0})
  }

  handleTouchStart(evt) {
    this.time = performance.now()
    const firstTouch = (evt.touches)[0];
    this.xDown = firstTouch.clientX;
    this.yDown = firstTouch.clientY;
  }

  handleTouchMove(evt) {
    // if (!this.xDown || !this.yDown) {
    //   return;
    // }
    let timeDelta = performance.now() - this.time
    let xUp = evt.touches[0].clientX;
    let yUp = evt.touches[0].clientY;

    let xDiff = this.xDown - xUp;
    let yDiff = this.yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      if(Math.abs(xDiff)>1)
      console.log("xDiff:",xDiff/timeDelta)
      store.commit("setLookDir",{x:(xDiff/timeDelta).toFixed(1)})
      /*most significant*/
      if (xDiff > 0) {
        /* right swipe */
        // console.log("swipe right");
      } else {
        /* left swipe */
        // console.log("swipe left");
      }
    } else {
      if(Math.abs(yDiff)>1)
        console.log("yDiff:",)
        store.commit("setLookDir",{y:(yDiff/timeDelta).toFixed(1)})

      if (yDiff > 0) {
        /* down swipe */
        // console.log("swipe up");
      } else {
        /* up swipe */
        // console.log("swipe down");
      }
    }
    /* reset values */
    this.xDown = xUp;
    this.yDown = yUp;
    this.time = performance.now()
  }
}
