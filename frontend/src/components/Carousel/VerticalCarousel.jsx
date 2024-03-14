import { Carousel } from '@mantine/carousel';

export default function VerticalCarousel({ children, ...props }) {
    return (
        <Carousel 
        withIndicators 
        align="start"
        orientation="vertical"
        slideGap="sm"
         {...props}>
            {children}
        </Carousel>
    );
}
