import React from 'react'

const Child =React.memo( ({func}) => {
    func()
  return (
    <div>child</div>
  )
})

export default Child