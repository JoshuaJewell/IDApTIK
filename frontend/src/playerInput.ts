import * as ex from 'excalibur';

export class PlayerInput {
  constructor(private engine: ex.Engine) {}

  get attack() { return this.engine.input.keyboard.isHeld(ex.Keys.X); }
  get fire() { return this.engine.input.keyboard.isHeld(ex.Keys.Y); }
  get sprint() { return this.engine.input.keyboard.isHeld(ex.Keys.ShiftLeft); }
  get up() { 
    return this.engine.input.keyboard.isHeld(ex.Keys.Up) || 
           this.engine.input.keyboard.isHeld(ex.Keys.W);
  }
  get left() { 
    return this.engine.input.keyboard.isHeld(ex.Keys.Left) || 
           this.engine.input.keyboard.isHeld(ex.Keys.A);
  }
  get right() { 
    return this.engine.input.keyboard.isHeld(ex.Keys.Right) || 
           this.engine.input.keyboard.isHeld(ex.Keys.D);
  }
  get crouch() { 
    return (this.engine.input.keyboard.isHeld(ex.Keys.Down) || 
            this.engine.input.keyboard.isHeld(ex.Keys.S)) || 
           this.engine.input.keyboard.isHeld(ex.Keys.ControlLeft);
  }
  get pointerPosition() { 
    return this.engine.input.pointers.primary.lastWorldPos; 
  }
}