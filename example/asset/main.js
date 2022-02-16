function print (msg) {
  const p = document.createElement('p')
  p.innerHTML = msg
  document.body.appendChild(p)
}

function test (msg, access) {
  const p = document.createElement('p')
  const name = document.createElement('b')
  name.innerHTML = msg
  name.style.fontWeight = 'normal'
  name.style.marginRight = '8px'
  const result = document.createElement('span')
  result.innerHTML = access ? '测试通过' : '测试不通过'
  if (access) {
    result.style.color = 'green'
  } else {
    result.style.color = 'red'
  }
  p.appendChild(name)
  p.appendChild(result)
  document.body.append(p)
}