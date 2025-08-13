const getImageUrl = (image: string) => {
    if (image.startsWith("http")) return new URL(image).href
    return new URL(`../assets/${image}`, import.meta.url).href
}

export { getImageUrl }
