import Rectangle, { IRectOptions } from "./Rectangle";

export interface ITileStyle {
  fill?: string,
  stroke?: string,
  selected?: {
    fill?: string,
    stroke?: string
  }
}

export default class Tile extends Rectangle {
  public zIndex: number;
  public isSelected: boolean = false;
  public isDisabled: boolean = false;
  public isRemovable: boolean = false;
  private animationCounter = 0;
  private animationTarget = -3;
  private styles = {
    default: {
      fill: "#EFEFEF",
      stroke: "#ffffff",
      selected: {
        fill: "#D1F2D2"
      }
    },
    disabled: {
      fill: "#D1F2D2",
      stroke: "#ffffff",
      selected: {
        fill: "#EFEFEF"
      }
    },
    notRemovable: {
      fill: "#EECED1",
      selected: {
        fill: "#ff0000"
      }
    }
  };

  constructor(shape: IRectOptions, public type: "r" | "f" | "b", public gridPosition: [number, number]) {
    super(shape);
    this.zIndex = this.type === "b" ? 2 : 1;
    if (this.type === "r") {
      this.isRemovable = true;
    }
    if (this.type === "f") {
      this.isRemovable = true;
      this.isDisabled = true;
    }
    // this.setAnimation({
    //   originX: x + width / 2,
    //   originY: y + height / 2,
    //   rotate: [-3, 3],
    //   pixelPerFrame: 1
    // }, ctx)
  }

  public setSelected(selection: Rectangle): void {
    this.isSelected =
      selection.shouldDraw &&
      !(
        this.hitbox.left > selection.hitbox.right ||
        this.hitbox.right < selection.hitbox.left ||
        this.hitbox.top > selection.hitbox.bottom ||
        this.hitbox.bottom < selection.hitbox.top
      );
  }

  public drawAdditionalDetails(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height } = this;

    // const obligatoryMarking = new ObligatoryMarking(x + width / 2, y + height / 2, 10);
    // obligatoryMarking.draw(ctx);
  }

  public setStyling(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height } = this;

    // ctx.beginPath();
    // ctx.lineWidth = 1;
    ctx.lineWidth = 5;
    ctx.fillStyle = this.styles.default.fill;
    ctx.strokeStyle = this.styles.default.stroke;
    if (this.isSelected) {
      ctx.fillStyle = this.styles.default.selected.fill;
    }
    if (this.isDisabled) {
      ctx.fillStyle = this.styles.disabled.fill;
      ctx.strokeStyle = this.styles.disabled.stroke;
      if (this.isSelected) {
        ctx.fillStyle = this.styles.disabled.selected.fill;
      }
    }
    if (!this.isRemovable) {
      ctx.fillStyle = this.styles.notRemovable.fill;
      // this.setCharacteristics({ x: -(width / 2), y: -(height / 2), width, height });
      if (this.isSelected) {
        ctx.fillStyle = this.styles.notRemovable.selected.fill;
        // this.animate({
        //   originX: x + width / 2,
        //   originY: y + height / 2,
        //   rotate: [-3, 3],
        //   pixelPerFrame: 1
        // }, ctx)
        ctx.translate(x + width / 2, y + height / 2);
        this.incrementAnimation();
        ctx.rotate((this.animationCounter * Math.PI) / 180);
        // ctx.rect(-(width / 2), -(height / 2), width, height);
        // this.setCharacteristics({ x: -(width / 2), y: -(height / 2), width, height });
        // return;
      }
    }
    // ctx.rect(startX, startY, width, height);
  }

  public drawShape(ctx: CanvasRenderingContext2D): void {
    const { x, y, width, height } = this;

    if (!this.isRemovable && this.isSelected) {
      ctx.rect(-(width / 2), -(height / 2), width, height);
    } else {
      ctx.rect(this.x, this.y, this.width, this.height);
    }
    ctx.fill();
    ctx.stroke();
  }

  private incrementAnimation() {
    if (this.animationCounter < this.animationTarget) {
      ++this.animationCounter;
    } else if (this.animationCounter > this.animationTarget) {
      --this.animationCounter;
    } else {
      this.animationTarget = this.animationTarget === -3 ? 3 : -3;
    }
  }
}
