import React from 'react';
import { Carousel, CarouselSlide } from '@mantine/carousel';
import './carousel.css';

export default function VerticalCarousel({ children, ...props }) {
    return (
        <Carousel
        withIndicators
        align="start"
        orientation="horizontal"
        slideGap="md"
        slideSize="override" //Not a valid class. Just overrides default so that slide is sized to contained component.
        containScroll='trimSnaps'
         {...props}>
            {React.Children.map(children, (child) => (
                <CarouselSlide>{child}</CarouselSlide>
            ))}
            {/* {children} */}
        </Carousel>
    );
}
