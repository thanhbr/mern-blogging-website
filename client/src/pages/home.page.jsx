import React from 'react'
import AnimationWrapper from '../common/page-animation'
import InPageNavigation from '../components/inpage-navigation.component'

const HomePage = () => {
  return (
    <AnimationWrapper>
      <section className='h-cover flex justify-center gap-10'>
        {/* lastest blogs */}
        <div className='w-full'>
          <InPageNavigation 
            routes={['home', 'trending blogs']}
          />
        </div>

        {/* filters and treding blogs */}
        <div>

        </div>
      </section>
    </AnimationWrapper>
  )
}

export default HomePage