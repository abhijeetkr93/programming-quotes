const findRandom = function findRandom (data) {
  return data[Math.floor(Math.random() * data.length)]
}

export default {
  hostname: 'https://programming-quotes-api.herokuapp.com',
  findRandom
}
