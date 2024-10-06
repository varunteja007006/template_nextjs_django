from PIL import Image
import os


def getFilesList(path):
    files = os.listdir(path)
    image_files = [f for f in files if f.endswith((".png", ".jpeg", ".webp"))]
    return image_files


def resize_images(image, size):
    return image.resize(size)


def main():
    image_files = getFilesList(
        "/home/varun/Documents/Django/doffice/frontend/public/staff"
    )
    for image_file in image_files:
        image = Image.open(
            os.path.join(
                "/home/varun/Documents/Django/doffice/frontend/public/staff", image_file
            )
        )
        size = (1200, 800)
        resized_image = resize_images(image, size)
        resized_image.save(
            os.path.join(
                "/home/varun/Documents/Django/doffice/frontend/public/staff",
                f"resized_{image_file}",
            )
        )
        print(f"width: {image.width}, height: {image.height}")


if __name__ == "__main__":
    main()
