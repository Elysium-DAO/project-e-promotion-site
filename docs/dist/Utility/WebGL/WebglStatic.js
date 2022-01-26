export function hsv2rgb(hue, saturate, value) {
  hue = radian2degree(hue);
  let f = (n, k = (n + hue / 60) % 6) => value - value * saturate * Math.max(Math.min(k, 4 - k, 1), 0);
  return [f(5), f(3), f(1), 1];
}
export function rgb2hsv(r, g, b) {
  let v = Math.max(r, g, b), c = v - Math.min(r, g, b);
  let h = c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c);
  return [degree2radian(60 * (h < 0 ? h + 6 : h)), v && c / v, v];
}
export function radian2degree(radian) {
  return radian * (180 / Math.PI);
}
export function degree2radian(degree) {
  return degree * (Math.PI / 180);
}
function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}
export function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
export function SphereCollide(sphereX, sphereY, radian, collider_x, colider_y) {
  let posDiff = Math.sqrt(Math.pow(sphereX - collider_x, 2) + Math.pow(sphereY - colider_y, 2));
  return posDiff <= radian;
}
export function GetTriangleArea(p1, p2, p3) {
  return 0.5 * (-p2.y * p3.x + p1.y * (-p2.x + p3.x) + p1.x * (p2.y - p3.y) + p2.x * p3.y);
}
export function TriangleCollide(point, v1, v2, v3) {
  let area = GetTriangleArea(v1, v2, v3);
  let s = 1 / (2 * area) * (v1.y * v3.x - v1.x * v3.y + (v3.y - v1.y) * point.x + (v1.x - v3.x) * point.y);
  let t = 1 / (2 * area) * (v1.x * v2.y - v1.y * v2.x + (v1.y - v2.y) * point.x + (v2.x - v1.x) * point.y);
  return s > 0 && t > 0 && 1 - s - t > 0;
}
