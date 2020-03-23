import User from './model'

const user = {
  email: '576303283@qq.com',
  username: 'paxiong',
  password: '123456'
}

// 增
const newMethod = async () => {
  const data = new User(user)
  const result = await data.save()
  console.log(result)
}

// 删
const deleteMethod = async () => {
  const result = await User.deleteOne({name: 'paxiong'})
  console.log(result)
}

// 改
const updateMethod = async () => {
  // 将paxiong的email改为cc
  const result = await User.update({name: 'paxiong'}, {email: 'cc'})
  console.log(result)
}

// 查
const findMethod = async () => {
  const result = await User.find()
  console.log(result)
}

export {
  newMethod,
  deleteMethod,
  updateMethod,
  findMethod
}

