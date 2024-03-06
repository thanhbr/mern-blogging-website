import React from 'react'

const LoadMoreDataBtn = ({ state, fetchDataFunc }) => {
  if(state !== null && state?.totalDocs > state?.results?.length) {
    return (
      <button
        onClick={() => fetchDataFunc({page: state.page + 1})}
        className='text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2'
      >
        Load more
      </button>
    )
  }
}

export default LoadMoreDataBtn