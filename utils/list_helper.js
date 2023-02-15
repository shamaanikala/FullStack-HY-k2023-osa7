const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const result = blogs.reduce((like_sum,blogi) => like_sum + blogi.likes,0)
    return result
}

const deconstructBlog = (blog) => {
    // https://stackoverflow.com/questions/17781472/how-to-get-a-subset-of-a-javascript-objects-properties
    return (({ title, author, likes }) => ({ title, author, likes }))(blog)
}

const favoriteBlog = (blogs) => {
    // palauttaa listan eniten tykkäyksiä saaneen blogin tiedot
    // tehtävänannossa palautetaan
    // title
    // author
    // likes
    // jos monella blogilla eniten tykkäyksiä, niin palautetaan yksi

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
    // "Getting the maximum element of an array"
    //const bloglist = blogs.map(b => deconstructBlog(b))
    if (blogs.length === 1) {
        return deconstructBlog(blogs[0])
    } else {
        const mostLikedBlog = blogs.reduce(
            (tykatyin,blogi) => {
                return tykatyin.likes <= blogi.likes
                    ? blogi
                    : tykatyin
            },blogs[0])
        return deconstructBlog(mostLikedBlog)
    }
}

module.exports = {
    dummy,
    deconstructBlog,
    totalLikes,
    favoriteBlog
}