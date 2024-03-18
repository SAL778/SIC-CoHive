import { Carousel } from '@mantine/carousel';

export default function VerticalCarousel({ children, ...props }) {
    return (
        <Carousel 
        withIndicators 
        align="start"
        orientation="horizontal"
        containScroll='trimSnaps'
        slideGap="md"
         {...props}>
            {children}
        </Carousel>
    );
}
