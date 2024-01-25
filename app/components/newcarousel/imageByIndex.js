export const images = ["img/Kitty_1.png", "img/Kitty_2.png", "img/Kitty_4.png"]

const imageByIndex = (index) => images[index % images.length]

export default imageByIndex
