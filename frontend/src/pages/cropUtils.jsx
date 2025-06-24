export default function getCroppedImg(imageSrc, pixelCrop) {
  const image = new Image();
  image.src = imageSrc;
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  const { width, height } = pixelCrop;

  canvas.width = width;
  canvas.height = height;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        width,
        height,
        0,
        0,
        width,
        height
      );
      resolve(canvas.toDataURL("image/png"));
    };
    image.onerror = reject;
  });
}