import { Actor } from "./actor.class.js";

export class Projectile extends Actor {
  constructor(ctx, x, y, radius, color, velocity) {
    super(ctx, x, y, radius, color, velocity);
  }
}