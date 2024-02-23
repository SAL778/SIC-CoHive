import React from 'react'
import { DotButton, useDotButton } from './CarouselDotButton'
import useEmblaCarousel from 'embla-carousel-react'

/**
 * @param { slides, options }
 * @returns 
 * 
 * slides is an array of React Components
 * options
 */

const EmblaCarousel = (props) => {
  const { slides, options } = props
  const [emblaRef, emblaApi] = useEmblaCarousel(options)

  const { selectedIndex, scrollSnaps, onDotButtonClick } =
    useDotButton(emblaApi)

  //TODO: Replace this with a better solution
  const baseButtonStyles = "border-orange-600 w-6 h-6 border-4 rounded-lg ease-out duration-500"

  return (
    <section className="embla max-w-5xl space-y-4">
      <div className="embla__viewport overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex gap-4">
          {slides.map((slide, index) => (
            <div className="embla__slide" key={index}>
              {slide}
            </div>
          ))}
        </div>
      </div>

      <div className="embla__controls">
        <div className="embla__dots flex flex-row place-content-center gap-2">
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              //TODO: Replace this with a better solution
              className = {index === selectedIndex ?  
                baseButtonStyles +  " bg-orange-600" : baseButtonStyles + " hover:bg-orange-200"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default EmblaCarousel
